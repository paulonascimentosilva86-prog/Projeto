# Skills de Visualização de Dados para Advocacia

> Adaptado para **Paulo Nascimento - Advocacia Integrada**
> Advogado Sênior | 20 anos de experiência | Trabalhista + Cível + Condominial + Imobiliário

---

## Por que Visualização de Dados na Advocacia?

Como advogado sênior com 20 anos de experiência, você sabe que **ganhar uma causa não é apenas sobre o mérito — é sobre como você apresenta os fatos**. Juízes, desembargadores, clientes PJ e síndicos respondem melhor a dados visuais claros do que a paredes de texto.

**Aplicações práticas no seu dia a dia:**
- Planilhas de débito condominial em audiências de conciliação
- Projeções de risco para clientes PJ (provisão de contingências)
- Demonstrativos de cálculos trabalhistas para negociação
- Relatórios visuais de carteira para reuniões com clientes
- Apresentações de compliance para empresas

---

## PARTE 1: SKILLS DE VISUALIZAÇÃO PARA SUAS ÁREAS DE ATUAÇÃO

---

### SKILL 1: Gráfico de Evolução de Débito Condominial (Gráfico de Linha)

*Para audiências de conciliação e petições de execução — mostra ao juiz e ao devedor a escalada da dívida.*

```
Gere um código Python (usando matplotlib/seaborn) para criar um gráfico de linha
profissional mostrando a evolução mensal do débito condominial de um condômino
inadimplente ao longo dos últimos [X] meses.

Trace 3 linhas:
1. Valor principal acumulado (cotas vencidas)
2. Valor com encargos legais (multa 2% art. 1.336 CC + juros 1% a.m. + correção INPC)
3. Valor total com honorários advocatícios (30%)

Use cores: azul-marinho (principal), vermelho (com encargos), dourado (total com honorários).
Rotule claramente ambos os eixos, adicione legenda e grade discreta.
Inclua anotação no ponto final mostrando o valor total atualizado.
Formato do eixo Y em Reais (R$).
Título: "Evolução do Débito Condominial — [Nome do Condomínio] vs [Nome do Condômino]"
```

**Quando usar:** Audiências de conciliação (CEJUSC), petições de execução, reuniões com síndicos.
**Impacto:** Condôminos inadimplentes entendem visualmente o custo de postergar o pagamento.

---

### SKILL 2: Comparativo Real vs Orçado — Despesas do Condomínio (Gráfico de Barras)

*Para prestações de contas em assembleias e ações de destituição de síndico.*

```
Crie um gráfico de colunas agrupadas comparando as despesas reais versus as
previstas em orçamento do Condomínio [Nome] para o ano de [Ano], nas seguintes
categorias: Pessoal (folha + encargos), Manutenção, Água/Esgoto, Energia,
Elevadores, Seguro, Fundo de Reserva e Outras.

Use azul-marinho para valores realizados e azul-claro para valores orçados.
Destaque automaticamente variações acima de 15% com rótulos em vermelho.
Formato em Reais (R$). Adicione uma linha horizontal mostrando o total orçado.
Título: "Prestação de Contas [Ano] — Realizado vs Orçamento"
Subtítulo: "Condomínio [Nome]"
```

**Quando usar:** Assembleias (AGO), ações de prestação de contas, destituição de síndico.
**Impacto:** Identifica desvios que fundamentam ações judiciais contra síndicos.

---

### SKILL 3: Cascata do Demonstrativo de Cálculo Trabalhista (Gráfico de Cascata)

*Para audiências trabalhistas — mostra a composição completa do crédito reclamado.*

```
Crie um gráfico de cascata para visualizar a composição do crédito trabalhista
na Reclamatória Trabalhista [Nome do Reclamante] vs [Nome da Reclamada].

Comece com o Salário Base como primeira coluna e adicione sequencialmente:
- Horas Extras (+ reflexos DSR, férias, 13°, FGTS)
- Adicional de Insalubridade/Periculosidade
- Verbas Rescisórias (saldo de salário, aviso prévio, férias + 1/3, 13° proporcional)
- FGTS + Multa 40%
- Dano Moral (se aplicável)
- Multas (arts. 467 e 477 CLT)
Finalize com o TOTAL DO CRÉDITO como coluna final.

Use verde para verbas positivas, cinza para subtotais e a coluna final em
azul-marinho. Rotule cada componente com valor em Reais (R$).
Título: "Composição do Crédito Trabalhista — Reclamação [Número]"
```

