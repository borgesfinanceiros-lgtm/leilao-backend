-- -----------------------------------------------------
-- TABELAS PAI (INFERIDAS/AJUSTADAS) - PRECISAM VIR PRIMEIRO
-- -----------------------------------------------------

-- Tabela de Clientes
CREATE TABLE Clientes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    cpf_cnpj VARCHAR(18) UNIQUE NULL, -- Permitindo NULL se o cadastro for inicial ou pessoa estrangeira
    telefone VARCHAR(20) NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    -- Adicione outras colunas se souber quais são
);

-- Tabela de Administradores
CREATE TABLE Administradores (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    -- Adicione outras colunas se souber quais são
);

-- Tabela de Leiloes (CORRIGIDA: 'data_fim' agora permite NULL para evitar erro #1067)
CREATE TABLE Leiloes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    data_inicio TIMESTAMP NOT NULL,
    data_fim TIMESTAMP NULL, -- CORREÇÃO PARA ERRO #1067
    status ENUM('ativo', 'concluido', 'cancelado') DEFAULT 'ativo',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Lotes (CORRIGIDA: Tipos UNSIGNED para corresponder a Leiloes/Clientes)
CREATE TABLE Lotes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    leilao_id INT UNSIGNED NOT NULL, -- Corrigido para UNSIGNED
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    lance_minimo DECIMAL(10, 2) NOT NULL,
    valor_arremate DECIMAL(10, 2) NULL,
    FOREIGN KEY (leilao_id) REFERENCES Leiloes(id)
);


-- -----------------------------------------------------
-- MÓDULO 4: FINANCEIRO E PÓS-ARREMATE (SUAS TABELAS ORIGINAIS CORRIGIDAS)
-- -----------------------------------------------------

-- Tabela para rastrear documentos de habilitação (KYC - Know Your Customer)
CREATE TABLE HabilitacaoDocumentos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT UNSIGNED NOT NULL, -- CORRIGIDO: Adicionando UNSIGNED
    tipo_documento VARCHAR(50) NOT NULL,
    caminho_arquivo VARCHAR(255) NOT NULL,
    status ENUM('pendente', 'aprovado', 'rejeitado') DEFAULT 'pendente',
    data_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    administrador_aprovador_id INT UNSIGNED NULL, -- CORRIGIDO: Adicionando UNSIGNED
    FOREIGN KEY (cliente_id) REFERENCES Clientes(id),
    FOREIGN KEY (administrador_aprovador_id) REFERENCES Administradores(id)
);

-- Tabela de Pagamentos (Rastreia todas as transações)
CREATE TABLE Pagamentos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    lote_id INT UNSIGNED NOT NULL, -- CORRIGIDO: Adicionando UNSIGNED
    cliente_id INT UNSIGNED NOT NULL, -- CORRIGIDO: Adicionando UNSIGNED
    valor_total DECIMAL(10, 2) NOT NULL,
    comissao_leiloeiro DECIMAL(10, 2) NOT NULL,
    taxa_administrativa DECIMAL(10, 2) DEFAULT 0.00,
    gateway_transacao_id VARCHAR(100),
    metodo_pagamento VARCHAR(50) NOT NULL,
    status_pagamento ENUM('pendente', 'pago', 'falhou', 'estornado') DEFAULT 'pendente',
    data_pagamento TIMESTAMP NULL,
    data_vencimento DATE,
    FOREIGN KEY (lote_id) REFERENCES Lotes(id),
    FOREIGN KEY (cliente_id) REFERENCES Clientes(id)
);

-- Tabela de Notificações (Rastreia e armazena notificações internas)
CREATE TABLE Notificacoes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT UNSIGNED NOT NULL, -- CORRIGIDO: Adicionando UNSIGNED
    mensagem TEXT NOT NULL,
    link VARCHAR(255),
    lida BOOLEAN DEFAULT FALSE,
    data_notificacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES Clientes(id)
);