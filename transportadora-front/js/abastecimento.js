const API_URL_ABASTECIMENTO = "http://localhost:8080/abastecimento";

async function cadastroAbastecimento(event) {
  event.preventDefault();

  const dataInput = document.getElementById("dataAbastecimento").value;
  const partesData = dataInput.split("-");
  const data = `${partesData[2]}/${partesData[1]}/${partesData[0]}`;

  const empresa = parseInt(document.getElementById("selectEmpresa").value);
  const nf = parseInt(document.getElementById("Nf").value);
  const veiculo = parseInt(document.getElementById("selectVeiculo").value);
  const kmOdometro = parseFloat(document.getElementById("kmOdometro").value);
  const litros = parseFloat(document.getElementById("litros").value);
  const valorUni = parseFloat(document.getElementById("valorUni").value);
  const desconto = parseFloat(document.getElementById("desconto").value);


  const response = await fetch(API_URL_ABASTECIMENTO, {
    method: "POST",
    headers: { "Content-Type": "application/json" },    
    body: JSON.stringify({ 
        data, 
        empresa: {id: parseInt(empresa)},
        nf,
        veiculo: {id: parseInt(veiculo)},
        kmOdometro,
        litros,
        valorUni,
        desconto
        })
  });

  if (response.ok) {
    alert("Abastecimento cadastrado com sucesso!");
    window.location.href = "listar_abastecimento.html"; 
  } else {
    alert("Erro ao cadastrar Abastecimento. Verifique os dados e tente novamente.");
  }
}


// listar abastecimentos

async function carregarAbastecimentoLista() {
  const tabela = document.getElementById("tabelaAbastecimento");
  if (!tabela) return; 

  try {
    const response = await fetch(API_URL_ABASTECIMENTO);
    if (!response.ok) throw new Error("Erro ao carregar os Abastecimentos");

    const abastecimento = await response.json();
    tabela.innerHTML = ""; 

    if (abastecimento.length === 0) {
      tabela.innerHTML = `
        <tr>
          <td colspan="11" class="text-center text-muted">
            Nenhum abastecimentos cadastrada.
          </td>
        </tr>
      `;
      return;
    }

    abastecimento.forEach(a => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${a.data}</td>
        <td>${a.empresa ? a.empresa.nomeEmpresa : "sem empresa"}
        <td>${a.nf}</td>
        <td>${a.veiculo ? a.veiculo.placa : "sem placa"}</td>
        <td>${a.kmOdometro}</td>
        <td>${a.litros}</td>
        <td>${a.valorUni}</td>
        <td>${a.desconto}</td>
        <td>${a.total}</td>
        <td>${a.media}</td>
        
        <td class="text-center">
          <button class="btn btn-sm btn-warning me-2" onclick="window.editarAbastecimento(${a.id})">Editar</button>
          <button class="btn btn-sm btn-danger" onclick="window.deletarAbastecimento(${a.id})">Excluir</button>
        </td>
      `;

      tabela.appendChild(tr);
    });
  } catch (error) {
    console.error("Erro:", error);
    alert("Não foi possível carregar os Abastecimentos.");
  }
}

function getAbastecimentoIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

// update
async function updateAbastecimento(event) {
  event.preventDefault();

  const id = getAbastecimentoIdFromUrl();

  const dataInput = document.getElementById("dataAbastecimento").value;
  const empresa = document.getElementById("selectEmpresa").value;
  const nf = document.getElementById("Nf").value;
  const veiculo = document.getElementById("selectVeiculo").value;
  const kmOdometro = document.getElementById("kmOdometro").value;
  const litros = document.getElementById("litros").value;
  const valorUni = document.getElementById("valorUni").value;
  const desconto = document.getElementById("desconto").value;

  const payload = {};

  if (dataInput) {
    const partesData = dataInput.split("-");
    payload.data = `${partesData[2]}/${partesData[1]}/${partesData[0]}`;
  }

  if (empresa) payload.empresa = { id: Number(empresa) };
  if (nf) payload.nf = Number(nf);
  if (veiculo) payload.veiculo = { id: Number(veiculo) };
  if (kmOdometro) payload.kmOdometro = Number(kmOdometro);
  if (litros) payload.litros = Number(litros);
  if (valorUni) payload.valorUni = Number(valorUni);
  if (desconto) payload.desconto = Number(desconto);

  try {
    const response = await fetch(`${API_URL_ABASTECIMENTO}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      alert("Abastecimento atualizado com sucesso!");
      window.location.href = "listar_abastecimento.html";
    } else {
      const errorText = await response.text();
      console.error("Erro backend:", errorText);
      alert("Erro ao editar abastecimento: " + errorText);
    }
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao atualizar abastecimento.");
  }
}

// funções expostas no objeto global
window.deletarAbastecimento = async function(id) {
  if (!confirm("Tem certeza que deseja excluir este abastecimento?")) return;

  try {
    const response = await fetch(`${API_URL_ABASTECIMENTO}/${id}`, {
      method: "DELETE"
    });

    if (response.ok) {
      alert("Abastecimento excluído com sucesso!");
      carregarAbastecimentoLista();
    } else {
      alert("Erro ao excluir abastecimento.");
    }
  } catch (error) {
    console.error("Erro:", error);
    alert("Não foi possível excluir o abastecimento.");
  }
};

window.editarAbastecimento = function(id) {
  window.location.href = `editar_abastecimento.html?id=${id}`;
};

//carregar os dados pra tela de edição
async function carregarAbastecimento() {
  const id = getAbastecimentoIdFromUrl();
  if (!id) return;

  try {
    const response = await fetch(`${API_URL_ABASTECIMENTO}/${id}`);
    if (!response.ok) throw new Error("Erro ao carregar abastecimento");

    const a = await response.json();

    if (a.data) {
      const partes = a.data.split("/");
      document.getElementById("dataAbastecimento").value = `${partes[2]}-${partes[1]}-${partes[0]}`;
    }
    if (a.empresa) document.getElementById("selectEmpresa").value = a.empresa.id;
    if (a.nf) document.getElementById("Nf").value = a.nf;
    if (a.veiculo) document.getElementById("selectVeiculo").value = a.veiculo.id;
    if (a.kmOdometro) document.getElementById("kmOdometro").value = a.kmOdometro;
    if (a.litros) document.getElementById("litros").value = a.litros;
    if (a.valorUni) document.getElementById("valorUni").value = a.valorUni;
    if (a.desconto) document.getElementById("desconto").value = a.desconto;

  } catch (error) {
    console.error("Erro:", error);
    alert("Não foi possível carregar o abastecimento.");
  }
}




document.addEventListener("DOMContentLoaded", () => {
  carregarAbastecimentoLista();
  carregarAbastecimento();
});
