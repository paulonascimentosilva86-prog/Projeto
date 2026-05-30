#!/bin/bash

# ============================================================
# TESTE DE FUNCIONAMENTO - HERMES
# Sistema de Agentes Jurídicos com Claude Code
# ============================================================

set -e

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

PASSED=0
FAILED=0
TOTAL=0

# Função para teste
run_test() {
    TOTAL=$((TOTAL + 1))
    local test_name=$1
    local command=$2
    local expected=$3

    echo -e "${BLUE}[TEST $TOTAL]${NC} $test_name..."

    if eval "$command" &> /tmp/test_output.log; then
        PASSED=$((PASSED + 1))
        echo -e "  ${GREEN}✓ PASSOU${NC}"
        return 0
    else
        FAILED=$((FAILED + 1))
        echo -e "  ${RED}✗ FALHOU${NC}"
        cat /tmp/test_output.log 2>/dev/null || true
        return 1
    fi
}

clear

echo ""
echo -e "${CYAN}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                                                          ║${NC}"
echo -e "${CYAN}║  ${BOLD}HERMES - TESTE DE FUNCIONAMENTO${NC}${CYAN}                          ║${NC}"
echo -e "${CYAN}║  ${NC}Claude Code Juridico - Integração WhatsApp & Telegram   ${CYAN}║${NC}"
echo -e "${CYAN}║                                                          ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""

cd /home/user/Projeto/claude-code-juridico

# ============================================================
# 1. TESTES DE ESTRUTURA
# ============================================================
echo -e "${BOLD}${CYAN}[FASE 1] Testes de Estrutura${NC}${BOLD}"
echo ""

run_test "Diretório CLAUDE.md existe" "test -f CLAUDE.md"
run_test "Diretório .claude existe" "test -d .claude"
run_test "Diretório agentes existe" "test -d agentes"
run_test "Diretório documentos criado" "test -d documentos"
run_test "Arquivo settings.json existe" "test -f .claude/settings.json"

echo ""

# ============================================================
# 2. TESTES DE AGENTES
# ============================================================
echo -e "${BOLD}${CYAN}[FASE 2] Testes de Agentes${NC}${BOLD}"
echo ""

run_test "Agente Trabalhista (AGENT.md)" "test -f agentes/trabalhista/AGENT.md"
run_test "Agente Cível (AGENT.md)" "test -f agentes/civel/AGENT.md"
run_test "Agente Condominial (AGENT.md)" "test -f agentes/condominial/AGENT.md"
run_test "Agente Imobiliário (AGENT.md)" "test -f agentes/imobiliario/AGENT.md"
run_test "Agente Família (AGENT.md)" "test -f agentes/familia/AGENT.md"
run_test "Agente Produtividade (AGENT.md)" "test -f agentes/produtividade/AGENT.md"

echo ""

# ============================================================
# 3. TESTES DE SKILLS
# ============================================================
echo -e "${BOLD}${CYAN}[FASE 3] Testes de Skills${NC}${BOLD}"
echo ""

# Skills Principais
run_test "Skill /execucao-condominial" "test -f ~/.claude/commands/execucao-condominial.md"
run_test "Skill /peticao-trabalhista" "test -f ~/.claude/commands/peticao-trabalhista.md"
run_test "Skill /contrato-locacao" "test -f ~/.claude/commands/contrato-locacao.md"
run_test "Skill /analise-processo" "test -f ~/.claude/commands/analise-processo.md"
run_test "Skill /conversor-linguagem" "test -f ~/.claude/commands/conversor-linguagem.md"
run_test "Skill /calculadora-condominial" "test -f ~/.claude/commands/calculadora-condominial.md"

echo ""

# ============================================================
# 4. TESTES DE HOOKS
# ============================================================
echo -e "${BOLD}${CYAN}[FASE 4] Testes de Hooks${NC}${BOLD}"
echo ""

run_test "Hook validação de petição" "test -f hooks/validar-peticao.sh"
run_test "Hook backup automático" "test -f hooks/backup-documento.sh"
run_test "Permissão de execução (validar)" "test -x hooks/validar-peticao.sh"
run_test "Permissão de execução (backup)" "test -x hooks/backup-documento.sh"

echo ""

# ============================================================
# 5. TESTES DE CONFIGURAÇÃO
# ============================================================
echo -e "${BOLD}${CYAN}[FASE 5] Testes de Configuração${NC}${BOLD}"
echo ""

run_test "Claude Code instalado" "command -v claude &> /dev/null"
run_test "Git configurado" "command -v git &> /dev/null"
run_test "settings.json válido" "grep -q 'permissions' .claude/settings.json"

