#!/bin/bash

# ============================================================
# INTEGRADOR - OpenClaude + Claude Code Juridico
# Paulo Nascimento - Advocacia Integrada
# Integra o OpenClaude (multi-provedor) com skills juridicos
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
OPENCLAUDE_DIR="$PROJECT_DIR/openclaude"
CLAUDE_HOME="$HOME/.claude"

echo ""
echo -e "${CYAN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                                                              ║${NC}"
echo -e "${CYAN}║  ${BOLD}  OPENCLAUDE + CLAUDE CODE JURIDICO ${NC}${CYAN}                        ║${NC}"
echo -e "${CYAN}║  ${NC}  Integracao Multi-Provedor para Advocacia ${CYAN}                ║${NC}"
echo -e "${CYAN}║  ${NC}  OpenAI | Gemini | DeepSeek | Ollama | 200+ modelos ${CYAN}      ║${NC}"
echo -e "${CYAN}║                                                              ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# ============================================================
# ETAPA 1: Verificar pre-requisitos
# ============================================================
echo -e "${BLUE}[1/5]${NC} Verificando pre-requisitos..."

# Verificar Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "  ${GREEN}✓${NC} Node.js $NODE_VERSION"
else
    echo -e "  ${RED}✗${NC} Node.js nao encontrado (necessario >= 20.0.0)"
    echo -e "  ${YELLOW}  Instale: https://nodejs.org/${NC}"
    exit 1
fi

# Verificar npm/bun
if command -v bun &> /dev/null; then
    PKG_MANAGER="bun"
    echo -e "  ${GREEN}✓${NC} Bun encontrado (recomendado)"
elif command -v npm &> /dev/null; then
    PKG_MANAGER="npm"
    echo -e "  ${GREEN}✓${NC} npm encontrado"
else
    echo -e "  ${RED}✗${NC} Nenhum gerenciador de pacotes encontrado (npm ou bun)"
    exit 1
fi

# Verificar OpenClaude clonado
if [ -d "$OPENCLAUDE_DIR" ]; then
    echo -e "  ${GREEN}✓${NC} OpenClaude encontrado em $OPENCLAUDE_DIR"
else
    echo -e "  ${RED}✗${NC} OpenClaude nao encontrado. Clone primeiro:"
    echo -e "  ${YELLOW}  git clone https://github.com/Gitlawb/openclaude.git $OPENCLAUDE_DIR${NC}"
    exit 1
fi

echo ""

# ============================================================
# ETAPA 2: Instalar dependencias do OpenClaude
# ============================================================
echo -e "${BLUE}[2/5]${NC} Instalando dependencias do OpenClaude..."

cd "$OPENCLAUDE_DIR"

if [ "$PKG_MANAGER" = "bun" ]; then
    bun install 2>&1 | tail -3
else
    npm install 2>&1 | tail -3
fi

echo -e "  ${GREEN}✓${NC} Dependencias instaladas"

# Build do OpenClaude
echo -e "  Compilando OpenClaude..."
if [ "$PKG_MANAGER" = "bun" ]; then
    bun run build 2>&1 | tail -3
else
    npm run build 2>&1 | tail -3
fi

echo -e "  ${GREEN}✓${NC} OpenClaude compilado"
echo ""

# ============================================================
# ETAPA 3: Copiar skills juridicos para OpenClaude
# ============================================================
echo -e "${BLUE}[3/5]${NC} Integrando skills juridicos ao OpenClaude..."

# Criar diretorio de skills no OpenClaude
OPENCLAUDE_SKILLS="$OPENCLAUDE_DIR/.claude/commands"
mkdir -p "$OPENCLAUDE_SKILLS"

