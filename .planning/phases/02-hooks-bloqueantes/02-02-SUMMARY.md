---
phase: "02"
plan: "02"
subsystem: "tests/hooks"
tags: [bats, testes, hook, validacao, peticao]
dependency_graph:
  requires: [02-01]
  provides: [HOOK-05]
  affects: [claude-code-juridico/hooks/validar-peticao.sh]
tech_stack:
  added: [bats 1.13.0]
  patterns: [shell-testing, fixture-based-tests]
key_files:
  created:
    - tests/hooks/validar-peticao.bats
  modified: []
decisions:
  - Assertions com OR (||) para maior flexibilidade com maiusculas/minusculas
  - Fixtures preexistentes reutilizadas sem modificacao
metrics:
  duration: "~5min"
  completed: "2026-03-30T15:36:00Z"
  tasks_completed: 3
  files_created: 1
  files_modified: 0
---

# Phase 02 Plan 02: Testes BATS para Hook de Peticao Summary

Suite BATS com 11 cenarios cobrindo todos os paths do hook `validar-peticao.sh` com exit codes e mensagens de erro verificados.

## What Was Built

Suite de testes BATS em `tests/hooks/validar-peticao.bats` com cobertura completa do hook bloqueante de validacao de peticoes.

### Tests Criados (11/11 passing)

| # | Cenario | Exit | Assertion adicional |
|---|---------|------|---------------------|
| 1 | peticao civel completa | 0 | `validada` ou `VALIDACAO` no output |
| 2 | peticao condominial com planilha | 0 | - |
| 3 | peticao trabalhista com verbas | 0 | - |
| 4 | peticao vazia | 1 | - |
| 5 | sem enderecamento | 1 | `Enderecamento` no output |
| 6 | sem qualificacao | 1 | `Qualificacao` no output |
| 7 | sem pedidos | 1 | `Pedidos` no output |
| 8 | condominial sem planilha | 1 | `planilha` ou `Planilha` no output |
| 9 | trabalhista sem verbas | 1 | `verbas` ou `Verbas` no output |
| 10 | arquivo inexistente | 1 | - |
| 11 | sem argumento | 1 | - |

## Verification Results

- `npx bats tests/hooks/validar-peticao.bats`: 11/11 passed
- `npx vitest run`: 97/97 passed (sem regressao nas calculadoras)

## Deviations from Plan

None - plan executed exactly as written.

Fixtures preexistentes (`tests/hooks/fixtures/`) cobriram todos os 11 cenarios sem necessidade de criacao adicional. O BATS 1.13.0 ja estava disponivel via devDependency no `package.json`.

## Decisions Made

1. Assertions com OR (`||`) para aceitar tanto `Enderecamento` quanto `enderecamento` — evita fragilidade caso o hook mude casing no futuro.
2. Fixtures lidas e hook executado manualmente antes de escrever os testes para confirmar o output exato — assertions baseadas em output real, nao em suposicoes.

## Known Stubs

None.

## Self-Check: PASSED

- tests/hooks/validar-peticao.bats: FOUND
- Commit 0ac75f6: FOUND (test(02-02): suite BATS com 11 cenarios para hook de peticao)
