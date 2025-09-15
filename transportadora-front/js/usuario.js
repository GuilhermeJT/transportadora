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


async function carregarDonos() {
  try {
    const response = await fetch(API_URL_USUARIO);
    if (!response.ok) {
      throw new Error("Erro ao carregar usuários");
    }

    const usuarios = await response.json();
    const select = document.getElementById("selectDono");

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

