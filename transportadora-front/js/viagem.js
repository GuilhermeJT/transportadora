const API_URL_VIAGEM = "http://localhost:8080/viagem"; 

async function cadastroViagem(event) {
  event.preventDefault();

  const responsavel = document.getElementById("selectResponsavel").value;
  const transportadora = document.getElementById("selectTransportadora").value;

  const motorista = document.getElementById("selectMotorista").value;
  const veiculo = document.getElementById("selectVeiculo").value;
  const origem = document.getElementById("selectOrigem").value;
  const destino = document.getElementById("selectDestino").value;
  const quantidadeAnimais = document.getElementById("quantidadeAnimais").value;

  const dataInput = document.getElementById("dataViagem").value;
  const partes = dataInput.split("-"); 
  const dataEmbarque = `${partes[2]}/${partes[1]}/${partes[0]}`;

  const dataInputDesem = document.getElementById("dataDesembarque").value;
  const partesDesem = dataInputDesem.split("-"); 
  const dataDesembarque = `${partesDesem[2]}/${partesDesem[1]}/${partesDesem[0]}`;

  const km = document.getElementById("kmPercorrido").value;
  const valorPorKm = document.getElementById("valorPorKm").value;
  const valorGastoPedagio = document.getElementById("valorPedagios").value;

  const adiantamento = document.getElementById("adiantamento").value;




  const condicao = document.getElementById("selectCondicao").value;

  const response = await fetch(API_URL_VIAGEM, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      responsavel: {id: parseInt(responsavel)},
      transportadora : {id: parseInt(transportadora)},
      motorista: { id: parseInt(motorista)},
      veiculo: { id: parseInt(veiculo) },
      origem: { id: parseInt(origem) },
      destino: { id: parseInt(destino) },
      quantidadeAnimais,
      dataEmbarque,
      dataDesembarque,
      km,
      valorPorKm,
      valorGastoPedagio,
      adiantamento,
      condicao: condicao ? { id: parseInt(condicao) } : null
    })
  });


  if (response.ok) {
    alert("Viagem cadastrada com sucesso!");
    window.location.href = "cadastro_viagem.html"; // redireciona para listagem
  } else {
    alert("Erro ao cadastrar Viagem. Verifique os dados e tente novamente.");
  }
}

// -------------------

function getViagemIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}


async function carregarViagem() {
  const id = getViagemIdFromUrl();
  if (!id) return;

  try {
    const response = await fetch(`${API_URL_VIAGEM}/${id}`);
    if (!response.ok) throw new Error("Erro ao carregar Viagem");

    const viagem = await response.json();
    document.getElementById("selectResponsavel").value = viagem.responsavel?.id || "";
    document.getElementById("selectTransportadora").value = viagem.transportadora?.id || "";
    document.getElementById("selectMotorista").value = viagem.motorista?.id || "";
    document.getElementById("selectVeiculo").value = viagem.veiculo?.id || "";
    document.getElementById("selectOrigem").value = viagem.origem?.id || "";
    document.getElementById("selectDestino").value = viagem.destino?.id || "";
    document.getElementById("quantidadeAnimais").value = viagem.quantidadeAnimais ?? "";
    
    // converter dd/MM/yyyy -> yyyy-MM-dd para o input
    if (viagem.dataEmbarque) {
      const partes = viagem.dataEmbarque.split("/");
      document.getElementById("dataViagem").value = `${partes[2]}-${partes[1]}-${partes[0]}`;
    }

    // converter dd/MM/yyyy -> yyyy-MM-dd para o input
    if (viagem.dataDesembarque) {
      const partes = viagem.dataDesembarque.split("/");
      document.getElementById("dataDesembarque").value = `${partes[2]}-${partes[1]}-${partes[0]}`;
    }

    document.getElementById("kmPercorrido").value = viagem.km ?? "";
    document.getElementById("valorPorKm").value = viagem.valorPorKm ?? "";
    document.getElementById("valorPedagios").value = viagem.valorGastoPedagio ?? "";
    document.getElementById("adiantamento").value = viagem.adiantamento ?? "";
    document.getElementById("selectCondicao").value = viagem.condicao?.id || "";


  } catch (error) {
    console.error("Erro:", error);
    alert("Não foi possível carregar a Viagem.");
  }
}

