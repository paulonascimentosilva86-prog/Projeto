# Framework de Orquestracao - Paulo Nascimento Advocacia Integrada

> Baseado nos 7 Principios do Orchestration Prompting.
> "Brief a PM, don't ask a question." - Defina resultados, nao instrucoes.

---

## 3 Mudancas Fundamentais

| De (Chatbot Linear) | Para (Orquestracao) |
|---|---|
| Instrucoes passo a passo | **Resultados esperados** |
| Diretrizes vagas | **Guardrails com travas duras** |
| Descrever o processo | **Definir inputs e outputs** |

---

## Os 7 Principios Aplicados ao Escritorio

### 1. Defina a Linha de Chegada, Nao o Caminho

Cada skill deve ter um "DONE" claro:

| Skill | DONE = quando... |
|---|---|
| `/execucao-condominial` | Peticao completa + planilha de debito + documentos listados |
| `/peticao-trabalhista` | Peticao formatada + valor da causa calculado + fundamentacao TST |
| `/workflow-cobranca` | 3 documentos gerados (notificacao + protesto + peticao) |
| `/calculadora-condominial` | Tabela mes a mes com totais + formula explicitada |
| `/contrato-locacao` | Contrato com todas clausulas obrigatorias da Lei 8.245 |

### 2. Especifique Inputs com Precisao Cirurgica

Cada skill deve coletar dados EXATOS, nao genericos:

**Ruim:** "Informe os dados do cliente"
**Bom:**
```
DADOS OBRIGATORIOS (nao prosseguir sem eles):
- Nome completo do condomino: [texto]
- CPF: [000.000.000-00]
- Unidade: [Bloco X, Apto Y]
- Competencias inadimplentes: [MM/AAAA a MM/AAAA]
- Valor da cota ordinaria: [R$ 0.000,00]
- Valor da cota extraordinaria: [R$ 0.000,00] ou "nao ha"
```

### 3. Defina Entregaveis como Brief de Cliente

Cada output deve ter formato, destino e convencao de nomes:

```
ENTREGAVEL:
- Formato: Peticao em markdown formatado
- Secoes obrigatorias: Enderecamento, Qualificacao, Fatos, Direito, Pedidos, Valor
- Arquivo: peticoes/execucao_[condominio]_[unidade]_[data].md
- Planilha anexa: calculos/debito_[condominio]_[unidade]_[data].md
```

### 4. Guardrails, Nao Diretrizes

**Travas duras (NUNCA violar):**

| Guardrail | Regra |
|---|---|
| Prescricao | NUNCA incluir competencias com mais de 5 anos (art. 206 §5 I CC) |
| Multa condominial | NUNCA aplicar multa superior a 2% (art. 1.336 §1 CC) |
| Juros | NUNCA aplicar juros acima de 1% a.m. salvo previsao na convencao |
| Honorarios | SEMPRE aplicar 30% sobre debito atualizado (padrao do escritorio) |
| Bem de familia | SEMPRE fundamentar excecao do art. 3 IV Lei 8.009/90 |
| Valor da causa | NUNCA omitir - sempre calcular o total atualizado |
| Citacao | NUNCA esquecer pedido de citacao com forma legal correta |
| Dados sensiveis | NUNCA gerar documento sem CPF/CNPJ das partes |
| Competencia | NUNCA enderacar para vara/tribunal incorreto |
| Fundamentacao | NUNCA apresentar pedido sem base legal expressa |

### 5. Checkpoints de Verificacao

Antes de gerar o documento final, validar:

```
CHECKPOINT 1 - DADOS COMPLETOS
[ ] Todos os dados obrigatorios foram coletados?
[ ] CPF/CNPJ validados (formato correto)?
[ ] Competencias dentro do prazo prescricional?
[ ] Comarca/vara definida?

CHECKPOINT 2 - CALCULO CORRETO
[ ] Multa 2% aplicada corretamente?
[ ] Juros pro rata die calculados?
[ ] Indice de correcao (INPC) mencionado?
[ ] Honorarios 30% sobre total atualizado?
[ ] Soma confere?

CHECKPOINT 3 - PETICAO COMPLETA
[ ] Enderecamento presente e correto?
[ ] Qualificacao com dados completos?
[ ] Fatos narrados cronologicamente?
[ ] Fundamentacao legal completa?
[ ] Pedidos numerados com base legal?
[ ] Valor da causa declarado?
[ ] Documentos anexos listados?
```

### 6. Roteamento por Complexidade

Direcionar cada tarefa para o modelo adequado:

| Complexidade | Tarefas | Modelo Sugerido |
|---|---|---|
| **Alta** (raciocinio complexo) | Peticoes com multiplas teses, analise de viabilidade, pareceres, recursos superiores | @opus |
| **Media** (execucao padrao) | Peticoes padrao, contratos, notificacoes, calculos | @sonnet |
| **Baixa** (tarefas simples) | Modelos de email, conversao de linguagem, checklists | @haiku |

### 7. Exemplos de Referencia

Sempre fornecer ao modelo um exemplo do resultado esperado. 30 segundos de investimento economizam revisoes.

---

## Framework de Despacho (Dispatch Brief)

Toda tarefa juridica deve seguir este template:

```
MISSAO: [O que precisa ser feito - resultado, nao processo]
CONTEXTO: [Polo ativo/passivo, area do direito, urgencia, peculiaridades]
FONTES: [Legislacao, jurisprudencia, convencao condominial, contrato]
ENTREGAVEIS: [Formato exato, secoes, arquivo de saida]
ROTEAMENTO: [Qual modelo/agente usar] (opcional)
GUARDRAILS: [O que NUNCA fazer + limites rigidos]
CHECKPOINTS: [Pontos de verificacao antes do output final]
REFERENCIA: [Exemplo de documento similar ja aprovado]
```

---

## Orquestracao de Workflows Agendados

Para tarefas recorrentes (prazos, relatorios, monitoramento):

```
CHAVES:
> Inputs de dados variaveis (o que muda a cada execucao)
> Estrutura de output consistente (sempre o mesmo formato)
> Tratamento de falhas (o que fazer se algo der errado)
> Logica de notificacao (quando e como alertar)
```

**A unica variavel e o prompt.** A infraestrutura permanece constante.

---

## 5 Erros que Queimam Creditos

| Erro | Correcao |
|---|---|
| Tratar como chat (jogar tudo de uma vez) | Usar Dispatch Brief estruturado |
| Formato de entrega vago | Especificar formato, secoes, nomes de arquivo |
| Sem guardrails para acoes externas | Definir travas duras (prescricao, multa, juros) |
| Usar Opus para tudo | Rotear por complexidade (Opus/Sonnet/Haiku) |
| Sem verificacao antes do output | Implementar checkpoints obrigatorios |

---

## Agentes como Orquestra

```
ORQUESTRA DO ESCRITORIO:

Opus ─────── Pareceres, recursos superiores, teses complexas
Sonnet ────── Peticoes padrao, contratos, calculos (PROJETO MANAGER)
Haiku ─────── Emails, checklists, conversoes rapidas

           ┌── Agente Condominial (PRINCIPAL)
           ├── Agente Trabalhista
Sonnet PM ─┤── Agente Civel
           ├── Agente Imobiliario
           ├── Agente Familia
           └── Agente Produtividade
```

O Sonnet atua como **Gerente de Projeto**, roteando para o agente especialista correto e escalando para Opus quando a complexidade exige.
