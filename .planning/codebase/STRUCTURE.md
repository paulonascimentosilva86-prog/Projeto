# Directory Structure

**Analysis Date:** 2026-03-28

## Root Layout

```
Projeto/
├── PESQUISA_SKILLS_MORETTO.md          # Pesquisa de skills (referência)
├── advogado-condominio.mp4             # Vídeo renderizado (cópia)
├── como-aprender-claude.mp4            # Vídeo renderizado (cópia)
├── claude-code-juridico/               # Ecossistema principal
│   ├── CLAUDE.md                       # Documentação do projeto
│   ├── instalar.sh                     # Script de instalação
│   ├── .claude/                        # Configuração Claude Code
│   │   ├── settings.json               # Hooks e permissões
│   │   ├── commands/                   # 48 slash commands
│   │   │   ├── peticao-trabalhista.md
│   │   │   ├── execucao-condominial.md
│   │   │   ├── calculadora-condominial.md
│   │   │   └── ... (48 arquivos .md)
│   │   └── skills/
│   │       └── remotion-best-practices/  # Skill Remotion
│   │           ├── SKILL.md
│   │           └── rules/ (37 arquivos)
│   ├── agentes/                        # 6 agentes especializados
│   │   ├── trabalhista/AGENT.md
│   │   ├── civel/AGENT.md
│   │   ├── condominial/AGENT.md
│   │   ├── imobiliario/AGENT.md
│   │   ├── familia/AGENT.md
│   │   └── produtividade/AGENT.md
│   ├── hooks/                          # Scripts de validação
│   │   ├── validar-peticao.sh
│   │   └── backup-documento.sh
│   └── remotion-videos/                # Sistema de vídeos
│       ├── package.json
│       ├── tsconfig.json
│       ├── src/
│       │   ├── index.ts                # Entry point
│       │   ├── Root.tsx                # Composições (5 vídeos)
│       │   ├── JuridicoVideo.tsx       # Template genérico Reels
│       │   ├── AdvogadoCondominio.tsx  # Vídeo condominial
│       │   └── ComoAprenderClaude.tsx  # Vídeo educacional
│       └── out/                        # Vídeos renderizados
│           ├── advogado-condominio.mp4
│           └── como-aprender-claude.mp4
├── .claude/                            # GSD (recém instalado)
│   ├── commands/gsd/                   # 58 comandos GSD
│   ├── agents/                         # Agentes GSD
│   ├── get-shit-done/                  # Core do GSD
│   ├── hooks/                          # Hooks GSD
│   └── settings.json
└── .planning/                          # Diretório de planejamento GSD
    └── codebase/                       # Mapeamento (este documento)
```

## Key Locations

| O quê | Onde |
|-------|------|
| Commands jurídicos | `claude-code-juridico/.claude/commands/` |
| Agentes | `claude-code-juridico/agentes/` |
| Hooks de validação | `claude-code-juridico/hooks/` |
| Vídeos fonte (TSX) | `claude-code-juridico/remotion-videos/src/` |
| Vídeos renderizados | `claude-code-juridico/remotion-videos/out/` |
| Configuração Claude | `claude-code-juridico/.claude/settings.json` |
| Instalador | `claude-code-juridico/instalar.sh` |
| GSD system | `.claude/` |

## Naming Conventions

- **Commands:** kebab-case em português (`peticao-trabalhista.md`, `acao-despejo.md`)
- **Agentes:** Diretório por área, arquivo `AGENT.md` dentro
- **Componentes Remotion:** PascalCase (`AdvogadoCondominio.tsx`)
- **Hooks:** kebab-case descritivo (`validar-peticao.sh`)

## File Counts

| Tipo | Quantidade |
|------|-----------|
| Slash Commands | 48 |
| Agentes | 6 |
| Hooks | 2 |
| Vídeos (composições) | 5 |
| Vídeos renderizados | 2 |
| Remotion rules | 37 |

---

*Structure analysis: 2026-03-28*
*Update after reorganization*
