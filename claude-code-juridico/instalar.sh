#!/bin/bash

# ============================================================
# INSTALADOR - Claude Code Juridico
# Paulo Nascimento - Advocacia Integrada
# Sistema de Agentes e Skills para Advocacia
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

# Diretorio do projeto
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLAUDE_HOME="$HOME/.claude"

echo ""
echo -e "${CYAN}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                                                          ║${NC}"
echo -e "${CYAN}║  ${BOLD}  CLAUDE CODE JURIDICO ${NC}${CYAN}                                 ║${NC}"
echo -e "${CYAN}║  ${NC}  Paulo Nascimento - Advocacia Integrada ${CYAN}              ║${NC}"
echo -e "${CYAN}║  ${NC}  Sistema de Agentes e Skills para Advocacia ${CYAN}          ║${NC}"
echo -e "${CYAN}║                                                          ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""

# ============================================================
# ETAPA 1: Verificar pre-requisitos
# ============================================================
echo -e "${BLUE}[1/6]${NC} Verificando pre-requisitos..."

# Verificar se Claude Code esta instalado
if command -v claude &> /dev/null; then
    CLAUDE_VERSION=$(claude --version 2>/dev/null || echo "desconhecida")
    echo -e "  ${GREEN}✓${NC} Claude Code encontrado (versao: $CLAUDE_VERSION)"
else
    echo -e "  ${YELLOW}⚠${NC} Claude Code nao encontrado no PATH"
    echo -e "  ${YELLOW}  Os comandos serao instalados mesmo assim.${NC}"
    echo -e "  ${YELLOW}  Instale o Claude Code: npm install -g @anthropic-ai/claude-code${NC}"
fi

# Verificar git
if command -v git &> /dev/null; then
    echo -e "  ${GREEN}✓${NC} Git encontrado"
else
    echo -e "  ${RED}✗${NC} Git nao encontrado. Instale o git e tente novamente."
    exit 1
fi

echo ""

# ============================================================
# ETAPA 2: Criar estrutura de diretorios
# ============================================================
echo -e "${BLUE}[2/6]${NC} Criando estrutura de diretorios..."

# Criar diretorio de comandos do Claude Code (global)
mkdir -p "$CLAUDE_HOME/commands"

# Criar diretorios locais
DIRS=(
    "documentos/peticoes"
    "documentos/contratos"
    "documentos/notificacoes"
    "documentos/calculos"
    "documentos/pareceres"
    "documentos/relatorios"
)

for dir in "${DIRS[@]}"; do
    mkdir -p "$PROJECT_DIR/$dir"
    echo -e "  ${GREEN}✓${NC} $dir"
done

echo ""

# ============================================================
# ETAPA 3: Instalar comandos slash (skills)
# ============================================================
echo -e "${BLUE}[3/6]${NC} Instalando comandos slash (skills)..."

COMMANDS_SRC="$PROJECT_DIR/.claude/commands"
COMMANDS_DST="$CLAUDE_HOME/commands"

