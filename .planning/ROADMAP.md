# Roadmap: Claude Code Jurídico — Blindagem e Expansão

## Overview

O projeto parte do ecossistema existente (48 commands, 6 agentes, 5 calculadoras) e executa duas frentes em sequência: primeiro blinda o que já existe com testes e validações que impedem erros reais ao cliente, depois expande com três skills estratégicas ausentes. A frente de blindagem começa pelas calculadoras (risco crítico) e pelos hooks de petição (prevenção de documentos incompletos), avança pela validação estática do corpus legal, e encerra. A frente de expansão entrega o Radar de Prazos, o Extrator de Dados e o Pacote Construtoras como capabilities autônomas.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Calculadoras Blindadas** - Testes automatizados para as 5 calculadoras com decimal.js e valores determinísticos
- [ ] **Phase 2: Hooks Bloqueantes** - Hooks exit 1 para petições incompletas + suite BATS
- [ ] **Phase 3: Linter Jurídico** - Catálogo de referências legais e validação estrutural dos commands/agentes
- [ ] **Phase 4: Radar de Prazos** - Contagem em dias úteis, feriados, recesso forense e alertas de proximidade
- [ ] **Phase 5: Extrator de Dados** - Extração estruturada de holerites, CTPS e contratos
- [ ] **Phase 6: Pacote Construtoras** - Cinco commands para assessoria jurídica de construtoras

## Phase Details

### Phase 1: Calculadoras Blindadas
**Goal**: As 5 calculadoras produzem resultados verificáveis e matematicamente precisos em qualquer entrada conhecida
**Depends on**: Nothing (first phase)
**Requirements**: CALC-01, CALC-02, CALC-03, CALC-04, CALC-05, CALC-06
**Success Criteria** (what must be TRUE):
  1. Executar `npx vitest run tests/calculadoras/` passa 100% dos testes sem falha
  2. Cada calculadora tem pelo menos um teste com valor de entrada e resultado esperado fixos (ex: multa 2% sobre R$1.000 = R$20,00)
  3. Nenhum resultado de cálculo usa operações de ponto flutuante nativo — decimal.js com ROUND_HALF_UP está em uso em todos os arquivos de cálculo
  4. A calculadora de reclamatória cobre os 3 cenários (sem justa causa, justa causa, pedido demissão) e os reflexos sobre FGTS+40%
**Plans**: TBD

### Phase 2: Hooks Bloqueantes
**Goal**: Petições incompletas são rejeitadas com exit 1 antes de serem enviadas, e essa garantia é verificada por testes automatizados
**Depends on**: Phase 1
**Requirements**: HOOK-01, HOOK-02, HOOK-03, HOOK-04, HOOK-05
**Success Criteria** (what must be TRUE):
  1. Tentar submeter uma petição sem endereçamento, sem qualificação das partes ou sem pedidos retorna exit 1 e mensagem de erro legível
  2. Tentar submeter uma petição condominial sem planilha de débitos ou uma trabalhista sem verbas retorna exit 1
  3. Executar `bats tests/hooks/` passa todos os cenários (petição completa → exit 0, incompleta → exit 1, vazia → exit 1)
  4. Nenhuma petição válida é bloqueada pelo hook (zero falsos positivos nos fixtures de petição completa)
**Plans**: TBD

### Phase 3: Linter Jurídico
**Goal**: O corpus de commands e agentes é auditável: referências legais estão catalogadas e a estrutura obrigatória de cada command é verificável automaticamente
**Depends on**: Phase 2
**Requirements**: LINT-01, LINT-02, LINT-03, LINT-04
**Success Criteria** (what must be TRUE):
  1. Executar o script de extração produz um catálogo estruturado listando todas as leis, súmulas e artigos referenciados nos 48 commands e 6 agentes
  2. Executar a validação estrutural aponta qualquer command que não possua as seções "Quando Usar", "Informações Necessárias" e "Fundamentação Legal"
  3. O script de consistência detecta divergências de formato (ex: datas em formatos diferentes, moeda sem padrão) entre commands
  4. Existe um checklist de revisão trimestral preenchível manualmente com as fontes de mudança mais relevantes (TST, CPC, reforma trabalhista)
**Plans**: TBD

### Phase 4: Radar de Prazos
**Goal**: O advogado pode calcular qualquer prazo processual em dias úteis com exclusão automática de feriados e recesso forense, e recebe alertas de proximidade
**Depends on**: Phase 3
**Requirements**: PRAZO-01, PRAZO-02, PRAZO-03, PRAZO-04
**Success Criteria** (what must be TRUE):
  1. Dado um evento processual e um prazo em dias (ex: 15 dias para contestar), o command retorna a data final contando apenas dias úteis conforme CPC art. 219
  2. Feriados nacionais e o recesso forense (20/dez a 20/jan, art. 220 CPC) são excluídos automaticamente da contagem
  3. O command sinaliza quando o prazo está a 3 dias úteis, a 1 dia útil ou já vencido
  4. A regra de exclusão do dia inicial e inclusão do dia final (art. 224 CPC) é aplicada corretamente em todos os cenários testados
**Plans**: TBD

### Phase 5: Extrator de Dados
**Goal**: O advogado consegue extrair dados estruturados de holerites, CTPS e contratos para alimentar calculadoras e petições sem redigitação manual
**Depends on**: Phase 4
**Requirements**: EXTR-01, EXTR-02, EXTR-03
**Success Criteria** (what must be TRUE):
  1. Fornecer um holerite ao command retorna os campos necessários para a calculadora de reclamatória (salário base, descontos, verbas variáveis)
  2. Fornecer uma CTPS ao command retorna um histórico de empregos estruturado com datas de admissão, demissão e salários
  3. Fornecer um contrato ao command retorna as cláusulas-chave identificadas (prazo, valor, penalidades, reajuste) em formato utilizável diretamente em petições
**Plans**: TBD

### Phase 6: Pacote Construtoras
**Goal**: O escritório pode atender construtoras com cinco commands especializados cobrindo desde o memorial de incorporação até o habite-se
**Depends on**: Phase 5
**Requirements**: CONST-01, CONST-02, CONST-03, CONST-04, CONST-05
**Success Criteria** (what must be TRUE):
  1. O command de memorial de incorporação gera estrutura conforme Lei 4.591/64 com todas as cláusulas obrigatórias identificadas
  2. O command de quadro de áreas produz tabela compatível com NBR 12.721
  3. O command de patrimônio de afetação orienta sobre a segregação patrimonial conforme Lei 10.931/2004
  4. O command de contrato-padrão de venda inclui quadro-resumo com todos os elementos exigidos pelo CDC e Lei 4.591/64
  5. O command de checklist de habite-se lista todos os documentos e condições para regularização final da obra
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Calculadoras Blindadas | 0/? | Not started | - |
| 2. Hooks Bloqueantes | 0/? | Not started | - |
| 3. Linter Jurídico | 0/? | Not started | - |
| 4. Radar de Prazos | 0/? | Not started | - |
| 5. Extrator de Dados | 0/? | Not started | - |
| 6. Pacote Construtoras | 0/? | Not started | - |
