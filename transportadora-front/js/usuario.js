const API_URL_USUARIO = "http://localhost:8080/usuario"; // ajuste conforme seu endpoint

async function cadastrarUsuario(event) {
  event.preventDefault();

  const nome = document.getElementById("nome").value;
  const password = document.getElementById("password").value;

  const response = await fetch(API_URL_USUARIO, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, password })
  });

  if (response.ok) {
    alert("Usuário cadastrado com sucesso!");
    window.location.href = "cadastro_usuario.html"; // redireciona para listagem
  } else {
    alert("Erro ao cadastrar usuário. Verifique os dados e tente novamente.");
  }
}

// pega o id da URL (ex: editar_usuario.html?id=3)
function getUsuarioIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

// carrega dados do usuário para preencher os campos
async function carregarUsuario() {
  const id = getUsuarioIdFromUrl();
  if (!id) return;

  try {
    const response = await fetch(`${API_URL_USUARIO}/${id}`);
    if (!response.ok) throw new Error("Erro ao carregar usuário");

    const usuario = await response.json();
    document.getElementById("nome").value = usuario.nome;
    document.getElementById("password").value = usuario.password;
  } catch (error) {
    console.error("Erro:", error);
    alert("Não foi possível carregar o usuário.");
  }
}

// atualiza os dados do usuário
async function updateUsuario(event) {
  event.preventDefault();

  const id = getUsuarioIdFromUrl();
  const nome = document.getElementById("nome").value;
  const password = document.getElementById("password").value;

  // monta o JSON só com os campos preenchidos
  const payload = {};
  if (nome) payload.nome = nome;
  if (password) payload.password = password;

  try {
    const response = await fetch(`${API_URL_USUARIO}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      alert("Usuário atualizado com sucesso!");
      window.location.href = "listar_usuario.html";
    } else {
      alert("Erro ao editar usuário. Verifique os dados e tente novamente.");
    }
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao atualizar usuário.");
  }
}


async function carregarDonos(selectId) {
  try {
    const response = await fetch(API_URL_USUARIO);
    if (!response.ok) {
      throw new Error("Erro ao carregar usuários");
    }

    const usuarios = await response.json();
    const select = document.getElementById(selectId);

    // limpa o select (mantém apenas "Selecione...")
    select.innerHTML = '<option value="">Selecione...</option>';

    usuarios.forEach(u => {
      const option = document.createElement("option");
      option.value = u.id;             // id do usuário vai no value
      option.textContent = u.nome;     // nome do usuário aparece pro usuário
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Erro:", error);
    alert("Não foi possível carregar os donos.");
  }
}

// <<---->>
async function carregarUsuariosLista() {
  const tabela = document.getElementById("tabelaUsuarios");
  if (!tabela) return; // protege: se não tiver tabela, não faz nada

  try {
    const response = await fetch(API_URL_USUARIO);
    if (!response.ok) throw new Error("Erro ao carregar usuários");

    const usuarios = await response.json();
    tabela.innerHTML = ""; 

    if (usuarios.length === 0) {
      tabela.innerHTML = `
        <tr>
          <td colspan="3" class="text-center text-muted">
            Nenhum usuário cadastrado.
          </td>
        </tr>
      `;
      return;
    }

    usuarios.forEach(u => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${u.id}</td>
        <td>${u.nome}</td>
        <td class="text-center">
          <button class="btn btn-sm btn-warning me-2" onclick="window.editarUsuario(${u.id})">Editar</button>
          <button class="btn btn-sm btn-danger" onclick="window.deletarUsuario(${u.id})">Excluir</button>
        </td>
      `;

      tabela.appendChild(tr);
    });
  } catch (error) {
    console.error("Erro:", error);
    alert("Não foi possível carregar os usuários.");
  }
}

// 👉 funções expostas no objeto global
window.deletarUsuario = async function(id) {
  if (!confirm("Tem certeza que deseja excluir este usuário?")) return;

  try {
    const response = await fetch(`${API_URL_USUARIO}/${id}`, {
      method: "DELETE"
    });

    if (response.ok) {
      alert("Usuário excluído com sucesso!");
      carregarUsuariosLista();
    } else {
      alert("Erro ao excluir usuário.");
    }
  } catch (error) {
    console.error("Erro:", error);
    alert("Não foi possível excluir o usuário.");
  }
};

window.editarUsuario = function(id) {
  window.location.href = `editar_usuario.html?id=${id}`;
};

// garante o carregamento inicial (só chama se existir tabela)
document.addEventListener("DOMContentLoaded", carregarUsuariosLista, carregarUsuario);
