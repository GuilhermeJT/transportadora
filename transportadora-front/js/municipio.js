const API_URL_MUNICIPIO = "http://localhost:8080/municipio"; // ajuste conforme seu endpoint

async function cadastroMunicipio(event) {
  event.preventDefault();

  const nome = document.getElementById("nome").value;
  const estado = document.getElementById("estado").value;

  const response = await fetch(API_URL_MUNICIPIO, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, estado })
  });

  if (response.ok) {
    alert("Municipio cadastrado com sucesso!");
    window.location.href = "cadastro_municipio.html"; // redireciona para listagem
  } else {
    alert("Erro ao cadastrar Municipio. Verifique os dados e tente novamente.");
  }
}


async function carregarMunicipios(selectId) {
  try {
    const response = await fetch(API_URL_MUNICIPIO);
    if (!response.ok) {
      throw new Error("Erro ao carregar Municipios");
    }

    const municipios = await response.json();
    const select = document.getElementById(selectId);

    // limpa o select (mantém apenas "Selecione...")
    select.innerHTML = '<option value="">Selecione...</option>';

    municipios.forEach(u => {
      const option = document.createElement("option");
      option.value = u.id;             
      option.textContent = u.nome;     
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Erro:", error);
    alert("Não foi possível carregar os municipios.");
  }
}



async function carregarMunicipiosLista() {
  const tabela = document.getElementById("tabelaMunicipios");
  if (!tabela) return; 

  try {
    const response = await fetch(API_URL_MUNICIPIO);
    if (!response.ok) throw new Error("Erro ao carregar municípios");

    const municipio = await response.json();
    tabela.innerHTML = ""; 

    if (municipio.length === 0) {
      tabela.innerHTML = `
        <tr>
          <td colspan="4" class="text-center text-muted">
            Nenhum município cadastrado.
          </td>
        </tr>
      `;
      return;
    }

    municipio.forEach(a => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${a.id}</td>
        <td>${a.nome}</td>
        <td>${a.estado}</td>
        <td class="text-center">
          <button class="btn btn-sm btn-warning me-2" onclick="window.editarMunicipio(${a.id})">Editar</button>
          <button class="btn btn-sm btn-danger" onclick="window.deletarMunicipio(${a.id})">Excluir</button>
        </td>
      `;

      tabela.appendChild(tr);
    });
  } catch (error) {
    console.error("Erro:", error);
    alert("Não foi possível carregar os municípios.");
  }
}

// 👉 funções expostas no objeto global
window.deletarMunicipio = async function(id) {
  if (!confirm("Tem certeza que deseja excluir este município?")) return;

  try {
    const response = await fetch(`${API_URL_MUNICIPIO}/${id}`, {
      method: "DELETE"
    });

    if (response.ok) {
      alert("município excluído com sucesso!");
      carregarMunicipiosLista();
    } else {
      alert("Erro ao excluir município.");
    }
  } catch (error) {
    console.error("Erro:", error);
    alert("Não foi possível excluir o município.");
  }
};

window.editarMunicipio = function(id) {
  window.location.href = `edidar_municipio.html?id=${id}`;
};

// garante o carregamento inicial (só chama se existir tabela)
document.addEventListener("DOMContentLoaded", carregarMunicipiosLista);

