import { arredondar, porcentagem, somar, toDecimal } from './decimal-utils.js'
import Decimal from 'decimal.js'

// Constantes nomeadas
const PROJECOES = {
  otimista: 100,
  realista: 70,
  acordo: 55,
} as const

const HONORARIOS_PCT = 10

export type CenarioReclamatoria = 'sem_justa_causa' | 'justa_causa' | 'pedido_demissao'

export interface ReclamatoriaInput {
  cenario: CenarioReclamatoria
  salarioBase: number
  mesesTrabalhados: number
  anosCompletos: number
  saldoDiasTrabalhados: number
  saldoFGTS: number
  horasExtrasMensais?: number
  mediaMensalVariavel?: number
}

export interface VerbaRescisoria {
  nome: string
  valor: string
  inclui: boolean
}

export interface ReclamatoriaResult {
  cenario: CenarioReclamatoria
  verbas: VerbaRescisoria[]
  subtotal: string
  honorarios: string
  totalBruto: string
  projecoes: {
    otimista: string
    realista: string
    acordo: string
  }
}

/**
 * Calcula o aviso previo proporcional em dias.
 * Lei 12.506/2011: 30 dias base + 3 dias por ano completo, maximo 90 dias.
 */
export function calcularDiasAvisoPrevio(anosCompletos: number): number {
  const dias = 30 + anosCompletos * 3
  return Math.min(dias, 90)
}

/**
 * Calcula o saldo de salario pelos dias trabalhados no mes da demissao.
 * Formula: salarioBase / 30 * diasTrabalhados
 */
function calcularSaldoSalario(salarioBase: number, diasTrabalhados: number): string {
  const valor = toDecimal(salarioBase).div(30).mul(diasTrabalhados)
  return arredondar(valor)
}

/**
 * Calcula o aviso previo indenizado.
 * Formula: salarioBase / 30 * diasAviso
 */
function calcularAvisoPrevio(salarioBase: number, anosCompletos: number): string {
  const dias = calcularDiasAvisoPrevio(anosCompletos)
  const valor = toDecimal(salarioBase).div(30).mul(dias)
  return arredondar(valor)
}

/**
 * Calcula o 13o proporcional.
 * Formula: salarioBase / 12 * (mesesTrabalhados % 12)
 * Se mesesTrabalhados for multiplo de 12, usa 12 (ano completo).
 */
function calcularDecimo3Proporcional(salarioBase: number, mesesTrabalhados: number): string {
  const mesesNoAno = mesesTrabalhados % 12 === 0 ? 12 : mesesTrabalhados % 12
  const valor = toDecimal(salarioBase).div(12).mul(mesesNoAno)
  return arredondar(valor)
}

/**
 * Calcula ferias proporcionais + 1/3.
 * Formula: (salarioBase / 12 * mesesFerias) * (4/3)
 */
function calcularFeriasPropMaisUmTerco(salarioBase: number, mesesTrabalhados: number): string {
  const mesesFerias = mesesTrabalhados % 12 === 0 ? 12 : mesesTrabalhados % 12
  const feriasBruto = toDecimal(salarioBase).div(12).mul(mesesFerias)
  const valor = feriasBruto.mul(new Decimal(4).div(3))
  return arredondar(valor)
}

/**
 * Calcula ferias vencidas + 1/3 (para justa causa — ciclo completo anterior).
 * Formula: salarioBase * (4/3)
 */
function calcularFeriasVencidas(salarioBase: number): string {
  const valor = toDecimal(salarioBase).mul(new Decimal(4).div(3))
  return arredondar(valor)
}

/**
 * Calcula a multa de 40% do FGTS sobre o saldo total depositado.
 * Formula: saldoFGTS * 40%
 */
function calcularMultaFGTS(saldoFGTS: number): string {
  const valor = porcentagem(saldoFGTS, 40)
  return arredondar(valor)
}

/**
 * Calcula o total de horas extras acumuladas no contrato.
 * Formula: horasExtrasMensais * mesesTrabalhados
 */
function calcularHorasExtrasTotal(horasExtrasMensais: number, mesesTrabalhados: number): string {
  const valor = toDecimal(horasExtrasMensais).mul(mesesTrabalhados)
  return arredondar(valor)
}

/**
 * Implementa o simulador de reclamatoria trabalhista com 3 cenarios e 3 projecoes.
 */
