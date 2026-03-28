# Architecture

**Analysis Date:** 2026-03-28

## Pattern

**Plugin/Command Architecture** — O sistema é um ecossistema de commands e agentes independentes que rodam dentro do Claude Code como plataforma host.

Cada command é um arquivo Markdown autônomo com instruções especializadas. Cada agente é uma persona com conhecimento de domínio jurídico. Não há código compartilhado entre commands.

## Layers

```
┌─────────────────────────────────────────┐
│           Claude Code CLI               │ ← Plataforma host
├─────────────────────────────────────────┤
│         Settings & Hooks                │ ← Configuração e validação
├─────────────────────────────────────────┤
│     Agentes Especializados (6)          │ ← Personas com domínio jurídico
├──────────┬──────────┬───────────────────┤
│ Trabalhista│ Cível  │ Condominial │ ... │
├──────────┴──────────┴───────────────────┤
│       Slash Commands (48)               │ ← Instruções por tipo de peça
├──────────┬──────────┬───────────────────┤
│ Petições │Contratos │ Calculadoras│ ... │
├──────────┴──────────┴───────────────────┤
│       Remotion Videos                   │ ← Marketing jurídico
└─────────────────────────────────────────┘
```

## Data Flow

1. **Usuário** invoca slash command (ex: `/execucao-condominial`)
2. **Claude Code** carrega o command `.md` + agente relevante
3. **Claude (LLM)** processa instruções + dados do caso → gera peça
4. **Hook** `validar-peticao.sh` verifica estrutura da peça
5. **Output** → documento jurídico formatado

Para vídeos:
1. **Componente TSX** define cenas, animações, texto
2. **Remotion CLI** renderiza React → frames → MP4
3. **Output** → `remotion-videos/out/*.mp4`

## Abstractions

- **Command (.md)** — Prompt template com estrutura, campos obrigatórios, fundamentação legal
- **Agente (AGENT.md)** — Persona especializada com identidade, áreas de atuação, base legal, diretrizes
- **Hook (.sh)** — Script de validação/automação pós-execução
- **Composição (TSX)** — Componente React que define um vídeo programático

## Entry Points

- `instalar.sh` — Instalação do ecossistema no Claude Code do usuário
- Slash commands via Claude Code CLI (ex: `/peticao-trabalhista`)
- `npm run dev` — Dev server Remotion para preview de vídeos
- `npm run build:all` — Renderização de todos os vídeos

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Commands como Markdown | Facilidade de criação/edição sem código |
| Agentes separados por área | Conhecimento especializado por domínio |
| Remotion para vídeos | Vídeos programáticos reproduzíveis e versionáveis |
| Sem banco de dados | Cada sessão é independente — simplicidade |

---

*Architecture analysis: 2026-03-28*
*Update after structural changes*
