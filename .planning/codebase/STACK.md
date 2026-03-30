# Technology Stack

**Analysis Date:** 2026-03-28

## Languages

**Primary:**
- TypeScript/TSX - Vídeos motion graphics (Remotion)
- Markdown - Commands, agentes, skills, documentação

**Secondary:**
- Bash - Scripts de instalação e hooks de validação
- JavaScript (CJS) - GSD tooling (`.claude/get-shit-done/bin/`)

## Runtime

**Environment:**
- Node.js - Renderização de vídeos Remotion e tooling GSD
- Claude Code CLI - Execução de slash commands e agentes

**Package Manager:**
- npm
- Lockfile: `package-lock.json` presente em `remotion-videos/`

## Frameworks

**Core:**
- Remotion 4.0.441 - Framework de vídeo programático (React → MP4)
- React 19.2.4 - UI components para vídeos
- Claude Code - Plataforma de agentes/commands

**Testing:**
- Nenhum framework de teste formal configurado

**Build/Dev:**
- Remotion CLI 4.0.441 - Renderização de vídeos
- TypeScript - Tipagem dos componentes de vídeo

## Key Dependencies

**Critical:**
- `remotion` 4.0.441 - Engine de renderização de vídeos
- `@remotion/cli` 4.0.441 - CLI para dev server e build
- `@remotion/player` 4.0.441 - Preview de vídeos
- `react` 19.2.4 - Componentes de vídeo

**Infrastructure:**
- Claude Code slash commands (48 commands em `.claude/commands/`)
- Claude Code agents (6 agentes em `agentes/`)
- Claude Code hooks (validação de petições, backup)

## Configuration

**Environment:**
- Configuração via `.claude/settings.json` (hooks e permissões)
- Sem variáveis de ambiente requeridas

**Build:**
- `tsconfig.json` em `remotion-videos/`
- Scripts npm: `dev`, `build`, `build:all` (5 composições)

## Platform Requirements

**Development:**
- Node.js com npm
- Claude Code CLI instalado
- Qualquer plataforma (macOS/Linux/Windows)

**Production:**
- Vídeos renderizados em `remotion-videos/out/` (MP4)
- Commands e agentes executados via Claude Code

---

*Stack analysis: 2026-03-28*
*Update after major dependency changes*
