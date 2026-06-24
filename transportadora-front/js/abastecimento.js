const API_URL_ABASTECIMENTO = "http://localhost:8080/abastecimento";

// formata número no padrão R$ brasileiro (1.234,56)
function formatarBRL(valor) {
  return Number(valor || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// selo de cor para a condição (pago = verde, pendente = amarelo)
function badgeCondicao(condicao) {
  const status = condicao && condicao.status ? condicao.status : null;
  if (!status) return '<span class="badge bg-secondary">—</span>';
  const s = status.toLowerCase();
  let cls = "bg-secondary";
  if (s === "pago") cls = "bg-success";
  else if (s === "pendente") cls = "bg-warning text-dark";
  return `<span class="badge ${cls}">${status}</span>`;
}

// converte dd/MM/yyyy -> yyyy-MM-dd (mantido por compatibilidade, não é mais usado no filtro)
function brParaISO(br) {
  if (!br) return "";
  const partes = br.split("/");
  if (partes.length !== 3) return "";
  return `${partes[2]}-${partes[1]}-${partes[0]}`;
}

// monta a linha (tr) de um abastecimento para a tabela
function linhaAbastecimento(a) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${a.data}</td>
    <td>${a.empresa ? a.empresa.nomeEmpresa : "sem empresa"}</td>
    <td>${a.nf}</td>
    <td>${a.veiculo ? a.veiculo.placa : "sem placa"}</td>
    <td>${a.kmOdometro}</td>
    <td>${a.litros}</td>
    <td>${a.valorUni}</td>
    <td>${a.desconto}</td>
    <td>${a.total}</td>
    <td>${a.media}</td>
    <td class="text-center">${badgeCondicao(a.condicao)}</td>
    <td class="text-center">
      <button class="btn btn-sm btn-warning me-2" onclick="window.editarAbastecimento(${a.id})">Editar</button>
      <button class="btn btn-sm btn-danger" onclick="window.deletarAbastecimento(${a.id})">Excluir</button>
    </td>
  `;
  return tr;
}

async function cadastroAbastecimento(event) {
  event.preventDefault();

  const dataInput = document.getElementById("dataAbastecimento").value;
  const partesData = dataInput.split("-");
  const data = `${partesData[2]}/${partesData[1]}/${partesData[0]}`;

  const empresa = parseInt(document.getElementById("selectEmpresa").value);
  const nf = parseInt(document.getElementById("Nf").value);
  const veiculo = parseInt(document.getElementById("selectVeiculo").value);
  const kmOdometro = parseFloat(document.getElementById("kmOdometro").value);
  const litros = parseFloat(document.getElementById("litros").value);
  const valorUni = parseFloat(document.getElementById("valorUni").value);
  const desconto = parseFloat(document.getElementById("desconto").value);
  const condicao = document.getElementById("selectCondicao").value;


  const response = await fetch(API_URL_ABASTECIMENTO, {
    method: "POST",
    headers: { "Content-Type": "application/json" },    
    body: JSON.stringify({ 
        data, 
        empresa: {id: parseInt(empresa)},
        nf,
        veiculo: {id: parseInt(veiculo)},
        kmOdometro,
        litros,
        valorUni,
        desconto,
        condicao: condicao ? { id: parseInt(condicao) } : null
        })
  });

  if (response.ok) {
    alert("Abastecimento cadastrado com sucesso!");
    window.location.href = "listar_abastecimento.html"; 
  } else {
    alert("Erro ao cadastrar Abastecimento. Verifique os dados e tente novamente.");
  }
}


// listar abastecimentos
async function carregarAbastecimentoLista() {
  const tabela = document.getElementById("tabelaAbastecimento");
  if (!tabela) return; 

  try {
    const response = await fetch(API_URL_ABASTECIMENTO);
    if (!response.ok) throw new Error("Erro ao carregar os Abastecimentos");

    const abastecimento = await response.json();
    tabela.innerHTML = ""; 

    // lista completa: esconde o total (só aparece ao filtrar por data)
    const total = document.getElementById("totalAbastecimento");
    if (total) total.style.display = "none";

    if (abastecimento.length === 0) {
      tabela.innerHTML = `
        <tr>
          <td colspan="12" class="text-center text-muted">
            Nenhum abastecimentos cadastrada.
          </td>
        </tr>
      `;
      return;
    }

    abastecimento.forEach(a => tabela.appendChild(linhaAbastecimento(a)));
  } catch (error) {
    console.error("Erro:", error);
    alert("Não foi possível carregar os Abastecimentos.");
  }
}

// ===================== FILTRO (backend) =====================
async function filtrarAbastecimentoPorData(event) {
  if (event) event.preventDefault();

  const tabela = document.getElementById("tabelaAbastecimento");
  if (!tabela) return;

  const inicio = document.getElementById("dataInicio").value;
  const fim = document.getElementById("dataFim").value;
  const placa = document.getElementById("filtroPlaca").value.trim();

  if (!inicio || !fim) {
    alert("Selecione a data de início e a data final para filtrar.");
    return;
  }
  if (inicio > fim) {
    alert("A data de início não pode ser maior que a data final.");
    return;
  }

  const params = new URLSearchParams({ inicio, fim });
  if (placa) params.append("placa", placa);

  try {
    const response = await fetch(`${API_URL_ABASTECIMENTO}/filtro?${params.toString()}`);
    if (!response.ok) throw new Error("Erro ao filtrar os Abastecimentos");

    const abastecimento = await response.json();

    // soma o total do período e mostra
    const somaTotal = abastecimento.reduce((acc, a) => acc + Number(a.total || 0), 0);
    const total = document.getElementById("totalAbastecimento");
    if (total) {
      total.textContent = `Total: R$ ${formatarBRL(somaTotal)}`;
      total.style.display = "";
    }

    tabela.innerHTML = "";

    if (abastecimento.length === 0) {
      tabela.innerHTML = `
        <tr>
          <td colspan="12" class="text-center text-muted">
            Nenhum abastecimento no intervalo informado.
          </td>
        </tr>
      `;
      return;
    }

    abastecimento.forEach(a => tabela.appendChild(linhaAbastecimento(a)));
  } catch (error) {
    console.error("Erro:", error);
    alert("Não foi possível filtrar os Abastecimentos.");
  }
}

// ===================== PDF do período/filtros (backend) =====================
window.baixarPdfAbastecimento = async function () {
  const inicio = document.getElementById("dataInicio").value;
  const fim = document.getElementById("dataFim").value;
  const placa = document.getElementById("filtroPlaca").value.trim();

  if (!inicio || !fim) {
    alert("Selecione a data de início e a data final para baixar o PDF.");
    return;
  }
  if (inicio > fim) {
    alert("A data de início não pode ser maior que a data final.");
    return;
  }

  const params = new URLSearchParams({ inicio, fim });
  if (placa) params.append("placa", placa);

  try {
    const response = await fetch(`${API_URL_ABASTECIMENTO}/filtro?${params.toString()}`);
    if (!response.ok) throw new Error("Erro ao carregar os Abastecimentos");

    const abastecimentos = await response.json();

    if (abastecimentos.length === 0) {
      alert("Nenhum abastecimento no período informado.");
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
    const larguraPagina = doc.internal.pageSize.getWidth();

    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text("ABASTECIMENTOS", larguraPagina / 2, 30, { align: "center" });

    const head = [["DATA", "EMPRESA", "NF", "PLACA", "KM ODOMETRO", "LITROS", "VALOR", "DESCONTO", "TOTAL", "MEDIA", "SITUAÇÃO"]];

    let somaTotal = 0;
    const body = abastecimentos.map(a => {
      somaTotal += Number(a.total || 0);
      return [
        a.data ?? "",
        a.empresa ? a.empresa.nomeEmpresa : "",
        a.nf ?? "",
        a.veiculo ? a.veiculo.placa : "",
        a.kmOdometro ?? "",
        a.litros ?? "",
        `R$ ${formatarBRL(a.valorUni)}`,
        `R$ ${formatarBRL(a.desconto)}`,
        `R$ ${formatarBRL(a.total)}`,
        a.media ?? "",
        (a.condicao && a.condicao.status ? a.condicao.status : "").toUpperCase()
      ];
    });

    doc.autoTable({
      head: head,
      body: body,
      startY: 42,
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 3, lineColor: [0, 0, 0], lineWidth: 0.5, textColor: [0, 0, 0], overflow: "linebreak", valign: "middle" },
      headStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0], fontStyle: "bold", halign: "center", valign: "middle" },
      columnStyles: {
        0: { cellWidth: 62, halign: "center" },
        2: { cellWidth: 50, halign: "center" },
        3: { cellWidth: 62, halign: "center" },
        6: { halign: "right" },
        7: { halign: "right" },
        8: { halign: "right" },
        10: { cellWidth: 70, halign: "center" }
      }
    });

    const posY = doc.lastAutoTable.finalY + 20;
    doc.setFontSize(11);
    doc.setFont(undefined, "bold");
    doc.text(`TOTAL = R$ ${formatarBRL(somaTotal)}`, larguraPagina - 40, posY, { align: "right" });

    const hoje = new Date();
    const dd = String(hoje.getDate()).padStart(2, "0");
    const mm = String(hoje.getMonth() + 1).padStart(2, "0");
    const aaaa = hoje.getFullYear();
    doc.save(`ABASTECIMENTOS_${dd}_${mm}_${aaaa}.pdf`);

  } catch (error) {
    console.error("Erro:", error);
    alert("Não foi possível gerar o PDF.");
  }
};

// ===================== Excel do período/filtros (backend) =====================
window.baixarExcelAbastecimento = async function () {
  const inicio = document.getElementById("dataInicio").value;
  const fim = document.getElementById("dataFim").value;
  const placa = document.getElementById("filtroPlaca").value.trim();

  if (!inicio || !fim) {
    alert("Selecione a data de início e a data final para baixar o Excel.");
    return;
  }
  if (inicio > fim) {
    alert("A data de início não pode ser maior que a data final.");
    return;
  }

  const params = new URLSearchParams({ inicio, fim });
  if (placa) params.append("placa", placa);

  try {
    const response = await fetch(`${API_URL_ABASTECIMENTO}/filtro?${params.toString()}`);
    if (!response.ok) throw new Error("Erro ao carregar os Abastecimentos");

    const abastecimentos = await response.json();

    if (abastecimentos.length === 0) {
      alert("Nenhum abastecimento no período informado.");
      return;
    }

    const head = ["DATA", "EMPRESA", "NF", "PLACA", "KM ODOMETRO", "LITROS", "VALOR", "DESCONTO", "TOTAL", "MEDIA", "SITUAÇÃO"];

    let somaTotal = 0;
    const body = abastecimentos.map(a => {
      somaTotal += Number(a.total || 0);
      return [
        a.data ?? "",
        a.empresa ? a.empresa.nomeEmpresa : "",
        a.nf ?? "",
        a.veiculo ? a.veiculo.placa : "",
        a.kmOdometro ?? "",
        a.litros ?? "",
        Number(a.valorUni || 0),
        Number(a.desconto || 0),
        Number(a.total || 0),
        a.media ?? "",
        (a.condicao && a.condicao.status ? a.condicao.status : "").toUpperCase()
      ];
    });

    body.push(["", "", "", "", "", "", "", "", "", "", ""]);
    body.push(["TOTAL", somaTotal, "", "", "", "", "", "", "", "", ""]);

    const planilha = [head, ...body];
    const ws = XLSX.utils.aoa_to_sheet(planilha);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Abastecimentos");

    const hoje = new Date();
    const dd = String(hoje.getDate()).padStart(2, "0");
    const mm = String(hoje.getMonth() + 1).padStart(2, "0");
    const aaaa = hoje.getFullYear();
    XLSX.writeFile(wb, `ABASTECIMENTOS_${dd}_${mm}_${aaaa}.xlsx`);

  } catch (error) {
    console.error("Erro:", error);
    alert("Não foi possível gerar o Excel.");
  }
};

// limpa o filtro e volta a listagem completa
window.limparFiltroAbastecimento = function () {
  document.getElementById("dataInicio").value = "";
  document.getElementById("dataFim").value = "";
  document.getElementById("filtroPlaca").value = "";
  carregarAbastecimentoLista();
};

function getAbastecimentoIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

// update
async function updateAbastecimento(event) {
  event.preventDefault();

  const id = getAbastecimentoIdFromUrl();

  const dataInput = document.getElementById("dataAbastecimento").value;
  const empresa = document.getElementById("selectEmpresa").value;
  const nf = document.getElementById("Nf").value;
  const veiculo = document.getElementById("selectVeiculo").value;
  const kmOdometro = document.getElementById("kmOdometro").value;
  const litros = document.getElementById("litros").value;
  const valorUni = document.getElementById("valorUni").value;
  const desconto = document.getElementById("desconto").value;
  const condicao = document.getElementById("selectCondicao").value;

  const payload = {};

  if (dataInput) {
    const partesData = dataInput.split("-");
    payload.data = `${partesData[2]}/${partesData[1]}/${partesData[0]}`;
  }

  if (empresa) payload.empresa = { id: Number(empresa) };
  if (nf) payload.nf = Number(nf);
  if (veiculo) payload.veiculo = { id: Number(veiculo) };
  if (kmOdometro) payload.kmOdometro = Number(kmOdometro);
  if (litros) payload.litros = Number(litros);
  if (valorUni) payload.valorUni = Number(valorUni);
  if (desconto) payload.desconto = Number(desconto);
  if (condicao) payload.condicao = { id: parseInt(condicao) };

  try {
    const response = await fetch(`${API_URL_ABASTECIMENTO}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      alert("Abastecimento atualizado com sucesso!");
      window.location.href = "listar_abastecimento.html";
    } else {
      const errorText = await response.text();
      console.error("Erro backend:", errorText);
      alert("Erro ao editar abastecimento: " + errorText);
    }
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao atualizar abastecimento.");
  }
}

