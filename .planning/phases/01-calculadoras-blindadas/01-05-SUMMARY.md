---
phase: 01-calculadoras-blindadas
plan: "05"
subsystem: calculadoras/trabalhista
tags: [tdd, trabalhista, insalubridade, periculosidade, reflexos, decimal-utils]

dependency_graph:
  requires:
    - "01-01: decimal-utils.ts (arredondar, porcentagem, multiplicar, somar, toDecimal)"
  provides:
    - "calcularInsalubridade: adicional mensal e total + reflexos sobre salario minimo"
    - "calcularPericulosidade: adicional mensal e total + reflexos sobre salario-base"
    - "calcularReflexos: ferias+1/3, 13 proporcional, FGTS 8% sobre totalAdicional"
    - "calcularMaisVantajoso: comparativo sem cumulatividade (art. 193 §2 CLT)"
  affects: []

tech_stack:
  added: []
  patterns:
    - "TDD: RED (teste sem modulo) → GREEN (implementacao passa 10/10)"
    - "Arredondamento contabil por linha antes de somar totais"
    - "Constantes nomeadas para graus de insalubridade"
    - "Decimal.js com ROUND_HALF_UP para toda aritmetica"

key_files:
  created:
    - src/calculadoras/trabalhista.ts
    - tests/calculadoras/trabalhista.test.ts
  modified: []

decisions:
  - "Arredondar cada reflexo individualmente antes de somar totalReflexos (padrao contabil — soma de valores ja arredondados, nao de valores precisos)"
  - "calcularReflexos aceita adicionalMensal como number (nao TrabalhistaResult) para uso isolado nos testes"
  - "MaisVantajosoResult extende TrabalhistaResult adicionando maisVantajoso e aviso"

metrics:
  duration: "~10 minutos"
  completed: "2026-03-28T21:03:51Z"
  tasks_completed: 2
  files_created: 2
  tests_passing: 10
---

# Phase 01 Plan 05: Calculadora Insalubridade/Periculosidade Summary

**One-liner:** Insalubridade (3 graus sobre salario minimo) e periculosidade (30% salario-base) com reflexos e regra de nao-cumulatividade do art. 193 §2 CLT, usando decimal.js ROUND_HALF_UP.

## Funcoes Exportadas

| Funcao | Assinatura | Descricao |
|--------|-----------|-----------|
| `calcularInsalubridade` | `(InsalubridadeInput) => TrabalhistaResult` | Base = salarioMinimo x grau; reflexos inclusos |
| `calcularPericulosidade` | `(PericulosidadeInput) => TrabalhistaResult` | Base = salarioBase x 30% (Sumula 191 TST); reflexos inclusos |
| `calcularReflexos` | `(ReflexosInput) => TrabalhistaResult` | Reflexos isolados a partir de adicionalMensal externo |
| `calcularMaisVantajoso` | `(TrabalhistaResult, TrabalhistaResult) => MaisVantajosoResult` | Retorna o mais vantajoso sem cumular |

## Constantes Exportadas

```typescript
export const GRAUS_INSALUBRIDADE = {
  minimo: 10,   // 10% do salario minimo — art. 192 CLT
  medio: 20,    // 20% do salario minimo
  maximo: 40,   // 40% do salario minimo
} as const

export const AVISO_NAO_CUMULAM =
  'Art. 193 §2 CLT — insalubridade e periculosidade nao cumulam: empregado escolhe o mais vantajoso'
```

## Regra de Nao-Cumulatividade

Art. 193 §2 CLT: empregado nao pode receber insalubridade E periculosidade ao mesmo tempo.
`calcularMaisVantajoso()` compara `adicionalMensal` dos dois adicionais e retorna apenas o maior,
incluindo o campo `aviso` com a referencia legal.

## Formulas Implementadas

```
Insalubridade mensal = salarioMinimo × (grau / 100)
Periculosidade mensal = salarioBase × 0.30
totalAdicional = adicionalMensal × meses

reflexoFerias  = adicionalMensal × (4/3)   [ferias + 1/3 constitucional — Sumula 132 TST]
reflexo13      = adicionalMensal            [proporcional — totalAdicional / 12]
reflexoFGTS    = totalAdicional × 0.08     [FGTS sobre totalAdicional]

totalReflexos  = sum(round(reflexoFerias), round(reflexo13), round(reflexoFGTS))
totalGeral     = round(totalAdicional) + round(totalReflexos)
```

## Resultados dos Testes

```
npx vitest run tests/calculadoras/trabalhista.test.ts
Test Files  1 passed (1)
Tests       10 passed (10)
```

| Caso | Entrada | Esperado | Status |
|------|---------|----------|--------|
| Insalubridade grau minimo (10%) | salMin=1412, meses=12 | adicionalMensal="141.20" | PASS |
| Insalubridade grau medio (20%) | salMin=1412, meses=12 | adicionalMensal="282.40" | PASS |
| Insalubridade grau maximo (40%) | salMin=1412, meses=12 | adicionalMensal="564.80" | PASS |
| Periculosidade 30% | salBase=3000, meses=12 | adicionalMensal="900.00" | PASS |
| Periculosidade 30% | salBase=5000, meses=6 | adicionalMensal="1500.00" | PASS |
| Reflexos grau medio | adicMensal=282.40, meses=12 | reflexoFerias="376.53", reflexo13="282.40", reflexoFGTS="271.10", totalReflexos="930.03" | PASS |
| Reflexo FGTS isolado | adicMensal=900, meses=12 | reflexoFGTS="864.00" | PASS |
| Mais vantajoso: periculosidade | salBase=4000 | maisVantajoso="periculosidade" (1200 > 564.80) | PASS |
| Mais vantajoso: insalubridade | salBase=1500 | maisVantajoso="insalubridade" (564.80 > 450) | PASS |
| Nao cumulam — aviso | grau medio vs periculosidade | aviso contem "193" | PASS |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Rounding order for totalReflexos**
- **Found during:** Task 2 GREEN (1 test failing: expected "930.03" got "930.04")
- **Issue:** Summing precise Decimal values before rounding gives 376.5333... + 282.40 + 271.104 = 930.0373... → rounds to "930.04". Test spec expects sum of already-rounded values (376.53 + 282.40 + 271.10 = 930.03).
- **Fix:** Round each reflexo individually first, then sum the rounded strings — matches standard accounting practice and the test specification.
- **Files modified:** src/calculadoras/trabalhista.ts
- **Commit:** 3eeb525

## Self-Check: PASSED

- src/calculadoras/trabalhista.ts: FOUND
- tests/calculadoras/trabalhista.test.ts: FOUND
- Commit 1ac2321 (RED tests): FOUND
- Commit 3eeb525 (GREEN implementation): FOUND
- 10/10 tests passing: CONFIRMED
