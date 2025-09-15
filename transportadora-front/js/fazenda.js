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
