import { describe, it, expect } from 'vitest'
import { calcularDistrato, DistratoInput, DistratoResult } from '../../src/calculadoras/distrato'

describe('calcularDistrato', () => {

  // Caso 1: Desistência regime comum sem uso
  it('desistencia comprador - regime comum - sem uso - retencao 25%', () => {
    const input: DistratoInput = {
      cenario: 'desistencia_comprador',
      regime: 'comum',
      totalPago: 200000,
      valorImovel: 500000,
      mesesUso: 0,
      comissaoCorretagem: 15000,
      iptu: 0,
      condominio: 0,
      fatorINCC: 1.0,
      multaContratual: 0,
    }
    const result: DistratoResult = calcularDistrato(input)

    expect(result.totalPago).toBe('200000.00')
    expect(result.retencao).toBe('50000.00')
    expect(result.taxaFruicao).toBe('0.00')
    expect(result.comissaoCorretagem).toBe('15000.00')
    expect(result.valorDevolver).toBe('135000.00')
    expect(result.prazoDevoucao).toBe('180 dias')
  })

  // Caso 2: Desistência patrimônio afetação sem uso — retenção 50%
  it('desistencia comprador - patrimonio afetacao - sem uso - retencao 50%', () => {
    const input: DistratoInput = {
      cenario: 'desistencia_comprador',
      regime: 'afetacao',
      totalPago: 200000,
      valorImovel: 500000,
      mesesUso: 0,
      comissaoCorretagem: 15000,
      iptu: 0,
      condominio: 0,
      fatorINCC: 1.0,
      multaContratual: 0,
    }
    const result: DistratoResult = calcularDistrato(input)

    expect(result.totalPago).toBe('200000.00')
    expect(result.retencao).toBe('100000.00')
    expect(result.taxaFruicao).toBe('0.00')
    expect(result.comissaoCorretagem).toBe('15000.00')
    expect(result.valorDevolver).toBe('85000.00')
    expect(result.prazoDevoucao).toBe('30 dias apos habite-se')
  })

  // Caso 3: Desistência regime comum com 6 meses de uso (taxa de fruição)
  it('desistencia comprador - regime comum - com 6 meses uso - taxa fruicao aplicada', () => {
    const input: DistratoInput = {
      cenario: 'desistencia_comprador',
      regime: 'comum',
      totalPago: 200000,
      valorImovel: 500000,
      mesesUso: 6,
      comissaoCorretagem: 15000,
      iptu: 0,
      condominio: 0,
      fatorINCC: 1.0,
      multaContratual: 0,
    }
    const result: DistratoResult = calcularDistrato(input)

    // taxaFruicao = 500000 * 0.005 * 6 = 15000.00
    expect(result.taxaFruicao).toBe('15000.00')
    // valorDevolver = 200000 - 50000 (25%) - 15000 (corretagem) - 15000 (fruicao) = 120000
    expect(result.valorDevolver).toBe('120000.00')
  })

  // Caso 4: Atraso da construtora (>180 dias) — devolução integral + correção INCC + multa
  it('atraso construtora - devolucao integral com correcao INCC e multa contratual', () => {
    const input: DistratoInput = {
      cenario: 'atraso_construtora',
      regime: 'comum',
      totalPago: 200000,
      valorImovel: 500000,
      mesesUso: 0,
      comissaoCorretagem: 0,
      iptu: 0,
      condominio: 0,
      fatorINCC: 1.08,
      multaContratual: 1, // 1% sobre total pago
    }
    const result: DistratoResult = calcularDistrato(input)

    // valorDevolver = 200000 * 1.08 + (200000 * 1%) = 216000 + 2000 = 218000
    expect(result.retencao).toBe('0.00')
    expect(result.valorDevolver).toBe('218000.00')
    expect(result.prazoDevoucao).toBe('60 dias')
  })

  // Caso 5: Arrependimento em 7 dias — devolução integral sem deduções
  it('arrependimento 7 dias - devolucao integral sem retencao', () => {
    const input: DistratoInput = {
      cenario: 'arrependimento',
      regime: 'comum',
      totalPago: 50000,
      valorImovel: 300000,
      mesesUso: 0,
      comissaoCorretagem: 5000,
      iptu: 0,
      condominio: 0,
      fatorINCC: 1.0,
      multaContratual: 0,
    }
    const result: DistratoResult = calcularDistrato(input)

    expect(result.totalPago).toBe('50000.00')
    expect(result.retencao).toBe('0.00')
    expect(result.taxaFruicao).toBe('0.00')
    expect(result.valorDevolver).toBe('50000.00')
    expect(result.prazoDevoucao).toBe('7 dias')
  })

  // Caso 6: Precisão decimal — valores com centavos
  it('desistencia comprador - regime comum - com centavos - precisao decimal', () => {
    const input: DistratoInput = {
      cenario: 'desistencia_comprador',
      regime: 'comum',
      totalPago: 123456.78,
      valorImovel: 400000,
      mesesUso: 0,
      comissaoCorretagem: 10000,
      iptu: 500,
      condominio: 300,
      fatorINCC: 1.0,
      multaContratual: 0,
    }
    const result: DistratoResult = calcularDistrato(input)

    // retencao = 123456.78 * 0.25 = 30864.195 → arredondado = 30864.20 (ROUND_HALF_UP)
    expect(result.retencao).toBe('30864.20')
    // taxaFruicao = 0
    expect(result.taxaFruicao).toBe('0.00')
    // valorDevolver = 123456.78 - 30864.20 - 10000 - 500 - 300 = 81792.58
    expect(result.valorDevolver).toBe('81792.58')
  })

  // Caso 7: Com IPTU e condomínio deduzidos no regime afetação
  it('desistencia comprador - afetacao - com IPTU e condominio deduzidos', () => {
    const input: DistratoInput = {
      cenario: 'desistencia_comprador',
      regime: 'afetacao',
      totalPago: 300000,
      valorImovel: 600000,
      mesesUso: 3,
      comissaoCorretagem: 20000,
      iptu: 1500,
      condominio: 2400,
      fatorINCC: 1.0,
      multaContratual: 0,
    }
    const result: DistratoResult = calcularDistrato(input)

    // retencao = 300000 * 0.50 = 150000.00
    expect(result.retencao).toBe('150000.00')
    // taxaFruicao = 600000 * 0.005 * 3 = 9000.00
    expect(result.taxaFruicao).toBe('9000.00')
    // valorDevolver = 300000 - 150000 - 20000 - 1500 - 2400 - 9000 = 117100.00
    expect(result.valorDevolver).toBe('117100.00')
  })

  // Verifica que observacoes contém referencias legais
  it('observacoes contém referencias legais relevantes', () => {
    const input: DistratoInput = {
      cenario: 'desistencia_comprador',
      regime: 'comum',
      totalPago: 100000,
      valorImovel: 400000,
      mesesUso: 0,
      comissaoCorretagem: 0,
      iptu: 0,
      condominio: 0,
      fatorINCC: 1.0,
      multaContratual: 0,
    }
    const result: DistratoResult = calcularDistrato(input)

    expect(result.observacoes).toBeInstanceOf(Array)
    expect(result.observacoes.length).toBeGreaterThan(0)
    // Deve mencionar a lei
    const textoObservacoes = result.observacoes.join(' ')
    expect(textoObservacoes).toMatch(/13\.786\/2018/)
  })

  // Verifica que valorDevolver nunca é negativo
  it('valorDevolver nao pode ser negativo quando deducoes excedem total pago', () => {
    const input: DistratoInput = {
      cenario: 'desistencia_comprador',
      regime: 'afetacao',
      totalPago: 10000,
      valorImovel: 500000,
      mesesUso: 12,
      comissaoCorretagem: 5000,
      iptu: 2000,
      condominio: 1000,
      fatorINCC: 1.0,
      multaContratual: 0,
    }
    const result: DistratoResult = calcularDistrato(input)

    const valorDevolver = parseFloat(result.valorDevolver)
    expect(valorDevolver).toBeGreaterThanOrEqual(0)
  })
})
