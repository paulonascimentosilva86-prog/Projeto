# Roadmap: Claude Code Jurídico — Blindagem e Expansão

## Overview

O projeto parte do ecossistema existente (48 commands, 6 agentes, 5 calculadoras) e executa duas frentes em sequência: primeiro blinda o que já existe com testes e validações que impedem erros reais ao cliente, depois expande com três skills estratégicas ausentes. A frente de blindagem começa pelas calculadoras (risco crítico) e pelos hooks de petição (prevenção de documentos incompletos), avança pela validação estática do corpus legal, e encerra. A frente de expansão entrega o Radar de Prazos, o Extrator de Dados e o Pacote Construtoras como capabilities autônomas.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Calculadoras Blindadas** - Testes automatizados para as 5 calculadoras com decimal.js e valores determinísticos
- [ ] **Phase 2: Hooks Bloqueantes** - Hooks exit 1 para petições incompletas + suite BATS com 3 cenários
- [ ] **Phase 3: Linter Jurídico** - Catálogo de referências legais e validação estrutural dos 48 commands e 6 agentes
- [ ] **Phase 4: Radar de Prazos** - Contagem em dias úteis, feriados, recesso forense e alertas de proximidade
- [ ] **Phase 5: Extrator de Dados** - Extração estruturada de holerites, CTPS e contratos para cálculo
- [ ] **Phase 6: Pacote Construtoras** - Cinco commands para assessoria jurídica completa de construtoras

## Phase Details

### Phase 1: Calculadoras Blindadas
**Goal**: As 5 calculadoras produzem resultados verificáveis e matematicamente precisos em qualquer entrada conhecida
**Depends on**: Nothing (first phase)
**Requirements**: CALC-01, CALC-02, CALC-03, CALC-04, CALC-05, CALC-06
**Success Criteria** (what must be TRUE):
  1. Executar `npx vitest run tests/calculadoras/` passa 100% dos testes sem falha
  2. Cada calculadora tem pelo menos um teste com valor de entrada e resultado esperado fixos (ex: multa 2% sobre R$ 1.000 = R$ 20,00; retenção distrato 25% sobre R$ 200.000 = R$ 50.000,00)
  3. Nenhum arquivo de cálculo usa operações de ponto flutuante nativo — decimal.js com ROUND_HALF_UP está em uso em todos os módulos de cálculo
  4. A calculadora de reclamatória cobre os 3 cenários (sem justa causa, justa causa, pedido de demissão) incluindo FGTS+40% e reflexos sobre verbas variáveis
**Plans**: 6 plans

Plans:
- [x] 01-01-PLAN.md — Infraestrutura: Vitest + decimal.js + decimal-utils.ts (CALC-06)
- [x] 01-02-PLAN.md — Calculadora condominial: multa 2%, juros 1%/mes, honorarios 30% (CALC-01)
- [x] 01-03-PLAN.md — Calculadora distrato: retencao 25%/50%, Lei 13.786/2018 (CALC-02)
- [x] 01-04-PLAN.md — Calculadora aluguel: IGP-M, IPCA, INPC, reajuste acumulado (CALC-03)
- [x] 01-05-PLAN.md — Calculadora insalubridade/periculosidade: graus, NRs, reflexos (CALC-04)
- [x] 01-06-PLAN.md — Simulador reclamatoria: 3 cenarios, FGTS+40%, projecoes (CALC-05)

### Phase 2: Hooks Bloqueantes
**Goal**: Petições incompletas são rejeitadas com exit 1 antes de chegarem ao Claude, e essa garantia é verificada por testes automatizados
**Depends on**: Phase 1
**Requirements**: HOOK-01, HOOK-02, HOOK-03, HOOK-04, HOOK-05
**Success Criteria** (what must be TRUE):
  1. Tentar submeter uma petição sem endereçamento, sem qualificação das partes ou sem pedidos retorna exit 1 com mensagem de erro legível identificando o elemento ausente
  2. Tentar submeter uma petição condominial sem planilha de débitos ou uma trabalhista sem verbas retorna exit 1 por validação de tipo
  3. Executar `bats tests/hooks/` passa todos os cenários: petição completa retorna exit 0, petição incompleta retorna exit 1, petição vazia retorna exit 1
  4. Nenhuma petição válida é bloqueada pelo hook (zero falsos positivos nos fixtures de petição completa)
