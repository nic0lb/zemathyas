/**
 * Controller de Pedidos
 * Registra novo pedido, calcula total e separa itens por setor de preparo
 */
const { query, pool } = require('../config/db');
const { v4: uuidv4 } = require('uuid');

/**
 * Gera código curto legível para o pedido (ex: ZM-8F3A)
 */
function gerarCodigoPedido() {
  const parte = uuidv4().replace(/-/g, '').substring(0, 4).toUpperCase();
  return `ZM-${parte}`;
}

/**
 * POST /api/pedidos
 * Body esperado:
 * {
 *   mesaId: number,
 *   observacoesGerais?: string,
 *   itens: [
 *     {
 *       produtoId: number,
 *       quantidade: number,
 *       pesoG?: number,               // quando preço por 100g
 *       observacoes?: string,
 *       opcoesIds: number[]           // IDs das opções escolhidas
 *     }
 *   ]
 * }
 */
async function criarPedido(req, res) {
  const client = await pool.connect();

  try {
    const { mesaId, observacoesGerais, itens } = req.body;

    // ---- Validações básicas ----
    if (!mesaId || !Array.isArray(itens) || itens.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'mesaId e pelo menos um item são obrigatórios',
      });
    }

    // Verificar se a mesa existe
    const mesaCheck = await client.query(
      `SELECT id, numero, status FROM mesas WHERE id = $1`,
      [mesaId]
    );
    if (mesaCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Mesa não encontrada',
      });
    }

    await client.query('BEGIN');

    // ---- Buscar dados dos produtos e opções ----
    const produtoIds = [...new Set(itens.map((i) => i.produtoId))];
    const produtosResult = await client.query(
      `SELECT p.id, p.nome, p.preco, p.preco_por_100g, p.peso_minimo_g, p.setor_id,
              s.nome AS setor_nome
       FROM produtos p
       JOIN setores s ON s.id = p.setor_id
       WHERE p.id = ANY($1) AND p.ativo = TRUE`,
      [produtoIds]
    );

    const produtosMap = {};
    for (const p of produtosResult.rows) {
      produtosMap[p.id] = p;
    }

    // Coletar todos os opcoesIds
    const todasOpcoesIds = itens.flatMap((i) => i.opcoesIds || []);
    let opcoesMap = {};
    if (todasOpcoesIds.length > 0) {
      const opcoesResult = await client.query(
        `SELECT id, nome, preco_adicional FROM opcoes WHERE id = ANY($1) AND ativo = TRUE`,
        [todasOpcoesIds]
      );
      for (const o of opcoesResult.rows) {
        opcoesMap[o.id] = o;
      }
    }

    // ---- Calcular totais e montar itens ----
    let valorTotal = 0;
    const itensProcessados = [];
    const itensPorSetor = {}; // Para a resposta final

    for (const item of itens) {
      const produto = produtosMap[item.produtoId];
      if (!produto) {
        throw new Error(`Produto ID ${item.produtoId} não encontrado ou inativo`);
      }

      const quantidade = Math.max(1, parseInt(item.quantidade) || 1);
      let precoUnitario = parseFloat(produto.preco);
      let pesoG = null;

      // Preço por peso (ex: picanha)
      if (produto.preco_por_100g) {
        pesoG = item.pesoG || produto.peso_minimo_g || 300;
        if (pesoG < (produto.peso_minimo_g || 100)) {
          throw new Error(`Peso mínimo para ${produto.nome} é ${produto.peso_minimo_g}g`);
        }
        precoUnitario = (parseFloat(produto.preco_por_100g) * pesoG) / 100;
      }

      // Soma dos adicionais das opções
      let precoAdicionais = 0;
      const opcoesEscolhidas = [];
      for (const opcaoId of item.opcoesIds || []) {
        const opcao = opcoesMap[opcaoId];
        if (opcao) {
          precoAdicionais += parseFloat(opcao.preco_adicional);
          opcoesEscolhidas.push({
            id: opcao.id,
            nome: opcao.nome,
            precoAdicional: parseFloat(opcao.preco_adicional),
          });
        }
      }

      const subtotalItem = (precoUnitario + precoAdicionais) * quantidade;
      valorTotal += subtotalItem;

      itensProcessados.push({
        produtoId: produto.id,
        setorId: produto.setor_id,
        setorNome: produto.setor_nome,
        nomeProduto: produto.nome,
        quantidade,
        precoUnitario,
        precoAdicionais,
        pesoG,
        observacoes: item.observacoes || null,
        opcoesEscolhidas,
        subtotal: subtotalItem,
      });

      // Agrupar por setor para a resposta
      if (!itensPorSetor[produto.setor_nome]) {
        itensPorSetor[produto.setor_nome] = [];
      }
      itensPorSetor[produto.setor_nome].push({
        nome: produto.nome,
        quantidade,
        pesoG,
        observacoes: item.observacoes,
        opcoes: opcoesEscolhidas.map((o) => o.nome),
      });
    }

    // ---- Inserir pedido ----
    const codigo = gerarCodigoPedido();
    const pedidoResult = await client.query(
      `INSERT INTO pedidos (mesa_id, codigo, status, valor_total, observacoes_gerais, origem)
       VALUES ($1, $2, 'recebido', $3, $4, 'qr_code')
       RETURNING id, codigo, created_at`,
      [mesaId, codigo, valorTotal.toFixed(2), observacoesGerais || null]
    );

    const pedido = pedidoResult.rows[0];

    // ---- Inserir itens e suas opções ----
    for (const item of itensProcessados) {
      const itemResult = await client.query(
        `INSERT INTO itens_pedido
           (pedido_id, produto_id, setor_id, nome_produto, quantidade,
            preco_unitario, preco_adicionais, peso_g, observacoes, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pendente')
         RETURNING id`,
        [
          pedido.id,
          item.produtoId,
          item.setorId,
          item.nomeProduto,
          item.quantidade,
          item.precoUnitario.toFixed(2),
          item.precoAdicionais.toFixed(2),
          item.pesoG,
          item.observacoes,
        ]
      );

      const itemId = itemResult.rows[0].id;

      for (const opcao of item.opcoesEscolhidas) {
        await client.query(
          `INSERT INTO item_opcoes (item_pedido_id, opcao_id, nome_opcao, preco_adicional)
           VALUES ($1, $2, $3, $4)`,
          [itemId, opcao.id, opcao.nome, opcao.precoAdicional.toFixed(2)]
        );
      }
    }

    // Atualizar status da mesa se necessário
    await client.query(
      `UPDATE mesas SET status = 'ocupada', updated_at = NOW() WHERE id = $1`,
      [mesaId]
    );

    await client.query('COMMIT');

    // ---- Resposta com separação por setor ----
    return res.status(201).json({
      success: true,
      data: {
        pedidoId: pedido.id,
        codigo: pedido.codigo,
        mesaNumero: mesaCheck.rows[0].numero,
        valorTotal: parseFloat(valorTotal.toFixed(2)),
        status: 'recebido',
        criadoEm: pedido.created_at,
        // Separação automática por setor de preparo (para impressão/comanda)
        porSetor: itensPorSetor,
        mensagem: 'Pedido enviado com sucesso! A cozinha e o bar já receberam.',
      },
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('[PedidoController] Erro:', error);

    const statusCode = error.message.includes('não encontrado') || error.message.includes('Peso mínimo')
      ? 400
      : 500;

    return res.status(statusCode).json({
      success: false,
      error: error.message || 'Erro ao registrar o pedido',
    });
  } finally {
    client.release();
  }
}

