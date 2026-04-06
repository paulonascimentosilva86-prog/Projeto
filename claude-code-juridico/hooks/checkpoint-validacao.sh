#!/bin/bash
# Hook: Checkpoint de Validacao Avancado (Orchestration Prompting)
# Valida estrutura, guardrails e completude do documento juridico

FILE="$1"
if [ -z "$FILE" ] || [ ! -f "$FILE" ]; then
    exit 0
fi

ERRORS=0
WARNINGS=0

# === CHECKPOINT 1: ESTRUTURA BASICA ===
echo "[CHECKPOINT 1] Verificando estrutura do documento..."

check_required() {
    if ! grep -qi "$1" "$FILE"; then
        echo "  [ERRO] Ausente: $2"
        ERRORS=$((ERRORS + 1))
    else
        echo "  [OK] $2"
    fi
}

check_required "enderecamento\|excelentissimo\|meritissimo\|juizo\|vara" "Enderecamento"
check_required "qualificacao\|qualificad\|inscrit.*CPF\|inscrit.*CNPJ" "Qualificacao das partes"
check_required "dos fatos\|fatos\|sinopse" "Secao de fatos"
check_required "do direito\|fundament\|merito" "Fundamentacao juridica"
check_required "dos pedidos\|requer\|pede" "Pedidos"
check_required "valor da causa\|da-se.*causa.*valor" "Valor da causa"

# === CHECKPOINT 2: GUARDRAILS JURIDICOS ===
echo ""
echo "[CHECKPOINT 2] Verificando guardrails juridicos..."

# Verificar se ha CPF ou CNPJ mencionado
if ! grep -qE "[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}|[0-9]{2}\.[0-9]{3}\.[0-9]{3}/[0-9]{4}-[0-9]{2}" "$FILE"; then
    echo "  [ALERTA] CPF/CNPJ nao encontrado no formato padrao"
    WARNINGS=$((WARNINGS + 1))
fi

# Verificar fundamentacao legal (artigos de lei)
if ! grep -qiE "art\.|artigo|lei [0-9]|codigo civil|CPC|CLT|CF" "$FILE"; then
    echo "  [ERRO] Nenhuma referencia legal encontrada"
    ERRORS=$((ERRORS + 1))
else
    echo "  [OK] Referencias legais presentes"
fi

# Verificar se multa condominial esta correta (max 2%)
if grep -qi "condominial\|condominio\|cota" "$FILE"; then
    if grep -qiE "multa.*(3|4|5|[1-9][0-9])%" "$FILE"; then
        echo "  [ERRO] GUARDRAIL: Multa condominial acima de 2% detectada (art. 1.336 §1 CC)"
        ERRORS=$((ERRORS + 1))
    else
        echo "  [OK] Multa condominial dentro do limite"
    fi
fi

# === CHECKPOINT 3: COMPLETUDE ===
echo ""
echo "[CHECKPOINT 3] Verificando completude..."

# Verificar assinatura/encerramento
if grep -qi "advogad\|OAB\|termos.*pede.*deferimento" "$FILE"; then
    echo "  [OK] Encerramento presente"
else
    echo "  [ALERTA] Encerramento/assinatura possivelmente ausente"
    WARNINGS=$((WARNINGS + 1))
fi

# Verificar documentos anexos
if grep -qi "anex\|document\|junt" "$FILE"; then
    echo "  [OK] Referencia a documentos anexos"
else
    echo "  [ALERTA] Sem mencao a documentos anexos"
    WARNINGS=$((WARNINGS + 1))
fi

# === RESULTADO FINAL ===
echo ""
echo "════════════════════════════════════════"
if [ $ERRORS -gt 0 ]; then
    echo "[VALIDACAO] $ERRORS erro(s) e $WARNINGS alerta(s) encontrados"
    echo "[ACAO] Revise os erros antes de protocolar"
elif [ $WARNINGS -gt 0 ]; then
    echo "[VALIDACAO] Aprovado com $WARNINGS alerta(s) - verifique"
else
    echo "[VALIDACAO] Documento aprovado em todos os checkpoints"
fi
echo "════════════════════════════════════════"

exit 0
