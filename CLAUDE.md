<!-- GSD:project-start source:PROJECT.md -->
## Project

**Claude Code Jurídico — Blindagem e Expansão**

Ecossistema de agentes e slash commands para o escritório Paulo Nascimento - Advocacia Integrada. Cobre Trabalhista, Cível, Condominial, Imobiliário e Família com 48 commands, 6 agentes especializados, 5 calculadoras e vídeos Remotion para marketing jurídico. O projeto agora foca em blindar o que já existe (testes, validações) e expandir com skills estratégicas faltantes.

**Core Value:** As calculadoras e petições devem gerar output correto e completo — um cálculo errado ou uma petição sem elemento essencial causa prejuízo real ao cliente.

### Constraints

- **Plataforma**: Claude Code CLI — commands e agentes são arquivos Markdown, sem backend
- **Sem persistência**: Não há banco de dados — testes devem ser self-contained
- **Base legal**: Referências a leis e súmulas dependem do conhecimento do modelo, não de API externa
- **Calculadoras**: Precisam de precisão matemática — erros são inaceitáveis em contexto jurídico
- **Formato**: Petições seguem ABNT e normas do tribunal destino
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->
## Technology Stack

## Languages
- TypeScript/TSX - Vídeos motion graphics (Remotion)
- Markdown - Commands, agentes, skills, documentação
- Bash - Scripts de instalação e hooks de validação
- JavaScript (CJS) - GSD tooling (`.claude/get-shit-done/bin/`)
## Runtime
- Node.js - Renderização de vídeos Remotion e tooling GSD
- Claude Code CLI - Execução de slash commands e agentes
- npm
- Lockfile: `package-lock.json` presente em `remotion-videos/`
## Frameworks
- Remotion 4.0.441 - Framework de vídeo programático (React → MP4)
- React 19.2.4 - UI components para vídeos
- Claude Code - Plataforma de agentes/commands
- Nenhum framework de teste formal configurado
- Remotion CLI 4.0.441 - Renderização de vídeos
- TypeScript - Tipagem dos componentes de vídeo
## Key Dependencies
- `remotion` 4.0.441 - Engine de renderização de vídeos
- `@remotion/cli` 4.0.441 - CLI para dev server e build
- `@remotion/player` 4.0.441 - Preview de vídeos
- `react` 19.2.4 - Componentes de vídeo
- Claude Code slash commands (48 commands em `.claude/commands/`)
- Claude Code agents (6 agentes em `agentes/`)
- Claude Code hooks (validação de petições, backup)
## Configuration
- Configuração via `.claude/settings.json` (hooks e permissões)
- Sem variáveis de ambiente requeridas
- `tsconfig.json` em `remotion-videos/`
- Scripts npm: `dev`, `build`, `build:all` (5 composições)
## Platform Requirements
- Node.js com npm
- Claude Code CLI instalado
- Qualquer plataforma (macOS/Linux/Windows)
- Vídeos renderizados em `remotion-videos/out/` (MP4)
- Commands e agentes executados via Claude Code
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

## Language & Style
- Português sem acentos nos nomes de arquivo (`peticao` não `petição`)
- Conteúdo com acentos normais
- Estrutura consistente: Identidade → Áreas → Base Legal → Diretrizes → Comandos Relacionados
- Functional components com arrow functions
- Export nomeado (`export const ComponentName`)
- Props tipadas inline ou com `defaultProps`
- Cores como strings hex inline
- Animações com `interpolate()`, `spring()`, `useCurrentFrame()`
- `set -e` no topo
- Cores ANSI para output formatado
- Verificação de pré-requisitos no início
## Naming Patterns
| Contexto | Padrão | Exemplo |
|----------|--------|---------|
| Commands | kebab-case pt-BR | `execucao-condominial.md` |
| Agentes (dir) | nome da área | `trabalhista/`, `condominial/` |
| Agentes (file) | sempre AGENT.md | `AGENT.md` |
| Composições | PascalCase | `AdvogadoCondominio.tsx` |
| IDs Remotion | PascalCase | `ReelsCondominial` |
| Hooks | kebab-case descritivo | `validar-peticao.sh` |
| Docs | UPPER_SNAKE | `CLAUDE.md`, `AGENT.md` |
## Command Structure Pattern
## Quando Usar
## Informações Necessárias
## Estrutura do Documento
## Fundamentação Legal
## Observações
## Agent Structure Pattern
## Identidade
## Áreas de Atuação
## Base Legal Principal
## Diretrizes
## Comandos Relacionados
## Error Handling
- Hook `validar-peticao.sh`: verifica 5 elementos essenciais (endereçamento, qualificação, fatos, direito, pedidos)
- Exit 0 sempre (não bloqueia execução)
- Alertas informativos `[ALERTA]` para elementos faltantes
## Formatting Standards
- Valores monetários: `R$` com 2 casas decimais
- Datas: `DD/MM/AAAA`
- Referências legais: artigo + diploma + ano (ex: `art. 1.336, §1º, CC`)
- Jurisprudência: tribunal + número + data
- Petições: formatação ABNT e normas do tribunal destino
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

## Pattern
## Layers
```
```
## Data Flow
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
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
