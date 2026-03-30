#!/bin/bash
# Hook: Validar estrutura basica de peticao (bloqueante)
# Verifica se o documento gerado possui os elementos essenciais
# Exit 1 se qualquer elemento essencial estiver ausente

FILE="$1"

# Verificar se arquivo existe e nao esta vazio
if [ -z "$FILE" ] || [ ! -f "$FILE" ] || [ ! -s "$FILE" ]; then
    echo "[ERRO] Arquivo vazio ou inexistente: ${FILE:-'(nenhum arquivo fornecido)'}"
    exit 1
fi

ERRORS=0

# Verificar enderecamento (HOOK-01)
if ! grep -qi "excelentissimo\|exmo\|meritissimo\|juiz.*vara\|tribunal\|comarca\|foro" "$FILE"; then
    echo "[ERRO] Elemento essencial ausente: Enderecamento"
    ERRORS=$((ERRORS + 1))
fi

# Verificar qualificacao das partes (HOOK-02)
if ! grep -qiE "CPF|CNPJ|brasileiro|brasileira|nacionalidade|estado civil|portador" "$FILE"; then
    echo "[ERRO] Elemento essencial ausente: Qualificacao das partes"
    ERRORS=$((ERRORS + 1))
fi

# Verificar pedidos (HOOK-03)
if ! grep -qi "dos pedidos\|requer\|ante o exposto\|pede deferimento" "$FILE"; then
    echo "[ERRO] Elemento essencial ausente: Pedidos"
    ERRORS=$((ERRORS + 1))
fi

# Se elementos essenciais ausentes, bloquear
if [ $ERRORS -gt 0 ]; then
    exit 1
fi

# Validacao por tipo (HOOK-04)

# Verificar tipo condominial
if grep -qi "condominial\|cota condominial\|condominio" "$FILE"; then
    if ! grep -qi "planilha\|discrimina" "$FILE"; then
        echo "[ERRO] Validacao de tipo: peticao condominial exige planilha de debito"
        exit 1
    fi
fi

# Verificar tipo trabalhista
if grep -qi "trabalhista\|reclamacao trabalhista\|reclamante" "$FILE"; then
    if ! grep -qi "verbas\|FGTS\|rescisoria\|horas extras\|salario" "$FILE"; then
        echo "[ERRO] Validacao de tipo: peticao trabalhista exige verbas rescisorias"
        exit 1
    fi
fi

echo "[VALIDACAO] ✓ Peticao validada com sucesso"
exit 0
