-- DDL para o sistema de reparações automotivas

-- Tabela Cliente
CREATE TABLE Cliente (
    codigo_cliente INT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    logradouro VARCHAR(100),
    numero VARCHAR(10),
    cep VARCHAR(20),
    bairro VARCHAR(50),
    cidade VARCHAR(50),
    estado VARCHAR(2),
    telefone VARCHAR(20)
);

-- Tabela Veiculo
CREATE TABLE Veiculo (
    codigo_veiculo INT PRIMARY KEY,
    codigo_cliente INT NOT NULL,
    data_aquisicao DATE,
    modelo VARCHAR(50),
    placa VARCHAR(20),
    FOREIGN KEY (codigo_cliente) REFERENCES Cliente(codigo_cliente)
);

-- Tabela Categoria
CREATE TABLE Categoria (
    nome_categoria VARCHAR(50) PRIMARY KEY,
    custo_horario_mao_obra DECIMAL(10,2) NOT NULL
);

-- Tabela Funcionario
CREATE TABLE Funcionario (
    codigo_funcionario INT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    logradouro VARCHAR(100),
    numero VARCHAR(10),
    cep VARCHAR(20),
    bairro VARCHAR(50),
    cidade VARCHAR(50),
    estado VARCHAR(2),
    telefone VARCHAR(20),
    categoria VARCHAR(50) NOT NULL,
    FOREIGN KEY (categoria) REFERENCES Categoria(nome_categoria)
);

-- Tabela Peca
CREATE TABLE Peca (
    codigo_peca INT PRIMARY KEY,
    descricao VARCHAR(100) NOT NULL,
    custo_unitario DECIMAL(10,2) NOT NULL,
    qtd_estoque INT NOT NULL
);

-- Tabela Reparacao
CREATE TABLE Reparacao (
    codigo_reparacao INT PRIMARY KEY,
    codigo_veiculo INT NOT NULL,
    codigo_cliente INT NOT NULL,
    data_reparacao DATE NOT NULL,
    custo_total DECIMAL(10,2),
    FOREIGN KEY (codigo_veiculo) REFERENCES Veiculo(codigo_veiculo),
    FOREIGN KEY (codigo_cliente) REFERENCES Cliente(codigo_cliente)
);

-- Tabela ItensReparacao (Peças usadas em cada reparação)
CREATE TABLE ItensReparacao (
    codigo_reparacao INT NOT NULL,
    codigo_peca INT NOT NULL,
    quantidade_usada INT NOT NULL,
    preco_peca DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (codigo_reparacao, codigo_peca),
    FOREIGN KEY (codigo_reparacao) REFERENCES Reparacao(codigo_reparacao),
    FOREIGN KEY (codigo_peca) REFERENCES Peca(codigo_peca)
);

-- Tabela MaoDeObraReparacao (Mão de obra de funcionários em cada reparação)
CREATE TABLE MaoDeObraReparacao (
    codigo_reparacao INT NOT NULL,
    codigo_funcionario INT NOT NULL,
    tempo_horas DECIMAL(5,2) NOT NULL,
    custo_mao_obra DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (codigo_reparacao, codigo_funcionario),
    FOREIGN KEY (codigo_reparacao) REFERENCES Reparacao(codigo_reparacao),
    FOREIGN KEY (codigo_funcionario) REFERENCES Funcionario(codigo_funcionario)
);

-- Inserir dados de exemplo (3 tuplas por tabela)

INSERT INTO Cliente VALUES
(1, 'João Silva', 'Rua das Flores', '123', '12345-678', 'Centro', 'São Paulo', 'SP', '11999999999'),
(2, 'Maria Oliveira', 'Avenida Brasil', '456', '23456-789', 'Jardim', 'Rio de Janeiro', 'RJ', '21988888888'),
(3, 'Carlos Pereira', 'Travessa dos Pássaros', '789', '34567-890', 'Bela Vista', 'Belo Horizonte', 'MG', '31977777777');

INSERT INTO Veiculo VALUES
(1, 1, '2021-05-10', 'Ford Fiesta', 'ABC-1234'),
(2, 2, '2020-10-15', 'Chevrolet Onix', 'DEF-5678'),
(3, 1, '2019-08-20', 'Volkswagen Gol', 'GHI-9012');

INSERT INTO Categoria VALUES
('Mecânico', 50.00),
('Eletricista', 60.00),
('Funileiro', 55.00);

INSERT INTO Funcionario VALUES
(1, 'Paulo Santos', 'Rua A', '10', '12345-000', 'Centro', 'São Paulo', 'SP', '11981112222', 'Mecânico'),
(2, 'Ana Costa', 'Rua B', '20', '23456-111', 'Jardim', 'Rio de Janeiro', 'RJ', '21982223333', 'Eletricista'),
(3, 'Carlos Souza', 'Rua C', '30', '34567-222', 'Bela Vista', 'Belo Horizonte', 'MG', '31983334444', 'Funileiro');

INSERT INTO Peca VALUES
(1, 'Filtro de óleo', 20.00, 50),
(2, 'Pastilha de freio', 35.00, 40),
(3, 'Velas de ignição', 15.00, 100);

INSERT INTO Reparacao VALUES
(1, 1, 1, '2023-03-01', 350.00),
(2, 2, 2, '2023-03-05', 220.00),
(3, 3, 1, '2023-03-10', 400.00);

INSERT INTO ItensReparacao VALUES
(1, 1, 1, 20.00),
(1, 2, 2, 35.00),
(2, 3, 4, 15.00);

INSERT INTO MaoDeObraReparacao VALUES
(1, 1, 4.0, 200.00),
(2, 2, 3.0, 180.00),
(3, 3, 5.0, 275.00);
