# Claude Code Jurídico — Blindagem e Expansão

## What This Is

Ecossistema de agentes e slash commands para o escritório Paulo Nascimento - Advocacia Integrada. Cobre Trabalhista, Cível, Condominial, Imobiliário e Família com 48 commands, 6 agentes especializados, 5 calculadoras e vídeos Remotion para marketing jurídico. O projeto agora foca em blindar o que já existe (testes, validações) e expandir com skills estratégicas faltantes.

## Core Value

As calculadoras e petições devem gerar output correto e completo — um cálculo errado ou uma petição sem elemento essencial causa prejuízo real ao cliente.

## Requirements

### Validated

- ✓ 48 slash commands cobrindo 3 fases (Fundação, Expansão, Diferenciação) — existente
- ✓ 6 agentes especializados (Trabalhista, Cível, Condominial, Imobiliário, Família, Produtividade) — existente
- ✓ 5 calculadoras (condominial, distrato, aluguel, insalubridade, reclamatória) — existente
- ✓ Hook de validação de petição (estrutura básica) — existente
- ✓ Hook de backup de documentos — existente
- ✓ 5 composições Remotion (2 renderizadas) — existente
- ✓ Instalador automatizado (instalar.sh) — existente

### Active

**Frente 1 — Blindagem (qualidade e prevenção de bugs):**
- [ ] Testes automatizados para as 5 calculadoras (valores determinísticos)
- [ ] Hooks bloqueantes para petições (elementos obrigatórios impedem geração)
- [ ] Validação de base legal nos agentes (leis, súmulas, artigos atualizados)
- [ ] Testes de estrutura para commands (snapshot: output mantém padrão)

**Frente 2 — Skills estratégicas faltantes:**
- [ ] Radar de Prazos Inteligente (cronograma com alertas, feriados, suspensões)
- [ ] Extrator de Dados de Documentos (holerites, CTPS, contratos → dados estruturados)
- [ ] Assessoria para Construtoras (memorial de incorporação, quadro de áreas, patrimônio de afetação)

### Out of Scope

- Dashboard de Produtividade — requer persistência de dados, complexidade alta para o momento
- Análise de Juiz/Vara (Jurimetria) — depende de base de dados externa não disponível
- Mapeamento de Risco da Carteira — requer integração com sistema de gestão processual
- Captação e Qualificação de Leads — fora do escopo técnico do Claude Code
- Simulador de Cenários Processuais — depende de dados estatísticos confiáveis

## Context

- Escritório médio, full service, mix PF e PJ
- Maior demanda: Trabalhista + Cível + Condominial/Imobiliário
- Foco condominial: execução de cotas condominiais (ambos os polos)
- Stack: Markdown (commands/agentes) + TypeScript/React (Remotion) + Bash (hooks/instalação)
- Plataforma: Claude Code CLI
- Sem banco de dados — cada sessão é independente
- Pesquisa Moretto documentada em `PESQUISA_SKILLS_MORETTO.md` como referência
- Codebase mapeado em `.planning/codebase/` (7 documentos)

## Constraints

- **Plataforma**: Claude Code CLI — commands e agentes são arquivos Markdown, sem backend
- **Sem persistência**: Não há banco de dados — testes devem ser self-contained
- **Base legal**: Referências a leis e súmulas dependem do conhecimento do modelo, não de API externa
- **Calculadoras**: Precisam de precisão matemática — erros são inaceitáveis em contexto jurídico
- **Formato**: Petições seguem ABNT e normas do tribunal destino

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Priorizar testes de calculadoras antes de novas skills | Calculadoras erradas causam prejuízo real — blindar primeiro | — Pending |
| Hooks bloqueantes (exit 1) para elementos essenciais | Alertas ignoráveis não previnem erros | — Pending |
| Radar de Prazos como primeira skill nova | Perda de prazo é o erro mais grave da advocacia | — Pending |
| Manter arquitetura sem banco de dados | Simplicidade — Claude Code não precisa de infra extra | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-03-28 after initialization*
