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
