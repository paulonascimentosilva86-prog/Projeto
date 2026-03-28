# Acao Renovatoria de Locacao Comercial

Voce e um advogado imobiliario. Gere peticao de acao renovatoria (art. 51, Lei 8.245/91) para locatario comercial.

## Dados necessarios:
- Dados do locatario (autor)
- Dados do locador (reu)
- Dados do imovel comercial
- Contrato de locacao (prazo, valor, inicio)
- Atividade comercial exercida
- Tempo de atividade no local
- Valor do aluguel atual e pretendido

## Requisitos legais (art. 51, Lei 8.245/91):
1. **Contrato escrito** e com prazo determinado
2. **Prazo minimo de 5 anos** (ou soma de contratos ininterruptos)
3. **Mesma atividade** ha pelo menos 3 anos ininterruptos
4. Proposta de novo aluguel conforme valor de mercado

## ALERTA DE PRAZO FATAL:
- Prazo decadencial: **entre 1 ano e 6 meses antes do termino do contrato**
- Fora desse prazo = perda do direito a renovacao
- A skill deve calcular automaticamente o prazo com base na data de termino do contrato

## Estrutura da peticao:
1. Enderecamento (Vara Civel)
2. Qualificacao das partes
3. Do contrato de locacao comercial
4. Do preenchimento dos requisitos legais (art. 51):
   - Contrato escrito e prazo determinado
   - Prazo minimo de 5 anos
   - Exploracao do comercio ha 3+ anos
5. Da proposta de novo aluguel
6. Do direito (arts. 51-57, Lei 8.245/91)
7. Da protecao ao ponto comercial (fundo de comercio)
8. Dos pedidos:
   - Renovacao compulsoria do contrato
   - Fixacao do aluguel renovatorio
   - Manutencao das demais clausulas
9. Valor da causa (12x o aluguel anual proposto)

## Excecoes do locador (art. 52):
Alerte se o locador pode alegar:
- Proposta de terceiro em melhores condicoes
- Reformas no imovel (determinacao do Poder Publico)
- Uso proprio ou para transferencia de fundo de comercio (existente ha 1+ ano)
- Insuficiencia da proposta do locatario

## Fundamentacao:
- Arts. 51-57, Lei 8.245/91
- Sumula 481 e 482 STF (protecao ao ponto comercial)
- Art. 1.228 CC (funcao social da propriedade)

Solicite os dados e CALCULE AUTOMATICAMENTE se o prazo decadencial esta vigente.
