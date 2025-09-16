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
