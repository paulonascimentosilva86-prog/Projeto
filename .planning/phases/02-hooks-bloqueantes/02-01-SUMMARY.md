---
phase: "02"
plan: "01"
subsystem: hooks
tags: [validation, shell, bats, fixtures, bloqueante]
dependency_graph:
  requires: []
  provides: [hook-bloqueante, fixtures-peticao]
  affects: [claude-code-juridico/hooks/validar-peticao.sh]
tech_stack:
  added: [bats@1.13.0]
  patterns: [exit-code-as-validation, grep-pattern-matching, fixture-based-testing]
key_files:
  created:
    - tests/hooks/fixtures/peticao-completa.txt
    - tests/hooks/fixtures/peticao-sem-enderecamento.txt
    - tests/hooks/fixtures/peticao-sem-qualificacao.txt
    - tests/hooks/fixtures/peticao-sem-pedidos.txt
    - tests/hooks/fixtures/peticao-vazia.txt
    - tests/hooks/fixtures/peticao-condominial-completa.txt
    - tests/hooks/fixtures/peticao-condominial-sem-planilha.txt
    - tests/hooks/fixtures/peticao-trabalhista-completa.txt
    - tests/hooks/fixtures/peticao-trabalhista-sem-verbas.txt
  modified:
    - claude-code-juridico/hooks/validar-peticao.sh
    - package.json
decisions:
  - "Hook reescrito de exit 0 incondicional para exit 1 bloqueante em elementos ausentes"
  - "Validacao por tipo (condominial/trabalhista) adicionada com deteccao via grep"
  - "9 fixtures cobrem todos os casos de validacao (completos + cada elemento ausente)"
metrics:
  duration: "~15 min"
  completed: "2026-03-30"
  tasks_completed: 3
  files_created: 9
  files_modified: 3
---

# Phase 02 Plan 01: Infra BATS + Hook Bloqueante + Fixtures Summary

Hook `validar-peticao.sh` refatorado de alertas informativos (exit 0) para validacao bloqueante (exit 1) com 9 fixtures de peticoes cobrindo todos os cenarios de validacao e BATS instalado como devDependency.

## Tasks Completed

| # | Task | Status | Commit |
|---|------|--------|--------|
| 1 | Instalar BATS e criar estrutura | Done | 1e9f27b |
| 2 | Criar 9 fixtures de peticoes | Done | 1e9f27b |
| 3 | Refatorar validar-peticao.sh bloqueante | Done | 1e9f27b |

## What Was Built

### Hook Bloqueante (validar-peticao.sh)

Reescrita completa do hook de validacao:

- **Antes:** exit 0 sempre, alertas `[ALERTA]` apenas informativos
- **Depois:** exit 1 imediato quando elemento ausente, mensagens `[ERRO]` descritivas

Elementos validados:
1. **Arquivo** — vazio/inexistente → exit 1
2. **Enderecamento** (HOOK-01) — grep: `excelentissimo|exmo|meritissimo|juiz.*vara|tribunal|comarca|foro`
3. **Qualificacao** (HOOK-02) — grep: `CPF|CNPJ|brasileiro|brasileira|nacionalidade|estado civil|portador`
4. **Pedidos** (HOOK-03) — grep: `dos pedidos|requer|ante o exposto|pede deferimento`
5. **Tipo condominial** (HOOK-04) — exige `planilha|discrimina`
6. **Tipo trabalhista** (HOOK-04) — exige `verbas|FGTS|rescisoria|horas extras|salario`

### Fixtures de Teste

9 arquivos em `tests/hooks/fixtures/`:

| Fixture | Tipo | Resultado esperado |
|---------|------|--------------------|
| peticao-completa.txt | Civel completa | exit 0 |
| peticao-sem-enderecamento.txt | Sem cabecalho | exit 1 |
| peticao-sem-qualificacao.txt | Sem CPF/nacionalidade | exit 1 |
| peticao-sem-pedidos.txt | Sem secao pedidos | exit 1 |
| peticao-vazia.txt | 0 bytes | exit 1 |
| peticao-condominial-completa.txt | Condominial + planilha | exit 0 |
| peticao-condominial-sem-planilha.txt | Condominial sem planilha | exit 1 |
| peticao-trabalhista-completa.txt | Trabalhista + verbas | exit 0 |
| peticao-trabalhista-sem-verbas.txt | Trabalhista sem verbas | exit 1 |

### BATS Instalado

`bats@1.13.0` adicionado como devDependency no `package.json` raiz para suportar testes de shell em planos subsequentes.

## Verification Results

Todos os 9 fixtures testados com comportamento correto:

```
peticao-completa.txt           → [VALIDACAO] ✓ Peticao validada com sucesso  (exit 0)
peticao-vazia.txt              → [ERRO] Arquivo vazio ou inexistente           (exit 1)
peticao-sem-enderecamento.txt  → [ERRO] Elemento essencial ausente: Enderecamento (exit 1)
peticao-sem-qualificacao.txt   → [ERRO] Elemento essencial ausente: Qualificacao das partes (exit 1)
peticao-sem-pedidos.txt        → [ERRO] Elemento essencial ausente: Pedidos   (exit 1)
peticao-condominial-completa.txt → [VALIDACAO] ✓ Peticao validada com sucesso (exit 0)
peticao-condominial-sem-planilha.txt → [ERRO] Validacao de tipo: peticao condominial exige planilha de debito (exit 1)
peticao-trabalhista-completa.txt → [VALIDACAO] ✓ Peticao validada com sucesso (exit 0)
peticao-trabalhista-sem-verbas.txt → [ERRO] Validacao de tipo: peticao trabalhista exige verbas rescisorias (exit 1)
```

## Decisions Made

1. **Hook bloqueante em vez de alertas:** A semantica de exit 0 incondicional tornava o hook inutil como gate de qualidade. Exit 1 com mensagem descritiva permite uso em CI e pre-commit hooks.

2. **grep -qi com `-E` para qualificacao:** A pattern de qualificacao usa `grep -qiE` para suportar alternativas com `|` sem necessidade de escape com `\|`, mais legivel.

3. **Validacao de tipo apos elementos essenciais:** A ordem de validacao garante que erros de elementos essenciais sejam reportados antes da validacao de tipo, evitando mensagens de erro enganosas.

## Deviations from Plan

None - plan executed exactly as written.

## Known Stubs

None.

## Requirements Satisfied

- HOOK-01: Hook bloqueante para peticoes sem enderecamento
- HOOK-02: Hook bloqueante para peticoes sem qualificacao
- HOOK-03: Hook bloqueante para peticoes sem pedidos
- HOOK-04: Validacao por tipo (condominial exige planilha, trabalhista exige verbas)

## Self-Check: PASSED