// Orquestra a tela de Editar: popula os selects (assincrono) e SO DEPOIS preenche os dados
async function initEditarViagem() {
  // espera todos os selects serem populados antes de setar os valores
  await Promise.all([
    carregarDonos('selectResponsavel'),
    carregarDonos('selectMotorista'),
    carregarVeiculos('selectVeiculo'),
    carregarFazendas('selectOrigem'),
    carregarFazendas('selectDestino'),
    carregarEmpresas('selectTransportadora'),
    carregarCondicoes('selectCondicao')
  ]);

  // agora que as opcoes existem, o .value "pega" corretamente
  await carregarViagem();
}

//---------------------->>


async function filtrarViagensPorData(event) {
  if (event) event.preventDefault();

  const tabela = document.getElementById("tabelaViagens");
  if (!tabela) return;

  const inicio = document.getElementById("dataInicio").value; // input type="date"
  const fim = document.getElementById("dataFim").value;
  const motorista = document.getElementById("filtroMotorista").value.trim();
  const placa = document.getElementById("filtroPlaca").value.trim();

  if (!inicio || !fim) {
    alert("Selecione a data de início e a data final.");
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
    const response = await fetch(`${API_URL_VIAGEM}/filtro?${params.toString()}`);
    if (!response.ok) throw new Error("Erro ao filtrar Viagens");

    const viagem = await response.json();
    tabela.innerHTML = "";

    // soma o total das viagens do período e mostra o faturamento
    const somaFat = viagem.reduce((acc, v) => acc + Number(v.total || 0), 0);
    const fat = document.getElementById("faturamentoViagens");
    if (fat) {
      fat.textContent = `Faturamento Viagens: R$ ${formatarBRL(somaFat)}`;
      fat.style.display = "";
    }

    if (viagem.length === 0) {
      tabela.innerHTML = `
        <tr>
          <td colspan="15" class="text-center text-muted">
            Nenhuma viagem no intervalo informado.
          </td>
        </tr>
      `;
      return;
    }

    viagem.forEach(a => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${a.responsavel ? a.responsavel.nome : "Sem Responsavel"}</td>
        <td>${a.transportadora ? a.transportadora.nomeEmpresa : "Sem Transportadora"}</td>
        <td>${a.motorista ? a.motorista.nome : "Sem motorista"}</td>
        <td>${a.veiculo ? a.veiculo.placa : "Sem Veiculo"}</td>
        <td>${a.origem ? a.origem.nome_fazenda : "Sem fazenda"}</td>
        <td>${a.destino ? a.destino.nome_fazenda : "Sem fazenda"}</td>
        <td>${a.quantidadeAnimais}</td>
        <td>${a.dataEmbarque}</td>
        <td>${a.km}</td>
        <td>${a.valorPorKm}</td>
        <td>${a.valorGastoPedagio}</td>
        <td>${a.adiantamento}</td>
        <td>R$${a.total}</td>
        <td class="text-center">${badgeCondicao(a.condicao)}</td>
        
        <td class="text-center">
          <button class="btn btn-sm btn-warning me-2" onclick="window.editarViagem(${a.id})">Editar</button>
          <button class="btn btn-sm btn-danger" onclick="window.deletarViagem(${a.id})">Excluir</button>
        </td>
      `;

      tabela.appendChild(tr);
    });

  } catch (error) {
    console.error("Erro:", error);
    alert("Não foi possível filtrar as Viagens.");
  }
}

//---------------------->>

async function updateViagem(event) {
  event.preventDefault();

  const id = getViagemIdFromUrl();

  const responsavel = document.getElementById("selectResponsavel").value;
  const transportadora = document.getElementById("selectTransportadora").value;

  const motorista = document.getElementById("selectMotorista").value;
  const veiculo = document.getElementById("selectVeiculo").value;
  const origem = document.getElementById("selectOrigem").value;
  const destino = document.getElementById("selectDestino").value;
  const quantidadeAnimais = document.getElementById("quantidadeAnimais").value;

  const dataInput = document.getElementById("dataViagem").value; 
  let data = null;
  if (dataInput) {
    const partes = dataInput.split("-"); // yyyy-MM-dd
    data = `${partes[2]}/${partes[1]}/${partes[0]}`; // dd/MM/yyyy
  }

  const dataDesembarque = document.getElementById("dataDesembarque").value; 
  let dataDesem = null;
  if (dataDesembarque) {
    const partesDesem = dataDesembarque.split("-"); // yyyy-MM-dd
    dataDesem = `${partesDesem[2]}/${partesDesem[1]}/${partesDesem[0]}`; // dd/MM/yyyy
  }

  const kmPercorrido = document.getElementById("kmPercorrido").value;
  const valorPorKm = document.getElementById("valorPorKm").value;
  const valorGastoPedagio = document.getElementById("valorPedagios").value;
  const adiantamento = document.getElementById("adiantamento").value;
  const condicao = document.getElementById("selectCondicao").value;

  const payload = {};

  if(responsavel) payload.responsavel = {id: parseInt(responsavel)};
  if(transportadora) payload.transportadora = {id: parseInt(transportadora)};
  if (motorista) payload.motorista = { id: parseInt(motorista) };
  if (veiculo) payload.veiculo = { id: parseInt(veiculo) };
  if (origem) payload.origem = { id: parseInt(origem) };
  if (destino) payload.destino = { id: parseInt(destino) };

  if (quantidadeAnimais) payload.quantidadeAnimais = parseInt(quantidadeAnimais);
  if (data) payload.dataEmbarque = data;
  if (dataDesem) payload.dataDesembarque = dataDesem;
  if (kmPercorrido) payload.km = parseInt(kmPercorrido);
  if (valorPorKm) payload.valorPorKm = parseFloat(valorPorKm);
  if (valorGastoPedagio) payload.valorGastoPedagio = parseFloat(valorGastoPedagio);
  if (adiantamento) payload.adiantamento = parseFloat(adiantamento);
  if (condicao) payload.condicao = { id: parseInt(condicao) };

  

  try {
    const response = await fetch(`${API_URL_VIAGEM}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      alert("Viagem atualizada com sucesso!");
      window.location.href = "listar_viagem.html";
    } else {
      const errorText = await response.text();
      console.error("Erro backend:", errorText);
      alert("Erro ao editar Viagem: " + errorText);
    }
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao atualizar Viagem.");
  }
}