/**
 * GET /api/pedidos/:id
 * Detalhes de um pedido (útil para acompanhamento)
 */
async function obterPedido(req, res) {
  try {
    const { id } = req.params;

    const pedidoResult = await query(
      `SELECT p.id, p.codigo, p.status, p.valor_total, p.observacoes_gerais,
              p.created_at, m.numero AS mesa_numero
       FROM pedidos p
       JOIN mesas m ON m.id = p.mesa_id
       WHERE p.id = $1`,
      [id]
    );

    if (pedidoResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Pedido não encontrado' });
    }

    const itensResult = await query(
      `SELECT ip.id, ip.nome_produto, ip.quantidade, ip.preco_unitario,
              ip.preco_adicionais, ip.peso_g, ip.observacoes, ip.status,
              s.nome AS setor_nome
       FROM itens_pedido ip
       JOIN setores s ON s.id = ip.setor_id
       WHERE ip.pedido_id = $1`,
      [id]
    );

    return res.json({
      success: true,
      data: {
        ...pedidoResult.rows[0],
        valor_total: parseFloat(pedidoResult.rows[0].valor_total),
        itens: itensResult.rows,
      },
    });
  } catch (error) {
    console.error('[PedidoController] Erro obter:', error);
    return res.status(500).json({ success: false, error: 'Erro ao buscar pedido' });
  }
}

module.exports = {
  criarPedido,
  obterPedido,
};
