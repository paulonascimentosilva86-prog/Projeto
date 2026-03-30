---
phase: 01-calculadoras-blindadas
plan: "02"
subsystem: calculadoras
tags: [tdd, condominial, decimal.js, typescript, vitest]
dependency_graph:
  requires: ["01-01"]
  provides: ["calcularCondominial", "CondominialInput", "CondominialResult"]
  affects: ["calculadora-condominial command"]
tech_stack:
  added: []
  patterns: ["TDD red-green", "decimal.js ROUND_HALF_UP", "pure functions"]
key_files:
  created:
    - src/calculadoras/condominial.ts
    - tests/calculadoras/condominial.test.ts
  modified: []
decisions:
  - "Correcao calculada como principal * (fatorINPC - 1) nao como correcao composta"
  - "Juros incidem sobre (principal + multa) conforme formula do command original"
  - "Arredondamento intermediario nao aplicado — apenas no resultado final via arredondar()"
metrics:
  duration: "~10 minutes"
  completed: "2026-03-28"
  tasks_completed: 2
  files_created: 2
---

# Phase 01 Plan 02: Calculadora Condominial TDD Summary

Implemented `calcularCondominial()` as a pure TypeScript function using TDD (red-green cycle) with decimal.js via decimal-utils utilities. All 24 tests pass with deterministic values covering minimum, typical, floating-point trap, and extreme cases.

## Functions Exported

**File:** `src/calculadoras/condominial.ts`

- `CondominialInput` — interface: `{ principal: number, mesesAtraso: number, fatorINPC: number }`
- `CondominialResult` — interface: `{ principal, multa, juros, correcao, subtotal, honorarios, total }` (all strings)
- `calcularCondominial(input: CondominialInput): CondominialResult` — pure function, no side effects

## Formula Chain Implemented

```
multa     = Principal × 2%                           (art. 1.336, §1° CC)
juros     = (Principal + Multa) × 1% × meses_atraso
correcao  = Principal × (fatorINPC - 1)              (ex: fatorINPC=1.05 → 5% INPC)
subtotal  = Principal + Multa + Juros + Correcao
honorarios = Subtotal × 30%
total      = Subtotal + Honorarios
```

All arithmetic uses `decimal-utils.ts` functions (`porcentagem`, `multiplicar`, `somar`, `toDecimal`, `arredondar`). No native JS arithmetic operators used in calculations.

## Test Cases Covered (24 passed)

| Caso | Principal | Meses | fatorINPC | Multa | Juros | Correcao | Total |
|------|-----------|-------|-----------|-------|-------|----------|-------|
| Minimo | R$1.000,00 | 1 | 1.00 | 20.00 | 10.20 | 0.00 | 1.339,26 |
| Tipico | R$1.000,00 | 6 | 1.05 | 20.00 | 61.20 | 50.00 | 1.470,56 |
| Centavos | R$1.333,33 | 1 | 1.00 | 26.67 | 13.60 | 0.00 | 1.785,68 |
| Extremo | R$50.000,00 | 60 | 1.40 | 1.000,00 | 30.600,00 | 20.000,00 | 132.080,00 |

## Values Verified

- Multa 2% sobre R$ 1.000,00 = R$ 20,00 (confirmed by test)
- Juros 1%/mes verificado em 1, 6 e 60 meses diferentes
- Honorarios 30% calculados sobre subtotal (nao sobre principal)
- Ponto flutuante tratado: 1333.33 * 0.02 = 26.67 (arredondamento ROUND_HALF_UP)

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None — all values are computed from real formula, no hardcoded outputs.

## Self-Check: PASSED

- `src/calculadoras/condominial.ts` exists
- `tests/calculadoras/condominial.test.ts` exists
- Commit `03daaaa` (RED test) confirmed in git log
- Commit `4805e73` (GREEN implementation) confirmed in git log
- `npx vitest run tests/calculadoras/condominial.test.ts`: 24 passed | 0 failed