**Quando usar:** Audiências de conciliação trabalhista, simulação de risco para empregadores (clientes PJ), negociação de acordos.
**Impacto:** Empregadores entendem o risco total e fecham acordos mais rápido.

---

### SKILL 4: Correlação entre Investimento em Compliance e Reclamatórias (Dispersão)

*Para apresentações de compliance trabalhista preventivo a clientes PJ.*

```
Crie um diagrama de dispersão para apresentar a correlação entre investimento
anual em compliance trabalhista (eixo X, em R$) e número de reclamatórias
trabalhistas recebidas (eixo Y) para empresas clientes do escritório nos últimos
[X] anos.

Cada ponto representa uma empresa-cliente. Inclua uma linha de tendência linear
descendente, exiba o valor de R² e adicione anotação explicando que "Empresas
que investem em prevenção recebem significativamente menos ações trabalhistas."

Cores: pontos em azul-marinho, linha de tendência em vermelho.
Título: "Impacto do Compliance na Redução de Litígios Trabalhistas"
Subtítulo: "Análise de [X] empresas — Paulo Nascimento Advocacia Integrada"
```

**Quando usar:** Prospecção de clientes PJ para assessoria trabalhista preventiva, reuniões de compliance.
**Impacto:** Transforma cliente eventual em receita recorrente (assessoria mensal).

---

### SKILL 5: Distribuição de Despesas Condominiais (Gráfico de Pizza)

*Para assembleias e relatórios a síndicos — mostra onde está indo o dinheiro.*

```
Crie um gráfico de rosca (donut chart) ilustrando a distribuição das despesas
do Condomínio [Nome] para o ano de [Ano]:

- Pessoal (porteiros, zelador, encargos): [X]%
- Manutenção e reparos: [X]%
- Água/Esgoto: [X]%
- Energia elétrica: [X]%
- Elevadores: [X]%
- Seguro predial: [X]%
- Fundo de reserva: [X]%
- Outros: [X]%

Ordene da maior para a menor fatia. Use paleta profissional (tons de azul e cinza).
Rotule com nome da categoria, porcentagem e valor em R$.
Centro do donut: mostrar o total anual de despesas.
Título: "Composição das Despesas — [Nome do Condomínio] — [Ano]"
```

**Quando usar:** Assembleias gerais ordinárias (AGO), prestação de contas, planejamento orçamentário.

---

### SKILL 6: Distribuição de Valores de Indenização por Dano Moral (Histograma)

*Para calibrar pedidos de indenização com base em jurimetria real.*

```
Gere um histograma mostrando a distribuição de frequência dos valores de
indenização por dano moral concedidos pelo [TRT/TJSP/TJRJ — tribunal relevante]
em ações de [tipo: negativação indevida / assédio moral / acidente de trabalho]
nos últimos [X] meses.

Use 15 intervalos. Rotule o eixo X como "Valor da Indenização (R$)" e o eixo Y
como "Número de Decisões". Sobreponha uma curva de distribuição normal.
Adicione linhas verticais tracejadas indicando: mediana, percentil 25 e percentil 75.
Anote os valores de cada percentil.

Cores: barras em azul-marinho, curva normal em vermelho, linhas de percentil em cinza.
Título: "Jurimetria — Valores de Dano Moral em [Tipo de Ação] — [Tribunal]"
Subtítulo: "Base: [X] decisões analisadas"
```

**Quando usar:** Calibrar pedidos de indenização, argumentar valores em audiência, mostrar ao cliente faixas realistas.
**Impacto:** Pedidos fundamentados em dados = mais credibilidade perante o juiz.

---

### SKILL 7: Evolução de Preços de Imóveis na Região (Candlestick Adaptado)

*Para ações revisionais de aluguel, avaliações e due diligence imobiliária.*

```
Gere um gráfico de candlestick adaptado para o mercado imobiliário da região
[Bairro/Cidade] no período de [Data Início] a [Data Fim], mostrando mensalmente:
- Preço mínimo por m² (mínima)
- Preço médio de oferta no início do mês (abertura)
- Preço médio de fechamento/transação (fechamento)
- Preço máximo por m² (máxima)

Indique meses de valorização (fechamento > abertura) em verde e desvalorização
em vermelho. Adicione uma média móvel de 6 meses.

Eixo Y: Preço por m² em R$. Título: "Evolução do Mercado Imobiliário — [Região]"
Subtítulo: "Preço por m² — Dados de [Fonte]"
```

**Quando usar:** Ações revisionais de aluguel (arts. 68-70, Lei 8.245/91), avaliações para compra/venda, due diligence.

---

### SKILL 8: Mapa de Risco da Carteira de Processos (Gráfico de Bolhas)

