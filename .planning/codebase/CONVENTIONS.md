# Code Conventions

**Analysis Date:** 2026-03-28

## Language & Style

**Markdown Commands:**
- Português sem acentos nos nomes de arquivo (`peticao` não `petição`)
- Conteúdo com acentos normais
- Estrutura consistente: Identidade → Áreas → Base Legal → Diretrizes → Comandos Relacionados

**TypeScript (Remotion):**
- Functional components com arrow functions
- Export nomeado (`export const ComponentName`)
- Props tipadas inline ou com `defaultProps`
- Cores como strings hex inline
- Animações com `interpolate()`, `spring()`, `useCurrentFrame()`

**Bash Scripts:**
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

Cada slash command segue este padrão:

```markdown
# [Nome do Command]

## Quando Usar
[Descrição do caso de uso]

## Informações Necessárias
[Lista de dados que o usuário precisa fornecer]

## Estrutura do Documento
[Template da peça jurídica]

## Fundamentação Legal
[Artigos, leis, súmulas aplicáveis]

## Observações
[Alertas, prazos, exceções]
```

## Agent Structure Pattern

Cada agente segue este padrão:

```markdown
# Agente [Área] - Paulo Nascimento Advocacia Integrada

## Identidade
[Persona: advogado senior especialista em X]

## Áreas de Atuação
[Lista de competências]

## Base Legal Principal
[Leis, códigos, súmulas]

## Diretrizes
[Regras numeradas de comportamento]

## Comandos Relacionados
[Lista de slash commands vinculados]
```

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

---

*Conventions analysis: 2026-03-28*
*Update after pattern changes*
