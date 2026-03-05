const API_URL_DESPESA = "http://localhost:8080/despesa"; // ajuste conforme seu endpoint

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


