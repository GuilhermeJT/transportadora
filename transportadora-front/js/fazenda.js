const API_URL_FAZENDA = "http://localhost:8080/fazenda"; 

async function cadastroFazenda(event) {
  event.preventDefault();

  const nome_fazenda = document.getElementById("nome").value;
  const donoId = document.getElementById("selectDono").value;
  const municipioId = document.getElementById("selectMuni").value;

  const response = await fetch(API_URL_FAZENDA, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nome_fazenda,
      dono: { id: parseInt(donoId) },
      municipio: { id: parseInt(municipioId) }
    })
  });

  if (response.ok) {
    alert("Fazenda cadastrada com sucesso!");
    window.location.href = "cadastro_fazenda.html"; // redireciona para listagem
  } else {
    alert("Erro ao cadastrar Fazenda. Verifique os dados e tente novamente.");
  }
}

// -------------------

function getFazendaIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}


async function carregarFazenda() {
  const id = getFazendaIdFromUrl();
  if (!id) return;

  try {
    const response = await fetch(`${API_URL_FAZENDA}/${id}`);
    if (!response.ok) throw new Error("Erro ao carregar Fazenda");

    const fazenda = await response.json();
    document.getElementById("nome").value = fazenda.nome_fazenda;
    document.getElementById("selectDono").value = fazenda.dono.id;
    document.getElementById("selectMuni").value = fazenda.municipio.id;
    
  } catch (error) {
    console.error("Erro:", error);
    alert("Não foi possível carregar o Fazenda.");
  }
}

// atualiza os dados do usuário
async function updateFazenda(event) {
  event.preventDefault();

  const id = getFazendaIdFromUrl();
  const nome = document.getElementById("nome").value;
  const donoId = document.getElementById("selectDono").value;
  const municipioId = document.getElementById("selectMuni").value;

  // monta o JSON só com os campos preenchidos
  const payload = {};
  if(nome) payload.nome_fazenda = nome;
  if (donoId) payload.dono = {id: parseInt(donoId)};
  if (municipioId) payload.municipio = {id: parseInt(municipioId)};

  try {
    const response = await fetch(`${API_URL_FAZENDA}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      alert("Fazenda atualizado com sucesso!");
      window.location.href = "listar_fazenda.html";
    } else {
      alert("Erro ao editar Fazenda. Verifique os dados e tente novamente.");
    }
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao atualizar Fazenda.");
  }
}


// -------------------


async function carregarFazendas(selectId) {
  try {
    const response = await fetch(API_URL_FAZENDA);
    if (!response.ok) {
      throw new Error("Erro ao carregar Fazendas");
    }

    const fazendas = await response.json();
    const select = document.getElementById(selectId);

    // limpa o select (mantém apenas "Selecione...")
    select.innerHTML = '<option value="">Selecione...</option>';

    fazendas.forEach(v => {
      const option = document.createElement("option");
      option.value = v.id; 
      option.textContent = v.nome_fazenda; 
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Erro:", error);
    alert("Não foi possível carregar as fazendas.");
  }
}


async function carregarFazendasLista() {
  const tabela = document.getElementById("tabelaFazendas");
  if (!tabela) return; 

  try {
    const response = await fetch(API_URL_FAZENDA);
    if (!response.ok) throw new Error("Erro ao carregar Fazendas");

    const fazenda = await response.json();
    tabela.innerHTML = ""; 

    if (fazenda.length === 0) {
      tabela.innerHTML = `
        <tr>
          <td colspan="5" class="text-center text-muted">
            Nenhuma fazenda cadastrada.
          </td>
        </tr>
      `;
      return;
    }

    fazenda.forEach(a => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${a.id}</td>
        <td>${a.nome_fazenda}</td>
        <td>${a.dono ? a.dono.nome : "Sem dono"}</td>
        <td>${a.municipio ? a.municipio.nome : "Sem município"}</td>
        <td class="text-center">
          <button class="btn btn-sm btn-warning me-2" onclick="window.editarFazenda(${a.id})">Editar</button>
          <button class="btn btn-sm btn-danger" onclick="window.deletarFazenda(${a.id})">Excluir</button>
        </td>
      `;

      tabela.appendChild(tr);
    });
  } catch (error) {
    console.error("Erro:", error);
    alert("Não foi possível carregar as fazendas.");
  }
}

// 👉 funções expostas no objeto global
window.deletarFazenda = async function(id) {
  if (!confirm("Tem certeza que deseja excluir esta fazenda?")) return;

  try {
    const response = await fetch(`${API_URL_FAZENDA}/${id}`, {
      method: "DELETE"
    });

    if (response.ok) {
      alert("fazenda excluída com sucesso!");
      carregarFazendasLista();
    } else {
      alert("Erro ao excluir fazenda.");
    }
  } catch (error) {
    console.error("Erro:", error);
    alert("Não foi possível excluir a fazenda.");
  }
};

window.editarFazenda = function(id) {
  window.location.href = `editar_fazenda.html?id=${id}`;
};

// garante o carregamento inicial (só chama se existir tabela)  
document.addEventListener("DOMContentLoaded", () => {
  carregarFazendasLista();
  carregarFazenda();
});