echo ""

# ============================================================
# 6. TESTES DE CONTEÚDO
# ============================================================
echo -e "${BOLD}${CYAN}[FASE 6] Testes de Conteúdo${NC}${BOLD}"
echo ""

run_test "CLAUDE.md contém agentes" "grep -q 'Agentes Especializados' CLAUDE.md"
run_test "CLAUDE.md contém skills" "grep -q 'Comandos Disponiveis' CLAUDE.md"
run_test "CLAUDE.md contém Trabalhista" "grep -q 'Trabalhista' CLAUDE.md"
run_test "CLAUDE.md contém Condominial" "grep -q 'Condominial' CLAUDE.md"

echo ""

# ============================================================
# 7. TESTES DE INTEGRAÇÃO (SIMULADO)
# ============================================================
echo -e "${BOLD}${CYAN}[FASE 7] Testes de Integração WhatsApp/Telegram${NC}${BOLD}"
echo ""

# Simular mensagem WhatsApp
create_test_message() {
    cat > /tmp/hermes_msg.json <<EOF
{
  "from": "+5511999999999",
  "to": "+551133333333",
  "body": "Preciso fazer execução de cotas condominiais",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF
}

run_test "Arquivo de teste de mensagem" "create_test_message && test -f /tmp/hermes_msg.json"
run_test "JSON de mensagem válido" "python3 -m json.tool /tmp/hermes_msg.json > /dev/null"

echo ""

# ============================================================
# 8. RESUMO DOS RESULTADOS
# ============================================================
echo -e "${BOLD}${CYAN}═══════════════════════════════════════════════════════════${NC}${BOLD}"
echo -e "${BOLD}${CYAN}                    RESUMO DOS TESTES${NC}${BOLD}"
echo -e "${BOLD}${CYAN}═══════════════════════════════════════════════════════════${NC}${BOLD}"
echo ""

PERCENTAGE=$((PASSED * 100 / TOTAL))

if [ $FAILED -eq 0 ]; then
    STATUS_COLOR=$GREEN
    STATUS="✓ SUCESSO TOTAL"
else
    STATUS_COLOR=$RED
    STATUS="✗ COM FALHAS"
fi

echo -e "${STATUS_COLOR}${BOLD}$STATUS${NC}"
echo ""
echo -e "  ${BOLD}Total de testes:${NC} $TOTAL"
echo -e "  ${GREEN}${BOLD}Passou:${NC} $PASSED"
echo -e "  ${RED}${BOLD}Falhou:${NC} $FAILED"
echo -e "  ${BOLD}Aprovação:${NC} $PERCENTAGE%"
echo ""

echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo ""

# ============================================================
# 9. INFORMAÇÕES DO SISTEMA
# ============================================================
echo -e "${BOLD}${CYAN}[INFO] Status do Sistema${NC}${BOLD}"
echo ""

SKILL_COUNT=$(find ~/.claude/commands -name "*.md" 2>/dev/null | wc -l)
AGENT_COUNT=$(find agentes -name "AGENT.md" 2>/dev/null | wc -l)
DOC_DIRS=$(find documentos -type d 2>/dev/null | wc -l)

echo -e "  ${CYAN}●${NC} Claude Code: $(claude --version 2>/dev/null || echo 'Instalado')"
echo -e "  ${CYAN}●${NC} Skills disponíveis: $SKILL_COUNT"
echo -e "  ${CYAN}●${NC} Agentes especializados: $AGENT_COUNT"
echo -e "  ${CYAN}●${NC} Diretórios de documentos: $DOC_DIRS"
echo -e "  ${CYAN}●${NC} Branch: $(git rev-parse --abbrev-ref HEAD)"
echo -e "  ${CYAN}●${NC} Commit: $(git rev-parse --short HEAD)"
echo ""

# ============================================================
# 10. PRÓXIMOS PASSOS
# ============================================================
echo -e "${BOLD}${CYAN}[PRÓXIMOS PASSOS]${NC}${BOLD}"
echo ""
echo "  1. Implementar integrações WhatsApp/Telegram"
echo "  2. Criar API REST para comunicação"
echo "  3. Configurar webhooks (Twilio, Telegram Bot API)"
echo "  4. Realizar testes de carga"
echo "  5. Deploy em produção"
echo ""

# Resultado final
if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}${BOLD}✓ Hermes pronto para integração com WhatsApp e Telegram!${NC}"
    exit 0
else
    echo -e "${RED}${BOLD}✗ Alguns testes falharam. Verifique os erros acima.${NC}"
    exit 1
fi
