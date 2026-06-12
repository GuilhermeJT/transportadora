const API_URL_VEICULO = "http://localhost:8080/veiculo";

// Cadastrar veículo
async function cadastrarVeiculo(event) {
  event.preventDefault();

  const modelo = document.getElementById("modelo").value;
  const placa = document.getElementById("placa").value;

  const response = await fetch(API_URL_VEICULO, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ modelo, placa })
  });

  if (response.ok) {
    alert("Veículo cadastrado com sucesso!");
    window.location.href = "listar_veiculo.html";
  } else {
    alert("Erro ao cadastrar veículo. Verifique os dados e tente novamente.");
  }
}

// Pega o id da URL
function getVeiculoIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

// Carrega dados para preencher os campos na tela de edição
async function carregarVeiculo() {
  const id = getVeiculoIdFromUrl();
  if (!id) return;

  try {
    const response = await fetch(`${API_URL_VEICULO}/${id}`);

    if (!response.ok) {
      throw new Error("Erro ao carregar veículo");
    }

    const veiculo = await response.json();

    document.getElementById("modelo").value = veiculo.modelo;
    document.getElementById("placa").value = veiculo.placa;

  } catch (error) {
    console.error("Erro:", error);
    alert("Não foi possível carregar o veículo.");
  }
}

// Atualizar veículo
async function updateVeiculo(event) {
  event.preventDefault();

  const id = getVeiculoIdFromUrl();

  const modelo = document.getElementById("modelo").value;
  const placa = document.getElementById("placa").value;

  const payload = {};

  if (modelo) payload.modelo = modelo;
  if (placa) payload.placa = placa;

  try {
    const response = await fetch(`${API_URL_VEICULO}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      alert("Veículo atualizado com sucesso!");
      window.location.href = "listar_veiculo.html";
    } else {
      alert("Erro ao editar veículo. Verifique os dados e tente novamente.");
    }

  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao atualizar veículo.");
  }
}

// Carregar veículos em um select
async function carregarVeiculos(selectId) {
  try {
    const response = await fetch(API_URL_VEICULO);

    if (!response.ok) {
      throw new Error("Erro ao carregar veículos");
    }

    const veiculos = await response.json();
    const select = document.getElementById(selectId);

    if (!select) return;

    select.innerHTML = '<option value="">Selecione...</option>';

    veiculos.forEach(v => {
      const option = document.createElement("option");

      option.value = v.id;
      option.textContent = `${v.modelo} - ${v.placa}`;

      select.appendChild(option);
    });

  } catch (error) {
    console.error("Erro:", error);
    alert("Não foi possível carregar os veículos.");
  }
}

// Listar veículos na tabela
async function carregarVeiculosLista() {
  const tabela = document.getElementById("tabelaVeiculos");

  if (!tabela) return;

  try {
    const response = await fetch(API_URL_VEICULO);

    if (!response.ok) {
      throw new Error("Erro ao carregar veículos");
    }

    const veiculos = await response.json();

    tabela.innerHTML = "";

    if (veiculos.length === 0) {
      tabela.innerHTML = `
        <tr>
          <td colspan="4" class="text-center text-muted">
            Nenhum veículo cadastrado.
          </td>
        </tr>
      `;
      return;
    }

    veiculos.forEach(v => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${v.id}</td>
        <td>${v.modelo}</td>
        <td>${v.placa}</td>
        <td class="text-center">
          <button class="btn btn-sm btn-warning me-2" onclick="editarVeiculo(${v.id})">
            Editar
          </button>
          <button class="btn btn-sm btn-danger" onclick="deletarVeiculo(${v.id})">
            Excluir
          </button>
        </td>
      `;

      tabela.appendChild(tr);
    });

  } catch (error) {
    console.error("Erro:", error);
    alert("Não foi possível carregar os veículos.");
  }
}

// Excluir veículo
async function deletarVeiculo(id) {
  if (!confirm("Tem certeza que deseja excluir este veículo?")) return;

  try {
    const response = await fetch(`${API_URL_VEICULO}/${id}`, {
      method: "DELETE"
    });

    if (response.ok) {
      alert("Veículo excluído com sucesso!");
      carregarVeiculosLista();
    } else {
      alert("Erro ao excluir veículo.");
    }

  } catch (error) {
    console.error("Erro:", error);
    alert("Não foi possível excluir o veículo.");
  }
}

// Editar veículo
function editarVeiculo(id) {
  window.location.href = `editar_veiculo.html?id=${id}`;
}

// Executa quando a página carregar
document.addEventListener("DOMContentLoaded", () => {
  carregarVeiculosLista();
  carregarVeiculo();
});