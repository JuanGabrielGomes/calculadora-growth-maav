# Calculadora de Potencial de Growth — modelo estático replicável

Ferramenta de geração de valor (lead magnet) que simula o funil de vendas do
visitante e mostra quanto ele poderia faturar, seu CAC, ROAS e a estrutura de
time necessária — pensada para convencer o cliente a contratar a Maav Hub.

Em **HTML, CSS e JavaScript puros** — sem build, sem Node.js, sem framework.
Mesmo modelo replicável usado no projeto `calculadora-consorcio-static`.

## Visual

Tema escuro (fundo navy `#0B0E14`–`#0D1430`, grid sutil de fundo e alguns
símbolos decorativos quase invisíveis atrás do hero), com o laranja
`#F57500` da Maav como cor de destaque — inspirado no visual da calculadora
de referência (Full Sales System), mas nas cores da marca. Como o fundo é
escuro, o logo usado no topo é uma variante com o texto "maav" em branco
(`assets/logo-horizontal-dark-theme.png`), gerada a partir do logo oficial
recolorindo só a parte do texto (o restante da marca — engrenagem laranja e
badge "hub" — continua idêntico ao original).

## De onde vieram as fórmulas

Inspirado na estrutura (inputs em slider + painel de resultados) da
calculadora da Full Sales System, mas **as fórmulas e os benchmarks são da
própria Maav Hub**, extraídos da planilha `Jackson Investimentos - KPIS de
Growth.xlsx`:

- **Funil**: Investimento → MQL (lead qualificado) → Agendamento → Oportunidade
  (apresentação) → Venda → Faturamento. Extraído da aba "1. GERAL" (KPIs reais
  mês a mês) da planilha.
- **CAC** = Investimento ÷ Vendas — aba "1. GERAL", linha "CAC".
- **ROAS** = Faturamento ÷ Investimento — aba "1. GERAL", linha "ROAS"
  (diferente da calculadora de referência, que calcula ROAS como retorno
  líquido; aqui usamos a definição real que a Maav já usa com seus clientes).
- **Custo por Agendamento** = Investimento ÷ Agendamentos — aba "1. GERAL",
  linha "CUSTO POR SQL - CUSTO POR AGENDAMENTO".
- **Capacidade de SDR** (220 MQLs/mês) e **capacidade de Closer**
  (80 oportunidades/mês) — aba "5. OPERAÇÃO - PLANEJAMENTO", bloco
  "CAPACIDADE PRODUTIVA TIME COMERCIAL" (10 MQLs/dia × 22 dias úteis para
  SDR; 4 oportunidades/dia × 20 dias úteis para Closer/Sales Rep).
- **Valores padrão dos sliders** (Custo por MQL R$45, Ticket Médio R$60.000,
  taxas de 5%/59%/48%) — combinam o cenário de planejamento da aba
  "4. META - PLANEJAMENTO" com as taxas de conversão reais da aba "1. GERAL"
  (agendamento/MQL, oportunidade/agendamento e venda/oportunidade do
  consolidado anual).

## Estrutura

```
clientes/
  maav-hub/          → cliente pronto
    index.html         → estrutura da página + todos os textos
    style.css           → cores, fonte e layout
    script.js            → regras de cálculo + lógica da calculadora
    assets/               → logos
  _modelo/            → copie esta pasta para criar um novo cliente
```

Cada pasta em `clientes/` é **autossuficiente** — pode subir só ela pro
servidor.

## Trocar cores, textos, logo ou benchmarks

- **Cores e fonte** → topo do `style.css`, bloco `:root { ... }`.
- **Textos da página** → direto nas tags do `index.html`.
- **Logo** → arquivos em `assets/`.
- **Link do botão (CTA) e capacidade de SDR/Closer** → bloco `CONFIG` no topo
  do `script.js`.
- **Valores iniciais dos sliders** (o que aparece ao abrir a página) → objeto
  `state` no `script.js`, e os atributos `value`/`min`/`max`/`step` de cada
  `<input type="range">` no `index.html` (mantenha os dois sincronizados).

## Google Tag Manager (ou outra tag de rastreamento)

Não precisa saber programar. Dentro do `index.html` de cada cliente tem duas
áreas já marcadas com comentários `GOOGLE TAG MANAGER`:

1. Uma logo antes de `</head>` — cole ali o **primeiro** trecho de código que
   o Google Tag Manager te dá na tela "Instalar Google Tag Manager" (a caixa
   de cima, que começa com `<script>`).
2. Uma logo depois de `<body>` — cole ali o **segundo** trecho (a caixa de
   baixo, que começa com `<noscript>`).

Copiar e colar os dois trechos exatamente como o próprio Google Tag Manager
mostra é suficiente — não precisa editar nada dentro deles. Se não for usar
GTM, é só deixar essas duas áreas em branco, elas não afetam a calculadora.

## Criar a calculadora de um novo cliente

1. Copie `clientes/_modelo` inteira e renomeie (ex: `clientes/consori`).
2. Coloque os logos em `clientes/consori/assets/`.
3. Ajuste `style.css` (cores), `index.html` (textos) e `script.js` (link do
   CTA, capacidade de SDR/Closer e valores padrão) para a realidade desse
   cliente.

## Subir na Vercel do cliente (conta dele, subdomínio dele)

Se a Vercel do cliente estiver ligada a uma organização do GitHub, o app da
Vercel só enxerga repositórios que pertencem a essa própria organização —
não repositórios externos onde alguém da organização é só colaborador. Se o
repositório não aparecer na hora de importar, a solução é duplicar o
repositório para dentro do GitHub do cliente antes de importar.

Este repositório está espelhado em `github.com/operacional-maav/calculadora-growth-maav`
(remote `maav`). Pra sincronizar atualizações depois de um `git push origin main`:

```bash
git push maav main
```

Depois disso (ou se o cliente já enxergar o repo original), rode o script
`scripts/conectar-vercel-cliente.sh` — ele é um passo a passo interativo que
te guia por cada tela (importar o repo na Vercel do cliente, liberar o
GitHub App se precisar, e depois ligar o subdomínio dele com o registro de
DNS certo):

```bash
bash scripts/conectar-vercel-cliente.sh
```

## Subir na HostGator (ou qualquer hospedagem)

Envie o **conteúdo** de `clientes/maav-hub/` (não a pasta em si) para
`public_html` (ou uma subpasta/subdomínio) via cPanel ou FTP. Não precisa de
Node.js, npm nem build — são arquivos estáticos comuns.
