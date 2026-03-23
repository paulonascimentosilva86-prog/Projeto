# Contextos Juridicos — Troca Rapida de Area do Direito

> Inspirado no ClaudeCTX | Adaptado para Paulo Nascimento - Advocacia Integrada
> Permite alternar o foco do assistente entre areas do direito com um unico comando

---

## Como Usar

Ao iniciar qualquer tarefa, ative o contexto da area relevante com o comando:

```
/contexto [area]
```

Exemplos:
- `/contexto condominial`
- `/contexto trabalhista`
- `/contexto civil`
- `/contexto imobiliario`
- `/contexto familia`

O contexto ativa automaticamente: legislacao principal, skills disponiveis, modelos de documentos, jurisprudencia prioritaria e perfil de atuacao (autor/reu/consultor).

---

## Contextos Disponiveis

### 1. CONDOMINIAL

| Item | Conteudo |
|---|---|
| **Legislacao principal** | CC arts. 1.331-1.358; Lei 4.591/64; CPC arts. 784 X, 829; Lei 13.105/2015 |
| **Skills ativas** | #16 Execucao de Cotas, #17 Workflow de Cobranca, #18 Defesa do Condomino, #19 Atas e Convocacoes, #20 Convencao e Regimento, #21 Destituicao de Sindico, #22 Notificacoes, #23 Obrigacao de Fazer/Nao Fazer, #24 Mediacao Condominial |
| **Modelos disponiveis** | MODELO_ACORDO_CONDOMINIAL.md, MODELO_NOTIFICACAO_CONDOMINIAL.md |
| **Perfil predominante** | Representante do condominio (credor) |
| **Jurisprudencia prioritaria** | Obrigacao propter rem (art. 1.345 CC), multa de 2% (art. 1.336 §1 CC), juros de 1% a.m., legitimidade do condominio, penhorabilidade do imovel de inadimplente |
| **Calculadoras** | #41 Calculadora de Debito Condominial (Principal + Multa 2% + Juros 1% a.m. + INPC + Honorarios 30%) |
| **Pipeline tipico** | Notificacao extrajudicial (3 dias) → Protesto → Execucao de titulo extrajudicial |

### 2. TRABALHISTA

| Item | Conteudo |
|---|---|
| **Legislacao principal** | CLT (DL 5.452/43); CF art. 7; Lei 13.467/2017 (Reforma); Sumulas e OJs do TST |
| **Skills ativas** | #1 Peticao Trabalhista, #2 Calculo Trabalhista, #3 Defesa Empresarial, #4 Analisador de Justa Causa, #5 Insalubridade/Periculosidade, #6 Compliance Preventivo, #7 Acordo Trabalhista, #8 Simulador de Reclamatoria |
| **Modelos disponiveis** | (a implementar: modelo de reclamatoria, modelo de contestacao) |
| **Perfil predominante** | Autor (reclamante) e Reu (empregador) — atuacao em ambos os polos |
| **Jurisprudencia prioritaria** | Sumulas do TST (vinculantes), OJs da SDI-1 e SDI-2, temas repetitivos do TST |
| **Calculadoras** | #2 Calculo Trabalhista (verbas rescisorias, FGTS, ferias, 13o, horas extras, reflexos) |
| **Pipeline tipico** | Consulta inicial → Analise de documentos → Calculo previo → Peticao inicial ou Defesa |

### 3. CIVEL

| Item | Conteudo |
|---|---|
| **Legislacao principal** | CC/2002; CPC/2015; CDC (Lei 8.078/90); Lei 9.099/95 (Juizados) |
| **Skills ativas** | #9 Peticao Civel, #10 Execucao/Cumprimento, #11 Acao de Consumo, #12 Cobranca/Monitoria, #13 Indenizacao, #14 Embargos e Impugnacoes, #15 Calculo Judicial |
| **Modelos disponiveis** | (a implementar: modelo de peticao inicial civel, modelo de cumprimento de sentenca) |
| **Perfil predominante** | Autor (consumidor, credor) — maior volume |
| **Jurisprudencia prioritaria** | Sumulas do STJ (responsabilidade civil, consumidor, obrigacoes), temas repetitivos |
| **Calculadoras** | #15 Calculo Judicial (correcao, juros, honorarios) |
| **Pipeline tipico** | Notificacao → Acao de conhecimento → Cumprimento de sentenca/Execucao |

### 4. IMOBILIARIO

