const API_URL_DESPESA = "http://localhost:8080/despesa";

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

function isoToBR(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("T")[0].split("-");
  return `${d}/${m}/${y}`;
}

// monta a linha (tr) de uma despesa para a tabela (sem coluna ID)
function linhaDespesa(a) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${isoToBR(a.dataDespesa)}</td>
    <td>${a.veiculo ? a.veiculo.placa : "sem placa"}</td>
    <td>${a.motorista ? a.motorista.nome : "sem motorista"}</td>
    <td>${a.descricao ?? ""}</td>
    <td>${a.empresa ? a.empresa.nomeEmpresa : "sem empresa"}</td>
    <td>${a.nf ?? ""}</td>
    <td>${a.valor ?? ""}</td>
    <td class="text-center">${badgeCondicao(a.condicao)}</td>
    <td class="text-center">
      <button class="btn btn-sm btn-warning me-2" onclick="window.editarDespesa(${a.id})">Editar</button>
      <button class="btn btn-sm btn-danger" onclick="window.deletarDespesa(${a.id})">Excluir</button>
    </td>
  `;
  return tr;
}

// ===================== CADASTRO =====================
async function cadastroDespesa(event) {
  event.preventDefault();

  const dataDespesa = document.getElementById("dataDespesa").value;
  const veiculo = document.getElementById("selectVeiculo").value;
  const motorista = document.getElementById("selectMotorista").value;
  const descricao = document.getElementById("descricao").value;
  const empresa = document.getElementById("selectEmpresa").value;
  const nf = Number(document.getElementById("nf").value);
  const valor = Number(document.getElementById("valorDespesa").value);
  const condicao = document.getElementById("selectCondicao").value;

  const payload = {
    dataDespesa,
    veiculo: { id: veiculo },
    motorista: { id: motorista },
    descricao,
    empresa: { id: empresa },
    nf,
    valor,
    condicao: condicao ? { id: condicao } : null
  };

  const response = await fetch(API_URL_DESPESA, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (response.ok) {
    alert("Despesa Cadastrada com Sucesso!");
    window.location.href = "listar_despesa.html";
  } else {
    alert("Erro ao cadastrar Despesa. Verifique os dados e tente novamente.");
  }
}

// ===================== LISTAR =====================
async function carregarDespesaLista() {
  const tabela = document.getElementById("tabelaDespesa");
  if (!tabela) return;

  try {
    const response = await fetch(API_URL_DESPESA);
    if (!response.ok) throw new Error("Erro ao carregar Despesas");

    const despesa = await response.json();
    tabela.innerHTML = "";

    // lista completa: esconde o total (só aparece ao filtrar por data)
    const total = document.getElementById("totalDespesas");
    if (total) total.style.display = "none";

    if (despesa.length === 0) {
      tabela.innerHTML = `
        <tr>
          <td colspan="9" class="text-center text-muted">
            Nenhuma despesa cadastrada.
          </td>
        </tr>
      `;
      return;
    }

    despesa.forEach(a => tabela.appendChild(linhaDespesa(a)));
  } catch (error) {
    console.error("Erro:", error);
    alert("Não foi possível carregar as despesas.");
  }
}

// ===================== FILTRO (backend) =====================
async function filtrarDespesasPorData(event) {
  if (event) event.preventDefault();

  const tabela = document.getElementById("tabelaDespesa");
  if (!tabela) return;

  const inicio = document.getElementById("dataInicio").value;
  const fim = document.getElementById("dataFim").value;
  const motorista = document.getElementById("filtroMotorista").value.trim();
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
  if (motorista) params.append("motorista", motorista);
  if (placa) params.append("placa", placa);

  try {
    const response = await fetch(`${API_URL_DESPESA}/filtro?${params.toString()}`);
    if (!response.ok) throw new Error("Erro ao filtrar Despesas");

    const despesa = await response.json();

    // soma as despesas do período e mostra o total
    const somaTotal = despesa.reduce((acc, d) => acc + Number(d.valor || 0), 0);
    const total = document.getElementById("totalDespesas");
    if (total) {
      total.textContent = `Total: R$ ${formatarBRL(somaTotal)}`;
      total.style.display = "";
    }

    tabela.innerHTML = "";

    if (despesa.length === 0) {
      tabela.innerHTML = `
        <tr>
          <td colspan="9" class="text-center text-muted">
            Nenhuma despesa no intervalo informado.
          </td>
        </tr>
      `;
      return;
    }

    despesa.forEach(a => tabela.appendChild(linhaDespesa(a)));
  } catch (error) {
    console.error("Erro:", error);
    alert("Não foi possível filtrar as despesas.");
  }
}

// ===================== PDF das despesas do período/filtros (backend) =====================
window.baixarPdfDespesas = async function () {
  const inicio = document.getElementById("dataInicio").value;
  const fim = document.getElementById("dataFim").value;
  const motorista = document.getElementById("filtroMotorista").value.trim();
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
  if (motorista) params.append("motorista", motorista);
  if (placa) params.append("placa", placa);

  try {
    const response = await fetch(`${API_URL_DESPESA}/filtro?${params.toString()}`);
    if (!response.ok) throw new Error("Erro ao carregar Despesas");

    const despesas = await response.json();

    if (despesas.length === 0) {
      alert("Nenhuma despesa no período informado.");
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
    const larguraPagina = doc.internal.pageSize.getWidth();

    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text("DESPESAS", larguraPagina / 2, 30, { align: "center" });

    const head = [["DATA", "PLACA", "MOTORISTA", "DESCRIÇÃO", "EMPRESA", "NF", "VALOR", "SITUAÇÃO"]];

    let somaTotal = 0;
    const body = despesas.map(d => {
      somaTotal += Number(d.valor || 0);
      return [
        isoToBR(d.dataDespesa),
        d.veiculo ? d.veiculo.placa : "",
        d.motorista ? d.motorista.nome : "",
        d.descricao ?? "",
        d.empresa ? d.empresa.nomeEmpresa : "",
        d.nf ?? "",
        `R$ ${formatarBRL(d.valor)}`,
        (d.condicao && d.condicao.status ? d.condicao.status : "").toUpperCase()
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
        1: { cellWidth: 62, halign: "center" },
        5: { cellWidth: 50, halign: "center" },
        6: { cellWidth: 80, halign: "right" },
        7: { cellWidth: 70, halign: "center" }
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
    doc.save(`DESPESAS_${dd}_${mm}_${aaaa}.pdf`);

  } catch (error) {
    console.error("Erro:", error);
    alert("Não foi possível gerar o PDF.");
  }
};

// ===================== Excel das despesas do período/filtros (backend) =====================
window.baixarExcelDespesas = async function () {
  const inicio = document.getElementById("dataInicio").value;
  const fim = document.getElementById("dataFim").value;
  const motorista = document.getElementById("filtroMotorista").value.trim();
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
  if (motorista) params.append("motorista", motorista);
  if (placa) params.append("placa", placa);

  try {
    const response = await fetch(`${API_URL_DESPESA}/filtro?${params.toString()}`);
    if (!response.ok) throw new Error("Erro ao carregar Despesas");

    const despesas = await response.json();

    if (despesas.length === 0) {
      alert("Nenhuma despesa no período informado.");
      return;
    }

    const head = ["DATA", "PLACA", "MOTORISTA", "DESCRIÇÃO", "EMPRESA", "NF", "VALOR", "SITUAÇÃO"];

    let somaTotal = 0;
    const body = despesas.map(d => {
      somaTotal += Number(d.valor || 0);
      return [
        isoToBR(d.dataDespesa),
        d.veiculo ? d.veiculo.placa : "",
        d.motorista ? d.motorista.nome : "",
        d.descricao ?? "",
        d.empresa ? d.empresa.nomeEmpresa : "",
        d.nf ?? "",
        Number(d.valor || 0),
        (d.condicao && d.condicao.status ? d.condicao.status : "").toUpperCase()
      ];
    });

    body.push(["", "", "", "", "", "", "", ""]);
    body.push(["TOTAL", somaTotal, "", "", "", "", "", ""]);

    const planilha = [head, ...body];
    const ws = XLSX.utils.aoa_to_sheet(planilha);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Despesas");

    const hoje = new Date();
    const dd = String(hoje.getDate()).padStart(2, "0");
    const mm = String(hoje.getMonth() + 1).padStart(2, "0");
    const aaaa = hoje.getFullYear();
    XLSX.writeFile(wb, `DESPESAS_${dd}_${mm}_${aaaa}.xlsx`);

  } catch (error) {
    console.error("Erro:", error);
    alert("Não foi possível gerar o Excel.");
  }
};

// limpa o filtro e volta a listagem completa
window.limparFiltroDespesa = function () {
  document.getElementById("dataInicio").value = "";
  document.getElementById("dataFim").value = "";
  document.getElementById("filtroMotorista").value = "";
  document.getElementById("filtroPlaca").value = "";
  carregarDespesaLista();
};

function getDespesaIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

// ===================== EDIÇÃO =====================
async function carregarDespesa() {
  const id = getDespesaIdFromUrl();
  if (!id) return;

  try {
    const response = await fetch(`${API_URL_DESPESA}/${id}`);
    if (!response.ok) throw new Error("Erro ao carregar despesa");

    const d = await response.json();

    if (d.dataDespesa) document.getElementById("dataDespesa").value = d.dataDespesa.split("T")[0];
    if (d.veiculo) document.getElementById("selectVeiculo").value = d.veiculo.id;
    if (d.motorista) document.getElementById("selectMotorista").value = d.motorista.id;
    if (d.descricao) document.getElementById("descricao").value = d.descricao;
    if (d.empresa) document.getElementById("selectEmpresa").value = d.empresa.id;
    if (d.nf) document.getElementById("nf").value = d.nf;
    if (d.valor) document.getElementById("valorDespesa").value = d.valor;
    if (d.condicao) document.getElementById("selectCondicao").value = d.condicao.id;

  } catch (error) {
    console.error("Erro:", error);
    alert("Não foi possível carregar a despesa.");
  }
}

// Editar despesa: popula os selects (assíncrono) e SÓ DEPOIS preenche os dados
async function initEditarDespesa() {
  await Promise.all([
    carregarVeiculos('selectVeiculo'),
    carregarDonos('selectMotorista'),
    carregarEmpresas('selectEmpresa'),
    carregarCondicoes('selectCondicao')
  ]);

  await carregarDespesa();
}

// ===================== UPDATE =====================
async function updateDespesa(event) {
  event.preventDefault();

  const id = getDespesaIdFromUrl();

  const dataDespesa = document.getElementById("dataDespesa").value;
  const veiculo = document.getElementById("selectVeiculo").value;
  const motorista = document.getElementById("selectMotorista").value;
  const descricao = document.getElementById("descricao").value;
  const empresa = document.getElementById("selectEmpresa").value;
  const nf = Number(document.getElementById("nf").value);
  const valor = Number(document.getElementById("valorDespesa").value);
  const condicao = document.getElementById("selectCondicao").value;

  const payload = {};
  if (dataDespesa) payload.dataDespesa = dataDespesa;
  if (veiculo) payload.veiculo = { id: veiculo };
  if (motorista) payload.motorista = { id: motorista };
  if (descricao) payload.descricao = descricao;
  if (empresa) payload.empresa = { id: empresa };
  if (nf) payload.nf = nf;
  if (valor) payload.valor = valor;
  if (condicao) payload.condicao = { id: condicao };

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

window.deletarDespesa = async function (id) {
  if (!confirm("Tem certeza que deseja excluir esta Despesa?")) return;

  try {
    const response = await fetch(`${API_URL_DESPESA}/${id}`, { method: "DELETE" });

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

window.editarDespesa = function (id) {
  window.location.href = `editar_despesa.html?id=${id}`;
};

document.addEventListener("DOMContentLoaded", () => {
  carregarDespesaLista();

  const btnFiltrar = document.getElementById("btnFiltrar");
  if (btnFiltrar) btnFiltrar.addEventListener("click", filtrarDespesasPorData);

  const btnPdf = document.getElementById("btnPdf");
  if (btnPdf) btnPdf.addEventListener("click", window.baixarPdfDespesas);

  const btnExcel = document.getElementById("btnExcel");
  if (btnExcel) btnExcel.addEventListener("click", window.baixarExcelDespesas);

  const btnLimpar = document.getElementById("btnLimpar");
  if (btnLimpar) btnLimpar.addEventListener("click", window.limparFiltroDespesa);
});