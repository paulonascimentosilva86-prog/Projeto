import { arredondar, porcentagem, multiplicar, somar, toDecimal } from './decimal-utils.js'

const MULTA_PCT = 2      // 2% sobre principal (art. 1.336, §1°, CC)
const JUROS_PCT = 1      // 1% ao mes sobre (principal + multa)
const HONORARIOS_PCT = 30 // 30% sobre subtotal

export interface CondominialInput {
  principal: number       // valor da divida em R$
  mesesAtraso: number     // quantos meses em atraso
  fatorINPC: number       // ex: 1.05 para 5% de correcao INPC acumulada
}

export interface CondominialResult {
  principal: string       // "1000.00"
  multa: string           // "20.00"
  juros: string           // "10.20"
  correcao: string        // "0.00"
  subtotal: string        // "1030.20"
  honorarios: string      // "309.06"
  total: string           // "1339.26"
}

export function calcularCondominial(input: CondominialInput): CondominialResult {
  const { principal, mesesAtraso, fatorINPC } = input

  // Multa = Principal x 2%
  const multa = porcentagem(principal, MULTA_PCT)

  // Juros = (Principal + Multa) x 1% x meses_atraso
  const baseJuros = somar(principal, multa)
  const juros = multiplicar(porcentagem(baseJuros, JUROS_PCT), mesesAtraso)

  // Correcao = Principal x (fatorINPC - 1)
  // ex: fatorINPC=1.05 => correcao = principal * 0.05
  const percentualINPC = toDecimal(fatorINPC).minus(1)
  const correcao = multiplicar(principal, percentualINPC)

  // Subtotal = Principal + Multa + Juros + Correcao
  const subtotal = somar(principal, multa, juros, correcao)

  // Honorarios = Subtotal x 30%
  const honorarios = porcentagem(subtotal, HONORARIOS_PCT)

  // Total = Subtotal + Honorarios
  const total = somar(subtotal, honorarios)

  return {
    principal: arredondar(principal),
    multa: arredondar(multa),
    juros: arredondar(juros),
    correcao: arredondar(correcao),
    subtotal: arredondar(subtotal),
    honorarios: arredondar(honorarios),
    total: arredondar(total),
  }
}
