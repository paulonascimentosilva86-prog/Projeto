# Testing

**Analysis Date:** 2026-03-28

## Current State

**Nenhum framework de teste formal** está configurado no projeto.

## Validation Mechanisms

Apesar de não haver testes automatizados, o projeto possui mecanismos de validação:

### Hook de Validação de Petição

`hooks/validar-peticao.sh` — Verifica estrutura básica:
- Endereçamento (Excelentíssimo/Meritíssimo)
- Qualificação das partes
- Seção de fatos
- Fundamentação jurídica
- Pedidos

**Tipo:** Validação pós-geração (grep-based)
**Cobertura:** Estrutura formal apenas, não conteúdo jurídico

### Hook de Backup

`hooks/backup-documento.sh` — Backup de documentos gerados

### Hook do Claude Code

`settings.json` → `PostToolUse` em `Write` → Confirmação visual

## Remotion Videos

- **Preview:** `npm run dev` (Remotion Studio para inspeção visual)
- **Build:** `npm run build:all` (renderização completa — falha se componente quebrar)
- **Sem testes unitários** para componentes TSX

## Gaps

| Área | Status | Impacto |
|------|--------|---------|
| Testes de commands | Ausente | Commands podem gerar peças incompletas |
| Testes de cálculo | Ausente | Calculadoras sem validação de resultado |
| Testes de componentes Remotion | Ausente | Regressões visuais não detectadas |
| Lint/format | Ausente | Sem padronização automática |

## Recommendations

1. **Testes de snapshot** para commands (verificar que output mantém estrutura)
2. **Testes de cálculo** para calculadoras (condominial, aluguel, distrato, trabalhista)
3. **Remotion visual tests** para regressões em vídeos

---

*Testing analysis: 2026-03-28*
*Update when testing framework is added*