| Item | Conteudo |
|---|---|
| **Legislacao principal** | CC/2002 (propriedade, posse); Lei 8.245/91 (Locacoes); Lei 13.786/2018 (Distratos); Lei 6.015/73 (Registros); Lei 13.465/2017 (REURB); Lei 10.931/2004 (Patrimonio de Afetacao) |
| **Skills ativas** | #25 Contrato de Locacao, #26 Acao de Despejo, #27 Renovatoria Comercial, #28 Compra e Venda, #29 Distrato, #30 Usucapiao, #31 Adjudicacao Compulsoria, #32 Reintegracao/Manutencao de Posse, #33 Due Diligence, #34 Assessoria Construtoras, #35 Revisional de Aluguel, #36 REURB |
| **Modelos disponiveis** | (a implementar: modelo de contrato de locacao, modelo de notificacao de despejo) |
| **Perfil predominante** | Locador, comprador, proprietario — conforme o caso |
| **Jurisprudencia prioritaria** | Sumulas STJ sobre locacao, posse, registro, usucapiao; temas repetitivos imobiliarios |
| **Calculadoras** | #42 Distrato Imobiliario, #43 Reajuste de Aluguel |
| **Pipeline tipico** | Due diligence → Contrato → (eventual) Notificacao → (eventual) Acao judicial |

### 5. FAMILIA E SUCESSOES

| Item | Conteudo |
|---|---|
| **Legislacao principal** | CC/2002 Livro IV (Direito de Familia) e Livro V (Sucessoes); Lei 11.441/2007 (divorcio/inventario extrajudicial); ECA; Lei 12.318/2010 (Alienacao Parental) |
| **Skills ativas** | #37 Divorcio, #38 Alimentos/Revisional/Exoneratoria, #39 Inventario e Partilha, #40 Guarda e Visitas |
| **Modelos disponiveis** | (a implementar: modelo de peticao de divorcio, modelo de acordo de alimentos) |
| **Perfil predominante** | Variavel conforme o caso (autor ou reu, requerente ou requerido) |
| **Jurisprudencia prioritaria** | Sumulas STJ sobre alimentos, guarda compartilhada, uniao estavel, ITCMD, meacao |
| **Calculadoras** | Trinomio necessidade-possibilidade-proporcionalidade (alimentos) |
| **Pipeline tipico** | Consulta → Tentativa de acordo extrajudicial → (consensual ou litigioso) → Acao |

---

## Contextos Transversais (ativados junto com qualquer area)

### PESQUISA JURISPRUDENCIAL
- **Caminho obrigatorio:** Jusbrasil (https://www.jusbrasil.com.br)
- **Conta:** paulonascimentosilva86@gmail.com
- **Validacao complementar:** sites oficiais dos tribunais (STF, STJ, TRFs, TJs)
- **Padrao de citacao:** 3 etapas (tese → ementa recuada → subsuncao ao caso)
- Ver: PLUGIN_JURISPRUDENCIA_NACIONAL.md

### FORMATACAO
- Timbre: Paulo Nascimento, Advocacia Integrada
- Rodape: OAB/PB 20.556
- Fonte: Century Gothic, 12pt, espacamento 1,5, justificado
- Numeracao: romana (I, II, III) com subdivisoes
- Ver: Secao "Formatacao Obrigatoria" do MAPEAMENTO_SKILLS.md

### REDACAO JURIDICA
- Todas as diretrizes I a VI do MAPEAMENTO_SKILLS.md se aplicam a qualquer contexto
- Restricoes absolutas (travessoes, emojis, retorica) sao universais
- Palavras proibidas sao universais

---

## Combinacao de Contextos

Para casos que envolvem multiplas areas, combinar contextos:

```
/contexto condominial + civil
/contexto imobiliario + familia
/contexto trabalhista + civil
```

Exemplos praticos:
- **Cobranca condominial com penhora de imovel:** condominial + civil (execucao)
- **Despejo por falta de pagamento com cobranca:** imobiliario + civil
- **Divorcio com partilha de imovel financiado:** familia + imobiliario
- **Reclamatoria com dano moral:** trabalhista + civil

---

## Regras de Uso

1. Sempre ativar o contexto antes de iniciar qualquer tarefa juridica
2. O contexto transversal (pesquisa, formatacao, redacao) e automatico e permanente
3. Ao trocar de area, o contexto anterior e desativado (salvo combinacao explicita)
4. Todas as skills listadas no contexto ficam disponiveis para ativacao
5. A legislacao e jurisprudencia prioritaria orientam a pesquisa e fundamentacao

---

*Sistema de Contextos Juridicos para Paulo Nascimento - Advocacia Integrada*
*Gerado em 23/03/2026*
