const API_URL_CONDICAO = "http://localhost:8080/condicao";

async function carregarCondicoes(selectId) {
  const select = document.getElementById(selectId);

  // se não existir esse select na página, não faz nada
  if (!select) return;

  try {
    const response = await fetch(API_URL_CONDICAO);

    if (!response.ok) {
      throw new Error("Erro ao carregar condições");
    }

    const condicoes = await response.json();

    select.innerHTML = '<option value="">Selecione...</option>';

    condicoes.forEach(condicao => {
      const option = document.createElement("option");
      option.value = condicao.id;
      option.textContent = condicao.status;
      select.appendChild(option);
    });

  } catch (error) {
    console.error("Erro:", error);
    alert("Não foi possível carregar as condições.");
  }
}