# Copiar todos os comandos slash do projeto juridico
COMMANDS_SRC="$PROJECT_DIR/.claude/commands"
if [ -d "$COMMANDS_SRC" ]; then
    SKILL_COUNT=0
    for cmd_file in "$COMMANDS_SRC"/*.md; do
        if [ -f "$cmd_file" ]; then
            cp "$cmd_file" "$OPENCLAUDE_SKILLS/"
            SKILL_COUNT=$((SKILL_COUNT + 1))
        fi
    done
    echo -e "  ${GREEN}✓${NC} $SKILL_COUNT skills juridicos copiados"
else
    echo -e "  ${YELLOW}⚠${NC} Nenhum skill encontrado em $COMMANDS_SRC"
fi

# Copiar agentes
OPENCLAUDE_AGENTS="$OPENCLAUDE_DIR/agentes"
if [ -d "$PROJECT_DIR/agentes" ]; then
    cp -r "$PROJECT_DIR/agentes" "$OPENCLAUDE_AGENTS"
    AGENT_COUNT=$(find "$OPENCLAUDE_AGENTS" -name "AGENT.md" | wc -l)
    echo -e "  ${GREEN}✓${NC} $AGENT_COUNT agentes especializados copiados"
fi

# Copiar CLAUDE.md
if [ -f "$PROJECT_DIR/CLAUDE.md" ]; then
    cp "$PROJECT_DIR/CLAUDE.md" "$OPENCLAUDE_DIR/CLAUDE.md"
    echo -e "  ${GREEN}✓${NC} CLAUDE.md do projeto copiado"
fi

echo ""

# ============================================================
# ETAPA 4: Criar perfil de provedor
# ============================================================
echo -e "${BLUE}[4/5]${NC} Configurando provedores..."

# Criar arquivo de configuracao de provedores
cat > "$PROJECT_DIR/provedores.md" << 'PROVIDER_EOF'
# Configuracao de Provedores - OpenClaude Juridico

## Como usar com diferentes provedores:

### OpenAI (GPT-4o, GPT-4, o3)
```bash
export OPENAI_API_KEY="sk-..."
cd openclaude && node dist/cli.mjs
# ou: openclaude (se instalado globalmente)
```

### Google Gemini
```bash
export GEMINI_API_KEY="AIza..."
cd openclaude && node dist/cli.mjs
# Use /provider para trocar para Gemini
```

### DeepSeek
```bash
export OPENAI_API_KEY="sk-..."
export OPENAI_BASE_URL="https://api.deepseek.com/v1"
export OPENAI_MODEL="deepseek-chat"
cd openclaude && node dist/cli.mjs
```

### Ollama (local, sem internet)
```bash
# Instale: curl -fsSL https://ollama.com/install.sh | sh
# Baixe um modelo: ollama pull llama3.2
cd openclaude && node dist/cli.mjs
# Use /provider para trocar para Ollama
```

### Usando com skills juridicos
Todos os comandos slash (/peticao-trabalhista, /execucao-condominial, etc.)
funcionam normalmente com qualquer provedor configurado.

### Trocar provedor em tempo real
Dentro do OpenClaude, use:
- `/provider` - listar e trocar provedores
- `/provider save meu-perfil` - salvar configuracao atual
- `/provider load meu-perfil` - carregar configuracao salva
PROVIDER_EOF

echo -e "  ${GREEN}✓${NC} Guia de provedores criado em provedores.md"
echo ""

# ============================================================
# ETAPA 5: Criar script de execucao rapida
# ============================================================
echo -e "${BLUE}[5/5]${NC} Criando atalhos de execucao..."

# Script principal para rodar OpenClaude com skills juridicos
cat > "$PROJECT_DIR/iniciar-openclaude.sh" << 'EXEC_EOF'
#!/bin/bash
# Inicia o OpenClaude com os skills juridicos integrados

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OPENCLAUDE_DIR="$SCRIPT_DIR/openclaude"

if [ ! -f "$OPENCLAUDE_DIR/dist/cli.mjs" ]; then
    echo "OpenClaude nao esta compilado. Execute primeiro:"
    echo "  bash openclaude-integrar.sh"
    exit 1
fi

cd "$OPENCLAUDE_DIR"

# Passar argumentos para o OpenClaude
if command -v node &> /dev/null; then
    node dist/cli.mjs "$@"
else
    echo "Node.js nao encontrado. Instale: https://nodejs.org/"
    exit 1
fi
EXEC_EOF

chmod +x "$PROJECT_DIR/iniciar-openclaude.sh"
echo -e "  ${GREEN}✓${NC} iniciar-openclaude.sh criado"

# Script para Ollama (uso local)
cat > "$PROJECT_DIR/iniciar-ollama.sh" << 'OLLAMA_EOF'
#!/bin/bash
# Inicia o OpenClaude com Ollama (100% local, sem internet)

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OPENCLAUDE_DIR="$SCRIPT_DIR/openclaude"

# Verificar Ollama
if ! command -v ollama &> /dev/null; then
    echo "Ollama nao encontrado. Instale:"
    echo "  curl -fsSL https://ollama.com/install.sh | sh"
    exit 1
fi

# Verificar se Ollama esta rodando
if ! curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo "Iniciando Ollama..."
    ollama serve &
    sleep 2
fi

# Verificar modelos disponiveis
MODELS=$(curl -s http://localhost:11434/api/tags | grep -o '"name":"[^"]*"' | head -5)
if [ -z "$MODELS" ]; then
    echo "Nenhum modelo encontrado. Baixe um modelo:"
    echo "  ollama pull llama3.2       (leve, rapido)"
    echo "  ollama pull qwen2.5-coder  (otimizado para codigo)"
    echo "  ollama pull mistral        (bom para portugues)"
    exit 1
fi

cd "$OPENCLAUDE_DIR"
export OLLAMA_HOST="http://localhost:11434"
node dist/cli.mjs "$@"
OLLAMA_EOF

chmod +x "$PROJECT_DIR/iniciar-ollama.sh"
echo -e "  ${GREEN}✓${NC} iniciar-ollama.sh criado (uso local)"

echo ""

# ============================================================
# RESUMO FINAL
# ============================================================
TOTAL_SKILLS=$(find "$COMMANDS_SRC" -name "*.md" 2>/dev/null | wc -l)

echo -e "${CYAN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║             INTEGRACAO CONCLUIDA                             ║${NC}"
echo -e "${CYAN}╠══════════════════════════════════════════════════════════════╣${NC}"
echo -e "${CYAN}║${NC}  OpenClaude:   ${GREEN}${BOLD}Clonado e compilado${NC}                           ${CYAN}║${NC}"
echo -e "${CYAN}║${NC}  Skills:       ${GREEN}${BOLD}$TOTAL_SKILLS comandos juridicos integrados${NC}               ${CYAN}║${NC}"
echo -e "${CYAN}║${NC}  Provedores:   ${GREEN}${BOLD}200+ modelos disponiveis${NC}                      ${CYAN}║${NC}"
echo -e "${CYAN}╠══════════════════════════════════════════════════════════════╣${NC}"
echo -e "${CYAN}║             COMO INICIAR                                     ║${NC}"
echo -e "${CYAN}╠══════════════════════════════════════════════════════════════╣${NC}"
echo -e "${CYAN}║${NC}                                                              ${CYAN}║${NC}"
echo -e "${CYAN}║${NC}  ${BOLD}Com OpenAI/Gemini/DeepSeek:${NC}                                  ${CYAN}║${NC}"
echo -e "${CYAN}║${NC}    export OPENAI_API_KEY=\"sk-...\"                              ${CYAN}║${NC}"
echo -e "${CYAN}║${NC}    bash iniciar-openclaude.sh                                  ${CYAN}║${NC}"
echo -e "${CYAN}║${NC}                                                              ${CYAN}║${NC}"
echo -e "${CYAN}║${NC}  ${BOLD}Com Ollama (local, sem internet):${NC}                            ${CYAN}║${NC}"
echo -e "${CYAN}║${NC}    bash iniciar-ollama.sh                                      ${CYAN}║${NC}"
echo -e "${CYAN}║${NC}                                                              ${CYAN}║${NC}"
echo -e "${CYAN}║${NC}  ${BOLD}Trocar provedor em tempo real:${NC}                               ${CYAN}║${NC}"
echo -e "${CYAN}║${NC}    /provider                                                   ${CYAN}║${NC}"
echo -e "${CYAN}║${NC}                                                              ${CYAN}║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}${BOLD}Integracao concluida com sucesso!${NC}"
echo -e "Consulte ${BOLD}provedores.md${NC} para detalhes de configuracao."
echo ""
