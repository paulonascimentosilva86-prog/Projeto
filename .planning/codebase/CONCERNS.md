# Technical Concerns

**Analysis Date:** 2026-03-28

## Severity Levels

- **HIGH** — Should address before adding features
- **MEDIUM** — Address when working in related area
- **LOW** — Track for future improvement

## Concerns

### 1. Sem Testes Automatizados — HIGH

**Area:** Todo o projeto
**Risk:** Commands e calculadoras podem gerar output incorreto sem detecção
**Prevention:** Adicionar testes para calculadoras (valores determinísticos) e validação de estrutura de petições
**Phase:** Deve ser endereçado antes de expandir commands

### 2. Duplicação de Vídeos na Raiz — LOW

**Area:** Raiz do projeto
**Files:** `advogado-condominio.mp4`, `como-aprender-claude.mp4`
**Risk:** Duplicação desnecessária — originais estão em `remotion-videos/out/`
**Prevention:** Remover cópias da raiz ou usar symlinks

### 3. Instalador Acoplado a Paths Globais — MEDIUM

**Area:** `instalar.sh`
**Risk:** Script copia commands para `~/.claude/` global, podendo conflitar com outros projetos Claude Code
**Prevention:** Considerar instalação local (por projeto) como padrão

### 4. Hooks Não-Bloqueantes — MEDIUM

**Area:** `hooks/validar-peticao.sh`
**Risk:** Sempre retorna exit 0 — alertas são ignoráveis
**Prevention:** Considerar exit 1 para elementos essenciais faltantes (endereçamento, pedidos)

### 5. Sem Versionamento de Commands — LOW

**Area:** `claude-code-juridico/.claude/commands/`
**Risk:** 48 commands sem controle de versão individual — difícil rastrear mudanças
**Prevention:** O git track já cobre isso, mas sem changelog por command

### 6. Base Legal sem Atualização Automática — MEDIUM

**Area:** Agentes e commands
**Risk:** Referências a leis, súmulas e jurisprudência podem ficar desatualizadas
**Prevention:** Revisão periódica da base legal nos agentes (especialmente Reforma Trabalhista e novas súmulas)

### 7. Remotion sem node_modules — LOW

**Area:** `remotion-videos/`
**Risk:** `package-lock.json` existe mas `node_modules/` não está no repo — `npm install` necessário antes de usar
**Prevention:** Documentar no README ou no `instalar.sh`

## Technical Debt

| Item | Severity | Effort |
|------|----------|--------|
| Adicionar testes | HIGH | Alto |
| Remover vídeos duplicados | LOW | Trivial |
| Hook bloqueante | MEDIUM | Baixo |
| Documentar setup Remotion | LOW | Baixo |

## Security

- **Sem secrets no código** — Nenhuma API key, token ou credencial detectada
- **Permissões Claude Code** restritas em `settings.json` (allow list explícita)
- **Hooks executáveis** com permissão adequada (755)

---

*Concerns analysis: 2026-03-28*
*Review quarterly or when adding major features*
