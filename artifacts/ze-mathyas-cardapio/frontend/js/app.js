/**
 * ============================================================
 * Zé Mathyas - Cardápio Digital Mobile
 * Lógica principal (vanilla JS, zero dependências de build)
 * ============================================================
 */

// ---- Estado global da aplicação ----
const state = {
  mesa: null,           // { mesaId, numero, hash, sessionToken }
  cardapio: null,       // categorias + produtos
  carrinho: [],         // itens no carrinho
  produtoAtual: null,   // produto aberto no modal
  selecoes: {},         // { grupoId: [opcaoId, ...] }
  quantidade: 1,
  pesoG: null,
  observacoes: '',
};

// ---- Helpers de formatação ----
function formatBRL(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function mostrarToast(msg, icon = '✓') {
  const toast = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  document.getElementById('toast-icon').textContent = icon;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 2500);
}

// ---- Inicialização ----
async function init() {
  try {
    // Extrai hash da URL: /mesa/m5-x9a2 ou ?mesa=m5-x9a2
    const pathMatch = window.location.pathname.match(/\/mesa\/([a-z0-9-]+)/i);
    const queryHash = new URLSearchParams(window.location.search).get('mesa');
    const hash = pathMatch ? pathMatch[1] : (queryHash || 'm5-x9a2'); // fallback para demo

    // 1. Identificar mesa
    const mesaData = await api.identificarMesa(hash);
    state.mesa = mesaData;
    document.getElementById('mesa-numero').textContent = `Mesa ${String(mesaData.numero).padStart(2, '0')}`;

    // Salva sessão localmente
    sessionStorage.setItem('zm_mesa', JSON.stringify(mesaData));

    // 2. Carregar cardápio
    const cardapioData = await api.getCardapio();
    state.cardapio = cardapioData;

    renderCardapio();
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('cardapio-content').classList.remove('hidden');
  } catch (err) {
    console.error(err);
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('error-state').classList.remove('hidden');
    document.getElementById('error-state').classList.add('flex');
    document.getElementById('error-message').textContent = err.message;
  }
}

