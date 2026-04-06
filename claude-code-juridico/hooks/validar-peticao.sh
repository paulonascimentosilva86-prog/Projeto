#!/bin/bash
# Hook: Validacao completa com checkpoints de orquestracao
# Verifica estrutura, guardrails e completude do documento juridico

FILE="$1"
if [ -z "$FILE" ] || [ ! -f "$FILE" ]; then
    exit 0
fi

ERRORS=0
WARNINGS=0

echo "═══════════════════════════════════════════"
echo "    CHECKPOINT DE VERIFICACAO JURIDICA"
echo "═══════════════════════════════════════════"

# ─── CHECKPOINT 1: ESTRUTURA DA PETICAO ───
echo ""
echo "▸ CHECKPOINT 1: Estrutura do Documento"

check_element() {
    if ! grep -qi "$1" "$FILE"; then
        echo "  [✗ ERRO] Elemento ausente: $2"
        ERRORS=$((ERRORS + 1))
    else
        echo "  [✓] $2"
    fi
}

check_element "enderecamento\|excelentissimo\|meritissimo\|juizo\|vara" "Enderecamento"
check_element "qualificacao\|qualificado\|inscrit" "Qualificacao das partes"
check_element "dos fatos\|fatos\|sinopse" "Secao de fatos"
check_element "do direito\|fundament\|merito" "Fundamentacao juridica"
check_element "dos pedidos\|requer\|pede" "Pedidos"
check_element "valor da causa\|atribui.*causa" "Valor da causa"

# ─── CHECKPOINT 2: GUARDRAILS JURIDICOS ───
echo ""
echo "▸ CHECKPOINT 2: Guardrails Juridicos"

# Verificar se ha CPF/CNPJ
if grep -qiE "CPF|CNPJ|[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}|[0-9]{2}\.[0-9]{3}\.[0-9]{3}/[0-9]{4}-[0-9]{2}" "$FILE"; then
    echo "  [✓] CPF/CNPJ presente"
else
    echo "  [! ALERTA] CPF/CNPJ possivelmente ausente"
    WARNINGS=$((WARNINGS + 1))
fi

# Verificar base legal
if grep -qiE "art\.|artigo|lei [0-9]|codigo civil|CPC|CLT|CDC|CF" "$FILE"; then
    echo "  [✓] Base legal referenciada"
else
    echo "  [✗ ERRO] Nenhuma base legal encontrada"
    ERRORS=$((ERRORS + 1))
fi

# Verificar se multa condominial excede 2% (guardrail)
# Apenas verifica em documentos condominiais para evitar falsos positivos (ex: multa 40% FGTS)
if grep -qi "condominial\|condominio\|cota condominial" "$FILE"; then
    if grep -qiE "multa.*(3|4|5|[6-9]|[1-9][0-9])%" "$FILE"; then
        echo "  [✗ ERRO] GUARDRAIL: Multa condominial possivelmente acima de 2% (art. 1.336 §1 CC)"
        ERRORS=$((ERRORS + 1))
    else
        echo "  [✓] Multa condominial dentro do limite"
    fi
elif grep -qi "multa" "$FILE"; then
    echo "  [✓] Multa mencionada (contexto nao-condominial)"
fi

# ─── CHECKPOINT 3: COMPLETUDE ───
echo ""
echo "▸ CHECKPOINT 3: Completude"

# Contar secoes principais
SECOES=$(grep -ciE "^#+\s|^[IVX]+\s*[-.]|^[0-9]+\s*[-.]" "$FILE" 2>/dev/null || echo "0")
if [ "$SECOES" -ge 4 ]; then
    echo "  [✓] Documento estruturado ($SECOES secoes encontradas)"
else
    echo "  [! ALERTA] Poucas secoes ($SECOES). Verificar estrutura."
    WARNINGS=$((WARNINGS + 1))
fi

# Verificar assinatura/encerramento
if grep -qiE "advogad|OAB|termos em que|pede deferimento|nestes termos" "$FILE"; then
    echo "  [✓] Encerramento/assinatura presente"
else
    echo "  [! ALERTA] Encerramento possivelmente ausente"
    WARNINGS=$((WARNINGS + 1))
fi

# Verificar documentos anexos
if grep -qiE "anexo|document|junt" "$FILE"; then
    echo "  [✓] Documentos/anexos referenciados"
else
    echo "  [! ALERTA] Nenhuma referencia a documentos anexos"
    WARNINGS=$((WARNINGS + 1))
fi

# ─── RESULTADO FINAL ───
echo ""
echo "═══════════════════════════════════════════"
if [ $ERRORS -gt 0 ]; then
    echo "  RESULTADO: $ERRORS ERRO(S) + $WARNINGS alerta(s)"
    echo "  ACAO: Revisar antes de finalizar!"
elif [ $WARNINGS -gt 0 ]; then
    echo "  RESULTADO: ✓ Sem erros | $WARNINGS alerta(s)"
    echo "  ACAO: Verificar alertas manualmente"
else
    echo "  RESULTADO: ✓ TODOS OS CHECKPOINTS APROVADOS"
fi
echo "═══════════════════════════════════════════"

exit 0
