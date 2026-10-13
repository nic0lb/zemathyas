/**
 * Controller do Cardápio
 * Retorna o cardápio completo agrupado por categorias,
 * incluindo grupos de opcionais e opções de cada produto
 */
const { query } = require('../config/db');

/**
 * GET /api/cardapio
 * Cardápio completo otimizado para o frontend mobile
 */
async function listarCardapio(req, res) {
  try {
    // 1. Categorias ativas ordenadas
    const categoriasResult = await query(
      `SELECT id, nome, slug, descricao, icone, ordem
       FROM categorias
       WHERE ativo = TRUE
       ORDER BY ordem ASC`
    );

    // 2. Produtos ativos com setor
    const produtosResult = await query(
      `SELECT
         p.id,
         p.categoria_id,
         p.nome,
         p.slug,
         p.descricao,
         p.preco,
         p.preco_por_100g,
         p.peso_minimo_g,
         p.imagem_url,
         p.destaque,
         p.tempo_preparo_min,
         s.nome AS setor_nome,
         s.cor_hex AS setor_cor
       FROM produtos p
       JOIN setores s ON s.id = p.setor_id
       WHERE p.ativo = TRUE
       ORDER BY p.categoria_id, p.destaque DESC, p.nome`
    );

    // 3. Grupos de opcionais vinculados aos produtos
    const gruposResult = await query(
      `SELECT
         pg.produto_id,
         g.id AS grupo_id,
         g.nome AS grupo_nome,
         g.tipo_selecao,
         g.min_selecoes,
         g.max_selecoes,
         g.obrigatorio,
         g.ordem AS grupo_ordem
       FROM produto_grupos pg
       JOIN grupos_opcionais g ON g.id = pg.grupo_id
       ORDER BY pg.produto_id, g.ordem`
    );

    // 4. Todas as opções ativas
    const opcoesResult = await query(
      `SELECT
         o.id,
         o.grupo_id,
         o.nome,
         o.preco_adicional,
         o.ordem
       FROM opcoes o
       WHERE o.ativo = TRUE
       ORDER BY o.grupo_id, o.ordem`
    );

    // ---- Montagem da estrutura aninhada ----
    const opcoesPorGrupo = {};
    for (const op of opcoesResult.rows) {
      if (!opcoesPorGrupo[op.grupo_id]) opcoesPorGrupo[op.grupo_id] = [];
      opcoesPorGrupo[op.grupo_id].push({
        id: op.id,
        nome: op.nome,
        precoAdicional: parseFloat(op.preco_adicional),
        ordem: op.ordem,
      });
    }

    const gruposPorProduto = {};
    for (const g of gruposResult.rows) {
      if (!gruposPorProduto[g.produto_id]) gruposPorProduto[g.produto_id] = [];
      gruposPorProduto[g.produto_id].push({
        id: g.grupo_id,
        nome: g.grupo_nome,
        tipoSelecao: g.tipo_selecao,
        minSelecoes: g.min_selecoes,
        maxSelecoes: g.max_selecoes,
        obrigatorio: g.obrigatorio,
        ordem: g.grupo_ordem,
        opcoes: opcoesPorGrupo[g.grupo_id] || [],
      });
    }

    const produtosPorCategoria = {};
    for (const p of produtosResult.rows) {
      if (!produtosPorCategoria[p.categoria_id]) {
        produtosPorCategoria[p.categoria_id] = [];
      }
      produtosPorCategoria[p.categoria_id].push({
        id: p.id,
        nome: p.nome,
        slug: p.slug,
        descricao: p.descricao,
        preco: parseFloat(p.preco),
        precoPor100g: p.preco_por_100g ? parseFloat(p.preco_por_100g) : null,
        pesoMinimoG: p.peso_minimo_g,
        imagemUrl: p.imagem_url,
        destaque: p.destaque,
        tempoPreparoMin: p.tempo_preparo_min,
        setor: {
          nome: p.setor_nome,
          cor: p.setor_cor,
        },
        gruposOpcionais: gruposPorProduto[p.id] || [],
      });
    }

    const cardapio = categoriasResult.rows.map((cat) => ({
      id: cat.id,
      nome: cat.nome,
      slug: cat.slug,
      descricao: cat.descricao,
      icone: cat.icone,
      ordem: cat.ordem,
      produtos: produtosPorCategoria[cat.id] || [],
    }));

    return res.json({
      success: true,
      data: {
        atualizadoEm: new Date().toISOString(),
        categorias: cardapio,
      },
    });
  } catch (error) {
    console.error('[CardapioController] Erro:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao carregar o cardápio',
    });
  }
}

module.exports = {
  listarCardapio,
};
