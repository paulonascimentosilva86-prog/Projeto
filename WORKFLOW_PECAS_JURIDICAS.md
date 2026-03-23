# Workflow de Elaboracao de Pecas Juridicas — Metodo RIPEV

> Inspirado no RIPER Workflow | Adaptado para a pratica juridica
> 5 fases obrigatorias para toda peca processual ou consultiva do escritorio

---

## Visao Geral

Toda peca juridica do escritorio Paulo Nascimento - Advocacia Integrada deve seguir o metodo **RIPEV** (Pesquisar, Inovar, Planejar, Executar, Validar), que garante qualidade, fundamentacao solida e consistencia.

```
PESQUISAR → INOVAR → PLANEJAR → EXECUTAR → VALIDAR
   (P)        (I)       (P)       (E)       (V)
```

Nenhuma fase pode ser pulada. A peca so e entregue apos completar as 5 fases.

---

## Fase 1: PESQUISAR (Somente leitura)

**Objetivo:** Compreender o caso, levantar fatos e fundamentacao antes de escrever qualquer linha.

### Acoes obrigatorias:

1. **Analisar os fatos do caso**
   - Ler todos os documentos fornecidos pelo cliente
   - Identificar: partes, datas, valores, pedidos, pretensao
   - Extrair dados relevantes (usar skill #46 Extrator de Dados quando aplicavel)

2. **Identificar a legislacao aplicavel**
   - Artigos de lei pertinentes (CC, CPC, CLT, CDC, leis especiais)
   - Sumulas vinculantes e nao vinculantes aplicaveis
   - Temas repetitivos do STJ/STF/TST

3. **Pesquisar jurisprudencia**
   - **OBRIGATORIO:** pesquisa via Jusbrasil (conta paulonascimentosilva86@gmail.com)
   - Buscar: ementas, acordaos, decisoes monocraticas
   - Identificar corrente majoritaria vs minoritaria
   - Selecionar 3-5 julgados mais relevantes e recentes
   - Ver: PLUGIN_JURISPRUDENCIA_NACIONAL.md

4. **Analisar a vara/juiz (quando disponivel)**
   - Perfil decisorio, teses acolhidas, valores habituais
   - Usar skill #49 Analise de Juiz/Vara quando implementada

### Entregavel da Fase 1:
```
RELATORIO DE PESQUISA
- Fatos relevantes: [lista]
- Legislacao aplicavel: [artigos]
- Jurisprudencia selecionada: [3-5 julgados com numero, tribunal, data]
- Corrente majoritaria: [sintese]
- Pontos de atencao: [riscos, lacunas, divergencias]
```

### Restricao: Nenhum texto de peca e redigido nesta fase.

---

## Fase 2: INOVAR (Estrategia e teses)

**Objetivo:** Definir a estrategia argumentativa e as teses juridicas antes de estruturar a peca.

### Acoes obrigatorias:

1. **Definir tese principal**
   - Qual o argumento central que sustenta o pedido?
   - Base normativa + precedente que melhor ampara

2. **Definir teses subsidiarias**
   - Argumentos alternativos caso a tese principal nao prospere
   - Ordenar por forca: da mais robusta para a mais fraca

3. **Antecipar contra-argumentos**
   - O que a parte contraria pode alegar?
   - Como refutar cada contra-argumento?

4. **Avaliar cenarios (quando aplicavel)**
   - Probabilidade de procedencia total, parcial, improcedencia
   - Valor estimado de condenacao ou acordo
   - Usar skill #50 Simulador de Cenarios quando implementada

### Entregavel da Fase 2:
```
ESTRATEGIA ARGUMENTATIVA
- Tese principal: [argumento + base legal + precedente]
- Teses subsidiarias: [1, 2, 3 em ordem de forca]
- Contra-argumentos esperados: [lista com refutacao]
- Cenario projetado: [otimista / realista / pessimista]
```

### Restricao: Nenhum texto de peca e redigido nesta fase.

---

## Fase 3: PLANEJAR (Estrutura da peca)

**Objetivo:** Criar o esqueleto completo da peca antes de redigir.

### Acoes obrigatorias:

1. **Definir tipo e formato da peca**
   - Peticao inicial, contestacao, recurso, notificacao, acordo, parecer
   - Ativar contexto juridico correspondente (ver CONTEXTOS_JURIDICOS.md)
   - Verificar se existe modelo (MODELO_ACORDO_CONDOMINIAL.md, MODELO_NOTIFICACAO_CONDOMINIAL.md)

2. **Montar estrutura topica**
   - Numeracao romana (I, II, III) com subdivisoes
   - Cada topico com titulo e resumo do argumento
   - Indicar onde cada julgado sera citado (padrao de 3 etapas)

3. **Planejar pedidos**
   - Lista completa de pedidos (principal e subsidiarios)
   - Valores quando aplicavel
   - Tutela de urgencia se cabivel

4. **Verificar formatacao**
   - Timbre, rodape, fonte, espacamento conforme MAPEAMENTO_SKILLS.md
   - Endereçamento correto (Douto Juizo / Douto Desembargador)

### Entregavel da Fase 3:
```
ESTRUTURA DA PECA
I. Dos Fatos
II. Do Direito
   II.1 [Tese principal + julgado X]
   II.2 [Tese subsidiaria 1 + julgado Y]
   II.3 [Tese subsidiaria 2 + julgado Z]
III. Da Tutela de Urgencia (se aplicavel)
IV. Dos Pedidos
   a) [pedido 1]
   b) [pedido 2]
   c) [pedido subsidiario]
V. Do Valor da Causa
```

### Restricao: A estrutura deve ser aprovada antes de iniciar a redacao.

---

## Fase 4: EXECUTAR (Redacao completa)

**Objetivo:** Redigir a peca completa seguindo a estrutura aprovada e todas as diretrizes.

### Acoes obrigatorias:

1. **Redigir seguindo todas as diretrizes de redacao juridica**
   - Estilo: clareza logica, rigor dogmatico, densidade conceitual (regras I.1 a I.9)
   - Ritmo: frases de medio folego, conectores, voz ativa (regras III.1 a III.4)
   - Restricoes: sem travessoes, emojis, retorica, metaforas (regras IV.1 a IV.13)
   - Palavras proibidas: lista completa da regra V

2. **Inserir jurisprudencia no padrao de 3 etapas**
   - ETAPA 1: Introducao da tese com indicacao do precedente
   - ETAPA 2: Bloco de ementa recuado com dados completos
   - ETAPA 3: Subsuncao ao caso concreto
   - REGRA: nenhuma ementa aparece sem paragrafo de subsuncao

3. **Redigir pedidos de forma completa e precisa**
   - Valores em numerais E por extenso
   - Base legal de cada pedido
   - Pedidos subsidiarios apos os principais

4. **Aplicar formatacao obrigatoria**
   - Timbre: Paulo Nascimento, Advocacia Integrada
   - Rodape: OAB/PB 20.556
   - Fonte: Century Gothic, 12pt, espacamento 1,5, justificado

### Entregavel da Fase 4: Peca completa redigida.

### Restricao: Seguir exatamente a estrutura aprovada na Fase 3.

---

## Fase 5: VALIDAR (Revisao e controle de qualidade)

**Objetivo:** Revisar a peca contra todos os padroes do escritorio antes de entregar.

### Checklist obrigatorio:

#### 5.1 Revisao de Forma
- [ ] Timbre e rodape corretos
- [ ] Fonte Century Gothic, 12pt, espacamento 1,5
- [ ] Texto justificado
- [ ] Numeracao romana com subdivisoes
- [ ] Endereçamento correto (Douto Juizo / Douto Desembargador)

#### 5.2 Revisao de Linguagem
- [ ] Nenhum travessao no texto (usar virgula, ponto ou ponto e virgula)
- [ ] Nenhum emoji
- [ ] Nenhuma palavra da lista proibida (regra V)
- [ ] Nenhuma pergunta retorica
- [ ] Nenhuma adjetivacao ou retorica emocional
- [ ] Voz ativa predominante
- [ ] Ortografia em portugues brasileiro

#### 5.3 Revisao de Conteudo
- [ ] Todos os fatos do caso foram contemplados
- [ ] Legislacao citada esta vigente e correta
- [ ] Toda jurisprudencia segue o padrao de 3 etapas (tese + ementa + subsuncao)
- [ ] Nenhuma ementa citada sem subsuncao
- [ ] Toda jurisprudencia foi verificada no Jusbrasil
- [ ] Pedidos sao coerentes com a fundamentacao
- [ ] Valores estao em numerais E por extenso

#### 5.4 Revisao Estrategica
- [ ] Tese principal esta clara e bem fundamentada
- [ ] Teses subsidiarias estao ordenadas por forca
- [ ] Contra-argumentos previsiveis foram antecipados
- [ ] A peca pode ser adotada pelo julgador como fundamentacao

### Entregavel da Fase 5:
```
RELATORIO DE VALIDACAO
- Itens verificados: [total]
- Itens OK: [total]
- Correcoes feitas: [lista]
- Status: APROVADO / REQUER AJUSTE
```

### Restricao: A peca so e entregue com status APROVADO.

---

## Fluxo Resumido

```
CASO NOVO
    |
    v
[1. PESQUISAR]
    Fatos + Legislacao + Jurisprudencia (Jusbrasil)
    |
    v
[2. INOVAR]
    Tese principal + Subsidiarias + Contra-argumentos
    |
    v
[3. PLANEJAR]
    Estrutura topica + Pedidos + Modelo aplicavel
    |
    v
[4. EXECUTAR]
    Redacao completa seguindo diretrizes I-VI
    |
    v
[5. VALIDAR]
    Checklist de forma + linguagem + conteudo + estrategia
    |
    v
PECA ENTREGUE (status: APROVADO)
```

---

## Aplicacao por Tipo de Documento

| Tipo de Documento | Fases Aplicaveis | Observacao |
|---|---|---|
| Peticao inicial | Todas (1-5) | Fluxo completo obrigatorio |
| Contestacao/Defesa | Todas (1-5) | Fase 2 foca em refutacao |
| Recursos (apelacao, agravo, REsp) | Todas (1-5) | Fase 1 inclui analise da sentenca recorrida |
| Notificacao extrajudicial | 1, 3, 4, 5 | Fase 2 (Inovar) opcional para notificacoes padrao |
| Acordo/Termo | 1, 3, 4, 5 | Fase 2 (Inovar) foca em concessoes mutuamente aceitaveis |
| Parecer juridico | Todas (1-5) | Fase 2 deve considerar multiplas interpretacoes |
| Cumprimento de sentenca | 1, 3, 4, 5 | Fase 1 foca na analise do titulo executivo |
| E-mail/mensagem ao cliente | 4, 5 | Versao simplificada para comunicacoes rotineiras |

---

## Integracao com Outras Ferramentas

| Ferramenta | Fase em que se aplica |
|---|---|
| CONTEXTOS_JURIDICOS.md | Fase 1 (ativar contexto da area) e Fase 3 (verificar skills e modelos) |
| PLUGIN_JURISPRUDENCIA_NACIONAL.md | Fase 1 (pesquisa) e Fase 5 (validacao de fontes) |
| MODELO_ACORDO_CONDOMINIAL.md | Fase 3 (estrutura) e Fase 4 (redacao) |
| MODELO_NOTIFICACAO_CONDOMINIAL.md | Fase 3 (estrutura) e Fase 4 (redacao) |
| PERSONAS_JURIDICAS.md | Todas as fases (perfil especializado ativo) |
| Calculadoras (#41, #42, #43) | Fase 1 (calculos previos) e Fase 4 (valores na peca) |

---

*Workflow RIPEV para Paulo Nascimento - Advocacia Integrada*
*5 fases obrigatorias | Qualidade garantida | Nenhuma peca sem validacao*
*Gerado em 23/03/2026*
