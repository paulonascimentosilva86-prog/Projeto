---
phase: 01-calculadoras-blindadas
plan: "06"
subsystem: testing
tags: [trabalhista, reclamatoria, vitest, decimal.js, tdd, calculadora]

requires:
  - phase: 01-01
    provides: decimal-utils.ts with arredondar/porcentagem/somar/toDecimal

provides:
  - calcularReclamatoria() function with 3 cenarios (sem_justa_causa, justa_causa, pedido_demissao)
  - 3 projecoes (otimista 100%, realista 70%, acordo 55%)
  - VerbaRescisoria interface with inclui flag per cenario
  - ReclamatoriaInput/ReclamatoriaResult exported TypeScript interfaces
  - 36 deterministic test cases covering all scenarios

affects:
  - simulador-reclamatoria command (consumes this calculator)
  - any phase adding dano moral or reflexos to reclamatoria

tech-stack:
  added: []
  patterns:
    - "TDD RED/GREEN: test file committed before implementation"
    - "Cenario pattern: inclui=true/false flags on each VerbaRescisoria per scenario"
    - "Named constants: PROJECOES and HONORARIOS_PCT at module level"
    - "Aviso previo proporcional: calcularDiasAvisoPrevio exported for reuse"

key-files:
  created:
    - src/calculadoras/reclamatoria.ts
    - tests/calculadoras/reclamatoria.test.ts
  modified: []

key-decisions:
  - "Honorarios 10% sobre subtotal (media art. 223-G CLT 5-15%), aplicados antes das projecoes"
  - "Ferias vencidas separadas de proporcionais: ambas existem no array verbas mas inclui varia por cenario"
  - "mesesNoAno = meses % 12 === 0 ? 12 : meses % 12 para tratar anos completos corretamente"
  - "horasExtrasMensais: inclui=false quando undefined, valor total = mensais * mesesTrabalhados"

patterns-established:
  - "Cenario-based inclui flag: cada verba presente no array mas inclui=false quando nao aplicavel"
  - "Subtotal calculado apenas sobre verbas com inclui=true"

requirements-completed:
  - CALC-05

duration: 12min
completed: 2026-03-28
---

# Phase 01 Plan 06: Simulador Reclamatoria Trabalhista TDD Summary

**Simulador de reclamatoria trabalhista com 3 cenarios (sem_justa_causa/justa_causa/pedido_demissao), aviso previo proporcional Lei 12.506/2011, FGTS+40%, honorarios 10% e projecoes otimista/realista/acordo**

## Performance

- **Duration:** 12 min
- **Started:** 2026-03-28T21:03:00Z
- **Completed:** 2026-03-28T21:15:00Z
- **Tasks:** 2 (RED + GREEN)
- **Files modified:** 2

## Accomplishments

- Implementou `calcularReclamatoria()` com logica de cenarios deterministica via array `VerbaRescisoria` com flag `inclui`
- Aviso previo proporcional Lei 12.506/2011: 30 + 3 dias/ano, maximo 90 dias, com helper `calcularDiasAvisoPrevio` exportado
- Suite completa de 6 arquivos: 97 testes passando (0 falhas) apos adicionar 36 novos casos

## Task Commits

Cada task foi commitada atomicamente:

1. **Task 1: RED — Criar testes para calcularReclamatoria** - `5c6b0aa` (test)
2. **Task 2: GREEN — Implementar calcularReclamatoria** - `3ea10aa` (feat)

## Files Created/Modified

- `/home/user/Projeto/src/calculadoras/reclamatoria.ts` - Implementacao completa com 3 cenarios, projecoes e honorarios
- `/home/user/Projeto/tests/calculadoras/reclamatoria.test.ts` - 36 casos deterministicos cobrindo todos os cenarios

## Decisions Made

- Honorarios 10% aplicados sobre subtotal (media do intervalo 5-15% do art. 223-G CLT) antes das projecoes
- `VerbaRescisoria.inclui` flag: toda verba existe no array em todos os cenarios; `inclui=false` sinaliza nao aplicavel — torna cenario facilmente introspectavel
- Ferias vencidas e proporcionais separadas para suportar justa causa (somente vencidas) vs demais cenarios
- `horasExtrasMensais * mesesTrabalhados` como total acumulado do contrato (sem reflexos adicionais neste plano)
- Projecao acordo = 55% do totalBruto (dentro do intervalo 50-60% especificado no command original)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None — todos os 36 testes passaram na primeira execucao do GREEN.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- `calcularReclamatoria()` pronta para consumo pelo command `/simulador-reclamatoria`
- Reflexos de horas extras (ferias, 13o, FGTS) nao implementados neste plano — horasExtrasMensais usa valor total direto; um plano futuro pode expandir com reflexos detalhados
- Suite completa em 97 testes, base solida para expansoes futuras

---
*Phase: 01-calculadoras-blindadas*
*Completed: 2026-03-28*
