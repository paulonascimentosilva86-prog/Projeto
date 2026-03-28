import { describe, it, expect } from 'vitest'
import Decimal from 'decimal.js'
import { arredondar, toDecimal, porcentagem } from '../../src/calculadoras/decimal-utils.js'

describe('decimal-utils', () => {
  describe('arredondar()', () => {
    it('trap classico de ponto flutuante: 0.1 + 0.2 = 0.30', () => {
      expect(arredondar(0.1 + 0.2)).toBe('0.30')
    })

    it('multa 2%: 1000 * 0.02 = 20.00', () => {
      expect(arredondar(1000 * 0.02)).toBe('20.00')
    })

    it('juros 1%: 1000 * 0.01 = 10.00', () => {
      expect(arredondar(1000 * 0.01)).toBe('10.00')
    })

    it('ROUND_HALF_UP: 0.005 arredonda para 0.01', () => {
      expect(arredondar(0.005)).toBe('0.01')
    })

    it('trunca abaixo de 0.005: 0.004 = 0.00', () => {
      expect(arredondar(0.004)).toBe('0.00')
    })
  })

  describe('porcentagem()', () => {
    it('honorarios 30% sobre 1000 = 300', () => {
      expect(porcentagem(1000, 30).toString()).toBe('300')
    })
  })

  describe('toDecimal()', () => {
    it('converte string para Decimal sem perda de precisao', () => {
      expect(toDecimal('1234.56').equals(new Decimal('1234.56'))).toBe(true)
    })
  })
})
