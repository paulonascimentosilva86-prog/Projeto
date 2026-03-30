import Decimal from 'decimal.js'
import { arredondar, porcentagem, multiplicar, somar, toDecimal } from './decimal-utils'

// Graus de insalubridade e percentuais — art. 192 CLT + NR-15
export const GRAUS_INSALUBRIDADE = {
  minimo: 10,
  medio: 20,
  maximo: 40,
} as const

// Regra de nao-cumulatividade — Art. 193 §2 CLT
export const AVISO_NAO_CUMULAM =
  'Art. 193 §2 CLT — insalubridade e periculosidade nao cumulam: empregado escolhe o mais vantajoso'

export type GrauInsalubridade = keyof typeof GRAUS_INSALUBRIDADE

export interface InsalubridadeInput {
  grau: GrauInsalubridade
  salarioMinimo: number   // ex: 1412.00
  meses: number           // periodo para calculo de reflexos
  salarioBase: number     // para calculo de ferias+1/3 e 13
}

export interface PericulosidadeInput {
  salarioBase: number     // base para 30% — Sumula 191 TST
  meses: number
}

export interface ReflexosInput {
  adicionalMensal: number   // valor do adicional por mes
  salarioBase: number
  meses: number
  incluiHorasExtras?: boolean
}

export interface TrabalhistaResult {
  adicionalMensal: string   // valor mensal do adicional
  totalAdicional: string    // adicionalMensal × meses
  reflexoFerias: string     // adicionalMensal * (4/3) — ferias + 1/3
  reflexo13: string         // adicionalMensal — proporcional 13o
  reflexoFGTS: string       // totalAdicional × 8%
  totalReflexos: string
  totalGeral: string        // totalAdicional + totalReflexos
}

export interface MaisVantajosoResult extends TrabalhistaResult {
  maisVantajoso: 'insalubridade' | 'periculosidade'
  aviso: string
}

/**
 * Calcula adicional de insalubridade (art. 192 CLT).
 * Base = salario minimo × grau (10%/20%/40%).
 * Sumula 139 TST e Sumula Vinculante 4 STF.
 */
export function calcularInsalubridade(input: InsalubridadeInput): TrabalhistaResult {
  const { grau, salarioMinimo, meses } = input
  const percentual = GRAUS_INSALUBRIDADE[grau]

  const adicionalMensalDecimal = porcentagem(salarioMinimo, percentual)
  const totalAdicionalDecimal = multiplicar(adicionalMensalDecimal, meses)

  return calcularReflexosInterno(adicionalMensalDecimal, totalAdicionalDecimal)
}

/**
 * Calcula adicional de periculosidade (art. 193 CLT).
 * Base = salario-base × 30% — NAO sobre salario minimo (Sumula 191 TST).
 */
export function calcularPericulosidade(input: PericulosidadeInput): TrabalhistaResult {
  const { salarioBase, meses } = input

  const adicionalMensalDecimal = porcentagem(salarioBase, 30)
  const totalAdicionalDecimal = multiplicar(adicionalMensalDecimal, meses)

  return calcularReflexosInterno(adicionalMensalDecimal, totalAdicionalDecimal)
}

/**
 * Calcula reflexos sobre o adicional.
 * Aceita input externo (usado nos testes isolados de reflexos).
 */
export function calcularReflexos(input: ReflexosInput): TrabalhistaResult {
  const { adicionalMensal, meses } = input
  const adicionalMensalDecimal = toDecimal(adicionalMensal)
  const totalAdicionalDecimal = multiplicar(adicionalMensalDecimal, meses)

  return calcularReflexosInterno(adicionalMensalDecimal, totalAdicionalDecimal)
}

/**
 * Logica interna de reflexos — reutilizada por insalubridade e periculosidade.
 *
 * Formulas:
 *   reflexoFerias  = adicionalMensal × (4/3)   [ferias + 1/3 constitucional]
 *   reflexo13      = adicionalMensal            [proporcional — totalAdicional/12 = adicionalMensal]
 *   reflexoFGTS    = totalAdicional × 8%
 *   totalReflexos  = soma dos tres reflexos
 *   totalGeral     = totalAdicional + totalReflexos
 */
function calcularReflexosInterno(
  adicionalMensalDecimal: Decimal,
  totalAdicionalDecimal: Decimal,
): TrabalhistaResult {
  // reflexoFerias = adicionalMensal * 4/3  (ferias + 1/3)
  const reflexoFeriasDecimal = adicionalMensalDecimal.mul(new Decimal(4).div(3))

  // reflexo13 = adicionalMensal (proporcional = totalAdicional / meses = adicionalMensal)
  const reflexo13Decimal = adicionalMensalDecimal

  // reflexoFGTS = totalAdicional * 8%
  const reflexoFGTSDecimal = porcentagem(totalAdicionalDecimal, 8)

  // Arredonda cada reflexo individualmente antes de somar (padrao contabil)
  const reflexoFeriasStr = arredondar(reflexoFeriasDecimal)
  const reflexo13Str = arredondar(reflexo13Decimal)
  const reflexoFGTSStr = arredondar(reflexoFGTSDecimal)
  const adicionalMensalStr = arredondar(adicionalMensalDecimal)
  const totalAdicionalStr = arredondar(totalAdicionalDecimal)

  const totalReflexosDecimal = somar(reflexoFeriasStr, reflexo13Str, reflexoFGTSStr)
  const totalGeralDecimal = somar(totalAdicionalStr, arredondar(totalReflexosDecimal))

  return {
    adicionalMensal: adicionalMensalStr,
    totalAdicional: totalAdicionalStr,
    reflexoFerias: reflexoFeriasStr,
    reflexo13: reflexo13Str,
    reflexoFGTS: reflexoFGTSStr,
    totalReflexos: arredondar(totalReflexosDecimal),
    totalGeral: arredondar(totalGeralDecimal),
  }
}

/**
 * Compara insalubridade vs periculosidade e retorna o mais vantajoso.
 * Art. 193 §2 CLT — NAO cumulam: empregado escolhe.
 */
export function calcularMaisVantajoso(
  insalubridade: TrabalhistaResult,
  periculosidade: TrabalhistaResult,
): MaisVantajosoResult {
  const vInsalubridade = new Decimal(insalubridade.adicionalMensal)
  const vPericulosidade = new Decimal(periculosidade.adicionalMensal)

  if (vPericulosidade.greaterThan(vInsalubridade)) {
    return {
      ...periculosidade,
      maisVantajoso: 'periculosidade',
      aviso: AVISO_NAO_CUMULAM,
    }
  }

  return {
    ...insalubridade,
    maisVantajoso: 'insalubridade',
    aviso: AVISO_NAO_CUMULAM,
  }
}