// funções expostas no objeto global
window.deletarAbastecimento = async function(id) {
  if (!confirm("Tem certeza que deseja excluir este abastecimento?")) return;

  try {
    const response = await fetch(`${API_URL_ABASTECIMENTO}/${id}`, {
      method: "DELETE"
    });

    if (response.ok) {
      alert("Abastecimento excluído com sucesso!");
      carregarAbastecimentoLista();
    } else {
      alert("Erro ao excluir abastecimento.");
    }
  } catch (error) {
    console.error("Erro:", error);
    alert("Não foi possível excluir o abastecimento.");
  }
};

window.editarAbastecimento = function(id) {
  window.location.href = `editar_abastecimento.html?id=${id}`;
};

//carregar os dados pra tela de edição
async function carregarAbastecimento() {
  const id = getAbastecimentoIdFromUrl();
  if (!id) return;

  try {
    const response = await fetch(`${API_URL_ABASTECIMENTO}/${id}`);
    if (!response.ok) throw new Error("Erro ao carregar abastecimento");

    const a = await response.json();

    if (a.data) {
      const partes = a.data.split("/");
      document.getElementById("dataAbastecimento").value = `${partes[2]}-${partes[1]}-${partes[0]}`;
    }
    if (a.empresa) document.getElementById("selectEmpresa").value = a.empresa.id;
    if (a.nf) document.getElementById("Nf").value = a.nf;
    if (a.veiculo) document.getElementById("selectVeiculo").value = a.veiculo.id;
    if (a.kmOdometro) document.getElementById("kmOdometro").value = a.kmOdometro;
    if (a.litros) document.getElementById("litros").value = a.litros;
    if (a.valorUni) document.getElementById("valorUni").value = a.valorUni;
    if (a.desconto) document.getElementById("desconto").value = a.desconto;
    document.getElementById("selectCondicao").value = a.condicao?.id || "";

  } catch (error) {
    console.error("Erro:", error);
    alert("Não foi possível carregar o abastecimento.");
  }
}




document.addEventListener("DOMContentLoaded", () => {
  carregarAbastecimentoLista();
  carregarAbastecimento();

  const btnFiltrar = document.getElementById("btnFiltrar");
  if (btnFiltrar) btnFiltrar.addEventListener("click", filtrarAbastecimentoPorData);

  const btnPdf = document.getElementById("btnPdf");
  if (btnPdf) btnPdf.addEventListener("click", window.baixarPdfAbastecimento);

  const btnExcel = document.getElementById("btnExcel");
  if (btnExcel) btnExcel.addEventListener("click", window.baixarExcelAbastecimento);

  const btnLimpar = document.getElementById("btnLimpar");
  if (btnLimpar) btnLimpar.addEventListener("click", window.limparFiltroAbastecimento);
});