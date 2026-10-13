/**
 * Rotas da API - Zé Mathyas Cardápio Digital
 */
const express = require('express');
const router = express.Router();

const mesaController = require('../controllers/mesaController');
const cardapioController = require('../controllers/cardapioController');
const pedidoController = require('../controllers/pedidoController');

// ---- Saúde da API ----
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'ze-mathyas-api',
    timestamp: new Date().toISOString(),
  });
});

// ---- Mesas ----
router.get('/mesas', mesaController.listarMesas);
router.get('/mesas/:hash', mesaController.identificarMesa);

// ---- Cardápio ----
router.get('/cardapio', cardapioController.listarCardapio);

// ---- Pedidos ----
router.post('/pedidos', pedidoController.criarPedido);
router.get('/pedidos/:id', pedidoController.obterPedido);

module.exports = router;