**Plans**: TBD

### Phase 3: Linter Jurídico
**Goal**: O corpus de commands e agentes é auditável — referências legais estão catalogadas e a estrutura obrigatória de cada command é verificável automaticamente
**Depends on**: Phase 2
**Requirements**: LINT-01, LINT-02, LINT-03, LINT-04
**Success Criteria** (what must be TRUE):
  1. Executar o script de extração produz catálogo estruturado com todas as leis, súmulas e artigos referenciados nos 48 commands e 6 agentes
  2. Executar a validação estrutural lista qualquer command que não possua as seções obrigatórias "Quando Usar", "Informações Necessárias" e "Fundamentação Legal"
  3. O script de consistência detecta e reporta divergências de formato entre commands (datas, valores monetários, citação de normas)
  4. Existe um checklist de revisão trimestral com as fontes de mudança mais relevantes (súmulas TST, atualizações CPC, reforma trabalhista) pronto para uso humano
**Plans**: TBD

### Phase 4: Radar de Prazos
**Goal**: O advogado pode calcular qualquer prazo processual em dias úteis com exclusão automática de feriados e recesso forense, e recebe alertas de proximidade
**Depends on**: Phase 3
**Requirements**: PRAZO-01, PRAZO-02, PRAZO-03, PRAZO-04
**Success Criteria** (what must be TRUE):
  1. Dado um evento processual e um prazo em dias (ex: 15 dias para contestar a partir de uma data), o command retorna a data final contando apenas dias úteis conforme CPC art. 219
  2. Feriados nacionais e o recesso forense (20/dez a 20/jan, art. 220 CPC) são excluídos automaticamente da contagem sem necessidade de configuração manual
  3. O command sinaliza explicitamente quando o prazo está a 3 dias úteis, a 1 dia útil ou já vencido na data da consulta
  4. A regra de exclusão do dia inicial e inclusão do dia final (CPC art. 224) é aplicada corretamente e pode ser verificada com exemplos de data conhecidos
**Plans**: TBD

### Phase 5: Extrator de Dados
**Goal**: O advogado consegue extrair dados estruturados de holerites, CTPS e contratos para alimentar calculadoras e petições sem redigitação manual
**Depends on**: Phase 4
**Requirements**: EXTR-01, EXTR-02, EXTR-03
**Success Criteria** (what must be TRUE):
  1. Fornecer um holerite ao command retorna os campos necessários para a calculadora de reclamatória (salário base, verbas variáveis, descontos) em formato estruturado
  2. Fornecer uma CTPS ao command retorna histórico de empregos com datas de admissão/demissão, empregadores e cargos identificados
  3. Fornecer um contrato ao command retorna as cláusulas-chave (partes, objeto, valor, prazo, penalidade, reajuste) em formato diretamente utilizável em petições
**Plans**: TBD

### Phase 6: Pacote Construtoras
**Goal**: O escritório pode atender construtoras com cinco commands especializados cobrindo desde o memorial de incorporação até o habite-se
**Depends on**: Phase 5
**Requirements**: CONST-01, CONST-02, CONST-03, CONST-04, CONST-05
**Success Criteria** (what must be TRUE):
  1. O command de memorial de incorporação gera estrutura completa conforme Lei 4.591/64 com todas as cláusulas obrigatórias presentes
  2. O command de quadro de áreas produz tabela compatível com NBR 12.721 discriminando área privativa, comum proporcional e total da unidade
  3. O command de patrimônio de afetação orienta sobre a segregação patrimonial conforme Lei 10.931/2004 com os atos necessários identificados
  4. O command de contrato-padrão de venda inclui quadro-resumo com os elementos exigidos pelo CDC e Lei 4.591/64
  5. O command de checklist de habite-se lista todos os documentos e requisitos para regularização final da obra em sequência lógica de obtenção
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Calculadoras Blindadas | 5/6 | In Progress|  |
| 2. Hooks Bloqueantes | 0/? | Not started | - |
| 3. Linter Jurídico | 0/? | Not started | - |
| 4. Radar de Prazos | 0/? | Not started | - |
| 5. Extrator de Dados | 0/? | Not started | - |
| 6. Pacote Construtoras | 0/? | Not started | - |
