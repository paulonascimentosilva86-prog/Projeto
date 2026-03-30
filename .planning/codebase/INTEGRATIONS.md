# External Integrations

**Analysis Date:** 2026-03-28

## APIs & External Services

**None detected** — O projeto é self-contained. Não consome APIs externas.

Os commands e agentes geram documentos locais (petições, contratos, cálculos) sem integração com sistemas externos (tribunais, PJe, etc.).

## AI/LLM

- **Claude (Anthropic)** — Backend de IA dos agentes e commands via Claude Code CLI
  - Modelo: configurável pelo usuário
  - Acesso: via Claude Code (não via API direta)

## Databases

**Nenhuma** — Projeto não persiste dados. Cada command gera output por sessão.

## Authentication

**Nenhuma** — Autenticação gerida pelo Claude Code CLI (API key do Anthropic).

## Webhooks / Event Systems

**Hooks Claude Code** (`.claude/settings.json`):
- `PostToolUse` → `Write` → Confirmação de documento salvo
- `Notification` → Alerta de tarefa concluída

**Hooks de validação** (`hooks/`):
- `validar-peticao.sh` — Verifica estrutura básica de petição (endereçamento, qualificação, fatos, direito, pedidos)
- `backup-documento.sh` — Backup de documentos gerados

## File I/O

**Input:**
- Dados do caso fornecidos pelo usuário via chat

**Output:**
- Petições, contratos, pareceres (texto/markdown)
- Vídeos MP4 renderizados via Remotion (`remotion-videos/out/`)
- Planilhas de cálculo (texto formatado)

---

*Integration analysis: 2026-03-28*
*Update when external services are added*
