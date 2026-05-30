#!/bin/bash
# Instalação das ferramentas de voz e transcrição
# Paulo Nascimento - Advocacia Integrada
#
# Uso: bash instalar-voz.sh
# Uso (só Whisper): bash instalar-voz.sh --so-whisper
# Uso (só TTS): bash instalar-voz.sh --so-tts

set -e

MODO="${1:-completo}"

echo "============================================"
echo "  INSTALAÇÃO: Ferramentas de Voz Jurídica"
echo "  Paulo Nascimento - Advocacia Integrada"
echo "============================================"
echo ""

# Verifica Python
if ! command -v python3 &> /dev/null; then
    echo "ERRO: Python3 não encontrado. Instale em python.org"
    exit 1
fi

PYTHON_VER=$(python3 --version)
echo "Python: $PYTHON_VER"

# Verifica pip
if ! command -v pip3 &> /dev/null; then
    echo "Instalando pip..."
    curl -sS https://bootstrap.pypa.io/get-pip.py | python3
fi

echo ""

# ─── WHISPER (Transcrição) ─────────────────────────────
if [[ "$MODO" != "--so-tts" ]]; then
    echo "[1/3] Instalando OpenAI Whisper (transcrição de áudio)..."
    pip3 install openai-whisper --quiet
    echo "      ✓ Whisper instalado"

    echo "[2/3] Instalando FFmpeg (necessário para Whisper)..."
    if command -v apt-get &> /dev/null; then
        sudo apt-get install -y ffmpeg --quiet
    elif command -v brew &> /dev/null; then
        brew install ffmpeg
    elif command -v winget &> /dev/null; then
        winget install ffmpeg
    else
        echo "      ⚠ FFmpeg não instalado automaticamente."
        echo "      → Baixe em: https://ffmpeg.org/download.html"
    fi
    echo "      ✓ FFmpeg pronto"
fi

# ─── COQUI TTS (Síntese de voz) ───────────────────────
if [[ "$MODO" != "--so-whisper" ]]; then
    echo "[3/3] Instalando Coqui TTS (síntese de voz)..."
    pip3 install TTS --quiet
    echo "      ✓ Coqui TTS instalado"
fi

# ─── TESTE RÁPIDO ─────────────────────────────────────
echo ""
echo "Verificando instalação..."

if [[ "$MODO" != "--so-tts" ]]; then
    python3 -c "import whisper; print('  ✓ Whisper:', whisper.__version__ if hasattr(whisper, '__version__') else 'ok')" 2>/dev/null || echo "  ✗ Whisper com problema"
fi

if [[ "$MODO" != "--so-whisper" ]]; then
    python3 -c "from TTS.api import TTS; print('  ✓ Coqui TTS: ok')" 2>/dev/null || echo "  ✗ Coqui TTS com problema"
fi

echo ""
echo "============================================"
echo "  INSTALAÇÃO CONCLUÍDA"
echo "============================================"
echo ""
echo "Próximos passos:"
echo "  1. Transcrever áudio:"
echo "     python3 tools/transcrever.py sua-gravacao.mp3"
echo ""
echo "  2. Gerar áudio a partir de texto:"
echo "     python3 tools/tts.py 'Texto aqui' --saida saida.mp3"
echo ""
echo "  3. Pipeline completo de reunião:"
echo "     bash tools/pipeline-audio.sh reuniao-cliente.mp3 consulta"
echo ""
echo "  4. Via Claude Code, use os comandos:"
echo "     /transcrever-audio | /gerar-audio | /pipeline-reuniao"
echo ""
