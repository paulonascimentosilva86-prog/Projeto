# Requirements — Claude Code Jurídico: Blindagem e Expansão

**Version:** v1
**Date:** 2026-03-28

---

## v1 Requirements

### Calculadoras (CALC)

- [x] **CALC-01**: Testes automatizados para calculadora condominial com valores conhecidos (multa 2%, juros 1%/mês, INPC, honorários 30%)
- [ ] **CALC-02**: Testes automatizados para calculadora de distrato imobiliário (retenção 25%/50%, Lei 13.786/2018)
- [x] **CALC-03**: Testes automatizados para calculadora de reajuste de aluguel (IGP-M, IPCA, INPC)
- [x] **CALC-04**: Testes automatizados para calculadora de insalubridade/periculosidade (graus, NRs, base de cálculo, reflexos)
- [ ] **CALC-05**: Testes automatizados para simulador de reclamatória (verbas rescisórias, FGTS+40%, reflexos, 3 cenários)
- [x] **CALC-06**: Usar decimal.js com ROUND_HALF_UP para precisão financeira em todos os cálculos

### Hooks (HOOK)

- [ ] **HOOK-01**: Hook bloqueante (exit 1) para petições sem endereçamento
- [ ] **HOOK-02**: Hook bloqueante (exit 1) para petições sem qualificação das partes
- [ ] **HOOK-03**: Hook bloqueante (exit 1) para petições sem pedidos
- [ ] **HOOK-04**: Validação por tipo de petição (condominial exige planilha, trabalhista exige verbas)
- [ ] **HOOK-05**: Testes do hook com BATS (petição completa, incompleta, vazia)

### Linter Jurídico (LINT)

- [ ] **LINT-01**: Script que extrai todas as referências legais dos 48 commands + 6 agentes em catálogo estruturado
- [ ] **LINT-02**: Validação de estrutura dos commands (seções obrigatórias: Quando Usar, Informações Necessárias, Fundamentação Legal)
- [ ] **LINT-03**: Verificação de consistência entre commands (formato de datas, valores, referências)
- [ ] **LINT-04**: Checklist de revisão trimestral de base legal (súmulas TST, reforma trabalhista, CPC)

### Radar de Prazos (PRAZO)

- [ ] **PRAZO-01**: Contagem de prazos em dias úteis (CPC art. 219)
- [ ] **PRAZO-02**: Calendário de feriados nacionais + recesso forense (20/dez a 20/jan, art. 220 CPC)
- [ ] **PRAZO-03**: Alertas por proximidade (3 dias úteis, 1 dia útil, vencido)
- [ ] **PRAZO-04**: Regra de exclusão do dia inicial e inclusão do dia final (art. 224 CPC)

### Extrator de Dados (EXTR)

- [ ] **EXTR-01**: Extração de dados de holerites → campos para cálculo trabalhista
- [ ] **EXTR-02**: Extração de dados de CTPS → histórico de empregos estruturado
- [ ] **EXTR-03**: Extração de dados de contratos → cláusulas-chave identificadas

### Construtoras (CONST)

- [ ] **CONST-01**: Command para memorial de incorporação (Lei 4.591/64)
- [ ] **CONST-02**: Command para quadro de áreas (NBR 12.721)
- [ ] **CONST-03**: Command para patrimônio de afetação (Lei 10.931/2004)
- [ ] **CONST-04**: Command para contrato-padrão de venda com quadro-resumo
- [ ] **CONST-05**: Command para checklist de habite-se

---

## v2 Requirements (Deferred)

- Workflow integrado entre commands (calculadora → notificação → execução)
- Vídeos Reels automáticos por command via Remotion
- Dashboard de Produtividade
- Simulador de Cenários Processuais
- Integração com APIs de índices (BCB/INPC em tempo real)

---

## Out of Scope

- Análise de Juiz/Vara (jurimetria) — depende de base de dados externa não disponível
- Mapeamento de Risco da Carteira — requer integração com sistema de gestão processual
- CRM/Captação de Leads — fora do escopo técnico do Claude Code
- Monitoramento INSS/eSocial — categoria de produto diferente
- Testes de conteúdo LLM — outputs não-determinísticos, testar estrutura apenas

---

## Traceability

| REQ-ID | Phase | Status |
|--------|-------|--------|
| CALC-01 | Phase 1 | Complete |
| CALC-02 | Phase 1 | Pending |
| CALC-03 | Phase 1 | Complete |
| CALC-04 | Phase 1 | Complete |
| CALC-05 | Phase 1 | Pending |
| CALC-06 | Phase 1 | Complete |
| HOOK-01 | Phase 2 | Pending |
| HOOK-02 | Phase 2 | Pending |
| HOOK-03 | Phase 2 | Pending |
| HOOK-04 | Phase 2 | Pending |
| HOOK-05 | Phase 2 | Pending |
| LINT-01 | Phase 3 | Pending |
| LINT-02 | Phase 3 | Pending |
| LINT-03 | Phase 3 | Pending |
| LINT-04 | Phase 3 | Pending |
| PRAZO-01 | Phase 4 | Pending |
| PRAZO-02 | Phase 4 | Pending |
| PRAZO-03 | Phase 4 | Pending |
| PRAZO-04 | Phase 4 | Pending |
| EXTR-01 | Phase 5 | Pending |
| EXTR-02 | Phase 5 | Pending |
| EXTR-03 | Phase 5 | Pending |
| CONST-01 | Phase 6 | Pending |
| CONST-02 | Phase 6 | Pending |
| CONST-03 | Phase 6 | Pending |
| CONST-04 | Phase 6 | Pending |
| CONST-05 | Phase 6 | Pending |

---

*Requirements defined: 2026-03-28*
*27 requirements across 6 categories*
*Traceability filled: 2026-03-28*
