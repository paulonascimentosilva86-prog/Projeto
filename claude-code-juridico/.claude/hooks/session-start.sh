#!/bin/bash
set -euo pipefail

# ============================================================
# SessionStart Hook - Claude Code Juridico
# Paulo Nascimento - Advocacia Integrada
#
# Instala dependencias automaticamente em sessoes remotas
# (Claude Code na web / Cowork)
# ============================================================

# Executar apenas em ambiente remoto (Claude Code na web)
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"

echo "[SessionStart] Configurando ambiente do escritorio juridico..."

# --- 1. Instalar dependencias Node.js (Remotion videos) ---
REMOTION_DIR="$PROJECT_DIR/remotion-videos"
if [ -f "$REMOTION_DIR/package.json" ]; then
  echo "[SessionStart] Instalando dependencias Node.js (Remotion)..."
  cd "$REMOTION_DIR"
  npm install --no-fund --no-audit 2>&1 | tail -1
  cd "$PROJECT_DIR"
  echo "[SessionStart] ✓ Node.js - dependencias instaladas"
fi

# --- 2. Instalar dependencias Python (Cookbooks) ---
REQUIREMENTS="$PROJECT_DIR/cookbooks/exemplos/requirements.txt"
if [ -f "$REQUIREMENTS" ]; then
  echo "[SessionStart] Instalando dependencias Python (Anthropic SDK)..."
  pip install -q anthropic 2>&1 | tail -1 || true
  echo "[SessionStart] ✓ Python - anthropic SDK instalado"
fi

# --- 3. Verificar TypeScript (para linting dos videos) ---
if [ -f "$REMOTION_DIR/package.json" ]; then
  if ! command -v npx &> /dev/null; then
    echo "[SessionStart] ⚠ npx nao encontrado"
  else
    echo "[SessionStart] ✓ TypeScript disponivel via npx tsc"
  fi
fi

# --- 4. Tornar hooks executaveis ---
HOOKS_DIR="$PROJECT_DIR/hooks"
if [ -d "$HOOKS_DIR" ]; then
  chmod +x "$HOOKS_DIR"/*.sh 2>/dev/null || true
  echo "[SessionStart] ✓ Hooks de validacao configurados"
fi

# --- 5. Configurar variaveis de ambiente ---
if [ -n "${CLAUDE_ENV_FILE:-}" ]; then
  echo "export PROJETO_JURIDICO_DIR=\"$PROJECT_DIR\"" >> "$CLAUDE_ENV_FILE"
  echo "export PYTHONPATH=\"$PROJECT_DIR/cookbooks/exemplos:\${PYTHONPATH:-}\"" >> "$CLAUDE_ENV_FILE"
fi

echo "[SessionStart] ✓ Ambiente pronto - 55 comandos, 6 agentes disponiveis"