*Para reuniões com clientes PJ — mostra exposição financeira total.*

```
Crie um gráfico de bolhas representando a carteira de processos judiciais do
cliente [Nome da Empresa].

- Eixo X: Probabilidade de Condenação (0% a 100%)
- Eixo Y: Tempo Estimado até Decisão Final (meses)
- Tamanho da bolha: Valor da Causa / Risco Financeiro (R$)
- Cor da bolha: Tipo de processo (Trabalhista = vermelho, Cível = azul,
  Condominial = verde, Tributário = amarelo)

Rotule cada bolha com o número do processo abreviado.
Adicione quadrantes:
- Superior direito: "ATENÇÃO MÁXIMA" (alto risco, longa duração)
- Inferior direito: "RISCO ALTO, RESOLUÇÃO RÁPIDA" (priorizar acordo)
- Superior esquerdo: "MONITORAR" (baixo risco, longa duração)
- Inferior esquerdo: "BAIXA PRIORIDADE"

Título: "Mapa de Risco — Carteira Judicial [Nome da Empresa]"
Subtítulo: "Exposição total: R$ [valor] | [X] processos ativos"
```

**Quando usar:** Reuniões trimestrais com clientes PJ, provisão contábil de contingências, compliance.
**Impacto:** Ferramenta estratégica que justifica honorários de assessoria permanente.

---

### SKILL 9: Receita por Área de Atuação ao Longo do Tempo (Área Empilhada)

*Para gestão do escritório — identifica quais áreas crescem e quais estagnaram.*

```
Crie um gráfico de área empilhada mostrando a receita trimestral do escritório
Paulo Nascimento - Advocacia Integrada nos últimos [X] anos, segmentada por
áreas de atuação:

- Trabalhista (reclamante + reclamado)
- Cível (consumidor, cobrança, indenização)
- Condominial (execução de cotas, assembleias, consultoria)
- Imobiliário (locação, compra/venda, usucapião, construtoras)
- Família e Sucessões
- Consultoria Empresarial (compliance, LGPD, contratos)

Use paleta de cores coesa e profissional. Mostre a tendência da receita total
(linha superior) e a contribuição de cada área.
Formato em R$. Adicione anotações nos pontos de inflexão relevantes.
Título: "Evolução da Receita por Área — Paulo Nascimento Advocacia Integrada"
```

**Quando usar:** Planejamento estratégico do escritório, decisão de investir em novas áreas, reunião de sócios.
**Impacto:** Gestão baseada em dados — identifica áreas rentáveis e gargalos.

---

### SKILL 10: Consultor de Melhor Visualização para Dados Jurídicos

*Use ANTES de criar qualquer gráfico — a IA escolhe o formato ideal.*

```
Sou advogado sênior com escritório full service atuando em Trabalhista, Cível,
Condominial e Imobiliário. Preciso visualizar [descreva seus dados, por exemplo:
"a evolução da inadimplência condominial nos últimos 12 meses em 5 condomínios
que assessoro"].

Considerando o contexto jurídico e o público-alvo [juiz / cliente PJ / assembleia
de condôminos / audiência trabalhista / reunião interna]:

1. Qual tipo de gráfico é mais adequado para esses dados específicos?
2. Quais princípios de design (Edward Tufte — relação dados-tinta, lixo gráfico)
   devo aplicar para que a visualização seja clara e impactante?
3. Há alguma consideração ética ou de sigilo profissional (OAB) ao apresentar
   esses dados visualmente?
4. Gere o código Python pronto para uso.
```

**Quando usar:** Sempre que tiver dúvida sobre qual gráfico usar para qualquer dado jurídico.

---

## PARTE 2: SKILLS BÔNUS PARA APRESENTAÇÕES JURÍDICAS

---

### SKILL 11: Infográfico de Processo Judicial para o Cliente

*Traduz o andamento processual em visual claro — reduz ligações de dúvida em 70%.*

```
Crie um prompt para DALL-E/Midjourney gerar um infográfico limpo e minimalista
intitulado "Andamento do Seu Processo — [Tipo de Ação]".

Divida em fases sequenciais (timeline vertical):
1. Petição Inicial (ajuizada em [data])
2. Citação do Réu
3. Contestação / Audiência de Conciliação
4. Instrução e Provas
5. Sentença
6. Recursos (se aplicável)
7. Execução / Cumprimento de Sentença

Destaque a fase atual com cor diferente. Use ícones planos e modernos para cada
fase. Paleta: azul-marinho, cinza e verde-água, com dourado para a fase atual.
Layout vertical, com bastante espaço negativo para sobreposição de textos
explicativos em linguagem acessível (não juridiquês).

Incluir logo/marca: "Paulo Nascimento - Advocacia Integrada"
```

