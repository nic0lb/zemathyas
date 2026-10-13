/**
 * Conexão com PostgreSQL usando o driver 'pg'
 * Pool de conexões para melhor performance sob carga
 */
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'zemathyas',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: 20,                    // Máximo de conexões no pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Log de erros do pool
pool.on('error', (err) => {
  console.error('[DB] Erro inesperado no pool de conexões:', err.message);
});

/**
 * Helper para executar queries com tratamento de erro padronizado
 */
async function query(text, params) {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DB] ${duration}ms | rows: ${result.rowCount}`);
    }
    return result;
  } catch (error) {
    console.error('[DB] Query error:', error.message);
    throw error;
  }
}

module.exports = { pool, query };
