const API_URL_EMPRESA = "http://localhost:8080/empresa"; // ajuste conforme seu endpoint

async function cadastroEmpresa(event) {
  event.preventDefault();

  const cnpj = document.getElementById("cnpj").value;
  const nomeEmpresa = document.getElementById("nomeEmpresa").value;

  const response = await fetch(API_URL_EMPRESA, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cnpj, nomeEmpresa})
  });

  if (response.ok) {
    alert("Emrpesa cadastrado com sucesso!");
    window.location.href = "cadastro_empresa.html"; // redireciona para listagem
  } else {
    alert("Erro ao cadastrar Empresa. Verifique os dados e tente novamente.");
  }
}



async function carregarEmpresas(selectId) {
  const select = document.getElementById(selectId);

  // se não existir esse select na página, não faz nada
  if (!select) return;

  try {
    const response = await fetch(API_URL_EMPRESA);

    if (!response.ok) {
      throw new Error("Erro ao carregar empresas");
    }

    const empresas = await response.json();

    select.innerHTML = '<option value="">Selecione...</option>';

    empresas.forEach(empresa => {
      const option = document.createElement("option");
      option.value = empresa.id;
      option.textContent = empresa.nomeEmpresa;
      select.appendChild(option);
    });

  } catch (error) {
    console.error("Erro:", error);
    alert("Não foi possível carregar as empresas.");
  }
}






function getEmpresaIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}


// atualiza os dados da empresa
async function updateEmpresa(event) {
  event.preventDefault();

  const id = getEmpresaIdFromUrl();
  const cnpj = document.getElementById("cnpj").value;
  const nomeEmpresa = document.getElementById("nomeEmpresa").value;

  // monta o JSON só com os campos preenchidos
  const payload = {};
  if (cnpj) payload.cnpj = cnpj;
  if (nomeEmpresa) payload.nomeEmpresa = nomeEmpresa;

  try {
    const response = await fetch(`${API_URL_EMPRESA}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      alert("Empresa atualizada com sucesso!");
      window.location.href = "listar_empresa.html";
    } else {
      alert("Erro ao editar Empresa. Verifique os dados e tente novamente.");
    }
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao atualizar Empresa.");
  }
}




//------------>
// Listar Empresas
async function carregarEmpresasLista() {
  const tabela = document.getElementById("tabelaEmpresas");
  if (!tabela) return; // só executa se existir a tabela na página

  try {
    const response = await fetch(API_URL_EMPRESA);
    if (!response.ok) throw new Error("Erro ao carregar empresas");

    const empresas = await response.json();
    tabela.innerHTML = "";

    if (empresas.length === 0) {
      tabela.innerHTML = `
        <tr>
          <td colspan="4" class="text-center text-muted">
            Nenhum empresa cadastrada.
          </td>
        </tr>
      `;
      return;
    }

    empresas.forEach(v => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${v.id}</td>
        <td>${v.cnpj}</td>
        <td>${v.nomeEmpresa}</td>
        <td class="text-center">
          <button class="btn btn-sm btn-warning me-2" onclick="editarEmpresa(${v.id})">Editar</button>
          <button class="btn btn-sm btn-danger" onclick="deletarEmpresa(${v.id})">Excluir</button>
        </td>
      `;
      tabela.appendChild(tr);
    });
  } catch (error) {
    console.error("Erro:", error);
    alert("Não foi possível carregar as empresas.");
  }
}

// Excluir veículo
async function deletarEmpresa(id) {
  if (!confirm("Tem certeza que deseja excluir esta empresa ?")) return;

  try {
    const response = await fetch(`${API_URL_EMPRESA}/${id}`, {
      method: "DELETE"
    });

    if (response.ok) {
      alert("Empresa excluída com sucesso!");
      await carregarEmpresasLista();
    } else {
      alert("Erro ao excluir empresa.");
    }
  } catch (error) {
    console.error("Erro:", error);
    alert("Não foi possível excluir a empresa.");
  }
}

// Editar veículo
function editarEmpresa(id) {
  window.location.href = `editar_empresa.html?id=${id}`;
}





document.addEventListener("DOMContentLoaded", () => {
  carregarEmpresasLista();
  carregarEmpresas("selectTransportadora"); // só se existir esse select nessa página
});