// -------------------


// selo de cor para a condição (pago = verde, pendente = amarelo)
// formata número no padrão R$ brasileiro (1.234,56)
function formatarBRL(valor) {
  return Number(valor || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function badgeCondicao(condicao) {
  const status = condicao && condicao.status ? condicao.status : null;
  if (!status) return '<span class="badge bg-secondary">—</span>';
  const s = status.toLowerCase();
  let cls = "bg-secondary";
  if (s === "pago") cls = "bg-success";
  else if (s === "pendente") cls = "bg-warning text-dark";
  return `<span class="badge ${cls}">${status}</span>`;
}

async function carregarViagensLista() {
  const tabela = document.getElementById("tabelaViagens");
  if (!tabela) return; 

  try {
    const response = await fetch(API_URL_VIAGEM);
    if (!response.ok) throw new Error("Erro ao carregar Viagens");

    const viagem = await response.json();
    tabela.innerHTML = ""; 

    // lista completa: esconde o faturamento (só aparece ao filtrar por data)
    const fat = document.getElementById("faturamentoViagens");
    if (fat) fat.style.display = "none";

    if (viagem.length === 0) {
      tabela.innerHTML = `
        <tr>
          <td colspan="15" class="text-center text-muted">
            Nenhuma viagem cadastrada.
          </td>
        </tr>
      `;
      return;
    }

    viagem.forEach(a => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${a.responsavel ? a.responsavel.nome : "Sem Responsavel"}</td>
        <td>${a.transportadora ? a.transportadora.nomeEmpresa : "Sem Transportadora"}</td>
        <td>${a.motorista ? a.motorista.nome : "Sem motorista"}</td>
        <td>${a.veiculo ? a.veiculo.placa : "Sem Veiculo"}</td>
        <td>${a.origem ? a.origem.nome_fazenda : "Sem fazenda"}</td>
        <td>${a.destino ? a.destino.nome_fazenda : "Sem fazenda"}</td>
        <td>${a.quantidadeAnimais}</td>
        <td>${a.dataEmbarque}</td>
        <td>${a.km}</td>
        <td>${a.valorPorKm}</td>
        <td>${a.valorGastoPedagio}</td>
        <td>${a.adiantamento}</td>
        <td>R$${a.total}</td>
        <td class="text-center">${badgeCondicao(a.condicao)}</td>
        
        <td class="text-center">
        <div class="d-grid gap-1">
          <button class="btn btn-sm btn-warning" onclick="window.editarViagem(${a.id})">Editar</button>
          <button class="btn btn-sm btn-danger" onclick="window.deletarViagem(${a.id})">Excluir</button>
        </div>
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

// gera e baixa o PDF das viagens do período/filtros atuais
window.baixarPdfViagens = async function () {
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
    const response = await fetch(`${API_URL_VIAGEM}/filtro?${params.toString()}`);
    if (!response.ok) throw new Error("Erro ao buscar viagens para o PDF");

    const viagens = await response.json();
    if (viagens.length === 0) {
      alert("Nenhuma viagem no período informado.");
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
    const larguraPagina = doc.internal.pageSize.getWidth();

    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text("FRETE", larguraPagina / 2, 30, { align: "center" });

    const head = [[
      "RESPONSAVEL", "TRANSPORTADORA", "MOTORISTA", "PLACA", "ORIGEM", "DESTINO",
      "ANIMAIS", "DATA EMBARQUE", "DATA DESEMBARQUE", "KM", "R$ KM", "PEDAGIOS",
      "ADIANTAMENTO", "TOTAL", "SITUAÇÃO"
    ]];

    let somaTotal = 0;
    const body = viagens.map(v => {
      somaTotal += Number(v.total || 0);
      return [
        v.responsavel ? v.responsavel.nome : "",
        v.transportadora ? v.transportadora.nomeEmpresa : "",
        v.motorista ? v.motorista.nome : "",
        v.veiculo ? v.veiculo.placa : "",
        v.origem ? v.origem.nome_fazenda : "",
        v.destino ? v.destino.nome_fazenda : "",
        v.quantidadeAnimais ?? "",
        v.dataEmbarque ?? "",
        v.dataDesembarque ?? "",
        v.km ?? "",
        `R$ ${formatarBRL(v.valorPorKm)}`,
        `R$ ${formatarBRL(v.valorGastoPedagio)}`,
        `R$ ${formatarBRL(v.adiantamento)}`,
        `R$ ${formatarBRL(v.total)}`,
        (v.condicao && v.condicao.status ? v.condicao.status : "").toUpperCase()
      ];
    });

    doc.autoTable({
      head: head,
      body: body,
      startY: 42,
      theme: "grid",
      styles: { fontSize: 6, cellPadding: 2, lineColor: [0, 0, 0], lineWidth: 0.5, textColor: [0, 0, 0], overflow: "linebreak", valign: "middle" },
      headStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0], fontStyle: "bold", halign: "center", valign: "middle" },
      columnStyles: {
        3:  { cellWidth: 48, halign: "center" },  // PLACA
        6:  { cellWidth: 34, halign: "center" },  // ANIMAIS
        7:  { cellWidth: 52, halign: "center" },  // DATA EMBARQUE
        8:  { cellWidth: 52, halign: "center" },  // DATA DESEMBARQUE
        9:  { cellWidth: 30, halign: "center" },  // KM
        10: { cellWidth: 42, halign: "right" },   // R$ KM
        11: { cellWidth: 50, halign: "right" },   // PEDAGIOS
        12: { cellWidth: 58, halign: "right" },   // ADIANTAMENTO
        13: { cellWidth: 54, halign: "right" },   // TOTAL
        14: { cellWidth: 52, halign: "center" }   // SITUAÇÃO
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
    doc.save(`FRETES_${dd}_${mm}_${aaaa}.pdf`);

  } catch (error) {
    console.error("Erro:", error);
    alert("Não foi possível gerar o PDF.");
  }
};

document.addEventListener("DOMContentLoaded", () => {
  carregarViagensLista();

  const btnFiltrar = document.getElementById("btnFiltrar");
  if (btnFiltrar) {
    btnFiltrar.addEventListener("click", filtrarViagensPorData);
  }

  const btnPdf = document.getElementById("btnPdf");
  if (btnPdf) {
    btnPdf.addEventListener("click", window.baixarPdfViagens);
  }

  
  const btnLimpar = document.getElementById("btnLimpar");
  if (btnLimpar) {
    btnLimpar.addEventListener("click", () => {
      
      document.getElementById("dataInicio").value = "";
      document.getElementById("dataFim").value   = "";
      document.getElementById("filtroMotorista").value = "";
      document.getElementById("filtroPlaca").value = "";

      
      carregarViagensLista();
    });
  }

  
});