---
phase: 01-calculadoras-blindadas
plan: "04"
subsystem: calculadoras
tags: [tdd, aluguel, reajuste, igpm, ipca, inpc, decimal]
dependency_graph:
  requires: ["01-01"]
  provides: ["calcularReajusteAluguel", "calcularReajusteAcumulado", "calcularComparativoAluguel"]
  affects: []
tech_stack:
  added: []
  patterns: ["TDD red-green", "decimal.js ROUND_HALF_UP", "negative index guard"]
key_files:
  created:
    - src/calculadoras/aluguel.ts
    - tests/calculadoras/aluguel.test.ts
  modified: []
decisions:
  - "Indice negativo bloqueado por padrao (permitirReducao=false) alinhado com pratica contratual brasileira"
  - "Reajuste acumulado por produto de fatores sequenciais, nao soma dos percentuais"
  - "calcularComparativoAluguel exposto como funcao separada para composabilidade"
metrics:
  duration: "~10 min"
  completed: "2026-03-28"
  tasks_completed: 2
  files_created: 2
  tests_passing: 11
---

# Phase 01 Plan 04: Calculadora Aluguel (Reajuste) Summary

**One-liner:** Reajuste de aluguel por IGP-M/IPCA/INPC com decimal.js, guard para indice negativo e acumulado por produto de fatores.

## What Was Built

Implementacao TDD completa da calculadora de reajuste de aluguel cobrindo os tres indices contratuais mais comuns no mercado imobiliario brasileiro.

### Functions Exported

| Funcao | Descricao |
|--------|-----------|
| `calcularReajusteAluguel` | Reajuste simples por um indice (IGP-M, IPCA ou INPC) |
| `calcularReajusteAcumulado` | Reajuste acumulado por produto de fatores anuais |
| `calcularComparativoAluguel` | Comparativo lado a lado dos 3 indices |

### Interfaces Exported

- `AluguelInput` — valorAtual, indice, percentualIndice, permitirReducao?
- `AluguelAcumuladoInput` — valorAtual, fatoresAnuais[], permitirReducao?
- `AluguelComparativoInput` — valorAtual, percentuaisIndices, permitirReducao?
- `AluguelResult` — valorAtual, indice, percentualAplicado, novoValor, diferenca, variacaoPercentual
- `AluguelComparativoResult` — valorAtual, resultados, maisVantajoso
- `IndiceAluguel` — 'IGP-M' | 'IPCA' | 'INPC'

## Test Results

```
npx vitest run tests/calculadoras/aluguel.test.ts
11 passed | 0 failed
```

### Test Cases

| Case | Scenario | Expected | Result |
|------|----------|----------|--------|
| 1 | IGP-M 10% sobre R$ 2.000 | novoValor="2200.00" | PASS |
| 2 | IPCA 5.79% sobre R$ 3.000 | novoValor="3173.70" | PASS |
| 3 | INPC 4.2% sobre R$ 1.500 | novoValor="1563.00" | PASS |
| 4 | IGP-M -3% sem permitirReducao | novoValor="2000.00" | PASS |
| 5 | IGP-M -3% com permitirReducao=true | novoValor="1940.00" | PASS |
| 6 | Centavos — floating point trap | novoValor="1846.78" | PASS |
| 7 | Indice negativo (default=false) | novoValor="2000.00" | PASS |
| 8 | Acumulado [10%, 5%] — produto 2310 nao 2300 | novoValor="2310.00" | PASS |
| 9 | Acumulado [5%, 3.5%, 8.2%] sobre R$ 1.000 | novoValor="1175.86" | PASS |
| 10 | Acumulado com fator negativo bloqueado | novoValor="2100.00" | PASS |
| 11 | Comparativo 3 indices maisVantajoso=IGP-M | maisVantajoso="IGP-M" | PASS |

## Key Decisions

### 1. Indice negativo bloqueado por padrao (permitirReducao=false)

O IGP-M pode ter variacao negativa. O command `calculadora-aluguel.md` documenta que "aluguel NAO pode ser reduzido (controverso)". A implementacao trata isso explicitamente: por padrao `permitirReducao=false`, e o novo valor nao pode ser menor que o atual. A flag `permitirReducao=true` esta disponivel para contratos que permitam reducao.

### 2. Reajuste acumulado por produto, nao por soma

Para periodos sem reajuste, a formula correta e:
```
valorFinal = valorAtual x fator1 x fator2 x fatorN
```
E NAO:
```
valorFinal = valorAtual x (1 + (indice1 + indice2 + ... + indiceN) / 100)
```
Isso e matematicamente correto e impede distorcao nos calculos judiciais.

## Deviations from Plan

None — plano executado exatamente como escrito.

Os 6 casos obrigatorios do plano foram implementados, mais 5 casos adicionais cobrindo INPC isolado, floating point, acumulado 3 anos, acumulado com negativo bloqueado e indice negativo default.

## Self-Check: PASSED

| Item | Status |
|------|--------|
| src/calculadoras/aluguel.ts | FOUND |
| tests/calculadoras/aluguel.test.ts | FOUND |
| 01-04-SUMMARY.md | FOUND |
| Commit 21f7dcb (RED tests) | FOUND |
| Commit a64f058 (GREEN impl) | FOUND |
| 11 tests passing | CONFIRMED |
