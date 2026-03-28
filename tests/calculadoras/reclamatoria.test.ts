import { describe, it, expect } from 'vitest'
import { calcularReclamatoria } from '../../src/calculadoras/reclamatoria.js'

// Parametros base reutilizados nos testes
const BASE = {
  salarioBase: 5000,
  mesesTrabalhados: 30,
  anosCompletos: 2,
  saldoDiasTrabalhados: 15,
  saldoFGTS: 12000,
}

// Calculos manuais com BASE:
// saldoSalario = 5000 / 30 * 15 = 2500.00
// avisoPrevio: 30 + 2*3 = 36 dias => 5000 / 30 * 36 = 6000.00
// mesesNoAno = 30 % 12 = 6; 13o = 5000 / 12 * 6 = 2500.00
// feriasProp = (5000 / 12 * 6) * (4/3) = 2500 * 4/3 = 3333.33
// multaFGTS = 12000 * 0.40 = 4800.00
// subtotal = 2500 + 6000 + 2500 + 3333.33 + 4800 = 19133.33
// honorarios = 19133.33 * 10% = 1913.33
// totalBruto = 19133.33 + 1913.33 = 21046.66
// otimista = 21046.66
// realista = 21046.66 * 0.70 = 14732.66
// acordo = 21046.66 * 0.55 = 11575.66

