#!/bin/bash

# ============================================================
# INSTALADOR OLLAMA - Claude Code Juridico
# Paulo Nascimento - Advocacia Integrada
# Configura Ollama + modelos otimizados para advocacia
# ============================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo ""
echo -e "${CYAN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                                                              ║${NC}"
echo -e "${CYAN}║  ${BOLD}  INSTALADOR OLLAMA - MODO JURIDICO ${NC}${CYAN}                        ║${NC}"
echo -e "${CYAN}║  ${NC}  IA 100% local, gratuita, sem internet ${CYAN}                    ║${NC}"
echo -e "${CYAN}║                                                              ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# ============================================================
# ETAPA 1: Instalar Ollama
# ============================================================
echo -e "${BLUE}[1/4]${NC} Instalando Ollama..."

if command -v ollama &> /dev/null; then
    echo -e "  ${GREEN}✓${NC} Ollama ja esta instalado ($(ollama --version 2>/dev/null || echo 'versao desconhecida'))"
else
    echo -e "  Baixando e instalando Ollama..."
    curl -fsSL https://ollama.com/install.sh | sh
    echo -e "  ${GREEN}✓${NC} Ollama instalado"
fi

echo ""

# ============================================================
# ETAPA 2: Iniciar servico Ollama
# ============================================================
echo -e "${BLUE}[2/4]${NC} Iniciando servico Ollama..."

if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo -e "  ${GREEN}✓${NC} Ollama ja esta rodando"
else
    echo -e "  Iniciando Ollama em segundo plano..."
    ollama serve &
    sleep 3

    if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
        echo -e "  ${GREEN}✓${NC} Ollama iniciado com sucesso"
    else
        echo -e "  ${YELLOW}⚠${NC} Ollama pode demorar para iniciar. Aguarde..."
        sleep 5
    fi
fi

echo ""

# ============================================================
# ETAPA 3: Detectar hardware e recomendar modelos
# ============================================================
echo -e "${BLUE}[3/4]${NC} Detectando hardware e escolhendo modelos..."

RAM_GB=$(free -g 2>/dev/null | awk '/Mem:/{print $2}' || echo "8")
HAS_GPU="nao"
if nvidia-smi &> /dev/null 2>&1; then
    HAS_GPU="nvidia"
    GPU_MEM=$(nvidia-smi --query-gpu=memory.total --format=csv,noheader,nounits 2>/dev/null | head -1)
    echo -e "  GPU NVIDIA detectada: ${GPU_MEM}MB VRAM"
fi

echo -e "  RAM total: ${RAM_GB}GB"
echo -e "  GPU: $HAS_GPU"
echo ""

# Definir modelos baseado no hardware
if [ "$RAM_GB" -ge 16 ]; then
    # 16GB+ RAM: pode rodar modelos maiores
    MODELO_PRINCIPAL="llama3.2:3b"
    MODELO_CODIGO="qwen2.5-coder:7b"
    MODELO_TEXTO="mistral:7b"
    echo -e "  ${GREEN}Hardware bom!${NC} Instalando modelos de 3B-7B parametros."
elif [ "$RAM_GB" -ge 8 ]; then
    # 8-16GB RAM: modelos medios
    MODELO_PRINCIPAL="llama3.2:3b"
    MODELO_CODIGO="qwen2.5-coder:3b"
    MODELO_TEXTO="phi3:mini"
    echo -e "  ${YELLOW}Hardware moderado.${NC} Instalando modelos de 3B parametros."
else
    # <8GB RAM: modelos leves
    MODELO_PRINCIPAL="llama3.2:1b"
    MODELO_CODIGO="qwen2.5-coder:1.5b"
    MODELO_TEXTO=""
    echo -e "  ${YELLOW}Hardware limitado.${NC} Instalando modelos compactos."
fi

echo ""

# ============================================================
# ETAPA 4: Baixar modelos
# ============================================================
echo -e "${BLUE}[4/4]${NC} Baixando modelos (pode demorar alguns minutos)..."
echo ""

baixar_modelo() {
    local modelo="$1"
    local descricao="$2"

    if [ -z "$modelo" ]; then return; fi

    echo -e "  Baixando ${BOLD}$modelo${NC} ($descricao)..."
    if ollama pull "$modelo" 2>&1 | tail -1; then
        echo -e "  ${GREEN}✓${NC} $modelo instalado"
    else
        echo -e "  ${RED}✗${NC} Erro ao baixar $modelo"
    fi
    echo ""
}

