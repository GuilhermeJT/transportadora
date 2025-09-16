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
