#!/bin/bash
# Pipeline completo: Transcrição → Análise jurídica → Relatório
# Paulo Nascimento - Advocacia Integrada
#
# Uso: ./pipeline-audio.sh reuniao-cliente.mp3 [tipo]
# Tipos: consulta | audiencia | reuniao | depoimento
#
# Exemplo:
#   ./pipeline-audio.sh gravacao.mp4 consulta
#   ./pipeline-audio.sh audiencia-trabalhista.mp3 audiencia

set -e

AUDIO="$1"
TIPO="${2:-consulta}"
DATA=$(date +%Y%m%d_%H%M)
DIR_BASE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DIR_SAIDA="$DIR_BASE/transcricoes"
NOME_BASE=$(basename "$AUDIO" | sed 's/\.[^.]*$//')

if [ -z "$AUDIO" ]; then
    echo "Uso: $0 <arquivo_audio> [tipo]"
    echo "Tipos: consulta | audiencia | reuniao | depoimento"
    exit 1
fi

if [ ! -f "$AUDIO" ]; then
    echo "ERRO: Arquivo '$AUDIO' não encontrado."
    exit 1
fi

mkdir -p "$DIR_SAIDA"

echo "============================================"
echo "  PIPELINE DE ÁUDIO JURÍDICO"
echo "  Paulo Nascimento - Advocacia Integrada"
echo "============================================"
echo "Arquivo: $AUDIO"
echo "Tipo: $TIPO"
echo "Data: $(date '+%d/%m/%Y %H:%M')"
echo "============================================"
echo ""

# Etapa 1: Transcrição
echo "[1/3] Transcrevendo áudio com Whisper..."
ARQUIVO_TRANSCRICAO="$DIR_SAIDA/${NOME_BASE}_${DATA}.txt"
python3 "$DIR_BASE/tools/transcrever.py" "$AUDIO" \
    --modelo medium \
    --timestamps \
    --saida "$ARQUIVO_TRANSCRICAO"

echo ""
echo "[2/3] Transcrição concluída: $ARQUIVO_TRANSCRICAO"
echo ""

# Etapa 2: Gerar relatório com cabeçalho
ARQUIVO_RELATORIO="$DIR_SAIDA/${NOME_BASE}_relatorio_${DATA}.txt"
cat > "$ARQUIVO_RELATORIO" << EOF
============================================
RELATÓRIO DE $( echo "$TIPO" | tr '[:lower:]' '[:upper:]')
Paulo Nascimento - Advocacia Integrada
============================================
Data: $(date '+%d/%m/%Y %H:%M')
Arquivo de origem: $AUDIO
Tipo: $TIPO
============================================

PRÓXIMOS PASSOS SUGERIDOS:
[ ] Revisar transcrição para erros
[ ] Identificar partes e fatos relevantes
[ ] Verificar prazos e obrigações mencionados
[ ] Abrir processo no sistema interno
[ ] Enviar resumo ao cliente via /modelo-email

============================================
TRANSCRIÇÃO (ver arquivo completo):
$(cat "$ARQUIVO_TRANSCRICAO")
============================================
EOF

echo "[3/3] Relatório gerado: $ARQUIVO_RELATORIO"
echo ""
echo "============================================"
echo "  PIPELINE CONCLUÍDO COM SUCESSO"
echo "============================================"
echo ""
echo "Arquivos gerados:"
echo "  Transcrição: $ARQUIVO_TRANSCRICAO"
echo "  Relatório:   $ARQUIVO_RELATORIO"
echo ""
echo "Próximos passos:"
echo "  → Use /transcrever-audio para análise jurídica via Claude"
echo "  → Use /relatorio-cliente para gerar relatório ao cliente"
echo "  → Use /modelo-email para comunicar ao cliente"