baixar_modelo "$MODELO_PRINCIPAL" "modelo principal - bom para peticoes e textos juridicos"
baixar_modelo "$MODELO_CODIGO" "otimizado para codigo e calculos"
[ -n "$MODELO_TEXTO" ] && baixar_modelo "$MODELO_TEXTO" "alternativo para textos longos em portugues"

# ============================================================
# Criar perfil OpenClaude para Ollama
# ============================================================
OPENCLAUDE_DIR="$PROJECT_DIR/openclaude"

if [ -d "$OPENCLAUDE_DIR" ]; then
    cat > "$OPENCLAUDE_DIR/.openclaude-profile.json" << PROFILE_EOF
{
  "provider": "ollama",
  "model": "$MODELO_PRINCIPAL",
  "baseUrl": "http://localhost:11434",
  "description": "Ollama local - Claude Code Juridico"
}
PROFILE_EOF
    echo -e "${GREEN}✓${NC} Perfil OpenClaude configurado para Ollama"
fi

# ============================================================
# RESUMO
# ============================================================
echo ""
echo -e "${CYAN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║             OLLAMA CONFIGURADO                               ║${NC}"
echo -e "${CYAN}╠══════════════════════════════════════════════════════════════╣${NC}"
echo -e "${CYAN}║${NC}                                                              ${CYAN}║${NC}"
echo -e "${CYAN}║${NC}  Modelos instalados:                                          ${CYAN}║${NC}"
echo -e "${CYAN}║${NC}    ${BOLD}$MODELO_PRINCIPAL${NC} - Peticoes, contratos, pareceres          ${CYAN}║${NC}"
echo -e "${CYAN}║${NC}    ${BOLD}$MODELO_CODIGO${NC} - Calculos e tabelas                  ${CYAN}║${NC}"
if [ -n "$MODELO_TEXTO" ]; then
echo -e "${CYAN}║${NC}    ${BOLD}$MODELO_TEXTO${NC} - Textos longos em portugues              ${CYAN}║${NC}"
fi
echo -e "${CYAN}║${NC}                                                              ${CYAN}║${NC}"
echo -e "${CYAN}║${NC}  ${BOLD}Como usar:${NC}                                                  ${CYAN}║${NC}"
echo -e "${CYAN}║${NC}                                                              ${CYAN}║${NC}"
echo -e "${CYAN}║${NC}  1. bash iniciar-ollama.sh                                    ${CYAN}║${NC}"
echo -e "${CYAN}║${NC}  2. Use /peticao-trabalhista, /execucao-condominial, etc.     ${CYAN}║${NC}"
echo -e "${CYAN}║${NC}  3. /provider para trocar modelo                              ${CYAN}║${NC}"
echo -e "${CYAN}║${NC}                                                              ${CYAN}║${NC}"
echo -e "${CYAN}║${NC}  ${BOLD}Testar modelo direto:${NC}                                       ${CYAN}║${NC}"
echo -e "${CYAN}║${NC}    ollama run $MODELO_PRINCIPAL                                ${CYAN}║${NC}"
echo -e "${CYAN}║${NC}                                                              ${CYAN}║${NC}"
echo -e "${CYAN}║${NC}  ${BOLD}Listar modelos:${NC}                                             ${CYAN}║${NC}"
echo -e "${CYAN}║${NC}    ollama list                                                 ${CYAN}║${NC}"
echo -e "${CYAN}║${NC}                                                              ${CYAN}║${NC}"
echo -e "${CYAN}║${NC}  ${BOLD}Baixar mais modelos:${NC}                                        ${CYAN}║${NC}"
echo -e "${CYAN}║${NC}    ollama pull llama3.1:8b     (mais potente)                  ${CYAN}║${NC}"
echo -e "${CYAN}║${NC}    ollama pull gemma2:9b       (Google, bom em PT-BR)          ${CYAN}║${NC}"
echo -e "${CYAN}║${NC}    ollama pull codellama:13b   (especialista em codigo)        ${CYAN}║${NC}"
echo -e "${CYAN}║${NC}                                                              ${CYAN}║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}${BOLD}Ollama pronto! Rode: bash iniciar-ollama.sh${NC}"
echo ""
