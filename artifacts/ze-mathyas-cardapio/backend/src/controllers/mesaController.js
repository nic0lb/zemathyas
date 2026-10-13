/**
 * Controller de Mesas
 * Responsável por identificar a mesa via hash do QR Code
 */
const { query } = require('../config/db');

/**
 * GET /api/mesas/:hash
 * Identifica a mesa pelo hash do QR Code e retorna dados da sessão
 */
async function identificarMesa(req, res) {
  try {
    const { hash } = req.params;

    if (!hash || hash.length < 4) {
      return res.status(400).json({
        success: false,
        error: 'Hash da mesa inválido',
      });
    }

    const result = await query(
      `SELECT id, numero, hash_qr, status, capacidade
       FROM mesas
       WHERE hash_qr = $1`,
      [hash.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Mesa não encontrada. Verifique o QR Code.',
      });
    }

    const mesa = result.rows[0];

    // Opcional: marcar como ocupada se estiver livre
    // (em produção, isso pode ser feito via webhook de presença ou manualmente)
    if (mesa.status === 'livre') {
      await query(
        `UPDATE mesas SET status = 'ocupada', updated_at = NOW() WHERE id = $1`,
        [mesa.id]
      );
      mesa.status = 'ocupada';
    }

    return res.json({
      success: true,
      data: {
        mesaId: mesa.id,
        numero: mesa.numero,
        hash: mesa.hash_qr,
        status: mesa.status,
        capacidade: mesa.capacidade,
        // Token de sessão simples (em produção use JWT)
        sessionToken: `sess_${mesa.id}_${Date.now()}`,
      },
    });
  } catch (error) {
    console.error('[MesaController] Erro:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno ao identificar a mesa',
    });
  }
}

/**
 * GET /api/mesas
 * Lista todas as mesas (útil para painel administrativo)
 */
async function listarMesas(req, res) {
  try {
    const result = await query(
      `SELECT id, numero, hash_qr, status, capacidade, updated_at
       FROM mesas
       ORDER BY numero`
    );

    return res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('[MesaController] Erro listar:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao listar mesas',
    });
  }
}

module.exports = {
  identificarMesa,
  listarMesas,
};