export function calcularReclamatoria(input: ReclamatoriaInput): ReclamatoriaResult {
  const {
    cenario,
    salarioBase,
    mesesTrabalhados,
    anosCompletos,
    saldoDiasTrabalhados,
    saldoFGTS,
    horasExtrasMensais,
  } = input

  const saldoSalarioValor = calcularSaldoSalario(salarioBase, saldoDiasTrabalhados)
  const avisoPrevioValor = calcularAvisoPrevio(salarioBase, anosCompletos)
  const decimo3ProporcionalValor = calcularDecimo3Proporcional(salarioBase, mesesTrabalhados)
  const feriasPropValor = calcularFeriasPropMaisUmTerco(salarioBase, mesesTrabalhados)
  const feriasVencidasValor = calcularFeriasVencidas(salarioBase)
  const multaFGTSValor = calcularMultaFGTS(saldoFGTS)
  const horasExtrasValor =
    horasExtrasMensais != null
      ? calcularHorasExtrasTotal(horasExtrasMensais, mesesTrabalhados)
      : '0.00'

  let verbas: VerbaRescisoria[]

  if (cenario === 'sem_justa_causa') {
    verbas = [
      { nome: 'Saldo de Salario', valor: saldoSalarioValor, inclui: true },
      { nome: 'Aviso Previo', valor: avisoPrevioValor, inclui: true },
      { nome: 'Decimo Terceiro Proporcional', valor: decimo3ProporcionalValor, inclui: true },
      { nome: 'Ferias Proporcionais + 1/3', valor: feriasPropValor, inclui: true },
      { nome: 'Ferias Vencidas + 1/3', valor: feriasVencidasValor, inclui: false },
      { nome: 'Multa FGTS 40%', valor: multaFGTSValor, inclui: true },
      { nome: 'Horas Extras', valor: horasExtrasValor, inclui: horasExtrasMensais != null },
    ]
  } else if (cenario === 'justa_causa') {
    verbas = [
      { nome: 'Saldo de Salario', valor: saldoSalarioValor, inclui: true },
      { nome: 'Aviso Previo', valor: avisoPrevioValor, inclui: false },
      { nome: 'Decimo Terceiro Proporcional', valor: decimo3ProporcionalValor, inclui: false },
      { nome: 'Ferias Proporcionais + 1/3', valor: feriasPropValor, inclui: false },
      { nome: 'Ferias Vencidas + 1/3', valor: feriasVencidasValor, inclui: true },
      { nome: 'Multa FGTS 40%', valor: multaFGTSValor, inclui: false },
      { nome: 'Horas Extras', valor: horasExtrasValor, inclui: horasExtrasMensais != null },
    ]
  } else {
    // pedido_demissao: sem multa FGTS, sem aviso previo indenizado
    verbas = [
      { nome: 'Saldo de Salario', valor: saldoSalarioValor, inclui: true },
      { nome: 'Aviso Previo', valor: avisoPrevioValor, inclui: false },
      { nome: 'Decimo Terceiro Proporcional', valor: decimo3ProporcionalValor, inclui: true },
      { nome: 'Ferias Proporcionais + 1/3', valor: feriasPropValor, inclui: true },
      { nome: 'Ferias Vencidas + 1/3', valor: feriasVencidasValor, inclui: false },
      { nome: 'Multa FGTS 40%', valor: multaFGTSValor, inclui: false },
      { nome: 'Horas Extras', valor: horasExtrasValor, inclui: horasExtrasMensais != null },
    ]
  }

  // Subtotal: soma apenas verbas com inclui=true
  const verbasIncluidas = verbas.filter(v => v.inclui)
  const subtotalDecimal = somar(...verbasIncluidas.map(v => v.valor))
  const subtotalStr = arredondar(subtotalDecimal)

  // Honorarios: 10% sobre subtotal (media 5-15%, art. 223-G CLT)
  const honorariosDecimal = porcentagem(subtotalDecimal, HONORARIOS_PCT)
  const honorariosStr = arredondar(honorariosDecimal)

  // Total bruto: subtotal + honorarios
  const totalBrutoDecimal = somar(subtotalDecimal, honorariosDecimal)
  const totalBrutoStr = arredondar(totalBrutoDecimal)

  // Projecoes
  const projecoes = {
    otimista: arredondar(totalBrutoDecimal.mul(PROJECOES.otimista).div(100)),
    realista: arredondar(totalBrutoDecimal.mul(PROJECOES.realista).div(100)),
    acordo: arredondar(totalBrutoDecimal.mul(PROJECOES.acordo).div(100)),
  }

  return {
    cenario,
    verbas,
    subtotal: subtotalStr,
    honorarios: honorariosStr,
    totalBruto: totalBrutoStr,
    projecoes,
  }
}
