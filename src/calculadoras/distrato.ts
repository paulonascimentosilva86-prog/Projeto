import Decimal from 'decimal.js'
import { arredondar, porcentagem, multiplicar, somar, toDecimal } from './decimal-utils'

export type CenarioDistrato = 'desistencia_comprador' | 'atraso_construtora' | 'arrependimento'
export type RegimeDistrato = 'comum' | 'afetacao'

export interface DistratoInput {
  cenario: CenarioDistrato
  regime: RegimeDistrato
  totalPago: number           // total já pago pelo comprador em R$
  valorImovel: number         // valor do imóvel
  mesesUso: number            // meses que usou (para taxa fruição)
  comissaoCorretagem: number  // valor da comissão já paga em R$
  iptu: number                // IPTU proporcional pago pelo comprador
  condominio: number          // condomínio proporcional pago pelo comprador
  fatorINCC: number           // ex: 1.08 para 8% de correção INCC (só atraso construtora)
  multaContratual: number     // % de multa (só atraso construtora), ex: 1 para 1%
}

export interface DistratoResult {
  totalPago: string
  retencao: string
  taxaFruicao: string
  comissaoCorretagem: string
  valorDevolver: string
  prazoDevoucao: string     // "180 dias" | "30 dias apos habite-se" | "60 dias" | "7 dias"
  observacoes: string[]
}

export function calcularDistrato(input: DistratoInput): DistratoResult {
  const {
    cenario,
    regime,
    totalPago,
    valorImovel,
    mesesUso,
    comissaoCorretagem,
    iptu,
    condominio,
    fatorINCC,
    multaContratual,
  } = input

  const totalPagoD = toDecimal(totalPago)
  const valorImovelD = toDecimal(valorImovel)

  let retencaoD = new Decimal(0)
  let taxaFruicaoD = new Decimal(0)
  let corretagem = toDecimal(comissaoCorretagem)
  let iptuD = toDecimal(iptu)
  let condominioD = toDecimal(condominio)
  let valorDevolverD: Decimal
  let prazoDevoucao: string
  const observacoes: string[] = []

  if (cenario === 'desistencia_comprador') {
    // Retenção conforme regime — art. 67-A Lei 13.786/2018
    if (regime === 'comum') {
      retencaoD = porcentagem(totalPagoD, 25)
      prazoDevoucao = '180 dias'
      observacoes.push('Art. 67-A, §5o, Lei 13.786/2018: retencao maxima de 25% sobre valores pagos (regime comum)')
      observacoes.push('Prazo de devolucao: 180 dias apos a formalizacao do distrato')
    } else {
      // afetacao
      retencaoD = porcentagem(totalPagoD, 50)
      prazoDevoucao = '30 dias apos habite-se'
      observacoes.push('Art. 67-A, §2o, Lei 13.786/2018: retencao maxima de 50% sobre valores pagos (patrimonio de afetacao)')
      observacoes.push('Prazo de devolucao: 30 dias apos expedicao do habite-se ou 180 dias apos o distrato')
    }

    // Taxa de fruição: 0,5% do valor do imóvel por mês de uso
    if (mesesUso > 0) {
      // taxaFruicao = valorImovel * 0.005 * mesesUso
      taxaFruicaoD = multiplicar(multiplicar(valorImovelD, '0.005'), mesesUso)
      observacoes.push(`Taxa de fruicao: 0,5% ao mes sobre o valor do imovel por ${mesesUso} mes(es) de uso`)
    }

    // Arredonda retencao antes de usar nas deducoes (cada linha do calculo e arredondada)
    retencaoD = toDecimal(arredondar(retencaoD))

    // valorDevolver = totalPago - retencao - corretagem - IPTU - condominio - fruicao
    const deducoes = somar(retencaoD, corretagem, iptuD, condominioD, taxaFruicaoD)
    valorDevolverD = totalPagoD.minus(deducoes)

    // Não pode ser negativo
    if (valorDevolverD.lt(0)) {
      valorDevolverD = new Decimal(0)
      observacoes.push('Atencao: soma das deducoes superou o total pago; valor a devolver ajustado para R$ 0,00')
    }

    observacoes.push('A retencao informada representa o MAXIMO legal — negocie valor menor quando possivel')

  } else if (cenario === 'atraso_construtora') {
    // Devolução integral + correção INCC + multa contratual
    // art. 67-A, §8o, Lei 13.786/2018 (por remissão ao art. 43-A, Lei 4.591/64)
    retencaoD = new Decimal(0)
    taxaFruicaoD = new Decimal(0)
    corretagem = new Decimal(0)
    iptuD = new Decimal(0)
    condominioD = new Decimal(0)
    prazoDevoucao = '60 dias'

    // valorDevolver = totalPago * fatorINCC + totalPago * (multaContratual / 100)
    const valorCorrigido = multiplicar(totalPagoD, fatorINCC)
    const multaValor = porcentagem(totalPagoD, multaContratual)
    valorDevolverD = valorCorrigido.plus(multaValor)

    observacoes.push('Art. 43-A, Lei 4.591/64 c/c art. 67-A, §8o, Lei 13.786/2018: atraso superior a 180 dias gera direito a resolucao com devolucao integral')
    observacoes.push('Valor inclui correcao monetaria pelo INCC e multa contratual')
    observacoes.push('Prazo de devolucao: 60 dias do distrato')

  } else {
    // arrependimento — art. 49 CDC + art. 67-A, §10, Lei 4.591/64
    retencaoD = new Decimal(0)
    taxaFruicaoD = new Decimal(0)
    corretagem = new Decimal(0)
    iptuD = new Decimal(0)
    condominioD = new Decimal(0)
    valorDevolverD = totalPagoD
    prazoDevoucao = '7 dias'

    observacoes.push('Art. 49 CDC + art. 67-A, §10, Lei 4.591/64: direito de arrependimento em 7 dias quando a compra ocorreu em estande de vendas ou fora da sede do vendedor')
    observacoes.push('Devolucao INTEGRAL de todos os valores pagos — sem qualquer retencao ou deducao')
    observacoes.push('Prazo de devolucao: 7 dias corridos apos o exercicio do direito de arrependimento')
  }

  return {
    totalPago: arredondar(totalPagoD),
    retencao: arredondar(retencaoD),
    taxaFruicao: arredondar(taxaFruicaoD),
    comissaoCorretagem: arredondar(corretagem),
    valorDevolver: arredondar(valorDevolverD),
    prazoDevoucao,
    observacoes,
  }
}
