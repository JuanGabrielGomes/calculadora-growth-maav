// ============================================================================
// CONFIGURAÇÃO DA CALCULADORA — MAAV HUB
// Números baseados nos benchmarks reais de growth da Maav Hub.
// Só mexa aqui se souber exatamente o que está mudando: estes valores
// controlam o resultado da simulação.
// ============================================================================
const CONFIG = {
  // Capacidade produtiva do time comercial (quantas pessoas são necessárias)
  capacidadeMqlPorSdrMes: 220,        // 10 MQLs/dia x 22 dias úteis
  capacidadeOportunidadePorCloserMes: 80, // 4 oportunidades/dia x 20 dias úteis

  whatsappNumero: "5500000000000", // DDI + DDD + número, só dígitos
  whatsappMensagem: "Olá, vi a calculadora de growth da Maav Hub e quero entender meu potencial de faturamento",
};
// ============================================================================

document.addEventListener("DOMContentLoaded", () => {
  const ctaWhatsapp = document.getElementById("cta-whatsapp");
  ctaWhatsapp.href = `https://wa.me/${CONFIG.whatsappNumero}?text=${encodeURIComponent(CONFIG.whatsappMensagem)}`;

  const state = {
    investimento: 10000,
    custoMql: 45,
    taxaAgend: 5,
    taxaComp: 59,
    taxaConv: 48,
    ticketMedio: 60000,
  };

  const controls = [
    { range: "rangeInvestimento", num: "numInvestimento", fill: "fillInvestimento", tooltip: "tooltipInvestimento", key: "investimento", format: (v) => `R$ ${v.toLocaleString("pt-BR")}` },
    { range: "rangeCustoMql", num: "numCustoMql", fill: "fillCustoMql", tooltip: "tooltipCustoMql", key: "custoMql", format: (v) => `R$ ${v.toLocaleString("pt-BR")}` },
    { range: "rangeTaxaAgend", num: "numTaxaAgend", fill: "fillTaxaAgend", tooltip: "tooltipTaxaAgend", key: "taxaAgend", format: (v) => `${v}%` },
    { range: "rangeTaxaComp", num: "numTaxaComp", fill: "fillTaxaComp", tooltip: "tooltipTaxaComp", key: "taxaComp", format: (v) => `${v}%` },
    { range: "rangeTaxaConv", num: "numTaxaConv", fill: "fillTaxaConv", tooltip: "tooltipTaxaConv", key: "taxaConv", format: (v) => `${v}%` },
    { range: "rangeTicketMedio", num: "numTicketMedio", fill: "fillTicketMedio", tooltip: "tooltipTicketMedio", key: "ticketMedio", format: (v) => `R$ ${v.toLocaleString("pt-BR")}` },
  ];

  function pct(rangeEl) {
    return ((rangeEl.value - rangeEl.min) / (rangeEl.max - rangeEl.min)) * 100;
  }

  controls.forEach(({ range, num, fill, tooltip, key, format }) => {
    const rEl = document.getElementById(range);
    const nEl = document.getElementById(num);
    const fEl = document.getElementById(fill);
    const tEl = document.getElementById(tooltip);

    function updateTooltip(value) {
      tEl.textContent = format(+value);
      const percent = pct(rEl);
      tEl.style.left = `calc(${percent}% + ${(0.5 - percent / 100) * 22}px)`;
    }

    function fromRange() {
      nEl.value = rEl.value;
      state[key] = +rEl.value;
      fEl.style.width = pct(rEl) + "%";
      updateTooltip(rEl.value);
      calculate();
    }

    function fromNum() {
      const raw = nEl.value.toString().replace(/\D/g, "");
      let v = Math.max(+rEl.min, Math.min(+rEl.max, +raw || 0));
      rEl.value = v;
      nEl.value = v;
      state[key] = v;
      fEl.style.width = pct(rEl) + "%";
      updateTooltip(v);
      calculate();
    }

    rEl.addEventListener("input", fromRange);
    nEl.addEventListener("input", fromNum);
    nEl.addEventListener("change", fromNum);

    rEl.value = state[key];
    nEl.value = state[key];
    fEl.style.width = pct(rEl) + "%";
    updateTooltip(state[key]);
  });

  function fmtBRL(n) {
    return Math.round(n).toLocaleString("pt-BR");
  }

  function updateRoasBadge(roas) {
    const badge = document.getElementById("roasBadge");
    badge.style.display = "inline-flex";
    if (roas >= 3) {
      badge.className = "roas-badge positive";
      badge.textContent = "Excelente";
    } else if (roas >= 1) {
      badge.className = "roas-badge warning";
      badge.textContent = "Atenção";
    } else {
      badge.className = "roas-badge negative";
      badge.textContent = "Revisar";
    }
  }

  function calculate() {
    const { investimento, custoMql, taxaAgend, taxaComp, taxaConv, ticketMedio } = state;

    const mql = investimento / custoMql;
    const agendamentos = mql * (taxaAgend / 100);
    const oportunidades = agendamentos * (taxaComp / 100);
    const vendasBrutas = oportunidades * (taxaConv / 100);
    const vendas = vendasBrutas > 0 ? Math.ceil(vendasBrutas) : 0;

    const faturamento = vendas * ticketMedio;
    const custoPorAgendamento = agendamentos > 0 ? investimento / agendamentos : 0;
    const cac = vendas > 0 ? investimento / vendas : 0;
    const roas = investimento > 0 ? faturamento / investimento : 0;
    const sdrs = Math.ceil(mql / CONFIG.capacidadeMqlPorSdrMes);
    const closers = Math.ceil(oportunidades / CONFIG.capacidadeOportunidadePorCloserMes);

    document.getElementById("faturamentoRes").textContent = fmtBRL(faturamento);
    document.getElementById("vendasRes").textContent = fmtBRL(vendas);
    document.getElementById("custoAgendRes").textContent = fmtBRL(custoPorAgendamento);
    document.getElementById("cacRes").textContent = vendas > 0 ? fmtBRL(cac) : "–";
    document.getElementById("roasRes").textContent = investimento > 0 ? roas.toFixed(1).replace(".", ",") : "–";
    document.getElementById("sdrsRes").textContent = fmtBRL(sdrs);
    document.getElementById("closersRes").textContent = fmtBRL(closers);

    updateRoasBadge(roas);
  }

  calculate();
});
