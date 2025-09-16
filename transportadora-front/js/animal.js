const API_URL_ANIMAL = "http://localhost:8080/animal"; // ajuste conforme seu endpoint

async function cadastrarAnimal(event) {
  event.preventDefault();

  const nomeAnimal = document.getElementById("nome").value;
  

  const response = await fetch(API_URL_ANIMAL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({nomeAnimal})
  });

  if (response.ok) {
    alert("Animal cadastrado com sucesso!");
    window.location.href = "cadastro_animal.html"; // redireciona para listagem
  } else {
    alert("Erro ao cadastrar animal. Verifique os dados e tente novamente.");
  }
}



async function carregarAnimais(selectId) {
  try {
    const response = await fetch(API_URL_ANIMAL);
    if (!response.ok) {
      throw new Error("Erro ao carregar Animal");
    }

    const animais = await response.json();
    const select = document.getElementById(selectId);

    // limpa o select (mantém apenas "Selecione...")
    select.innerHTML = '<option value="">Selecione...</option>';

    animais.forEach(v => {
      const option = document.createElement("option");
      option.value = v.id; 
      option.textContent = v.nomeAnimal; 
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Erro:", error);
    alert("Não foi possível carregar os Animais.");
  }
}


async function carregarAnimaisLista() {
  const tabela = document.getElementById("tabelaAnimais");
  if (!tabela) return; // protege: se não tiver tabela, não faz nada

  try {
    const response = await fetch(API_URL_ANIMAL);
    if (!response.ok) throw new Error("Erro ao carregar animais");

    const animais = await response.json();
    tabela.innerHTML = ""; 

    if (animais.length === 0) {
      tabela.innerHTML = `
        <tr>
          <td colspan="3" class="text-center text-muted">
            Nenhum animal cadastrado.
          </td>
        </tr>
      `;
      return;
    }

    animais.forEach(a => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${a.id}</td>
        <td>${a.nomeAnimal}</td>
        <td class="text-center">
          <button class="btn btn-sm btn-warning me-2" onclick="window.editarAnimal(${a.id})">Editar</button>
          <button class="btn btn-sm btn-danger" onclick="window.deletarAnimal(${a.id})">Excluir</button>
        </td>
      `;

      tabela.appendChild(tr);
    });
  } catch (error) {
    console.error("Erro:", error);
    alert("Não foi possível carregar os animais.");
  }
}

// 👉 funções expostas no objeto global
window.deletarAnimal = async function(id) {
  if (!confirm("Tem certeza que deseja excluir este animal?")) return;

  try {
    const response = await fetch(`${API_URL_ANIMAL}/${id}`, {
      method: "DELETE"
    });

    if (response.ok) {
      alert("Animal excluído com sucesso!");
      carregarAnimaisLista();
    } else {
      alert("Erro ao excluir animal.");
    }
  } catch (error) {
    console.error("Erro:", error);
    alert("Não foi possível excluir o animal.");
  }
};

window.editarAnimal = function(id) {
  window.location.href = `editar_animal.html?id=${id}`;
};

// garante o carregamento inicial (só chama se existir tabela)
document.addEventListener("DOMContentLoaded", carregarAnimaisLista);
