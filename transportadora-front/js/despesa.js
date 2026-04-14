const API_URL_DESPESA = "http://localhost:8080/despesa"; // ajuste 

async function cadastroDespesa(event) {
  event.preventDefault();
    
    const dataDespesa = document.getElementById("dataDespesa").value;
    const veiculo = document.getElementById("selectVeiculo").value;
    const motorista = document.getElementById("selectMotorista").value;
    const descricao = document.getElementById("descricao").value;
    const empresa = document.getElementById("selectEmpresa").value;
    const nf = Number(document.getElementById("nf").value);
    const valor = Number(document.getElementById("valorDespesa").value);

    
    const payload = {
        dataDespesa,
        veiculo: {id:veiculo},
        motorista: {id:motorista},
        descricao,
        empresa: {id:empresa},
        nf,
        valor
    };


    const response = await fetch(API_URL_DESPESA, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    console.log(response); 
    if (response.ok) {
        alert("Despesa Cadastrada com Sucesso!");
        window.location.href = "cadastro_despesa.html"; 
    } else {
        alert("Erro ao cadastrar Despesa. Verifique os dados e tente novamente.");
    }
}


function isoToBR(iso) {
  if (!iso) return "";
  const [y,m,d] = iso.split("T")[0].split("-");
  return `${d}/${m}/${y}`;
}



//TELA DE LISTAR

async function carregarDespesaLista() {
  const tabela = document.getElementById("tabelaDespesa");
  if (!tabela) return; 

  try {
    const response = await fetch(API_URL_DESPESA);
    if (!response.ok) throw new Error("Erro ao carregar Despesas");

    const despesa = await response.json();
    tabela.innerHTML = ""; 

    if (despesa.length === 0) {
      tabela.innerHTML = `
        <tr>
          <td colspan="9" class="text-center text-muted">
            Nenhum despesa cadastrada.
          </td>
        </tr>
      `;
      return;
    }

    despesa.forEach(a => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${a.id}</td>
        <td>${isoToBR(a.dataDespesa)}</td>
        <td>${a.veiculo ? a.veiculo.placa : "sem placa"}</td>
        <td>${a.motorista ? a.motorista.nome : "sem motorista"}</td>
        <td>${a.descricao}</td>
        <td>${a.empresa ? a.empresa.nomeEmpresa : "sem empresa"}</td>
        <td>${a.nf}</td>
        <td>${a.valor}</td>


        <td class="text-center">
          <button class="btn btn-sm btn-warning me-2" onclick="window.editarDespesa(${a.id})">Editar</button>
          <button class="btn btn-sm btn-danger" onclick="window.deletarDespesa(${a.id})">Excluir</button>
        </td>
      `;

      tabela.appendChild(tr);
    });
  } catch (error) {
    console.error("Erro:", error);
    alert("Não foi possível carregar as despesas.");
  }
}


function getViagemIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

//update
async function updateDespesa(event) {
        
    event.preventDefault();

    const id = getViagemIdFromUrl();

    const dataDespesa = document.getElementById("dataDespesa").value;
    const veiculo = document.getElementById("selectVeiculo").value;
    const motorista = document.getElementById("selectMotorista").value;
    const descricao = document.getElementById("descricao").value;
    const empresa = document.getElementById("selectEmpresa").value;
    const nf = Number(document.getElementById("nf").value);
    const valor = Number(document.getElementById("valorDespesa").value);

    const payload = {};

    if(dataDespesa) payload.dataDespesa = dataDespesa;
    if(veiculo) payload.veiculo = {id: veiculo};
    if(motorista) payload.motorista = {id: motorista};
    if(descricao) payload.descricao = descricao;
    if(empresa) payload.empresa = {id: empresa};
    if(nf) payload.nf = nf;
    if(valor) payload.valor = valor;

    
    

    try {
        const response = await fetch(`${API_URL_DESPESA}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
        });

        if (response.ok) {
        alert("Despesa atualizada com sucesso!");
        window.location.href = "listar_despesa.html";
        } else {
        const errorText = await response.text();
        console.error("Erro backend:", errorText);
        alert("Erro ao editar Despesa: " + errorText);
        }
    } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao atualizar Despesa.");
    }
}

// 👉 funções expostas no objeto global
window.deletarDespesa = async function(id) {
  if (!confirm("Tem certeza que deseja excluir esta Despesa?")) return;

  try {
    const response = await fetch(`${API_URL_DESPESA}/${id}`, {
      method: "DELETE"
    });

    if (response.ok) {
      alert("Despesa excluída com sucesso!");
      carregarDespesaLista();
    } else {
      alert("Erro ao excluir Despesa.");
    }
  } catch (error) {
    console.error("Erro:", error);
    alert("Não foi possível excluir a Despesa.");
  }
};

window.editarDespesa = function(id) {
  window.location.href = `editar_despesa.html?id=${id}`;
};




document.addEventListener("DOMContentLoaded", () => {
  carregarDespesaLista();});

