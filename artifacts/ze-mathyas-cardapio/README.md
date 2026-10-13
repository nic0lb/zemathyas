# 🥩 Zé Mathyas – La Parrilla & Resto  
## Cardápio Digital Interativo + Comanda Inteligente

Sistema web completo (mobile-first) para restaurantes de cortes nobres na parrilla.  
Caso de estudo real: **Zé Mathyas – La Parrilla & Resto** (Fortaleza/CE).

---

## 🏗️ Arquitetura

```
ze-mathyas-cardapio/
├── database/
│   └── schema.sql          # PostgreSQL completo + seed realista
├── backend/                # Node.js + Express
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── index.js
│       ├── config/db.js
│       ├── controllers/
│       │   ├── mesaController.js
│       │   ├── cardapioController.js
│       │   └── pedidoController.js
│       └── routes/index.js
└── frontend/               # HTML + Tailwind CSS + Vanilla JS
    ├── index.html
    ├── css/styles.css
    └── js/
        ├── api.js
        └── app.js
```

### Stack escolhida
| Camada     | Tecnologia              | Motivo                                      |
|------------|-------------------------|---------------------------------------------|
| Banco      | PostgreSQL              | Relacional, robusto, JSON-ready             |
| Backend    | Node.js + Express       | Leve, rápido de prototipar, mesmo ecossistema JS |
| Frontend   | HTML + Tailwind + JS    | Zero build, mobile-first, fácil de evoluir  |

---

## 📋 Fluxo implementado

1. Cliente escaneia QR Code → URL `/mesa/m5-x9a2`
2. Frontend chama `GET /api/mesas/m5-x9a2` → identifica mesa e cria sessão
3. Frontend carrega `GET /api/cardapio` → categorias + produtos + grupos de opcionais
4. Cliente personaliza item (ponto da carne, acompanhamentos, peso, observações)
5. Cliente envia pedido → `POST /api/pedidos`
6. Backend calcula total, grava itens e **separa automaticamente por setor** (parrilla / cozinha / bar / copa)

---

## 🚀 Como rodar

### 1. Banco de dados
```bash
# Crie o banco
createdb zemathyas

# Execute o schema + seed
psql -U postgres -d zemathyas -f database/schema.sql
```

### 2. Backend
```bash
cd backend
cp .env.example .env
# Edite .env com suas credenciais PostgreSQL

npm install
npm run dev          # porta 3001
```

### 3. Frontend
Abra `frontend/index.html` em um servidor local (Live Server, ou):

```bash
# Exemplo com Python
cd frontend
python -m http.server 5500
```

Acesse: `http://localhost:5500/?mesa=m5-x9a2`  
(ou configure um rewrite para `/mesa/:hash`)

---

## 📡 Endpoints principais

| Método | Rota                    | Descrição                                      |
|--------|-------------------------|------------------------------------------------|
| GET    | `/api/health`           | Health check                                   |
| GET    | `/api/mesas/:hash`      | Identifica mesa pelo hash do QR Code           |
| GET    | `/api/cardapio`         | Cardápio completo agrupado por categorias      |
| POST   | `/api/pedidos`          | Registra pedido + separação por setor          |
| GET    | `/api/pedidos/:id`      | Detalhes de um pedido                          |

### Exemplo de payload de pedido
```json
{
  "mesaId": 3,
  "observacoesGerais": "Cliente preferencial",
  "itens": [
    {
      "produtoId": 4,
      "quantidade": 1,
      "pesoG": 400,
      "observacoes": "Bem passado",
      "opcoesIds": [3, 8, 10]
    }
  ]
}
```

Resposta inclui o campo `porSetor` pronto para impressão de comandas:

```json
{
  "porSetor": {
    "parrilla": [
      { "nome": "Picanha Angus", "quantidade": 1, "pesoG": 400, "opcoes": ["Ao ponto", "Arroz de Alho"] }
    ],
    "bar": [...]
  }
}
```

---

## 🎨 UX / Design

- Tema escuro premium (preto + dourado `#C9A227`)
- Mobile-first (bottom sheets nativos)
- Abas de categorias com scroll horizontal
- Modal de personalização com validação de opcionais obrigatórios
- Carrinho flutuante + drawer de confirmação
- Feedback visual (toasts + loading)

---

## 🔮 Próximos passos sugeridos

1. **WebSocket / SSE** – atualização em tempo real do status do pedido
2. **Painel da cozinha/bar** – tela de comanda por setor
3. **Autenticação de garçom** + modo administrativo
4. **Integração com impressoras térmicas** (ESC/POS)
5. **PWA** (manifest + service worker) para instalação no celular
6. **Preço dinâmico por balança** (WebSocket com balança IoT)
7. **React / Next.js** se precisar de SSR ou componentes mais complexos
8. **Prisma ou Drizzle** para type-safety no backend

---

## 📄 Licença
MIT – use, adapte e evolua para o seu restaurante.

Feito com 🥩 e ☕ para o Zé Mathyas.
