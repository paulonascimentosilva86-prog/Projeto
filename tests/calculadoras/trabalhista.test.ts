import { describe, it, expect } from 'vitest'
import {
  calcularInsalubridade,
  calcularPericulosidade,
  calcularReflexos,
  calcularMaisVantajoso,
} from '../../src/calculadoras/trabalhista'

// Salario minimo 2024 = R$ 1.412,00
const SALARIO_MINIMO = 1412.00

describe('calcularInsalubridade', () => {
  it('grau minimo (10%) sobre salario minimo — 12 meses', () => {
    const result = calcularInsalubridade({
      grau: 'minimo',
      salarioMinimo: SALARIO_MINIMO,
      meses: 12,
      salarioBase: 3000,
    })
    expect(result.adicionalMensal).toBe('141.20')
    expect(result.totalAdicional).toBe('1694.40')
  })

  it('grau medio (20%) sobre salario minimo — 12 meses', () => {
    const result = calcularInsalubridade({
      grau: 'medio',
      salarioMinimo: SALARIO_MINIMO,
      meses: 12,
      salarioBase: 3000,
    })
    expect(result.adicionalMensal).toBe('282.40')
    expect(result.totalAdicional).toBe('3388.80')
  })

  it('grau maximo (40%) sobre salario minimo — 12 meses', () => {
    const result = calcularInsalubridade({
      grau: 'maximo',
      salarioMinimo: SALARIO_MINIMO,
      meses: 12,
      salarioBase: 3000,
    })
    expect(result.adicionalMensal).toBe('564.80')
    expect(result.totalAdicional).toBe('6777.60')
  })
})

describe('calcularPericulosidade', () => {
  it('30% sobre salario-base (nao sobre salario minimo) — 12 meses', () => {
    const result = calcularPericulosidade({
      salarioBase: 3000,
      meses: 12,
    })
    expect(result.adicionalMensal).toBe('900.00')
    expect(result.totalAdicional).toBe('10800.00')
  })

  it('30% sobre salario-base diferente — 6 meses', () => {
    const result = calcularPericulosidade({
      salarioBase: 5000,
      meses: 6,
    })
    expect(result.adicionalMensal).toBe('1500.00')
    expect(result.totalAdicional).toBe('9000.00')
  })
})

describe('calcularReflexos', () => {
  it('reflexos completos para grau medio (12 meses, salarioBase=3000)', () => {
    // adicionalMensal=282.40, totalAdicional=3388.80
    const result = calcularReflexos({
      adicionalMensal: 282.40,
      salarioBase: 3000,
      meses: 12,
    })
    // reflexoFerias = totalAdicional / 12 * (4/3) = 3388.80 / 12 * 1.3333 = 282.40 * 1.3333 = 376.53
    expect(result.reflexoFerias).toBe('376.53')
    // reflexo13 = totalAdicional / 12 = 282.40
    expect(result.reflexo13).toBe('282.40')
    // reflexoFGTS = totalAdicional * 8% = 3388.80 * 0.08 = 271.10
    expect(result.reflexoFGTS).toBe('271.10')
    // totalReflexos = 376.53 + 282.40 + 271.10 = 930.03
    expect(result.totalReflexos).toBe('930.03')
    // totalGeral = totalAdicional + totalReflexos = 3388.80 + 930.03 = 4318.83
    expect(result.totalGeral).toBe('4318.83')
  })

  it('reflexoFGTS calculado como 8% do totalAdicional', () => {
    // adicionalMensal=900, meses=12 => totalAdicional=10800
    const result = calcularReflexos({
      adicionalMensal: 900,
      salarioBase: 3000,
      meses: 12,
    })
    // reflexoFGTS = 10800 * 0.08 = 864.00
    expect(result.reflexoFGTS).toBe('864.00')
  })
})

describe('calcularMaisVantajoso', () => {
  it('retorna periculosidade quando maior que insalubridade maximo', () => {
    // salarioBase=4000: periculosidade=1200/mes
    // salarioMinimo=1412 grau maximo: insalubridade=564.80/mes
    const insalubridade = calcularInsalubridade({
      grau: 'maximo',
      salarioMinimo: SALARIO_MINIMO,
      meses: 12,
      salarioBase: 4000,
    })
    const periculosidade = calcularPericulosidade({
      salarioBase: 4000,
      meses: 12,
    })
    const resultado = calcularMaisVantajoso(insalubridade, periculosidade)
    expect(resultado.maisVantajoso).toBe('periculosidade')
    expect(resultado.adicionalMensal).toBe('1200.00')
  })

  it('retorna insalubridade quando maior que periculosidade', () => {
    // salarioBase=1500: periculosidade=450/mes
    // salarioMinimo=1412 grau maximo: insalubridade=564.80/mes
    const insalubridade = calcularInsalubridade({
      grau: 'maximo',
      salarioMinimo: SALARIO_MINIMO,
      meses: 12,
      salarioBase: 1500,
    })
    const periculosidade = calcularPericulosidade({
      salarioBase: 1500,
      meses: 12,
    })
    const resultado = calcularMaisVantajoso(insalubridade, periculosidade)
    expect(resultado.maisVantajoso).toBe('insalubridade')
    expect(resultado.adicionalMensal).toBe('564.80')
  })

  it('nao cumulam — aviso exportado com referencia ao art. 193 §2 CLT', () => {
    // Verifica que a funcao retorna apenas UM adicional (nao soma)
    const insalubridade = calcularInsalubridade({
      grau: 'medio',
      salarioMinimo: SALARIO_MINIMO,
      meses: 12,
      salarioBase: 3000,
    })
    const periculosidade = calcularPericulosidade({
      salarioBase: 3000,
      meses: 12,
    })
    const resultado = calcularMaisVantajoso(insalubridade, periculosidade)
    // periculosidade=900 > insalubridade medio=282.40
    expect(resultado.maisVantajoso).toBe('periculosidade')
    // resultado nao deve ser a soma dos dois
    expect(resultado.adicionalMensal).toBe('900.00')
    expect(resultado.aviso).toContain('193')
  })
})
