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