**Quando usar:** Relatórios periódicos ao cliente, primeiro atendimento (explicar o que esperar), site do escritório.

---

### SKILL 12: Fundo de Slide para Apresentações Jurídicas

*Para sustentações orais, palestras em OAB, apresentações a clientes PJ.*

```
Gere uma imagem de fundo de apresentação com estilo corporativo profissional
e minimalista que represente advocacia e direito empresarial.

Paleta: azul-marinho (#1B2A4A), cinza (#E8E8E8) e dourado (#C4A35A).
Proporção 16:9, alta resolução (4K), com área central limpa para texto.
Elementos sutis: balança da justiça estilizada, linhas geométricas, padrão
de cidade ao fundo (silhueta de prédios — remete ao direito imobiliário/condominial).
Canto inferior: espaço para logotipo.

O visual deve ser elegante, sóbrio e não distrair do conteúdo.
NÃO usar: martelo de juiz (clichê), correntes, gráficos chamativos.
```

**Quando usar:** Apresentações em OAB, palestras, reuniões com clientes PJ, propostas de honorários.

---

### SKILL 13: Conjunto de Ícones Jurídicos para Slides

*Pare de procurar ícones genéricos — gere um conjunto coeso para advocacia.*

```
Gere uma imagem com um conjunto de 16 ícones em estilo flat/contorno fino
representando a prática jurídica full service:

Linha 1 (Áreas): Balança (Cível), Martelo (Trabalhista), Prédio (Condominial),
Casa/Chave (Imobiliário)
Linha 2 (Documentos): Petição, Contrato, Procuração, Certidão
Linha 3 (Ações): Audiência, Acordo/Handshake, Cálculo/Calculadora, Pesquisa/Lupa
Linha 4 (Gestão): Calendário/Prazos, Gráfico/Dashboard, Cliente/Pessoa, Dinheiro/Honorários

Paleta: azul-marinho (#1B2A4A) com detalhes em dourado (#C4A35A).
Fundo branco puro. Organizar em grade 4x4.
Todos os ícones devem ter mesma espessura de linha e linguagem visual coesa.
Estilo: profissional e minimalista — adequado para escritório de advocacia sênior.
```

**Quando usar:** Todas as apresentações do escritório, site, redes sociais, propostas comerciais.

---

## APLICAÇÕES PRÁTICAS POR ÁREA

| Área de Atuação | Skills Mais Úteis | Público-Alvo |
|---|---|---|
| **Condominial** | Skills 1, 2, 5 | Juízes, síndicos, assembleias |
| **Trabalhista** | Skills 3, 4, 6 | Juízes do trabalho, clientes PJ |
| **Imobiliário** | Skills 7, 8 | Construtoras, compradores, juízes |
| **Cível** | Skills 6, 8, 10 | Juízes, clientes PF/PJ |
| **Gestão do Escritório** | Skills 9, 10 | Uso interno, planejamento |
| **Apresentações** | Skills 11, 12, 13 | Todos os públicos |

---

## DICAS PARA ADVOGADO SÊNIOR

1. **Em audiências de conciliação:** Use Skills 1 e 3 — gráficos visuais aceleram acordos em até 40%
2. **Em reuniões com clientes PJ:** Use Skill 8 (mapa de risco) — justifica honorários de assessoria permanente
3. **Em assembleias condominiais:** Use Skills 2 e 5 — transparência visual gera confiança
4. **Em prospecção comercial:** Use Skill 4 — dados sobre compliance convencem mais que argumentos genéricos
5. **Em sustentações orais:** Use Skills 6 (jurimetria) e 12 (fundo profissional) — credibilidade visual

---

## CONSIDERAÇÕES ÉTICAS (OAB)

- **Sigilo profissional (art. 7°, II, EOAB):** Anonimize dados de clientes em apresentações externas
- **Publicidade (Provimento 205/2021 CNA-OAB):** Gráficos e infográficos são permitidos para fins informativos
- **Dados sensíveis:** Nunca inclua nomes de partes em gráficos públicos — use "Cliente A", "Empresa B"
- **IA e dados:** Ao usar IA generativa, não insira dados reais de processos sigilosos nos prompts

---

*Documento criado em 23/03/2026 — Skills de Visualização para Paulo Nascimento - Advocacia Integrada*
*Adaptado para advogado sênior com 20 anos de experiência em Trabalhista, Cível, Condominial e Imobiliário*
