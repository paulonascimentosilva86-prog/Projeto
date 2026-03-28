---
phase: 01-calculadoras-blindadas
plan: "03"
subsystem: testing
tags: [decimal.js, vitest, tdd, distrato, imobiliario, lei-13786]

# Dependency graph
requires:
  - phase: 01-01
    provides: decimal-utils.ts with arredondar, porcentagem, multiplicar, somar, toDecimal
provides:
  - calcularDistrato() cobrindo 3 cenarios Lei 13.786/2018
  - DistratoInput e DistratoResult interfaces tipadas
  - Suite de 9 testes deterministicos com valores fixos
affects: [01-04, 01-05, 01-06, calculadora-distrato command]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "TDD Red-Green: testes escritos e commitados antes da implementacao"
    - "Arredondamento por linha de calculo (ROUND_HALF_UP em retencao antes de usar em deducoes)"
    - "valorDevolver minimo zero para evitar valores negativos em calculos legais"

key-files:
  created:
    - src/calculadoras/distrato.ts
    - tests/calculadoras/distrato.test.ts
  modified: []

key-decisions:
  - "Retencao e arredondada (ROUND_HALF_UP) antes de ser usada nas deducoes — cada linha do calculo e apresentada arredondada, como num laudo pericial"
  - "Taxa de fruicao aplicada somente em desistencia_comprador (nao em arrependimento nem atraso construtora)"
  - "Em atraso_construtora a corretagem retorna como R$ 0.00 — a construtora nao deduz comissao ao devolver"
  - "Arrependimento em 7 dias: sem nenhuma deducao — nem corretagem, nem fruicao"

patterns-established:
  - "Roundtrip por linha: cada valor monetario calculado e arredondado antes de participar de calculos subsequentes"

requirements-completed:
  - CALC-02

# Metrics
duration: 4min
completed: 2026-03-28
---

# Phase 01 Plan 03: Calculadora Distrato Imobiliario Summary

**calcularDistrato() implementada com TDD cobrindo 3 cenarios da Lei 13.786/2018: retenção 25% (regime comum), 50% (patrimônio afetação), devolução integral com INCC/multa (atraso construtora) e arrependimento 7 dias**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-28T21:01:52Z
- **Completed:** 2026-03-28T21:03:40Z
- **Tasks:** 2 (RED + GREEN)
- **Files modified:** 2

## Accomplishments

- 9 testes deterministicos cobrindo todos os cenarios da Lei 13.786/2018 com valores fixos
- Regime comum: retencao maxima 25% + prazo 180 dias (art. 67-A §5o)
- Patrimonio afetacao: retencao maxima 50% + prazo 30 dias apos habite-se (art. 67-A §2o)
- Atraso construtora: devolucao integral + correcao INCC + multa contratual + prazo 60 dias
- Arrependimento 7 dias: devolucao integral sem deducoes (art. 49 CDC + art. 67-A §10)
- Taxa de fruicao 0.5%/mes sobre valor do imovel deduzida corretamente
- valorDevolver nunca negativo (protecao contra super-deducao)

## Task Commits

1. **Task 1: RED — Criar testes para calcularDistrato** - `7f139d0` (test)
2. **Task 2: GREEN — Implementar calcularDistrato** - `f0c1843` (feat)

## Files Created/Modified

- `src/calculadoras/distrato.ts` — Funcao calcularDistrato exportando DistratoInput, DistratoResult e logica dos 3 cenarios
- `tests/calculadoras/distrato.test.ts` — 9 casos de teste deterministicos com valores fixos

## Decisions Made

- Retencao arredondada por linha antes de subtracoes subsequentes: na pratica juridica cada linha de um calculo e apresentada arredondada, e o valor a devolver deriva das linhas arredondadas — evita discrepancia entre laudo e calculo interno
- Taxa de fruicao excludente do cenario arrependimento e atraso construtora: logica legal — quem exerce arrependimento ou pleiteia por inadimplencia da construtora nao sofre taxa de uso
- Em atraso_construtora a comissaoCorretagem retorna zero no resultado: a construtora inadimplente nao tem direito a deduzir comissao

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Corrigido calculo decimal no caso com centavos**
- **Found during:** Task 2 (GREEN — implementar calcularDistrato)
- **Issue:** Teste esperava `81792.58` mas implementacao retornava `81792.59` — retencao `30864.195` era usada sem arredondamento nas deducoes, resultando em `81792.585` que arredonda para `.59`
- **Fix:** Adicionado `retencaoD = toDecimal(arredondar(retencaoD))` antes das deducoes — cada linha arredondada antes de uso
- **Files modified:** src/calculadoras/distrato.ts
- **Verification:** `npx vitest run tests/calculadoras/distrato.test.ts` 9 passed / 0 failed
- **Committed in:** f0c1843 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug — precisao decimal por linha de calculo)
**Impact on plan:** Fix necessario para precisao legal. Sem escopo adicional.

## Issues Encountered

None — apos correccao de arredondamento todos os testes passaram na primeira execucao.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- calcularDistrato() pronta para ser referenciada nos proximos planos de calculadoras
- Padrao TDD estabelecido para os planos 01-04, 01-05, 01-06
- Padrão de arredondamento por linha pode ser extraído para utility se necessário

---
*Phase: 01-calculadoras-blindadas*
*Completed: 2026-03-28*

## Self-Check: PASSED

- FOUND: src/calculadoras/distrato.ts
- FOUND: tests/calculadoras/distrato.test.ts
- FOUND: .planning/phases/01-calculadoras-blindadas/01-03-SUMMARY.md
- FOUND: 7f139d0 (RED tests commit)
- FOUND: f0c1843 (GREEN implementation commit)
- FOUND: 51a733c (docs metadata commit)
- npx vitest run tests/calculadoras/distrato.test.ts: 9 passed / 0 failed
