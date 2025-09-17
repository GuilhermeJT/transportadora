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
document.addEventListener("DOMContentLoaded", carregarFazendasLista);

