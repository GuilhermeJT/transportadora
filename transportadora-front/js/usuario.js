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