describe('calcularReclamatoria', () => {
  describe('Caso 1: sem_justa_causa — verbas obrigatorias presentes', () => {
    const resultado = calcularReclamatoria({ ...BASE, cenario: 'sem_justa_causa' })

    it('retorna cenario sem_justa_causa', () => {
      expect(resultado.cenario).toBe('sem_justa_causa')
    })

    it('saldoSalario = 2500.00', () => {
      const verba = resultado.verbas.find(v => v.nome === 'Saldo de Salario')
      expect(verba?.valor).toBe('2500.00')
      expect(verba?.inclui).toBe(true)
    })

    it('avisoPrevio = 6000.00 (36 dias)', () => {
      const verba = resultado.verbas.find(v => v.nome === 'Aviso Previo')
      expect(verba?.valor).toBe('6000.00')
      expect(verba?.inclui).toBe(true)
    })

    it('13o proporcional = 2500.00 (6 meses)', () => {
      const verba = resultado.verbas.find(v => v.nome === 'Decimo Terceiro Proporcional')
      expect(verba?.valor).toBe('2500.00')
      expect(verba?.inclui).toBe(true)
    })

    it('ferias proporcionais + 1/3 = 3333.33', () => {
      const verba = resultado.verbas.find(v => v.nome === 'Ferias Proporcionais + 1/3')
      expect(verba?.valor).toBe('3333.33')
      expect(verba?.inclui).toBe(true)
    })

    it('multa FGTS 40% = 4800.00', () => {
      const verba = resultado.verbas.find(v => v.nome === 'Multa FGTS 40%')
      expect(verba?.valor).toBe('4800.00')
      expect(verba?.inclui).toBe(true)
    })

    it('subtotal = 19133.33', () => {
      expect(resultado.subtotal).toBe('19133.33')
    })

    it('honorarios 10% = 1913.33', () => {
      expect(resultado.honorarios).toBe('1913.33')
    })

    it('totalBruto = 21046.66', () => {
      expect(resultado.totalBruto).toBe('21046.66')
    })
  })

  describe('Caso 2: sem_justa_causa — projecoes sobre totalBruto', () => {
    const resultado = calcularReclamatoria({ ...BASE, cenario: 'sem_justa_causa' })

    it('otimista = totalBruto (100%) = 21046.66', () => {
      expect(resultado.projecoes.otimista).toBe('21046.66')
    })

    it('realista = 70% do totalBruto = 14732.66', () => {
      expect(resultado.projecoes.realista).toBe('14732.66')
    })

    it('acordo = 55% do totalBruto = 11575.66', () => {
      expect(resultado.projecoes.acordo).toBe('11575.66')
    })
  })

  describe('Caso 3: justa_causa — apenas saldo salario e ferias vencidas', () => {
    // justa causa: salario 3000, 24 meses, 2 anos, 10 dias, fgts 5000
    const resultado = calcularReclamatoria({
      cenario: 'justa_causa',
      salarioBase: 3000,
      mesesTrabalhados: 24,
      anosCompletos: 2,
      saldoDiasTrabalhados: 10,
      saldoFGTS: 5000,
    })

    it('saldoSalario presente com inclui=true', () => {
      const verba = resultado.verbas.find(v => v.nome === 'Saldo de Salario')
      expect(verba?.inclui).toBe(true)
    })

    it('feriasVencidas presente com inclui=true', () => {
      const verba = resultado.verbas.find(v => v.nome === 'Ferias Vencidas + 1/3')
      expect(verba?.inclui).toBe(true)
    })

    it('multaFGTS com inclui=false', () => {
      const verba = resultado.verbas.find(v => v.nome === 'Multa FGTS 40%')
      expect(verba?.inclui).toBe(false)
    })

    it('avisoPrevio com inclui=false', () => {
      const verba = resultado.verbas.find(v => v.nome === 'Aviso Previo')
      expect(verba?.inclui).toBe(false)
    })

    it('13o proporcional com inclui=false', () => {
      const verba = resultado.verbas.find(v => v.nome === 'Decimo Terceiro Proporcional')
      expect(verba?.inclui).toBe(false)
    })

    it('ferias proporcionais com inclui=false (somente vencidas na justa causa)', () => {
      const verba = resultado.verbas.find(v => v.nome === 'Ferias Proporcionais + 1/3')
      expect(verba?.inclui).toBe(false)
    })
  })

  describe('Caso 4: pedido_demissao — sem multa FGTS e sem aviso previo indenizado', () => {
    const resultado = calcularReclamatoria({ ...BASE, cenario: 'pedido_demissao' })

    it('multaFGTS com inclui=false', () => {
      const verba = resultado.verbas.find(v => v.nome === 'Multa FGTS 40%')
      expect(verba?.inclui).toBe(false)
    })

    it('avisoPrevio com inclui=false', () => {
      const verba = resultado.verbas.find(v => v.nome === 'Aviso Previo')
      expect(verba?.inclui).toBe(false)
    })

    it('saldoSalario com inclui=true', () => {
      const verba = resultado.verbas.find(v => v.nome === 'Saldo de Salario')
      expect(verba?.inclui).toBe(true)
    })

    it('13o proporcional com inclui=true', () => {
      const verba = resultado.verbas.find(v => v.nome === 'Decimo Terceiro Proporcional')
      expect(verba?.inclui).toBe(true)
    })

    it('ferias proporcionais + 1/3 com inclui=true', () => {
      const verba = resultado.verbas.find(v => v.nome === 'Ferias Proporcionais + 1/3')
      expect(verba?.inclui).toBe(true)
    })
  })

  describe('Caso 5: aviso previo proporcional', () => {
    it('anosCompletos=0 => 30 dias', () => {
      const r = calcularReclamatoria({ ...BASE, anosCompletos: 0, cenario: 'sem_justa_causa' })
      // 5000 / 30 * 30 = 5000.00
      const verba = r.verbas.find(v => v.nome === 'Aviso Previo')
      expect(verba?.valor).toBe('5000.00')
      expect(verba?.inclui).toBe(true)
    })

    it('anosCompletos=2 => 36 dias', () => {
      const r = calcularReclamatoria({ ...BASE, anosCompletos: 2, cenario: 'sem_justa_causa' })
      // 5000 / 30 * 36 = 6000.00
      const verba = r.verbas.find(v => v.nome === 'Aviso Previo')
      expect(verba?.valor).toBe('6000.00')
    })

    it('anosCompletos=20 => 90 dias (maximo)', () => {
      // sem cap: 30 + 20*3 = 90 (exato no limite)
      const r = calcularReclamatoria({ ...BASE, anosCompletos: 20, cenario: 'sem_justa_causa' })
      // 5000 / 30 * 90 = 15000.00
      const verba = r.verbas.find(v => v.nome === 'Aviso Previo')
      expect(verba?.valor).toBe('15000.00')
    })
  })

  describe('Caso 6: aviso previo maximo — anosCompletos=25 => ainda 90 dias', () => {
    it('nao ultrapassa 90 dias mesmo com 25 anos', () => {
      const r = calcularReclamatoria({ ...BASE, anosCompletos: 25, cenario: 'sem_justa_causa' })
      // cap: 5000 / 30 * 90 = 15000.00
      const verba = r.verbas.find(v => v.nome === 'Aviso Previo')
      expect(verba?.valor).toBe('15000.00')
    })
  })

  describe('Caso 7: honorarios 10% aplicados sobre totalBruto', () => {
    it('honorarios = 10% do subtotal', () => {
      const r = calcularReclamatoria({ ...BASE, cenario: 'sem_justa_causa' })
      // subtotal = 19133.33, honorarios = 1913.33
      const subtotalNum = parseFloat(r.subtotal)
      const honorariosNum = parseFloat(r.honorarios)
      expect(honorariosNum).toBeCloseTo(subtotalNum * 0.10, 1)
    })

    it('totalBruto = subtotal + honorarios', () => {
      const r = calcularReclamatoria({ ...BASE, cenario: 'sem_justa_causa' })
      const subtotal = parseFloat(r.subtotal)
      const honorarios = parseFloat(r.honorarios)
      const total = parseFloat(r.totalBruto)
      expect(total).toBeCloseTo(subtotal + honorarios, 1)
    })
  })

  describe('Caso 8: com horas extras', () => {
    it('horas extras aparecem em verbas com inclui=true quando horasExtrasMensais fornecido', () => {
      const r = calcularReclamatoria({
        ...BASE,
        cenario: 'sem_justa_causa',
        horasExtrasMensais: 500,
      })
      const verba = r.verbas.find(v => v.nome === 'Horas Extras')
      expect(verba?.inclui).toBe(true)
      // 500 mensais * 30 meses = 15000.00
      expect(verba?.valor).toBe('15000.00')
    })

    it('sem horasExtrasMensais, horas extras tem inclui=false', () => {
      const r = calcularReclamatoria({ ...BASE, cenario: 'sem_justa_causa' })
      const verba = r.verbas.find(v => v.nome === 'Horas Extras')
      expect(verba?.inclui).toBe(false)
    })
  })

  describe('Caso 9: sem justa causa minimo (1 mes, salario=1412)', () => {
    // 1 mes de trabalho, 0 anos completos
    // saldoSalario = 1412 / 30 * 15 = 706.00
    // avisoPrevio = 1412 / 30 * 30 = 1412.00
    // 13o = 1412 / 12 * 1 = 117.67
    // ferias = (1412 / 12 * 1) * (4/3) = 117.67 * 4/3 = 156.89
    // multaFGTS = 500 * 0.40 = 200.00
    const resultado = calcularReclamatoria({
      cenario: 'sem_justa_causa',
      salarioBase: 1412,
      mesesTrabalhados: 1,
      anosCompletos: 0,
      saldoDiasTrabalhados: 15,
      saldoFGTS: 500,
    })

    it('saldoSalario = 706.00', () => {
      const verba = resultado.verbas.find(v => v.nome === 'Saldo de Salario')
      expect(verba?.valor).toBe('706.00')
    })

    it('avisoPrevio = 1412.00 (30 dias, 0 anos)', () => {
      const verba = resultado.verbas.find(v => v.nome === 'Aviso Previo')
      expect(verba?.valor).toBe('1412.00')
    })

    it('13o proporcional = 117.67 (1 mes)', () => {
      const verba = resultado.verbas.find(v => v.nome === 'Decimo Terceiro Proporcional')
      expect(verba?.valor).toBe('117.67')
    })

    it('ferias proporcionais + 1/3 = 156.89 (1 mes)', () => {
      const verba = resultado.verbas.find(v => v.nome === 'Ferias Proporcionais + 1/3')
      expect(verba?.valor).toBe('156.89')
    })

    it('multa FGTS 40% = 200.00', () => {
      const verba = resultado.verbas.find(v => v.nome === 'Multa FGTS 40%')
      expect(verba?.valor).toBe('200.00')
    })
  })
})
