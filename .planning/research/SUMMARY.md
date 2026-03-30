# Research Summary — Blindagem e Expansão

**Date:** 2026-03-28

## Key Findings

### Stack
- **Vitest 4.1.2** como framework principal (ESM nativo, compatível com Remotion/React 19)
- **decimal.js** para precisão financeira (evita floating point do JavaScript)
- **BATS 1.13.0** para testes de hooks Bash
- **remark/remark-parse** para validação estrutural dos 48 commands Markdown
- Snapshot testing para os 5 commands de maior volume

### Features — Table Stakes
1. **Testes de calculadoras** (5 calculadoras, valores determinísticos) — 2-4 dias
2. **Hooks bloqueantes** (exit 1 para elementos obrigatórios) — 1-2 dias
3. **Validação de referências legais** (catálogo grep + revisão humana trimestral) — 1-2 dias

### Features — Diferenciadores
4. **Radar de Prazos** (dias úteis, feriados, recesso forense) — 3-5 dias
5. **Extrator de Dados** (holerites, CTPS, contratos → dados estruturados) — 2-3 dias
6. **Pacote Construtoras** (5 commands: incorporação, quadro de áreas, patrimônio afetação) — 2-3 semanas

### Architecture
- 4 componentes testáveis: calculadoras (math), hooks (behavior), commands (structure), agentes (schema)
- Testes de commands usam **contract testing** (validar estrutura, não conteúdo LLM)
- Build order em 6 waves: hooks → calculadoras → hooks bloqueantes → commands → Remotion → legal linting
- Diretório: `tests/calculadoras/`, `tests/hooks/`, `tests/commands/`, `tests/agentes/`

### Pitfalls — Watch Out For
1. **Floating point** — `0.1 + 0.2 ≠ 0.3` em JS. Usar decimal.js com ROUND_HALF_UP
2. **Hook exit 0** — Validação atual não bloqueia nada. Urgente converter para exit 1
3. **Não testar conteúdo LLM** — Testar estrutura e math, nunca o texto gerado
4. **Referências legais envelhecem** — Súmulas TST, reforma trabalhista, CPC. Revisão trimestral
5. **Prazos em dias úteis** — CPC art. 219 exige dias úteis, não corridos. Recesso forense (Dec 20 - Jan 20)

## Risk Matrix

| Risk | Severity | Action |
|------|----------|--------|
| Calculadoras sem teste | CRITICAL | Phase 1 |
| Hooks não-bloqueantes | HIGH | Phase 1 |
| Referências legais desatualizadas | HIGH | Phase 2 |
| Prazos calculados errado | CRITICAL | Phase 3 (se implementar Radar) |

## Recommended Phase Structure

| Phase | Focus | Effort |
|-------|-------|--------|
| 1 | Testes de calculadoras + hooks bloqueantes | 1 semana |
| 2 | Validação de commands + referências legais | 1 semana |
| 3 | Radar de Prazos | 3-5 dias |
| 4 | Extrator de Dados | 2-3 dias |
| 5 | Pacote Construtoras | 2-3 semanas |

---

*Research synthesis: 2026-03-28*

Files:
- `.planning/research/STACK.md` — Testing stack and tools
- `.planning/research/FEATURES.md` — Feature categorization
- `.planning/research/ARCHITECTURE.md` — Test architecture and build order
- `.planning/research/PITFALLS.md` — Common pitfalls and prevention
