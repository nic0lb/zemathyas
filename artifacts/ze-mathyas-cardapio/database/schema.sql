-- ============================================================
-- Zé Mathyas - La Parrilla & Resto
-- Schema PostgreSQL - Cardápio Digital + Comanda Inteligente
-- ============================================================

-- Extensões úteis
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. MESAS
-- Cada mesa possui um hash único para o QR Code (ex: m5-x9a2)
-- ============================================================
CREATE TABLE mesas (
    id              SERIAL PRIMARY KEY,
    numero          INTEGER NOT NULL UNIQUE,          -- Número físico da mesa (1, 2, 5...)
    hash_qr         VARCHAR(32) NOT NULL UNIQUE,      -- Identificador no QR Code (/mesa/m5-x9a2)
    status          VARCHAR(20) NOT NULL DEFAULT 'livre'
                    CHECK (status IN ('livre', 'ocupada', 'reservada', 'manutencao')),
    capacidade      INTEGER DEFAULT 4,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_mesas_hash ON mesas(hash_qr);

-- ============================================================
-- 2. CATEGORIAS
-- ============================================================
CREATE TABLE categorias (
    id              SERIAL PRIMARY KEY,
    nome            VARCHAR(80) NOT NULL,
    slug            VARCHAR(80) NOT NULL UNIQUE,
    descricao       TEXT,
    ordem           INTEGER NOT NULL DEFAULT 0,       -- Ordenação no cardápio
    icone           VARCHAR(50),                      -- Ex: "🥩", "🍷"
    ativo           BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 3. SETORES DE PREPARO
-- Cozinha/Parrilla vs Bar/Copa (permite roteamento automático)
-- ============================================================
CREATE TABLE setores (
    id              SERIAL PRIMARY KEY,
    nome            VARCHAR(50) NOT NULL UNIQUE,      -- 'parrilla', 'cozinha', 'bar', 'copa'
    descricao       VARCHAR(120),
    cor_hex         VARCHAR(7) DEFAULT '#C9A227'      -- Cor para UI de impressão/comanda
);

-- ============================================================
-- 4. PRODUTOS
-- ============================================================
CREATE TABLE produtos (
    id                  SERIAL PRIMARY KEY,
    categoria_id        INTEGER NOT NULL REFERENCES categorias(id) ON DELETE RESTRICT,
    setor_id            INTEGER NOT NULL REFERENCES setores(id) ON DELETE RESTRICT,
    nome                VARCHAR(120) NOT NULL,
    slug                VARCHAR(120) NOT NULL,
    descricao           TEXT,
    preco               DECIMAL(10,2) NOT NULL,       -- Preço base (ou por porção)
    preco_por_100g      DECIMAL(10,2),                -- Se preço variável por peso (ex: picanha)
    peso_minimo_g       INTEGER,                      -- Peso mínimo quando aplicável
    imagem_url          VARCHAR(255),
    destaque            BOOLEAN NOT NULL DEFAULT FALSE,
    ativo               BOOLEAN NOT NULL DEFAULT TRUE,
    tempo_preparo_min   INTEGER DEFAULT 15,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(categoria_id, slug)
);

CREATE INDEX idx_produtos_categoria ON produtos(categoria_id);
CREATE INDEX idx_produtos_ativo ON produtos(ativo) WHERE ativo = TRUE;

-- ============================================================
-- 5. GRUPOS DE OPCIONAIS / VARIAÇÕES
-- Ex: "Ponto da Carne", "Acompanhamentos", "Extras"
-- ============================================================
CREATE TABLE grupos_opcionais (
    id                  SERIAL PRIMARY KEY,
    nome                VARCHAR(80) NOT NULL,         -- "Ponto da Carne"
    tipo_selecao        VARCHAR(20) NOT NULL DEFAULT 'unica'
                        CHECK (tipo_selecao IN ('unica', 'multipla', 'quantidade')),
    min_selecoes        INTEGER NOT NULL DEFAULT 0,   -- 0 = opcional
    max_selecoes        INTEGER NOT NULL DEFAULT 1,   -- 1 = radio, >1 = checkbox
    obrigatorio         BOOLEAN NOT NULL DEFAULT FALSE,
    ordem               INTEGER NOT NULL DEFAULT 0,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 6. OPÇÕES DENTRO DE UM GRUPO
-- ============================================================
CREATE TABLE opcoes (
    id                  SERIAL PRIMARY KEY,
    grupo_id            INTEGER NOT NULL REFERENCES grupos_opcionais(id) ON DELETE CASCADE,
    nome                VARCHAR(100) NOT NULL,        -- "Mal passado", "Ao ponto", "Batata frita"
    preco_adicional     DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    ordem               INTEGER NOT NULL DEFAULT 0,
    ativo               BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX idx_opcoes_grupo ON opcoes(grupo_id);

-- ============================================================
-- 7. RELAÇÃO PRODUTO ↔ GRUPOS DE OPCIONAIS
-- ============================================================
CREATE TABLE produto_grupos (
    produto_id          INTEGER NOT NULL REFERENCES produtos(id) ON DELETE CASCADE,
    grupo_id            INTEGER NOT NULL REFERENCES grupos_opcionais(id) ON DELETE CASCADE,
    ordem               INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (produto_id, grupo_id)
);

-- ============================================================
-- 8. PEDIDOS
-- ============================================================
CREATE TABLE pedidos (
    id                  SERIAL PRIMARY KEY,
    mesa_id             INTEGER NOT NULL REFERENCES mesas(id) ON DELETE RESTRICT,
    codigo              VARCHAR(12) NOT NULL UNIQUE,  -- Código curto legível (ex: ZM-8F3A)
    status              VARCHAR(20) NOT NULL DEFAULT 'recebido'
                        CHECK (status IN (
                            'recebido',      -- Cliente enviou
                            'em_preparo',    -- Cozinha/Bar iniciou
                            'pronto',        -- Pronto para servir
                            'entregue',      -- Na mesa
                            'cancelado',
                            'pago'
                        )),
    valor_total         DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    observacoes_gerais  TEXT,
    origem              VARCHAR(20) DEFAULT 'qr_code', -- qr_code, garcom, balcao
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pedidos_mesa ON pedidos(mesa_id);
CREATE INDEX idx_pedidos_status ON pedidos(status);
CREATE INDEX idx_pedidos_created ON pedidos(created_at DESC);

-- ============================================================
-- 9. ITENS DO PEDIDO
-- ============================================================
CREATE TABLE itens_pedido (
    id                  SERIAL PRIMARY KEY,
    pedido_id           INTEGER NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
    produto_id          INTEGER NOT NULL REFERENCES produtos(id) ON DELETE RESTRICT,
    setor_id            INTEGER NOT NULL REFERENCES setores(id), -- Snapshot do setor no momento do pedido
    nome_produto        VARCHAR(120) NOT NULL,        -- Snapshot do nome
    quantidade          INTEGER NOT NULL DEFAULT 1 CHECK (quantidade > 0),
    preco_unitario      DECIMAL(10,2) NOT NULL,       -- Preço base no momento
    preco_adicionais    DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    peso_g              INTEGER,                      -- Se preço por peso
    observacoes         TEXT,                         -- "Sem cebola", "Bem passado extra"
    status              VARCHAR(20) NOT NULL DEFAULT 'pendente'
                        CHECK (status IN ('pendente', 'em_preparo', 'pronto', 'entregue', 'cancelado')),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_itens_pedido ON itens_pedido(pedido_id);
CREATE INDEX idx_itens_setor ON itens_pedido(setor_id);

-- ============================================================
-- 10. OPÇÕES ESCOLHIDAS EM CADA ITEM
-- ============================================================
CREATE TABLE item_opcoes (
    id                  SERIAL PRIMARY KEY,
    item_pedido_id      INTEGER NOT NULL REFERENCES itens_pedido(id) ON DELETE CASCADE,
    opcao_id            INTEGER NOT NULL REFERENCES opcoes(id) ON DELETE RESTRICT,
    nome_opcao          VARCHAR(100) NOT NULL,        -- Snapshot
    preco_adicional     DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    quantidade          INTEGER NOT NULL DEFAULT 1
);

-- ============================================================
-- TRIGGERS DE UPDATED_AT
-- ============================================================
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_mesas
    BEFORE UPDATE ON mesas
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_produtos
    BEFORE UPDATE ON produtos
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_pedidos
    BEFORE UPDATE ON pedidos
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ============================================================
-- SEED INICIAL (dados de exemplo baseados no Zé Mathyas)
-- ============================================================

-- Setores
INSERT INTO setores (nome, descricao, cor_hex) VALUES
    ('parrilla', 'Cortes nobres e grelhados na parrilla', '#C9A227'),
    ('cozinha',  'Pratos quentes, massas e acompanhamentos', '#8B4513'),
    ('bar',      'Drinks e bebidas alcoólicas', '#1A1A2E'),
    ('copa',     'Bebidas não alcoólicas e sobremesas frias', '#2C3E50');

-- Categorias
INSERT INTO categorias (nome, slug, descricao, ordem, icone) VALUES
    ('Entradas',        'entradas',        'Petiscos e entradas para abrir o apetite', 1, '🥗'),
    ('Cortes Nobres',   'cortes-nobres',   'Seleção premium na parrilla',              2, '🥩'),
    ('Massas',          'massas',          'Massas artesanais',                        3, '🍝'),
    ('Executivos',      'executivos',      'Pratos executivos do dia',                 4, '🍽️'),
    ('Acompanhamentos', 'acompanhamentos', 'Guarnições clássicas do Zé',               5, '🥔'),
    ('Drinks',          'drinks',          'Coquetéis autorais',                       6, '🍸'),
    ('Bebidas',         'bebidas',         'Refrigerantes, sucos e águas',             7, '🥤'),
    ('Sobremesas',      'sobremesas',      'Doces para fechar com chave de ouro',      8, '🍮');

-- Grupos de opcionais
INSERT INTO grupos_opcionais (nome, tipo_selecao, min_selecoes, max_selecoes, obrigatorio, ordem) VALUES
    ('Ponto da Carne',     'unica',    1, 1, TRUE,  1),
    ('Acompanhamentos',    'multipla', 0, 3, FALSE, 2),
    ('Extras',             'multipla', 0, 5, FALSE, 3),
    ('Tipo de Arroz',      'unica',    0, 1, FALSE, 4);

-- Opções - Ponto da Carne
INSERT INTO opcoes (grupo_id, nome, preco_adicional, ordem) VALUES
    (1, 'Mal passado',           0.00, 1),
    (1, 'Ao ponto para mal',     0.00, 2),
    (1, 'Ao ponto',              0.00, 3),
    (1, 'Ao ponto para bem',     0.00, 4),
    (1, 'Bem passado',           0.00, 5);

-- Opções - Acompanhamentos (exemplos)
INSERT INTO opcoes (grupo_id, nome, preco_adicional, ordem) VALUES
    (2, 'Arroz de Alho',              0.00, 1),
    (2, 'Baião Cremoso do Zé',        8.00, 2),
    (2, 'Batata Frita',               0.00, 3),
    (2, 'Macaxeira Frita',            0.00, 4),
    (2, 'Farofa Mediterrânea',        0.00, 5),
    (2, 'Legumes Assados',            0.00, 6),
    (2, 'Salada Tropical',            0.00, 7);

-- Opções - Extras
INSERT INTO opcoes (grupo_id, nome, preco_adicional, ordem) VALUES
    (3, 'Ovo frito',                  6.00, 1),
    (3, 'Queijo coalho',              9.00, 2),
    (3, 'Bacon crocante',            12.00, 3);

-- Mesas de exemplo
INSERT INTO mesas (numero, hash_qr, status, capacidade) VALUES
    (1,  'm1-a7k3', 'livre', 4),
    (2,  'm2-b8p1', 'livre', 4),
    (5,  'm5-x9a2', 'livre', 6),
    (8,  'm8-q4r7', 'livre', 4),
    (12, 'm12-z3m9','livre', 8);

-- Produtos de exemplo (baseados no estilo real do restaurante)
INSERT INTO produtos (categoria_id, setor_id, nome, slug, descricao, preco, preco_por_100g, peso_minimo_g, destaque, tempo_preparo_min) VALUES
    -- Entradas
    (1, 2, 'Pão de Alho Artesanal',     'pao-alho',         'Pão de alho na brasa com manteiga especial', 28.00, NULL, NULL, FALSE, 12),
    (1, 1, 'Chorizo Argentino',         'chorizo',          'Autêntico chorizo argentino grelhado', 42.00, NULL, NULL, TRUE,  15),
    (1, 1, 'Coração de Frango',         'coracao-frango',   'Espeto de coração de frango na parrilla', 36.00, NULL, NULL, FALSE, 12),
    -- Cortes Nobres
    (2, 1, 'Picanha Angus',             'picanha-angus',    'Picanha bovina Angus selecionada', 0.00, 18.90, 300, TRUE, 20),
    (2, 1, 'Beef Ancho',                'beef-ancho',       'Beef Ancho premium na parrilla', 0.00, 22.50, 300, TRUE, 22),
    (2, 1, 'Maminha Argentina',         'maminha',          'Maminha argentina suculenta', 0.00, 16.90, 300, FALSE, 18),
    (2, 1, 'Tomahawk',                  'tomahawk',         'Tomahawk impressionante (aprox. 1kg)', 289.00, NULL, NULL, TRUE, 35),
    (2, 1, 'Costela Premium Defumada',  'costela-premium',  'Costela defumada lentamente', 0.00, 14.90, 400, FALSE, 25),
    -- Massas
    (3, 2, 'Fettuccine ao Alho e Óleo', 'fettuccine-alho',  'Fettuccine artesanal com alho e azeite', 48.00, NULL, NULL, FALSE, 15),
    -- Executivos
    (4, 2, 'Medalhão de Filé Mignon',   'medalhao-file',    'Medalhão com arroz de alho e legumes', 79.90, NULL, NULL, TRUE, 20),
    -- Acompanhamentos avulsos
    (5, 2, 'Baião Cremoso do Zé',       'baiao-cremoso',    'Baião de dois cremoso especial da casa', 28.00, NULL, NULL, FALSE, 10),
    (5, 2, 'Farofa Mediterrânea',       'farofa-med',       'Farofa com toque mediterrâneo', 18.00, NULL, NULL, FALSE, 8),
    -- Drinks
    (6, 3, 'Negroni do Zé',             'negroni',          'Negroni clássico com twist da casa', 38.00, NULL, NULL, TRUE, 5),
    (6, 3, 'Gin Tônica Premium',        'gin-tonica',       'Gin selecionado + tônica artesanal', 32.00, NULL, NULL, FALSE, 4),
    -- Bebidas
    (7, 4, 'Água com Gás',              'agua-gas',         'Água mineral com gás 500ml', 9.00, NULL, NULL, FALSE, 1),
    (7, 4, 'Refrigerante Lata',         'refri-lata',       'Coca, Guaraná ou Sprite', 8.00, NULL, NULL, FALSE, 1),
    -- Sobremesas
    (8, 4, 'Pudim de Leite',            'pudim',            'Pudim cremoso da casa', 24.00, NULL, NULL, FALSE, 2);

-- Associar grupos de opcionais aos cortes nobres (Ponto da Carne + Acompanhamentos)
INSERT INTO produto_grupos (produto_id, grupo_id, ordem)
SELECT p.id, g.id, g.ordem
FROM produtos p
CROSS JOIN grupos_opcionais g
WHERE p.categoria_id = 2 AND g.id IN (1, 2);  -- Cortes Nobres + Ponto + Acompanhamentos

-- Também para o medalhão
INSERT INTO produto_grupos (produto_id, grupo_id, ordem)
SELECT p.id, g.id, g.ordem
FROM produtos p
CROSS JOIN grupos_opcionais g
WHERE p.slug = 'medalhao-file' AND g.id IN (1, 2);

COMMENT ON TABLE mesas IS 'Mesas físicas com hash único para QR Code';
COMMENT ON TABLE pedidos IS 'Pedidos originados do cardápio digital via QR Code';
COMMENT ON COLUMN produtos.preco_por_100g IS 'Quando preenchido, o preço final é calculado pelo peso informado pelo cliente ou balança';