// ---- Renderização do Cardápio ----
function renderCardapio() {
  const tabsEl = document.getElementById('categorias-tabs');
  const listaEl = document.getElementById('produtos-lista');

  tabsEl.innerHTML = '';
  listaEl.innerHTML = '';

  state.cardapio.categorias.forEach((cat, idx) => {
    // Tab
    const tab = document.createElement('button');
    tab.className = `tab-btn flex-shrink-0 px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${idx === 0 ? 'tab-ativa' : 'tab-inativa'}`;
    tab.textContent = `${cat.icone || ''} ${cat.nome}`;
    tab.dataset.slug = cat.slug;
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(t => {
        t.classList.remove('tab-ativa');
        t.classList.add('tab-inativa');
      });
      tab.classList.remove('tab-inativa');
      tab.classList.add('tab-ativa');
      document.getElementById(`cat-${cat.slug}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    tabsEl.appendChild(tab);

    // Seção de produtos
    if (cat.produtos.length === 0) return;

    const section = document.createElement('section');
    section.id = `cat-${cat.slug}`;
    section.className = 'scroll-mt-28';

    section.innerHTML = `
      <h2 class="font-display text-parrilla-gold text-lg mb-3 flex items-center gap-2">
        <span>${cat.icone || ''}</span> ${cat.nome}
      </h2>
      <div class="space-y-3" id="produtos-${cat.slug}"></div>
    `;
    listaEl.appendChild(section);

    const produtosContainer = section.querySelector(`#produtos-${cat.slug}`);

    cat.produtos.forEach(produto => {
      const card = criarCardProduto(produto);
      produtosContainer.appendChild(card);
    });
  });
}

function criarCardProduto(produto) {
  const precoTexto = produto.precoPor100g
    ? `${formatBRL(produto.precoPor100g)}/100g`
    : formatBRL(produto.preco);

  const div = document.createElement('div');
  div.className = 'produto-card bg-parrilla-card rounded-2xl p-4 border border-parrilla-gold/10 cursor-pointer';
  div.innerHTML = `
    <div class="flex gap-3">
      <div class="flex-1 min-w-0">
        <div class="flex items-start gap-2 mb-1">
          <h3 class="font-semibold text-parrilla-cream text-[15px] leading-snug">${produto.nome}</h3>
          ${produto.destaque ? '<span class="badge-destaque px-1.5 py-0.5 rounded flex-shrink-0">★</span>' : ''}
        </div>
        ${produto.descricao ? `<p class="text-parrilla-muted text-xs leading-relaxed line-clamp-2 mb-2">${produto.descricao}</p>` : ''}
        <p class="text-parrilla-gold font-bold text-sm">${precoTexto}</p>
      </div>
      <div class="w-20 h-20 rounded-xl bg-parrilla-dark flex-shrink-0 flex items-center justify-center border border-parrilla-gold/10">
        <span class="text-2xl opacity-60">${produto.setor?.nome === 'parrilla' ? '🥩' : produto.setor?.nome === 'bar' ? '🍸' : '🍽️'}</span>
      </div>
    </div>
  `;

  div.addEventListener('click', () => abrirModalProduto(produto));
  return div;
}

// ---- Modal de Personalização ----
function abrirModalProduto(produto) {
  state.produtoAtual = produto;
  state.selecoes = {};
  state.quantidade = 1;
  state.pesoG = produto.pesoMinimoG || null;
  state.observacoes = '';

  // Pré-seleciona opções obrigatórias (primeira de cada grupo único)
  produto.gruposOpcionais.forEach(grupo => {
    if (grupo.obrigatorio && grupo.tipoSelecao === 'unica' && grupo.opcoes.length) {
      state.selecoes[grupo.id] = [grupo.opcoes[0].id];
    } else {
      state.selecoes[grupo.id] = [];
    }
  });

  const body = document.getElementById('modal-body');
  body.innerHTML = '';

  // Cabeçalho do produto
  const precoBase = produto.precoPor100g
    ? `${formatBRL(produto.precoPor100g)} / 100g`
    : formatBRL(produto.preco);

  body.innerHTML = `
    <div class="mb-5">
      <h2 class="font-display text-xl text-parrilla-gold mb-1">${produto.nome}</h2>
      ${produto.descricao ? `<p class="text-parrilla-muted text-sm leading-relaxed">${produto.descricao}</p>` : ''}
      <p class="text-parrilla-gold font-bold mt-2">${precoBase}</p>
    </div>
  `;

  // Peso (se aplicável)
  if (produto.precoPor100g) {
    const pesoMin = produto.pesoMinimoG || 200;
    body.innerHTML += `
      <div class="mb-5">
        <label class="block text-sm font-medium text-parrilla-cream mb-2">Peso (gramas)</label>
        <div class="flex items-center gap-3">
          <button type="button" class="w-10 h-10 rounded-full bg-parrilla-card border border-parrilla-gold/30 text-parrilla-gold font-bold" onclick="ajustarPeso(-50)">−</button>
          <input type="number" id="input-peso" value="${pesoMin}" min="${pesoMin}" step="50"
            class="w-24 text-center bg-parrilla-card border border-parrilla-gold/30 rounded-xl py-2 text-parrilla-cream font-semibold focus:outline-none focus:border-parrilla-gold"
            onchange="state.pesoG = parseInt(this.value) || ${pesoMin}; atualizarSubtotalModal()" />
          <button type="button" class="w-10 h-10 rounded-full bg-parrilla-card border border-parrilla-gold/30 text-parrilla-gold font-bold" onclick="ajustarPeso(50)">+</button>
          <span class="text-parrilla-muted text-sm">mín. ${pesoMin}g</span>
        </div>
      </div>
    `;
    state.pesoG = pesoMin;
  }

  // Grupos de opcionais
  produto.gruposOpcionais.forEach(grupo => {
    const grupoEl = document.createElement('div');
    grupoEl.className = 'mb-5';
    grupoEl.innerHTML = `
      <div class="flex items-center justify-between mb-2">
        <label class="text-sm font-medium text-parrilla-cream">
          ${grupo.nome}
          ${grupo.obrigatorio ? '<span class="text-parrilla-gold text-xs ml-1">*</span>' : ''}
        </label>
        <span class="text-[10px] text-parrilla-muted">
          ${grupo.tipoSelecao === 'unica' ? 'Escolha 1' : `Até ${grupo.maxSelecoes}`}
        </span>
      </div>
      <div class="space-y-2" id="grupo-${grupo.id}"></div>
    `;
    body.appendChild(grupoEl);

    const container = grupoEl.querySelector(`#grupo-${grupo.id}`);
    grupo.opcoes.forEach(opcao => {
      const isSelected = (state.selecoes[grupo.id] || []).includes(opcao.id);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all ${isSelected ? 'opcao-selecionada border-parrilla-gold' : 'border-parrilla-gold/15 bg-parrilla-card'}`;
      btn.innerHTML = `
        <span class="text-sm text-parrilla-cream">${opcao.nome}</span>
        ${opcao.precoAdicional > 0
          ? `<span class="text-xs text-parrilla-gold">+ ${formatBRL(opcao.precoAdicional)}</span>`
          : '<span class="text-xs text-parrilla-muted">incluso</span>'}
      `;
      btn.addEventListener('click', () => toggleOpcao(grupo, opcao.id, btn));
      container.appendChild(btn);
    });
  });

  // Quantidade
  body.innerHTML += `
    <div class="mb-5">
      <label class="block text-sm font-medium text-parrilla-cream mb-2">Quantidade</label>
      <div class="flex items-center gap-4">
        <button type="button" class="w-10 h-10 rounded-full bg-parrilla-card border border-parrilla-gold/30 text-parrilla-gold font-bold text-lg" onclick="ajustarQtd(-1)">−</button>
        <span class="text-xl font-bold text-parrilla-cream w-8 text-center" id="modal-qtd">1</span>
        <button type="button" class="w-10 h-10 rounded-full bg-parrilla-card border border-parrilla-gold/30 text-parrilla-gold font-bold text-lg" onclick="ajustarQtd(1)">+</button>
      </div>
    </div>
  `;

  // Observações
  body.innerHTML += `
    <div class="mb-2">
      <label class="block text-sm font-medium text-parrilla-cream mb-2">Observações</label>
      <textarea id="input-obs" rows="2" placeholder="Ex: sem cebola, bem passado..."
        class="w-full bg-parrilla-card border border-parrilla-gold/20 rounded-xl px-4 py-3 text-sm text-parrilla-cream placeholder-parrilla-muted/50 focus:outline-none focus:border-parrilla-gold/50 resize-none"
        oninput="state.observacoes = this.value"></textarea>
    </div>
  `;

  atualizarSubtotalModal();
  abrirSheet('modal');
}

function toggleOpcao(grupo, opcaoId, btnEl) {
  let selecionadas = state.selecoes[grupo.id] || [];

  if (grupo.tipoSelecao === 'unica') {
    selecionadas = [opcaoId];
    // Atualiza visual de todos os botões do grupo
    const container = document.getElementById(`grupo-${grupo.id}`);
    container.querySelectorAll('button').forEach(b => {
      b.classList.remove('opcao-selecionada');
      b.classList.add('border-parrilla-gold/15', 'bg-parrilla-card');
    });
    btnEl.classList.add('opcao-selecionada');
    btnEl.classList.remove('border-parrilla-gold/15', 'bg-parrilla-card');
  } else {
    // Múltipla
    if (selecionadas.includes(opcaoId)) {
      selecionadas = selecionadas.filter(id => id !== opcaoId);
      btnEl.classList.remove('opcao-selecionada');
      btnEl.classList.add('border-parrilla-gold/15', 'bg-parrilla-card');
    } else {
      if (selecionadas.length >= grupo.maxSelecoes) {
        mostrarToast(`Máximo de ${grupo.maxSelecoes} opções`, '⚠️');
        return;
      }
      selecionadas.push(opcaoId);
      btnEl.classList.add('opcao-selecionada');
      btnEl.classList.remove('border-parrilla-gold/15', 'bg-parrilla-card');
    }
  }

  state.selecoes[grupo.id] = selecionadas;
  atualizarSubtotalModal();
}

function ajustarQtd(delta) {
  state.quantidade = Math.max(1, state.quantidade + delta);
  document.getElementById('modal-qtd').textContent = state.quantidade;
  atualizarSubtotalModal();
}

function ajustarPeso(delta) {
  const min = state.produtoAtual.pesoMinimoG || 200;
  state.pesoG = Math.max(min, (state.pesoG || min) + delta);
  const input = document.getElementById('input-peso');
  if (input) input.value = state.pesoG;
  atualizarSubtotalModal();
}

function atualizarSubtotalModal() {
  const p = state.produtoAtual;
  if (!p) return;

  let unitario = p.preco;
  if (p.precoPor100g && state.pesoG) {
    unitario = (p.precoPor100g * state.pesoG) / 100;
  }

  let adicionais = 0;
  Object.values(state.selecoes).flat().forEach(opcaoId => {
    p.gruposOpcionais.forEach(g => {
      const op = g.opcoes.find(o => o.id === opcaoId);
      if (op) adicionais += op.precoAdicional;
    });
  });

  const total = (unitario + adicionais) * state.quantidade;
  document.getElementById('modal-subtotal').textContent = formatBRL(total);
}

function adicionarAoCarrinho() {
  const p = state.produtoAtual;

  // Validar obrigatórios
  for (const grupo of p.gruposOpcionais) {
    if (grupo.obrigatorio) {
      const sel = state.selecoes[grupo.id] || [];
      if (sel.length < grupo.minSelecoes) {
        mostrarToast(`Selecione: ${grupo.nome}`, '⚠️');
        return;
      }
    }
  }

  // Montar nomes das opções escolhidas
  const opcoesNomes = [];
  const opcoesIds = [];
  Object.entries(state.selecoes).forEach(([grupoId, ids]) => {
    const grupo = p.gruposOpcionais.find(g => g.id === parseInt(grupoId));
    ids.forEach(id => {
      const op = grupo?.opcoes.find(o => o.id === id);
      if (op) {
        opcoesNomes.push(op.nome);
        opcoesIds.push(id);
      }
    });
  });

  let precoUnitario = p.preco;
  if (p.precoPor100g && state.pesoG) {
    precoUnitario = (p.precoPor100g * state.pesoG) / 100;
  }

  let precoAdicionais = 0;
  opcoesIds.forEach(id => {
    p.gruposOpcionais.forEach(g => {
      const op = g.opcoes.find(o => o.id === id);
      if (op) precoAdicionais += op.precoAdicional;
    });
  });

  state.carrinho.push({
    produtoId: p.id,
    nome: p.nome,
    quantidade: state.quantidade,
    pesoG: state.pesoG,
    precoUnitario,
    precoAdicionais,
    opcoesIds,
    opcoesNomes,
    observacoes: state.observacoes,
    subtotal: (precoUnitario + precoAdicionais) * state.quantidade,
  });

  fecharSheet('modal');
  atualizarCarrinhoBar();
  mostrarToast('Adicionado ao pedido!');
}

// ---- Carrinho ----
function atualizarCarrinhoBar() {
  const qtd = state.carrinho.reduce((s, i) => s + i.quantidade, 0);
  const total = state.carrinho.reduce((s, i) => s + i.subtotal, 0);

  const bar = document.getElementById('carrinho-bar');
  if (qtd > 0) {
    bar.classList.remove('hidden');
    document.getElementById('carrinho-qtd').textContent = qtd;
    document.getElementById('carrinho-total').textContent = formatBRL(total);
  } else {
    bar.classList.add('hidden');
  }
}

function renderCarrinho() {
  const container = document.getElementById('carrinho-itens');
  const total = state.carrinho.reduce((s, i) => s + i.subtotal, 0);
  document.getElementById('drawer-total').textContent = formatBRL(total);

  if (state.carrinho.length === 0) {
    container.innerHTML = `<p class="text-center text-parrilla-muted py-10">Seu pedido está vazio</p>`;
    return;
  }

  container.innerHTML = state.carrinho.map((item, idx) => `
    <div class="flex gap-3 py-4 border-b border-parrilla-gold/10">
      <div class="flex-1">
        <div class="flex justify-between">
          <h4 class="font-medium text-parrilla-cream text-sm">${item.quantidade}x ${item.nome}</h4>
          <span class="text-parrilla-gold text-sm font-semibold">${formatBRL(item.subtotal)}</span>
        </div>
        ${item.pesoG ? `<p class="text-xs text-parrilla-muted mt-0.5">${item.pesoG}g</p>` : ''}
        ${item.opcoesNomes.length ? `<p class="text-xs text-parrilla-muted mt-0.5">${item.opcoesNomes.join(' · ')}</p>` : ''}
        ${item.observacoes ? `<p class="text-xs text-parrilla-muted/70 italic mt-0.5">"${item.observacoes}"</p>` : ''}
      </div>
      <button onclick="removerItemCarrinho(${idx})" class="text-parrilla-muted hover:text-red-400 text-lg self-start">×</button>
    </div>
  `).join('');
}

function removerItemCarrinho(idx) {
  state.carrinho.splice(idx, 1);
  renderCarrinho();
  atualizarCarrinhoBar();
}

async function enviarPedido() {
  if (state.carrinho.length === 0) return;

  const btn = document.getElementById('btn-enviar-pedido');
  btn.disabled = true;
  btn.textContent = 'Enviando...';

  try {
    const payload = {
      mesaId: state.mesa.mesaId,
      observacoesGerais: document.getElementById('obs-gerais').value || null,
      itens: state.carrinho.map(item => ({
        produtoId: item.produtoId,
        quantidade: item.quantidade,
        pesoG: item.pesoG || undefined,
        observacoes: item.observacoes || undefined,
        opcoesIds: item.opcoesIds,
      })),
    };

    const resultado = await api.criarPedido(payload);

    // Sucesso
    state.carrinho = [];
    atualizarCarrinhoBar();
    fecharSheet('drawer');

    mostrarToast(`Pedido ${resultado.codigo} enviado! 🔥`, '✓');

    // Feedback extra com setores
    setTimeout(() => {
      const setores = Object.keys(resultado.porSetor || {}).join(', ');
      alert(`Pedido ${resultado.codigo} confirmado!\nTotal: ${formatBRL(resultado.valorTotal)}\n\nEncaminhado para: ${setores}`);
    }, 600);
  } catch (err) {
    mostrarToast(err.message, '⚠️');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Enviar Pedido 🔥';
  }
}

// ---- Sheets (modal / drawer) ----
function abrirSheet(tipo) {
  const overlay = document.getElementById(tipo === 'modal' ? 'modal-produto' : 'drawer-carrinho');
  const sheet = document.getElementById(tipo === 'modal' ? 'modal-sheet' : 'drawer-sheet');
  overlay.classList.remove('hidden');
  requestAnimationFrame(() => {
    sheet.classList.add('sheet-open');
  });
}

function fecharSheet(tipo) {
  const overlay = document.getElementById(tipo === 'modal' ? 'modal-produto' : 'drawer-carrinho');
  const sheet = document.getElementById(tipo === 'modal' ? 'modal-sheet' : 'drawer-sheet');
  sheet.classList.remove('sheet-open');
  setTimeout(() => overlay.classList.add('hidden'), 280);
}

// ---- Event listeners ----
document.getElementById('modal-overlay').addEventListener('click', () => fecharSheet('modal'));
document.getElementById('drawer-overlay').addEventListener('click', () => fecharSheet('drawer'));
document.getElementById('btn-fechar-carrinho').addEventListener('click', () => fecharSheet('drawer'));
document.getElementById('btn-add-carrinho').addEventListener('click', adicionarAoCarrinho);
document.getElementById('btn-abrir-carrinho').addEventListener('click', () => {
  renderCarrinho();
  abrirSheet('drawer');
});
document.getElementById('btn-enviar-pedido').addEventListener('click', enviarPedido);

// Expõe funções usadas em onclick inline
window.ajustarQtd = ajustarQtd;
window.ajustarPeso = ajustarPeso;
window.removerItemCarrinho = removerItemCarrinho;
window.state = state;

// Boot
document.addEventListener('DOMContentLoaded', init);
