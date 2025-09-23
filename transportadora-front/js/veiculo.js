const API_URL_VEICULO = "http://localhost:8080/veiculo"; // ajuste conforme seu endpoint

async function cadastrarVeiculo(event) {
  event.preventDefault();

  const tipoVeiculo = document.getElementById("modelo").value;
  const placa = document.getElementById("placa").value;

  const response = await fetch(API_URL_VEICULO, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tipoVeiculo, placa })
  });

  if (response.ok) {
    alert("Veículo cadastrado com sucesso!");
    window.location.href = "cadastro_veiculo.html"; // redireciona para listagem
  } else {
    alert("Erro ao cadastrar Veículo. Verifique os dados e tente novamente.");
  }
}

// ---------------------------//
// pega o id da URL 

function getVeiculosIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

// carrega dados para preencher os campos
async function carregarVeiculos() {
  const id = getVeiculosIdFromUrl();
  if (!id) return;

  try {
    const response = await fetch(`${API_URL_VEICULO}/${id}`);
    if (!response.ok) throw new Error("Erro ao carregar veiculo");

    const veiculo = await response.json();
    document.getElementById("modelo").value = veiculo.tipoVeiculo;
    document.getElementById("placa").value = veiculo.placa;
  } catch (error) {
    console.error("Erro:", error);
    alert("Não foi possível carregar o veiculo.");
  }
}

// atualiza os dados
async function updateVeiculo(event) {
  event.preventDefault();

  const id = getVeiculosIdFromUrl();
  const tipoVeiculo = document.getElementById("modelo").value;
  const placa = document.getElementById("placa").value;

  const payload = {};
  if(tipoVeiculo) payload.tipoVeiculo = tipoVeiculo;
  if(placa) payload.placa = placa;

  try {
    const response = await fetch(`${API_URL_VEICULO}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      alert("veiculo atualizado com sucesso!");
      window.location.href = "listar_veiculo.html";
    } else {
      alert("Erro ao editar veiculo. Verifique os dados e tente novamente.");
    }
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao atualizar veiculo.");
  }
}

// -------------------------------------------//



async function carregarVeiculos(selectId) {
  try {
    const response = await fetch(API_URL_VEICULO);
    if (!response.ok) {
      throw new Error("Erro ao carregar veículos");
    }

    const veiculos = await response.json();
    const select = document.getElementById(selectId);

    // limpa o select (mantém apenas "Selecione...")
    select.innerHTML = '<option value="">Selecione...</option>';

    veiculos.forEach(v => {
      const option = document.createElement("option");
      option.value = v.id; 
      option.textContent = `${v.tipoVeiculo} - ${v.placa}`; 
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Erro:", error);
    alert("Não foi possível carregar os veículos.");
  }
}


// Listar veículos
async function carregarVeiculosLista() {
  const tabela = document.getElementById("tabelaVeiculos");
  if (!tabela) return; // só executa se existir a tabela na página

  try {
    const response = await fetch(API_URL_VEICULO);
    if (!response.ok) throw new Error("Erro ao carregar veículos");

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
        <td>${v.tipoVeiculo}</td>
        <td>${v.placa}</td>
        <td class="text-center">
          <button class="btn btn-sm btn-warning me-2" onclick="editarVeiculo(${v.id})">Editar</button>
          <button class="btn btn-sm btn-danger" onclick="deletarVeiculo(${v.id})">Excluir</button>
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

// Executa só quando a página carregar
document.addEventListener("DOMContentLoaded", carregarVeiculosLista, carregarVeiculos);