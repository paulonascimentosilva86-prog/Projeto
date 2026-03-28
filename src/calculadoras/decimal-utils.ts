import Decimal from 'decimal.js'

Decimal.set({ rounding: Decimal.ROUND_HALF_UP })

export function toDecimal(valor: number | string | Decimal): Decimal {
  return new Decimal(valor)
}

export function arredondar(valor: number | string | Decimal, casas = 2): string {
  return new Decimal(valor).toDecimalPlaces(casas, Decimal.ROUND_HALF_UP).toFixed(casas)
}

export function porcentagem(base: number | string | Decimal, pct: number | string | Decimal): Decimal {
  return new Decimal(base).mul(new Decimal(pct)).div(100)
}

export function multiplicar(a: number | string | Decimal, b: number | string | Decimal): Decimal {
  return new Decimal(a).mul(new Decimal(b))
}

export function somar(...valores: Array<number | string | Decimal>): Decimal {
  return valores.reduce((acc, v) => new Decimal(acc).add(new Decimal(v)), new Decimal(0)) as Decimal
}
