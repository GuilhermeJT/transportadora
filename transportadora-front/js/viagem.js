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


async function carregarViagensLista() {
  const tabela = document.getElementById("tabelaViagens");
  if (!tabela) return; 

  try {
    const response = await fetch(API_URL_VIAGEM);
    if (!response.ok) throw new Error("Erro ao carregar Viagens");

    const viagem = await response.json();
    tabela.innerHTML = ""; 

    if (viagem.length === 0) {
      tabela.innerHTML = `
        <tr>
          <td colspan="12" class="text-center text-muted">
            Nenhuma viagem cadastrada.
          </td>
        </tr>
      `;
      return;
    }

    viagem.forEach(a => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${a.id}</td>
        <td>${a.motorista ? a.motorista.nome : "Sem motorista"}</td>
        <td>${a.veiculo ? a.veiculo.tipoVeiculo : "Sem Veiculo"}</td>
        <td>${a.origem ? a.origem.nome_fazenda : "Sem fazenda"}</td>
        <td>${a.destino ? a.destino.nome_fazenda : "Sem fazenda"}</td>
        <td>${a.animal ? a.animal.nomeAnimal : "Sem Animal"}</td>
        <td>${a.qtdAnimais}</td>
        <td>${a.data}</td>
        <td>${a.km}</td>
        <td>${a.valorPorKm}</td>
        <td>${a.valorGastoPegadio}</td>
        <td class="text-center">
          <button class="btn btn-sm btn-warning me-2" onclick="window.editarViagem(${a.id})">Editar</button>
          <button class="btn btn-sm btn-danger" onclick="window.deletarViagem(${a.id})">Excluir</button>
        </td>
      `;

      tabela.appendChild(tr);
    });
  } catch (error) {
    console.error("Erro:", error);
    alert("Não foi possível carregar as Viagens.");
  }
}

// 👉 funções expostas no objeto global
window.deletarViagem = async function(id) {
  if (!confirm("Tem certeza que deseja excluir esta Viagem?")) return;

  try {
    const response = await fetch(`${API_URL_VIAGEM}/${id}`, {
      method: "DELETE"
    });

    if (response.ok) {
      alert("Viagem excluída com sucesso!");
      carregarViagensLista();
    } else {
      alert("Erro ao excluir Viagem.");
    }
  } catch (error) {
    console.error("Erro:", error);
    alert("Não foi possível excluir a viagem.");
  }
};

window.editarViagem = function(id) {
  window.location.href = `editar_viagem.html?id=${id}`;
};

// garante o carregamento inicial (só chama se existir tabela)
document.addEventListener("DOMContentLoaded", carregarViagensLista);

