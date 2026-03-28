# Phase 1 Research: Calculadoras Blindadas

**Date:** 2026-03-28

## Objective

Research what's needed to implement automated tests for 5 legal calculators, ensuring mathematical precision with decimal.js.

## Calculator Analysis

### 1. Calculadora Condominial (`calculadora-condominial.md`)
**Formula chain:**
- Multa = Principal × 2%
- Juros = (Principal + Multa) × 1% × meses_atraso
- Correção = INPC acumulado do vencimento até data-base
- Subtotal = Principal + Multa + Juros + Correção
- Honorários = Subtotal × 30%
- Total = Subtotal + Honorários

**Test cases needed:**
- Single month (caso mínimo)
- 6 months (caso típico)
- 60 months (caso extremo)
- Pro rata die juros
- Valores com centavos (floating point trap)

### 2. Calculadora Distrato (`calculadora-distrato.md`)
**Formula chain (desistência comprador):**
- Regime comum: retenção máxima 25% (art. 67-A, §5º)
- Patrimônio afetação: retenção máxima 50% (art. 67-A, §2º)
- Deduções: comissão corretagem + IPTU + condomínio + taxa fruição (0.5% valor/mês)
- Valor a devolver = Pago - Retenção - Deduções
- Prazo: 180 dias (regime comum) ou 30 dias após habite-se (afetação)

**Atraso construtora:**
- Tolerância 180 dias (art. 43-A)
- Devolução integral + correção INCC + multa contratual
- Prazo: 60 dias

**Arrependimento: 7 dias, devolução integral**

**Test cases:** Cada regime × cada motivo × com/sem uso do imóvel

### 3. Calculadora Aluguel (`calculadora-aluguel.md`)
**Fórmula:** Novo = Atual × (1 + índice/100)
**Índices:** IGP-M, IPCA, INPC
**Comparativo:** Calcula os 3 índices lado a lado

**Test cases:**
- Reajuste anual simples
- Reajuste acumulado (mais de 1 ano sem reajuste)
- Índice negativo (IGP-M negativo — controverso)

### 4. Calculadora Insalubridade/Periculosidade (`insalubridade-periculosidade.md`)
**Insalubridade:** Base = salário mínimo × grau (10%, 20%, 40%)
**Periculosidade:** Base = salário-base × 30%
**Reflexos:** férias+1/3, 13º, FGTS 8%, horas extras, aviso prévio
**Regra:** NÃO cumulam (empregado escolhe o mais vantajoso)

**Test cases:** Cada grau × com/sem reflexos × período de meses

### 5. Simulador Reclamatória (`simulador-reclamatoria.md`)
**Verbas:** saldo salário, aviso prévio (30+3/ano, max 90), 13º proporcional, férias+1/3, FGTS+40%, horas extras+reflexos, dano moral (art. 223-G), honorários 5-15%
**3 cenários:** Otimista (100%), Realista (70%), Acordo (50-60%)

**Test cases:**
- Sem justa causa (todas as verbas)
- Justa causa (apenas saldo + férias vencidas)
- Pedido de demissão (sem multa FGTS, sem aviso)

## Architecture Decision

### Why deterministic test functions, not LLM testing

As calculadoras são prompts Markdown — o Claude executa os cálculos inline. Para testá-las deterministicamente:

1. **Extrair as fórmulas** em funções TypeScript puras (`src/calculadoras/*.ts`)
2. **Testar as funções** com Vitest e valores conhecidos
3. **Os commands** continuam usando as instruções Markdown, mas agora temos implementações de referência verificadas

### Stack
- **Vitest 4.x** — test runner
- **decimal.js** — precisão financeira (ROUND_HALF_UP)
- **Diretório:** `tests/calculadoras/`
- **Funções:** `src/calculadoras/condominial.ts`, `distrato.ts`, `aluguel.ts`, `trabalhista.ts`, `reclamatoria.ts`

## Validation Architecture

### Dimension 1: Unit Tests (calculadoras)
Each calculator function tested with known inputs → expected outputs.

### Dimension 2: Edge Cases
- Zero values, single period, maximum periods
- Floating point traps (R$ 0.01 precision)
- Negative indices (IGP-M negativo)

### Dimension 3: Cross-validation
- Compare results against Calculadora do Cidadão (BCB) for INPC corrections
- Compare against JurisCalc (TJDFT) for condominial calculations

---

*Phase research: 2026-03-28*
