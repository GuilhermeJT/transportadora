CREATE TABLE usuario (
  id_usuario  INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nome        VARCHAR(120) NOT NULL,
  senha       VARCHAR(255) NOT NULL
);

-- =========================
-- TABELA: municipio
-- =========================
CREATE TABLE municipio (
  id_municipio INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nome         VARCHAR(120) NOT NULL,
  estado       CHAR(2) NOT NULL
);

-- =========================
-- TABELA: fazenda
-- (municipio 1:N fazenda)
-- (usuario 1:N fazenda) -> dono
-- =========================
CREATE TABLE fazenda (
  id_fazenda    INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nome_fazenda  VARCHAR(160) NOT NULL,
  id_dono       INTEGER NOT NULL,
  id_municipio  INTEGER NOT NULL,

  CONSTRAINT fk_fazenda_dono
    FOREIGN KEY (id_dono) REFERENCES usuario(id_usuario)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,

  CONSTRAINT fk_fazenda_municipio
    FOREIGN KEY (id_municipio) REFERENCES municipio(id_municipio)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

-- =========================
-- TABELA: veiculo
-- =========================
CREATE TABLE veiculo (
  id_veiculo    INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tipo_veiculo  VARCHAR(60) NOT NULL,
  placa         VARCHAR(10) NOT NULL,
  CONSTRAINT uq_veiculo_placa UNIQUE (placa)
);

-- =========================
-- TABELA: viagem
-- (usuario 1:N viagem) -> motorista
-- (veiculo 1:N viagem)
-- (fazenda 1:N viagem) origem/destino
-- =========================
CREATE TABLE viagem (
  id_viagem            INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  data                 DATE NOT NULL,
  km                   INTEGER NOT NULL,
  valorPorKm           NUMERIC(10,2) NOT NULL,
  valorGastoPedagio    NUMERIC(10,2) NOT NULL DEFAULT 0.00,

  id_motorista         INTEGER NOT NULL,
  id_veiculo           INTEGER NOT NULL,
  id_fazenda_origem    INTEGER NOT NULL,
  id_fazenda_destino   INTEGER NOT NULL,

  CONSTRAINT fk_viagem_motorista
    FOREIGN KEY (id_motorista) REFERENCES usuario(id_usuario)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,

  CONSTRAINT fk_viagem_veiculo
    FOREIGN KEY (id_veiculo) REFERENCES veiculo(id_veiculo)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,

  CONSTRAINT fk_viagem_fazenda_origem
    FOREIGN KEY (id_fazenda_origem) REFERENCES fazenda(id_fazenda)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,

  CONSTRAINT fk_viagem_fazenda_destino
    FOREIGN KEY (id_fazenda_destino) REFERENCES fazenda(id_fazenda)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,

  -- Regras úteis
  CONSTRAINT ck_viagem_km CHECK (km >= 0),
  CONSTRAINT ck_viagem_valores CHECK (valorPorKm >= 0 AND valorGastoPedagio >= 0),
  CONSTRAINT ck_viagem_origem_destino CHECK (id_fazenda_origem <> id_fazenda_destino)
);

-- =========================
-- TABELA: tipo_animal
-- =========================
CREATE TABLE tipo_animal (
  id_tipo_animal INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nome           VARCHAR(80) NOT NULL,
  CONSTRAINT uq_tipo_animal_nome UNIQUE (nome)
);

-- =========================
-- TABELA ASSOCIATIVA: animais_viagem
-- (viagem N:N tipo_animal) com atributo qtdAnimais
-- PK composta (id_tipo_animal, id_viagem)
-- =========================
CREATE TABLE animais_viagem (
  id_tipo_animal INTEGER NOT NULL,
  id_viagem      INTEGER NOT NULL,
  qtdAnimais     INTEGER NOT NULL,

  CONSTRAINT pk_animais_viagem PRIMARY KEY (id_tipo_animal, id_viagem),

  CONSTRAINT fk_animais_viagem_tipo
    FOREIGN KEY (id_tipo_animal) REFERENCES tipo_animal(id_tipo_animal)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,

  CONSTRAINT fk_animais_viagem_viagem
    FOREIGN KEY (id_viagem) REFERENCES viagem(id_viagem)
    ON UPDATE CASCADE
    ON DELETE CASCADE,

  CONSTRAINT ck_animais_qtd CHECK (qtdAnimais > 0)
);

-- =========================
-- ÍNDICES (performance)
-- =========================
CREATE INDEX IF NOT EXISTS idx_fazenda_municipio ON fazenda(id_municipio);
CREATE INDEX IF NOT EXISTS idx_fazenda_dono      ON fazenda(id_dono);

CREATE INDEX IF NOT EXISTS idx_viagem_data       ON viagem(data);
CREATE INDEX IF NOT EXISTS idx_viagem_motorista  ON viagem(id_motorista);
CREATE INDEX IF NOT EXISTS idx_viagem_veiculo    ON viagem(id_veiculo);
CREATE INDEX IF NOT EXISTS idx_viagem_origem     ON viagem(id_fazenda_origem);
CREATE INDEX IF NOT EXISTS idx_viagem_destino    ON viagem(id_fazenda_destino);

CREATE INDEX IF NOT EXISTS idx_animais_viagem_viagem ON animais_viagem(id_viagem);
