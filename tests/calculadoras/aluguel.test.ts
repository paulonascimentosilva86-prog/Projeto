import { describe, it, expect } from 'vitest'
import {
  calcularReajusteAluguel,
  calcularReajusteAcumulado,
  calcularComparativoAluguel,
} from '../../src/calculadoras/aluguel'

describe('calcularReajusteAluguel', () => {
  it('Caso 1: reajuste simples IGP-M 10% sobre R$ 2.000', () => {
    const result = calcularReajusteAluguel({
      valorAtual: 2000,
      indice: 'IGP-M',
      percentualIndice: 10,
    })
    expect(result.novoValor).toBe('2200.00')
    expect(result.diferenca).toBe('200.00')
    expect(result.valorAtual).toBe('2000.00')
    expect(result.indice).toBe('IGP-M')
    expect(result.percentualAplicado).toBe('10.00')
    expect(result.variacaoPercentual).toBe('10.00')
  })

  it('Caso 2: reajuste simples IPCA 5.79% sobre R$ 3.000', () => {
    const result = calcularReajusteAluguel({
      valorAtual: 3000,
      indice: 'IPCA',
      percentualIndice: 5.79,
    })
    // 3000 * 1.0579 = 3173.70
    expect(result.novoValor).toBe('3173.70')
    expect(result.diferenca).toBe('173.70')
    expect(result.indice).toBe('IPCA')
  })

  it('Caso 3: INPC 4.2% sobre R$ 1.500', () => {
    const result = calcularReajusteAluguel({
      valorAtual: 1500,
      indice: 'INPC',
      percentualIndice: 4.2,
    })
    // 1500 * 1.042 = 1563.00
    expect(result.novoValor).toBe('1563.00')
    expect(result.indice).toBe('INPC')
  })

  it('Caso 4: indice negativo sem permitirReducao (default) — nao reduz aluguel', () => {
    const result = calcularReajusteAluguel({
      valorAtual: 2000,
      indice: 'IGP-M',
      percentualIndice: -3,
      permitirReducao: false,
    })
    // IGP-M negativo: aluguel nao pode reduzir
    expect(result.novoValor).toBe('2000.00')
    expect(result.diferenca).toBe('0.00')
    expect(result.variacaoPercentual).toBe('0.00')
  })

  it('Caso 5: indice negativo com permitirReducao=true — reduz aluguel', () => {
    const result = calcularReajusteAluguel({
      valorAtual: 2000,
      indice: 'IGP-M',
      percentualIndice: -3,
      permitirReducao: true,
    })
    // 2000 * 0.97 = 1940.00
    expect(result.novoValor).toBe('1940.00')
    expect(result.diferenca).toBe('-60.00')
  })

  it('Caso 6: valores com centavos — floating point trap', () => {
    const result = calcularReajusteAluguel({
      valorAtual: 1750.50,
      indice: 'IPCA',
      percentualIndice: 5.5,
    })
    // 1750.50 * 1.055 = 1846.7775 -> 1846.78
    expect(result.novoValor).toBe('1846.78')
  })

  it('Caso 7: indice negativo sem parametro permitirReducao (default false) — nao reduz', () => {
    const result = calcularReajusteAluguel({
      valorAtual: 2000,
      indice: 'IGP-M',
      percentualIndice: -3,
    })
    expect(result.novoValor).toBe('2000.00')
  })
})

describe('calcularReajusteAcumulado', () => {
  it('Caso 8: reajuste acumulado 2 anos [10%, 5%] sobre R$ 2.000 — produto de fatores', () => {
    const result = calcularReajusteAcumulado({
      valorAtual: 2000,
      fatoresAnuais: [10, 5],
    })
    // Ano1 = 2000 * 1.10 = 2200
    // Ano2 = 2200 * 1.05 = 2310.00
    // NAO 2000 * 1.15 = 2300.00
    expect(result.novoValor).toBe('2310.00')
    expect(result.novoValor).not.toBe('2300.00')
  })

  it('Caso 9: reajuste acumulado 3 anos [5.0, 3.5, 8.2] sobre R$ 1.000', () => {
    const result = calcularReajusteAcumulado({
      valorAtual: 1000,
      fatoresAnuais: [5.0, 3.5, 8.2],
    })
    // 1000 * 1.05 * 1.035 * 1.082 = ?
    // 1000 * 1.05 = 1050
    // 1050 * 1.035 = 1086.75
    // 1086.75 * 1.082 = 1175.8635 -> 1175.86
    expect(result.novoValor).toBe('1175.86')
  })

  it('Caso 10: reajuste acumulado com fator negativo sem permitirReducao', () => {
    const result = calcularReajusteAcumulado({
      valorAtual: 2000,
      fatoresAnuais: [-3, 5],
      permitirReducao: false,
    })
    // Ano1: 2000 * 0.97 = 1940 -> bloqueado em 2000 (nao reduz)
    // Ano2: 2000 * 1.05 = 2100
    expect(result.novoValor).toBe('2100.00')
  })
})

describe('calcularComparativoAluguel', () => {
  it('Caso 11: comparativo 3 indices — identifica mais vantajoso para locador', () => {
    const result = calcularComparativoAluguel({
      valorAtual: 2000,
      percentuaisIndices: {
        'IGP-M': 10,
        'IPCA': 5.79,
        'INPC': 4.5,
      },
    })
    expect(result.valorAtual).toBe('2000.00')
    expect(result.resultados['IGP-M'].novoValor).toBe('2200.00')
    expect(result.resultados['IPCA'].novoValor).toBe('2115.80')
    expect(result.resultados['INPC'].novoValor).toBe('2090.00')
    // Maior valor = mais vantajoso para locador
    expect(result.maisVantajoso).toBe('IGP-M')
  })
})
