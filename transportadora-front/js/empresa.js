const API_URL_EMPRESA = "http://localhost:8080/empresa"; // ajuste conforme seu endpoint

async function cadastroEmpresa(event) {
  event.preventDefault();

  const cnpj = document.getElementById("cnpj").value;
  const nomeEmpresa = document.getElementById("nomeEmpresa").value;

  const response = await fetch(API_URL_EMPRESA, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cnpj, nomeEmpresa})
  });

  if (response.ok) {
    alert("Emrpesa cadastrado com sucesso!");
    window.location.href = "cadastro_empresa.html"; // redireciona para listagem
  } else {
    alert("Erro ao cadastrar Empresa. Verifique os dados e tente novamente.");
  }
}



async function carregarEmpresas(selectId) {
  const select = document.getElementById(selectId);

  // se não existir esse select na página, não faz nada
  if (!select) return;

  try {
    const response = await fetch(API_URL_EMPRESA);

    if (!response.ok) {
      throw new Error("Erro ao carregar empresas");
    }

    const empresas = await response.json();

    select.innerHTML = '<option value="">Selecione...</option>';

    empresas.forEach(empresa => {
      const option = document.createElement("option");
      option.value = empresa.id;
      option.textContent = empresa.nomeEmpresa;
      select.appendChild(option);
    });

  } catch (error) {
    console.error("Erro:", error);
    alert("Não foi possível carregar as empresas.");
  }
}




document.addEventListener("DOMContentLoaded", function () {
  carregarEmpresas("selectTransportadora");
});