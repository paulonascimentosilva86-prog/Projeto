# Guia Prático: Perplexity + NotebookLM para Advocacia

> Paulo Nascimento — Advocacia Integrada
> Áreas: Trabalhista · Cível · Condominial · Imobiliário

---

## O Fluxo em 3 Passos

```
1. PESQUISE no Perplexity (modo Deep Research)
         ↓
2. CURE 3-5 URLs das citações mais confiáveis
         ↓
3. CONSTRUA no NotebookLM com essas fontes
```

---

## Passo 1 — Perplexity (Pesquisa)

**Configuração:** Sempre use o modo **Pro → Deep Research**

### Modelos de Prompt por Área

#### Trabalhista
```
Qual é o entendimento atual do TST em 2025-2026 sobre [tema]?
Inclua: súmulas aplicáveis, OJs relevantes, precedentes de turma
e tendência jurisprudencial recente.
```
Exemplos de temas:
- Terceirização e responsabilidade subsidiária (Súmula 331)
- Horas extras por aplicativo / teletrabalho
- Adicional de insalubridade — base de cálculo após RE 565.714

#### Cível / Consumidor
```
Qual o posicionamento do STJ e TJs em 2025-2026 sobre [tema]?
Inclua: tese firmada em repetitivo (se houver), divergências entre
câmaras e critérios de fixação de danos morais.
```
Exemplos de temas:
- Negativação indevida — quantum de danos morais no TJSP
- Revisão contratual por onerosidade excessiva pós-pandemia
- Responsabilidade de construtora por vícios ocultos

#### Condominial
```
Como os tribunais estaduais (especialmente TJSP e TJRJ) têm decidido
em 2025-2026 sobre [tema]? Inclua: fundamento legal, entendimento
majoritário e casos de exceção.
```
Exemplos de temas:
- Execução de cotas condominiais — título executivo e procedimento
- Multa condominial — limite e proporcionalidade
- Destituição de síndico — requisitos e quórum

#### Imobiliário
```
Qual o estado atual da jurisprudência e legislação sobre [tema]
em contratos imobiliários? Inclua: Lei aplicável, posição do STJ,
e cláusulas que os tribunais têm considerado abusivas.
```
Exemplos de temas:
- Distrato imobiliário — percentual de retenção (Lei 13.786/2018)
- Contrato de locação — despejo por falta de pagamento (prazos pós-2024)
- Usucapião urbana extrajudicial — documentação e entraves cartorários

---

## Passo 2 — Curar as Fontes

Após o relatório do Perplexity, **não use tudo**. Filtre:

| Priorize | Descarte |
|---|---|
| Sites de tribunais (tjsp.jus.br, tst.jus.br, stj.jus.br) | Blogs jurídicos sem autoria |
| Diário Oficial / Legislação.gov.br | Fóruns e comentários |
| Revistas com ISSN (RDCC, RT, JOTA) | Notícias sem citação da decisão |
| Planalto.gov.br para legislação | Resumos de cursinho |

**Selecione 3 a 5 URLs.** Qualidade, não quantidade.

---

## Passo 3 — NotebookLM (Síntese)

### Setup
1. Acesse [notebooklm.google.com](https://notebooklm.google.com)
2. Crie um novo notebook por **caso ou tema** (ex: "Insalubridade 2026")
3. Adicione as URLs curadas como fontes
4. Cole o relatório bruto do Perplexity como fonte de "Texto Copiado"

### O que gerar no NotebookLM

#### Para Petições (Studio → Documento)
```
Prompt: "Com base nas fontes, elabore um resumo de tese jurídica
sobre [tema], com os principais argumentos, fundamentos legais
e jurisprudência favorável, em formato de tópicos para petição."
```
→ Copie o resultado para usar nas skills `/peticao-trabalhista`,
  `/peticao-civel` etc. do Claude Code.

#### Para Clientes (Studio → Slide Deck)
```
Prompt: "Crie uma apresentação explicando [situação jurídica do cliente]
em linguagem acessível, com o que ele pode esperar do processo
e os próximos passos."
```
→ Apresentação visual pronta com títulos, gráficos e resumos.

#### Para Estratégia (Studio → Tabela)
```
Prompt: "Monte uma tabela comparando as posições jurisprudenciais
sobre [tema], coluna por tribunal, linha por critério de decisão."
```
→ Exporta direto para Google Sheets.

#### Para Pareceres (Chat do NotebookLM)
```
Prompt: "Atuando como consultor jurídico sênior, elabore um parecer
sobre os riscos e oportunidades em [caso], baseado exclusivamente
nas fontes carregadas."
```
→ Zero alucinações — responde só com o que está nas fontes.

---

## Casos de Uso Completos

### Caso 1: Reclamatória Trabalhista com Tese Nova
1. **Perplexity Deep Research:** "Qual o entendimento do TST sobre
   home office e horas extras em 2025-2026?"
2. **Cure:** acórdãos do TST + texto da Portaria MTE 671/2021
3. **NotebookLM:** gere resumo de tese → alimente `/peticao-trabalhista`

### Caso 2: Defesa em Execução Condominial
1. **Perplexity:** "Quais as teses de defesa em execução de cotas
   condominiais com sucesso no TJSP 2024-2026?"
2. **Cure:** acórdãos do TJSP + arts. 784 e 833 CPC
3. **NotebookLM:** gere tabela de teses → use em `/defesa-condomino`

### Caso 3: Apresentação para Cliente Imobiliário
1. **Perplexity:** "Como funciona o distrato imobiliário e quais
   os direitos do comprador pela Lei 13.786/2018?"
2. **Cure:** texto da lei + 3 acórdãos favoráveis ao comprador
3. **NotebookLM Studio → Slide Deck:** apresentação para reunião

### Caso 4: Monitoramento de Mudanças Legislativas
1. **Perplexity:** "Quais as principais mudanças na legislação
   trabalhista e condominial nos últimos 90 dias?"
2. **Cure:** publicações do DOU + portarias recentes
3. **NotebookLM:** plano de ação → impacto nos casos em andamento

---

## Integração com Claude Code

Após gerar o conteúdo no NotebookLM, use-o como **insumo** para as
skills do Claude Code:

```
NotebookLM (tese curada)
        ↓
Cole no prompt inicial de:
/peticao-trabalhista
/peticao-civel
/execucao-condominial
/parecer-custos
        ↓
Claude Code gera a peça final formatada e fundamentada
```

---

## Dica de Ouro

O Perplexity encontra. Você filtra. O NotebookLM sintetiza.
O Claude Code formata e peticiona.

**Cada ferramenta faz o que faz melhor — nenhuma substitui a outra.**
