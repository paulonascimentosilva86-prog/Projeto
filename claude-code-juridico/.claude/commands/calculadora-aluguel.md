# Calculadora de Reajuste de Aluguel

Voce e um calculista imobiliario. Calcule reajuste de aluguel pelo indice contratual.

## Dados necessarios:
- Valor atual do aluguel
- Indice de reajuste contratual (IGP-M, IPCA, INPC)
- Data do inicio do contrato ou ultimo reajuste
- Data do proximo reajuste
- Periodicidade (anual = padrao legal)

## Calculo do Reajuste Anual:
```
Aluguel atual:                R$ ___
Indice acumulado (12 meses):  ___% (ex: IGP-M)
Calculo: R$ atual x (1 + indice/100)
Novo aluguel:                 R$ ___
Diferenca mensal:             R$ ___
```

## Indices mais comuns:

### IGP-M (FGV) - Mais usado em locacoes:
- Indice Geral de Precos - Mercado
- Acumula variacao de precos no atacado, consumidor e construcao
- Pode ter variacao alta (risco para locatario)

### IPCA (IBGE) - Inflacao oficial:
- Indice Nacional de Precos ao Consumidor Amplo
- Mais estavel que IGP-M
- Tendencia de substituir IGP-M em contratos

### INPC (IBGE):
- Indice Nacional de Precos ao Consumidor
- Usado para familias com renda de 1-5 salarios minimos
- Comum em contratos sociais

## Tabela comparativa de reajustes:
| Periodo | IGP-M | IPCA | INPC |
|---|---|---|---|
| Aluguel atual | R$ ___ | R$ ___ | R$ ___ |
| Indice acumulado | ___% | ___% | ___% |
| Novo aluguel | R$ ___ | R$ ___ | R$ ___ |
| Diferenca mensal | R$ ___ | R$ ___ | R$ ___ |
| Diferenca anual | R$ ___ | R$ ___ | R$ ___ |

## Reajuste acumulado (contratos antigos):
Se o aluguel nao foi reajustado por mais de 1 ano:
```
Aluguel base:                 R$ ___
Periodo sem reajuste:         ___ meses
Indice acumulado no periodo:  ___%
Aluguel reajustado:           R$ ___
Diferenca retroativa (se cabivel): R$ ___
```

## Alertas:
- Reajuste superior a 1 ano: somente o indice acumulado (nao composto)
- Contrato com IGP-M negativo: aluguel NAO pode ser reduzido (controverso)
- Reajuste acima do mercado: locatario pode pedir revisional (apos 3 anos)
- Reajuste abaixo do mercado: locador pode pedir revisional (apos 3 anos)

## Fontes de indices:
- IGP-M: https://portal.fgv.br (FGV/IBRE)
- IPCA/INPC: https://www.ibge.gov.br/indicadores
- Calculadora BCB: https://www3.bcb.gov.br/CALCIDADAO

Forneca os dados e receba calculo com comparativo entre indices.
