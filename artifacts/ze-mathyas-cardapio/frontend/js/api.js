/**
 * Camada de comunicação com a API
 * Em desenvolvimento: aponta para localhost:3001
 * Em produção: troque pela URL real
 */
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3001/api'
  : '/api'; // quando servir via proxy ou mesmo domínio

const api = {
  /**
   * Identifica a mesa pelo hash do QR Code
   * Ex: hash = "m5-x9a2"
   */
  async identificarMesa(hash) {
    const res = await fetch(`${API_BASE}/mesas/${hash}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Mesa não encontrada');
    return data.data;
  },

  /**
   * Cardápio completo agrupado por categorias
   */
  async getCardapio() {
    const res = await fetch(`${API_BASE}/cardapio`);
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Erro ao carregar cardápio');
    return data.data;
  },

  /**
   * Envia o pedido
   */
  async criarPedido(payload) {
    const res = await fetch(`${API_BASE}/pedidos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Erro ao enviar pedido');
    return data.data;
  },
};

// Export para uso global (sem bundler)
window.api = api;
