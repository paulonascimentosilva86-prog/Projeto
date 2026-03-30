import Decimal from 'decimal.js'
import { toDecimal, arredondar } from './decimal-utils'

export type IndiceAluguel = 'IGP-M' | 'IPCA' | 'INPC'

export interface AluguelInput {
  valorAtual: number
  indice: IndiceAluguel
  percentualIndice: number    // variacao percentual do indice, ex: 10.5 para 10.5%
  permitirReducao?: boolean   // default false — se false, nunca reduz o aluguel
}

export interface AluguelAcumuladoInput {
  valorAtual: number
  fatoresAnuais: number[]     // ex: [5.0, 3.5, 8.2] para 3 anos de indices
  permitirReducao?: boolean
}

export interface AluguelComparativoInput {
  valorAtual: number
  percentuaisIndices: Partial<Record<IndiceAluguel, number>>
  permitirReducao?: boolean
}

export interface AluguelResult {
  valorAtual: string
  indice: string
  percentualAplicado: string
  novoValor: string
  diferenca: string           // novo - atual
  variacaoPercentual: string  // percentual real aplicado
}

export interface AluguelComparativoResult {
  valorAtual: string
  resultados: Record<IndiceAluguel, AluguelResult>
  maisVantajoso: IndiceAluguel  // para o locador: maior valor
}

/**
 * Calcula o reajuste de aluguel por um unico indice.
 * Formula: novoValor = valorAtual x (1 + percentualIndice/100)
 * Se permitirReducao=false (default) e o indice for negativo, o valor nao reduz.
 */
export function calcularReajusteAluguel(input: AluguelInput): AluguelResult {
  const { valorAtual, indice, percentualIndice, permitirReducao = false } = input

  const base = toDecimal(valorAtual)
  const fator = toDecimal(1).add(toDecimal(percentualIndice).div(100))
  let calculado = base.mul(fator)

  // Indice negativo: se nao permite reducao, mantem o valor atual
  if (!permitirReducao && calculado.lt(base)) {
    calculado = base
  }

  const percentualReal = calculado.sub(base).div(base).mul(100)

  return {
    valorAtual: arredondar(base),
    indice,
    percentualAplicado: arredondar(percentualIndice),
    novoValor: arredondar(calculado),
    diferenca: arredondar(calculado.sub(base)),
    variacaoPercentual: arredondar(percentualReal),
  }
}

/**
 * Calcula o reajuste acumulado quando o aluguel nao foi reajustado por mais de 1 ano.
 * Usa produto de fatores anuais (nao soma):
 *   valorFinal = valorAtual x fator1 x fator2 x ... x fatorN
 */
export function calcularReajusteAcumulado(input: AluguelAcumuladoInput): AluguelResult {
  const { valorAtual, fatoresAnuais, permitirReducao = false } = input

  const base = toDecimal(valorAtual)

  // Aplica cada fator sequencialmente (produto, nao soma)
  let acumulado = base
  for (const fatorPct of fatoresAnuais) {
    const fator = toDecimal(1).add(toDecimal(fatorPct).div(100))
    let proximo = acumulado.mul(fator)
    if (!permitirReducao && proximo.lt(acumulado)) {
      proximo = acumulado
    }
    acumulado = proximo
  }

  const percentualTotal = acumulado.sub(base).div(base).mul(100)

  return {
    valorAtual: arredondar(base),
    indice: 'acumulado',
    percentualAplicado: arredondar(percentualTotal),
    novoValor: arredondar(acumulado),
    diferenca: arredondar(acumulado.sub(base)),
    variacaoPercentual: arredondar(percentualTotal),
  }
}

/**
 * Calcula reajuste pelos 3 indices lado a lado e identifica o mais vantajoso para o locador.
 */
export function calcularComparativoAluguel(input: AluguelComparativoInput): AluguelComparativoResult {
  const { valorAtual, percentuaisIndices, permitirReducao = false } = input

  const indices: IndiceAluguel[] = ['IGP-M', 'IPCA', 'INPC']
  const resultados = {} as Record<IndiceAluguel, AluguelResult>

  for (const indice of indices) {
    const pct = percentuaisIndices[indice] ?? 0
    resultados[indice] = calcularReajusteAluguel({
      valorAtual,
      indice,
      percentualIndice: pct,
      permitirReducao,
    })
  }

  // Mais vantajoso para o locador = maior novo valor
  let maisVantajoso: IndiceAluguel = 'IGP-M'
  let maiorValor = new Decimal(resultados['IGP-M'].novoValor)
  for (const indice of indices) {
    const val = new Decimal(resultados[indice].novoValor)
    if (val.gt(maiorValor)) {
      maiorValor = val
      maisVantajoso = indice
    }
  }

  return {
    valorAtual: arredondar(valorAtual),
    resultados,
    maisVantajoso,
  }
}