if [ -d "$COMMANDS_SRC" ]; then
    SKILL_COUNT=0
    for cmd_file in "$COMMANDS_SRC"/*.md; do
        if [ -f "$cmd_file" ]; then
            filename=$(basename "$cmd_file")
            cp "$cmd_file" "$COMMANDS_DST/$filename"
            skill_name="${filename%.md}"
            echo -e "  ${GREEN}✓${NC} /$skill_name"
            SKILL_COUNT=$((SKILL_COUNT + 1))
        fi
    done
    echo -e "  ${CYAN}→ $SKILL_COUNT skills instaladas${NC}"
else
    echo -e "  ${RED}✗${NC} Diretorio de comandos nao encontrado"
fi

echo ""

# ============================================================
# ETAPA 4: Configurar CLAUDE.md (projeto)
# ============================================================
echo -e "${BLUE}[4/6]${NC} Configurando CLAUDE.md..."

if [ -f "$PROJECT_DIR/CLAUDE.md" ]; then
    echo -e "  ${GREEN}✓${NC} CLAUDE.md do projeto configurado"
else
    echo -e "  ${YELLOW}⚠${NC} CLAUDE.md nao encontrado"
fi

# Copiar CLAUDE.md para home como referencia global (se nao existir)
if [ ! -f "$CLAUDE_HOME/CLAUDE.md" ]; then
    cp "$PROJECT_DIR/CLAUDE.md" "$CLAUDE_HOME/CLAUDE.md" 2>/dev/null || true
    echo -e "  ${GREEN}✓${NC} CLAUDE.md global configurado em $CLAUDE_HOME/"
else
    echo -e "  ${YELLOW}⚠${NC} CLAUDE.md global ja existe (nao sobrescrito)"
fi

echo ""

# ============================================================
# ETAPA 5: Configurar hooks
# ============================================================
echo -e "${BLUE}[5/6]${NC} Configurando hooks..."

# Criar hook de validacao de peticoes
HOOKS_DIR="$PROJECT_DIR/hooks"
mkdir -p "$HOOKS_DIR"

cat > "$HOOKS_DIR/validar-peticao.sh" << 'HOOK_EOF'
#!/bin/bash
# Hook: Validar estrutura basica de peticao
# Verifica se o documento gerado possui os elementos essenciais

FILE="$1"
if [ -z "$FILE" ] || [ ! -f "$FILE" ]; then
    exit 0
fi

ERRORS=0

# Verificar elementos essenciais
check_element() {
    if ! grep -qi "$1" "$FILE"; then
        echo "[ALERTA] Elemento ausente: $2"
        ERRORS=$((ERRORS + 1))
    fi
}

check_element "enderecamento\|excelentissimo\|meritissimo" "Enderecamento"
check_element "qualificacao\|qualificado" "Qualificacao das partes"
check_element "dos fatos\|fatos" "Secao de fatos"
check_element "do direito\|fundament" "Fundamentacao juridica"
check_element "dos pedidos\|requer" "Pedidos"

if [ $ERRORS -gt 0 ]; then
    echo "[VALIDACAO] $ERRORS elemento(s) possivelmente ausente(s)"
else
    echo "[VALIDACAO] ✓ Estrutura basica da peticao verificada"
fi

exit 0
HOOK_EOF

chmod +x "$HOOKS_DIR/validar-peticao.sh"
echo -e "  ${GREEN}✓${NC} Hook de validacao de peticoes"

cat > "$HOOKS_DIR/backup-documento.sh" << 'HOOK_EOF'
#!/bin/bash
# Hook: Backup automatico de documentos gerados
# Cria copia com timestamp

FILE="$1"
if [ -z "$FILE" ] || [ ! -f "$FILE" ]; then
    exit 0
fi

BACKUP_DIR="$(dirname "$FILE")/.backups"
mkdir -p "$BACKUP_DIR"

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
FILENAME=$(basename "$FILE")
cp "$FILE" "$BACKUP_DIR/${TIMESTAMP}_${FILENAME}"

echo "[BACKUP] Copia salva: ${TIMESTAMP}_${FILENAME}"
exit 0
HOOK_EOF

chmod +x "$HOOKS_DIR/backup-documento.sh"
echo -e "  ${GREEN}✓${NC} Hook de backup automatico"

echo ""

# ============================================================
# ETAPA 6: Resumo da instalacao
# ============================================================
echo -e "${BLUE}[6/6]${NC} Instalacao concluida!"
echo ""

# Contar recursos instalados
TOTAL_SKILLS=$(find "$COMMANDS_SRC" -name "*.md" 2>/dev/null | wc -l)
TOTAL_AGENTS=$(find "$PROJECT_DIR/agentes" -name "AGENT.md" 2>/dev/null | wc -l)
TOTAL_HOOKS=$(find "$HOOKS_DIR" -name "*.sh" 2>/dev/null | wc -l)

echo -e "${CYAN}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║              RESUMO DA INSTALACAO                        ║${NC}"
echo -e "${CYAN}╠══════════════════════════════════════════════════════════╣${NC}"
echo -e "${CYAN}║${NC}  Skills (comandos slash):  ${GREEN}${BOLD}$TOTAL_SKILLS${NC}                        ${CYAN}║${NC}"
echo -e "${CYAN}║${NC}  Agentes especializados:   ${GREEN}${BOLD}$TOTAL_AGENTS${NC}                         ${CYAN}║${NC}"
echo -e "${CYAN}║${NC}  Hooks configurados:       ${GREEN}${BOLD}$TOTAL_HOOKS${NC}                         ${CYAN}║${NC}"
echo -e "${CYAN}╠══════════════════════════════════════════════════════════╣${NC}"
echo -e "${CYAN}║              AGENTES DISPONIVEIS                         ║${NC}"
echo -e "${CYAN}╠══════════════════════════════════════════════════════════╣${NC}"
echo -e "${CYAN}║${NC}  ${BOLD}Trabalhista${NC}   - Reclamatorias, defesas, calculos        ${CYAN}║${NC}"
echo -e "${CYAN}║${NC}  ${BOLD}Civel${NC}         - Peticoes, execucoes, consumidor         ${CYAN}║${NC}"
echo -e "${CYAN}║${NC}  ${BOLD}Condominial${NC}   - Execucao cotas, cobranca, assembleias   ${CYAN}║${NC}"
echo -e "${CYAN}║${NC}  ${BOLD}Imobiliario${NC}   - Locacao, despejo, compra/venda, posse   ${CYAN}║${NC}"
echo -e "${CYAN}║${NC}  ${BOLD}Familia${NC}       - Divorcio, alimentos, inventario, guarda ${CYAN}║${NC}"
echo -e "${CYAN}║${NC}  ${BOLD}Produtividade${NC} - Relatorios, honorarios, marketing       ${CYAN}║${NC}"
echo -e "${CYAN}╠══════════════════════════════════════════════════════════╣${NC}"
echo -e "${CYAN}║              SKILLS POR AREA                             ║${NC}"
echo -e "${CYAN}╠══════════════════════════════════════════════════════════╣${NC}"
echo -e "${CYAN}║${NC}  ${BOLD}Condominial (9):${NC} execucao, calculadora, workflow,       ${CYAN}║${NC}"
echo -e "${CYAN}║${NC}    defesa, notificacao, destituicao, convencao,         ${CYAN}║${NC}"
echo -e "${CYAN}║${NC}    atas-assembleia, mediacao                            ${CYAN}║${NC}"
echo -e "${CYAN}║${NC}  ${BOLD}Trabalhista (7):${NC} peticao, defesa, justa-causa,          ${CYAN}║${NC}"
echo -e "${CYAN}║${NC}    acordo, simulador, insalubridade, compliance         ${CYAN}║${NC}"
echo -e "${CYAN}║${NC}  ${BOLD}Imobiliario (9):${NC} locacao, despejo, renovatoria,         ${CYAN}║${NC}"
echo -e "${CYAN}║${NC}    revisional, compra-venda, distrato, usucapiao,       ${CYAN}║${NC}"
echo -e "${CYAN}║${NC}    adjudicacao, reintegracao, due-diligence, reurb      ${CYAN}║${NC}"
echo -e "${CYAN}║${NC}  ${BOLD}Civel (4):${NC} peticao, execucao, consumo, embargos        ${CYAN}║${NC}"
echo -e "${CYAN}║${NC}  ${BOLD}Familia (4):${NC} divorcio, alimentos, inventario, guarda   ${CYAN}║${NC}"
echo -e "${CYAN}║${NC}  ${BOLD}Calculadoras (5):${NC} condominial, distrato, aluguel,      ${CYAN}║${NC}"
echo -e "${CYAN}║${NC}    insalubridade, simulador-reclamatoria                ${CYAN}║${NC}"
echo -e "${CYAN}║${NC}  ${BOLD}Produtividade (9):${NC} conversor, relatorio, honorarios,   ${CYAN}║${NC}"
echo -e "${CYAN}║${NC}    parecer-custos, minutas, emails, conteudo,           ${CYAN}║${NC}"
echo -e "${CYAN}║${NC}    jurisprudencia, analise-processo, lgpd               ${CYAN}║${NC}"
echo -e "${CYAN}╠══════════════════════════════════════════════════════════╣${NC}"
echo -e "${CYAN}║              COMO USAR                                   ║${NC}"
echo -e "${CYAN}╠══════════════════════════════════════════════════════════╣${NC}"
echo -e "${CYAN}║${NC}  1. Abra o Claude Code neste diretorio                  ${CYAN}║${NC}"
echo -e "${CYAN}║${NC}  2. Digite / para ver todos os comandos                 ${CYAN}║${NC}"
echo -e "${CYAN}║${NC}  3. Exemplo: /execucao-condominial                      ${CYAN}║${NC}"
echo -e "${CYAN}║${NC}  4. O agente guiara voce pelo processo                  ${CYAN}║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}${BOLD}Instalacao concluida com sucesso!${NC}"
echo -e "Diretorio do projeto: ${BOLD}$PROJECT_DIR${NC}"
echo ""
