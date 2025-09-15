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
