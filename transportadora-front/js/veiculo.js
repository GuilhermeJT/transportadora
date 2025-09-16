const API_URL_VEICULO = "http://localhost:8080/veiculo"; // ajuste conforme seu endpoint

async function cadastrarVeiculo(event) {
  event.preventDefault();

  const tipoVeiculo = document.getElementById("modelo").value;
  const placa = document.getElementById("placa").value;

  const response = await fetch(API_URL_VEICULO, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tipoVeiculo, placa })
  });

  if (response.ok) {
    alert("Veículo cadastrado com sucesso!");
    window.location.href = "cadastro_veiculo.html"; // redireciona para listagem
  } else {
    alert("Erro ao cadastrar Veículo. Verifique os dados e tente novamente.");
  }
}



async function carregarVeiculos(selectId) {
  try {
    const response = await fetch(API_URL_VEICULO);
    if (!response.ok) {
      throw new Error("Erro ao carregar veículos");
    }

    const veiculos = await response.json();
    const select = document.getElementById(selectId);

    // limpa o select (mantém apenas "Selecione...")
    select.innerHTML = '<option value="">Selecione...</option>';

    veiculos.forEach(v => {
      const option = document.createElement("option");
      option.value = v.id; 
      option.textContent = `${v.tipoVeiculo} - ${v.placa}`; 
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Erro:", error);
    alert("Não foi possível carregar os veículos.");
  }
}

