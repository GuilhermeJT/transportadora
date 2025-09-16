const API_URL_VIAGEM = "http://localhost:8080/viagem"; 

async function cadastroViagem(event) {
  event.preventDefault();

  const motorista = document.getElementById("selectMotorista").value;
  const veiculo = document.getElementById("selectVeiculo").value;
  const origem = document.getElementById("selectOrigem").value;
  const destino = document.getElementById("selectDestino").value;
  const animal = document.getElementById("selectAnimal").value;
  const qtdAnimais = document.getElementById("qtdAnimais").value;

  const dataInput = document.getElementById("dataViagem").value;
  const partes = dataInput.split("-"); 
  const data = `${partes[2]}/${partes[1]}/${partes[0]}`;

  const km = document.getElementById("kmPercorrido").value;
  const valorPorKm = document.getElementById("valorPorKm").value;
  const valorGastoPegadio = document.getElementById("valorPedagios").value;


  const response = await fetch(API_URL_VIAGEM, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      motorista: { id: parseInt(motorista)},
      veiculo: { id: parseInt(veiculo) },
      origem: { id: parseInt(origem) },
      destino: { id: parseInt(destino) },
      animal: { id: parseInt(animal) },
      qtdAnimais,
      data,
      km,
      valorPorKm,
      valorGastoPegadio
    })
  });


  if (response.ok) {
    alert("Viagem cadastrada com sucesso!");
    window.location.href = "cadastro_viagem.html"; // redireciona para listagem
  } else {
    alert("Erro ao cadastrar Viagem. Verifique os dados e tente novamente.");
  }
}