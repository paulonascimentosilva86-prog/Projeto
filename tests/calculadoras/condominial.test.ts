import { describe, it, expect } from 'vitest'
import { calcularCondominial } from '../../src/calculadoras/condominial.js'

describe('calcularCondominial', () => {
  describe('caso minimo: principal=1000, mesesAtraso=1, fatorINPC=1 (sem correcao)', () => {
    it('retorna multa 2% = 20.00', () => {
      const resultado = calcularCondominial({ principal: 1000, mesesAtraso: 1, fatorINPC: 1 })
      expect(resultado.multa).toBe('20.00')
    })

    it('retorna juros 1%/mes = 10.20', () => {
      const resultado = calcularCondominial({ principal: 1000, mesesAtraso: 1, fatorINPC: 1 })
      expect(resultado.juros).toBe('10.20')
    })

    it('retorna correcao = 0.00 quando fatorINPC=1', () => {
      const resultado = calcularCondominial({ principal: 1000, mesesAtraso: 1, fatorINPC: 1 })
      expect(resultado.correcao).toBe('0.00')
    })

    it('retorna subtotal = 1030.20', () => {
      const resultado = calcularCondominial({ principal: 1000, mesesAtraso: 1, fatorINPC: 1 })
      expect(resultado.subtotal).toBe('1030.20')
    })

    it('retorna honorarios 30% sobre subtotal = 309.06', () => {
      const resultado = calcularCondominial({ principal: 1000, mesesAtraso: 1, fatorINPC: 1 })
      expect(resultado.honorarios).toBe('309.06')
    })

    it('retorna total = 1339.26', () => {
      const resultado = calcularCondominial({ principal: 1000, mesesAtraso: 1, fatorINPC: 1 })
      expect(resultado.total).toBe('1339.26')
    })

    it('retorna principal como string com 2 casas decimais', () => {
      const resultado = calcularCondominial({ principal: 1000, mesesAtraso: 1, fatorINPC: 1 })
      expect(resultado.principal).toBe('1000.00')
    })
  })

  describe('caso tipico: principal=1000, mesesAtraso=6, fatorINPC=1.05', () => {
    it('retorna multa = 20.00', () => {
      const resultado = calcularCondominial({ principal: 1000, mesesAtraso: 6, fatorINPC: 1.05 })
      expect(resultado.multa).toBe('20.00')
    })

    it('retorna juros por 6 meses = 61.20', () => {
      const resultado = calcularCondominial({ principal: 1000, mesesAtraso: 6, fatorINPC: 1.05 })
      expect(resultado.juros).toBe('61.20')
    })

    it('retorna correcao INPC 5% = 50.00', () => {
      const resultado = calcularCondominial({ principal: 1000, mesesAtraso: 6, fatorINPC: 1.05 })
      expect(resultado.correcao).toBe('50.00')
    })

    it('retorna subtotal = 1131.20', () => {
      const resultado = calcularCondominial({ principal: 1000, mesesAtraso: 6, fatorINPC: 1.05 })
      expect(resultado.subtotal).toBe('1131.20')
    })

    it('retorna honorarios = 339.36', () => {
      const resultado = calcularCondominial({ principal: 1000, mesesAtraso: 6, fatorINPC: 1.05 })
      expect(resultado.honorarios).toBe('339.36')
    })

    it('retorna total = 1470.56', () => {
      const resultado = calcularCondominial({ principal: 1000, mesesAtraso: 6, fatorINPC: 1.05 })
      expect(resultado.total).toBe('1470.56')
    })
  })

  describe('caso com centavos: principal=1333.33, mesesAtraso=1, fatorINPC=1 (trap ponto flutuante)', () => {
    it('retorna multa sem ponto flutuante: 1333.33 * 2% = 26.67', () => {
      const resultado = calcularCondominial({ principal: 1333.33, mesesAtraso: 1, fatorINPC: 1 })
      expect(resultado.multa).toBe('26.67')
    })

    it('retorna juros calculados sobre (principal + multa) = 13.60', () => {
      const resultado = calcularCondominial({ principal: 1333.33, mesesAtraso: 1, fatorINPC: 1 })
      expect(resultado.juros).toBe('13.60')
    })

    it('retorna subtotal correto = 1373.60', () => {
      const resultado = calcularCondominial({ principal: 1333.33, mesesAtraso: 1, fatorINPC: 1 })
      expect(resultado.subtotal).toBe('1373.60')
    })

    it('retorna honorarios 30% = 412.08', () => {
      const resultado = calcularCondominial({ principal: 1333.33, mesesAtraso: 1, fatorINPC: 1 })
      expect(resultado.honorarios).toBe('412.08')
    })

    it('retorna total = 1785.68', () => {
      const resultado = calcularCondominial({ principal: 1333.33, mesesAtraso: 1, fatorINPC: 1 })
      expect(resultado.total).toBe('1785.68')
    })
  })

  describe('caso extremo: principal=50000, mesesAtraso=60, fatorINPC=1.4', () => {
    it('retorna multa = 1000.00', () => {
      const resultado = calcularCondominial({ principal: 50000, mesesAtraso: 60, fatorINPC: 1.4 })
      expect(resultado.multa).toBe('1000.00')
    })

    it('retorna juros por 60 meses = 30600.00', () => {
      const resultado = calcularCondominial({ principal: 50000, mesesAtraso: 60, fatorINPC: 1.4 })
      expect(resultado.juros).toBe('30600.00')
    })

    it('retorna correcao INPC 40% = 20000.00', () => {
      const resultado = calcularCondominial({ principal: 50000, mesesAtraso: 60, fatorINPC: 1.4 })
      expect(resultado.correcao).toBe('20000.00')
    })

    it('retorna subtotal = 101600.00', () => {
      const resultado = calcularCondominial({ principal: 50000, mesesAtraso: 60, fatorINPC: 1.4 })
      expect(resultado.subtotal).toBe('101600.00')
    })

    it('retorna honorarios = 30480.00', () => {
      const resultado = calcularCondominial({ principal: 50000, mesesAtraso: 60, fatorINPC: 1.4 })
      expect(resultado.honorarios).toBe('30480.00')
    })

    it('retorna total = 132080.00', () => {
      const resultado = calcularCondominial({ principal: 50000, mesesAtraso: 60, fatorINPC: 1.4 })
      expect(resultado.total).toBe('132080.00')
    })
  })
})
