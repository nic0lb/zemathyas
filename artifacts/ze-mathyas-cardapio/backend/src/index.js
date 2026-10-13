/**
 * ============================================================
 * Zé Mathyas - La Parrilla & Resto
 * Backend API - Cardápio Digital + Comanda Inteligente
 * ============================================================
 * Stack: Node.js + Express + PostgreSQL
 * ============================================================
 */
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;

// ---- Middlewares ----
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Log simples de requisições
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ---- Rotas ----
app.use('/api', routes);

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    name: 'Zé Mathyas API',
    version: '1.0.0',
    docs: '/api/health',
    endpoints: {
      'GET /api/mesas/:hash': 'Identifica mesa via QR Code',
      'GET /api/cardapio': 'Cardápio completo agrupado',
      'POST /api/pedidos': 'Registra novo pedido',
      'GET /api/pedidos/:id': 'Detalhes do pedido',
    },
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint não encontrado' });
});

// Error handler global
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.stack);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'development' ? err.message : 'Erro interno',
  });
});

// ---- Start ----
app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════════════════╗
  ║   🥩  Zé Mathyas API - La Parrilla & Resto       ║
  ║   Rodando em http://localhost:${PORT}              ║
  ║   Ambiente: ${process.env.NODE_ENV || 'development'}                      ║
  ╚═══════════════════════════════════════════════════╝
  `);
});
