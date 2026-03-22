# Jurisprudencia Nacional BR

> Plugin para pesquisa de jurisprudencia brasileira com cobertura nacional real,
> validacao de resultados e geracao de relatorios em Word.
> Integra-se ao pipeline juridico do escritorio (Skills #1, #2, #3, #22).

---

## Visao Geral

Realiza buscas em todos os principais tribunais do Brasil: STF, STJ, TRF1 ao TRF6,
e principais TJs estaduais. Todo resultado citado contem numero de processo e ementa
verificavel. Nunca sao fabricadas ou inventadas decisoes judiciais.

---

## Componentes

### Skills (Deteccao Automatica)

**pesquisa-jurisprudencia-nacional**

Ativada automaticamente quando voce pede pesquisa de jurisprudencia em conversa natural.
Busca em STF, STJ, todos os TRFs e principais TJs, sintetiza o entendimento nacional
e oferece relatorio em Word.

Frases que ativam:
- "pesquise jurisprudencia sobre"
- "existe julgado sobre"
- "o que os tribunais decidem sobre"
- "levantamento jurisprudencial"
- "fundamentacao jurisprudencial para"

**pesquisa-sumulas-temas**

Ativada automaticamente quando voce pede sumulas, temas repetitivos, repercussao geral
ou IRDRs. Busca em STF (sumulas vinculantes e persuasivas, repercussao geral) e STJ
(sumulas, temas repetitivos), alem de IRDRs/IACs nos TJs e TRFs.

Frases que ativam:
- "existe sumula sobre"
- "qual a sumula do STJ sobre"
- "temas repetitivos sobre"
- "repercussao geral"
- "IRDR sobre"

---

### Commands (Acionamento Direto)

**`/pesquisar-jurisprudencia [tema]`**

Pesquisa jurisprudencia nacional sobre o tema informado. Aceita filtros opcionais:
- `--tribunal STF|STJ|TRF|TJ` para focar em um tribunal
- `--anos N` para definir recorte temporal (ex: `--anos 3`)

Exemplos:
```
/pesquisar-jurisprudencia responsabilidade civil medico erro diagnostico
/pesquisar-jurisprudencia prescricao tributaria ICMS --tribunal STJ --anos 5
/pesquisar-jurisprudencia dano moral banco de dados negativacao indevida
```

**`/buscar-sumulas [tema ou numero]`**

Busca sumulas e temas repetitivos sobre o assunto ou numero informado. Aceita filtro opcional:
- `--tipo vinculante|persuasiva|repetitivo|rg|irdr`

Exemplos:
```
/buscar-sumulas responsabilidade objetiva fornecedor
/buscar-sumulas 83 --tipo persuasiva
/buscar-sumulas prescricao FGTS --tipo repetitivo
```

---

## Cobertura de Tribunais

| Categoria | Tribunais |
|---|---|
| Superiores | STF, STJ |
| Justica Federal | TRF1, TRF2, TRF3, TRF4, TRF5, TRF6 |
| Justica Estadual | TJSP, TJRJ, TJMG, TJRS, TJPR, TJSC, TJBA, TJCE, TJPE, TJGO, TJDF, e outros via JusBrasil |

---

## Padrao de Qualidade

Todas as decisoes citadas seguem o padrao:

| Requisito | Descricao |
|---|---|
| Numero do processo | Completo e no formato correto do tribunal |
| Ementa | Extraida do texto original (nunca gerada por IA) |
| Tribunal e data | Identificados quando disponiveis |
| Relator | Identificado quando disponivel |
| URL de origem | Para verificacao e auditoria |

**Regra absoluta:** nenhuma decisao judicial sera fabricada ou inventada. Se a busca
nao encontrar resultados verificaveis, o sistema informa que nao localizou julgados
em vez de criar decisoes ficticia.

---

## Fluxo de Pesquisa

```
1. Usuario solicita pesquisa (conversa natural ou /comando)
         |
2. Identificar termos-chave e tribunal(is) alvo
         |
3. Buscar via WebSearch nos sites oficiais dos tribunais
   - stf.jus.br, stj.jus.br, trf1-5.jus.br, tj[UF].jus.br
   - jusbrasil.com.br (conta paulonascimentosilva86@gmail.com)
         |
4. Validar cada resultado:
   - Numero de processo existe?
   - Ementa corresponde ao tema?
   - Data e relator batem?
         |
5. Sintetizar entendimento nacional
   - Corrente majoritaria vs minoritaria
   - Divergencias entre tribunais
   - Sumulas e temas repetitivos aplicaveis
         |
6. Apresentar relatorio estruturado
   - Oferecer geracao em Word se solicitado
```

---

## Integracao com o Pipeline Juridico

| Etapa do Pipeline | Como o plugin auxilia |
|---|---|
| Consultoria inicial | Fundamenta pareceres com jurisprudencia atualizada |
| Elaboracao de pecas | Fornece julgados para citacao em peticoes e recursos |
| Notificacoes extrajudiciais | Reforça a fundamentacao legal com precedentes |
| Estrategia processual | Identifica correntes majoritarias para orientar a tese |
| Recursos | Localiza divergencia jurisprudencial para recursos especiais |

---

## Configuracao

Nenhuma configuracao adicional necessaria. O plugin utiliza as ferramentas de busca
web ja disponiveis no ambiente (WebSearch, WebFetch).

Para pesquisas no JusBrasil com acesso autenticado, utilizar a conta:
- E-mail: paulonascimentosilva86@gmail.com

---

## Exemplos de Uso Pratico

### Pesquisa para Notificacao Condominial
```
"Pesquise jurisprudencia sobre penhora de imovel por divida condominial"
```
Resultado: julgados do STJ e TJs sobre execucao de cotas condominiais e
possibilidade de penhora/alienacao, reforçando o fundamento do art. 829 CPC.

### Pesquisa para Acordo Condominial
```
"Existe sumula sobre obrigacao propter rem em condominio?"
```
Resultado: sumulas e temas repetitivos do STJ sobre natureza propter rem
das obrigacoes condominiais (vinculacao ao imovel, nao ao proprietario anterior).

### Pesquisa para Defesa Trabalhista
```
/pesquisar-jurisprudencia vinculo empregaticio motorista aplicativo --tribunal TST --anos 3
```
Resultado: julgados recentes do TST sobre o tema, com correntes divergentes.
