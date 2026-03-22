# MODELO — TERMO DE ACORDO DE COTAS CONDOMINIAIS

> Skill vinculada: #24 Mediacao e Conciliacao Condominial / #17 Workflow de Cobranca Condominial
> Uso: Gerar termo de acordo para cobranca de cotas condominiais inadimplentes
> Todas as citacoes jurisprudenciais devem ser buscadas no Jusbrasil (conta paulonascimentosilva86@gmail.com)

---

## DADOS A COLETAR ANTES DA GERACAO DO DOCUMENTO

Antes de gerar o termo de acordo, o sistema deve perguntar ao usuario todos os campos abaixo. Nenhum campo pode ser inventado ou presumido.

### BLOCO 1 — Natureza do Acordo

| # | Pergunta | Opcoes / Formato |
|---|---|---|
| 1.1 | O acordo e judicial ou extrajudicial? | JUDICIAL / EXTRAJUDICIAL |
| 1.2 | Existe processo judicial em curso? | SIM / NAO |
| 1.3 | Se SIM, qual o numero do processo? | Numero completo (ex: 0800XXX-XX.2025.8.15.XXXX) |
| 1.4 | Se JUDICIAL, ha pedido de desbloqueio de valores? | SIM / NAO |
| 1.5 | Se SIM, qual o valor bloqueado e em qual conta? | Valor em R$ + banco/agencia/conta |

### BLOCO 2 — Dados do Condominio (Credor)

| # | Pergunta | Formato |
|---|---|---|
| 2.1 | Nome completo do condominio | Texto livre |
| 2.2 | CNPJ do condominio | XX.XXX.XXX/XXXX-XX |
| 2.3 | Endereco completo do condominio | Rua, numero, bairro, cidade, UF, CEP |
| 2.4 | Nome completo do sindico | Texto livre |

### BLOCO 3 — Dados do Devedor

| # | Pergunta | Formato |
|---|---|---|
| 3.1 | Nome completo do devedor | Texto livre |
| 3.2 | CPF do devedor | XXX.XXX.XXX-XX |
| 3.3 | RG do devedor | Numero + orgao expedidor/UF |
| 3.4 | Nacionalidade | Texto livre |
| 3.5 | Endereco completo do devedor | Rua, numero, bloco, apto, bairro, cidade, UF, CEP |
| 3.6 | Telefone/WhatsApp do devedor | (XX) XXXXX-XXXX |
| 3.7 | O devedor sera representado por advogado? | SIM / NAO |
| 3.8 | Se SIM: nome do advogado, OAB, CPF, endereco profissional e e-mail | Dados completos |

### BLOCO 4 — Dados do Debito

| # | Pergunta | Formato |
|---|---|---|
| 4.1 | Unidade devedora (bloco e apartamento) | Ex: Bloco 17, Apto 204 |
| 4.2 | Periodos inadimplentes (meses/anos) | Lista de meses (ex: jan/2023, fev/2023...) |
| 4.3 | Valor do principal | R$ X.XXX,XX |
| 4.4 | Valor dos juros de mora (1% a.m.) | R$ X.XXX,XX |
| 4.5 | Valor da multa (2%) | R$ X.XXX,XX |
| 4.6 | Valor da atualizacao monetaria (INPC) | R$ X.XXX,XX |
| 4.7 | Subtotal do condominio | R$ X.XXX,XX |
| 4.8 | Valor dos honorarios advocaticios | R$ X.XXX,XX |
| 4.9 | Percentual dos honorarios e base (ex: 30% sobre o subtotal, conforme art. 51 da convencao) | Percentual + fundamentacao |
| 4.10 | Valor total do acordo | R$ X.XXX,XX |

### BLOCO 5 — Condicoes de Pagamento

| # | Pergunta | Formato |
|---|---|---|
| 5.1 | Quantas parcelas? | Numero inteiro |
| 5.2 | Ha entrada? | SIM / NAO |
| 5.3 | Se SIM, valor da entrada (condominio + honorarios) e data de vencimento | R$ + data |
| 5.4 | Valor de cada parcela e data de vencimento | Tabela: parcela / valor condominio / valor honorarios / data |
| 5.5 | Forma de pagamento (boleto, PIX, deposito) | Texto livre |
| 5.6 | Conta para pagamento (banco, agencia, conta, titular, CNPJ/CPF) | Dados bancarios completos |
| 5.7 | WhatsApp do advogado para solicitar boleto caso nao chegue | (XX) XXXXX-XXXX |

### BLOCO 6 — Clausulas Adicionais

| # | Pergunta | Formato |
|---|---|---|
| 6.1 | Percentual de multa convencional por inadimplemento do acordo | Ex: 80% sobre o saldo devedor |
| 6.2 | O devedor deve pagar tambem a cota condominial do mes em curso? | SIM / NAO |
| 6.3 | Com o acordo, o condomino recupera direito a voto em assembleia? | SIM / NAO |
| 6.4 | Assinatura digital (ICP-Brasil) ou fisica com testemunhas? | DIGITAL / FISICA |
| 6.5 | Local e data do acordo | Cidade, dia/mes/ano |

---

## ESTRUTURA DO DOCUMENTO GERADO

O documento gerado deve seguir rigorosamente a estrutura abaixo, adaptando-se conforme o acordo seja judicial ou extrajudicial.

---

### CABECALHO

```
TERMO DE ACORDO [EXTRAJUDICIAL / JUDICIAL] DE COTAS CONDOMINIAIS

Natureza: ACORDO [EXTRAJUDICIAL / JUDICIAL]
[Se judicial: Processo n. XXXXXXX-XX.XXXX.X.XX.XXXX]
Credor: [NOME DO CONDOMINIO]
Devedor: [NOME DO DEVEDOR]
```

### PREAMBULO (Qualificacao das Partes)

Pelo presente instrumento:

**CREDOR:** [Nome do condominio], inscrito no CNPJ n. [CNPJ], localizado na [endereco completo], neste ato representado por PAULO SEVERINO DO NASCIMENTO SILVA, advogado, inscrito na OAB/PB sob o n. 20.556, com endereco profissional na Rua Desembargador Jose Peregrino, n. 235, sala 205, Empresarial Andre Lima, bairro: centro, Joao Pessoa/PB, CEP 58013-500, e e-mail: paulonascimentosilva86@gmail.com, constituido pelo sindico, o(a) Sr(a). [nome do sindico].

**DEVEDOR:** [Nome completo], [nacionalidade], inscrito no CPF sob o n. [CPF], RG de n. [RG], com residencia e domicilio a [endereco completo], telefone WhatsApp: [telefone].
[Se representado por advogado: neste ato representado por sua procuradora [nome], advogada, inscrita na OAB/[UF] sob o n. [numero], inscrita no CPF sob o n. [CPF], endereco profissional na [endereco], e-mail: [e-mail].]

Ajustam o seguinte:

### CLAUSULAS

**Clausula 1 — Reconhecimento do Debito**

Declara o devedor que e proprietario e responsavel pelo pagamento das cotas condominiais da unidade [bloco/apto], que neste caso, corresponde ao saldo devedor discriminado da seguinte forma:

a) Principal: R$ [valor] ([extenso]);
b) Juros de mora (1% a.m.): R$ [valor] ([extenso]);
c) Multa (2%): R$ [valor] ([extenso]);
d) Atualizacao monetaria (INPC): R$ [valor] ([extenso]);

Perfazendo o subtotal de condominio em R$ [valor] ([extenso]), acrescido de R$ [valor] ([extenso]), atinente aos honorarios advocaticios do causidico do condominio, nos termos do art. 51 da convencao, totalizando R$ [valor total] ([extenso]), referente as cotas condominiais relativas aos periodos de [lista de meses/anos], cuja certeza, liquidez e exigibilidade reconhece expressamente, tendo o promovido conferido o calculo previamente apresentado pelo condominio credor.

**Clausula 2 — Forma de Pagamento**

As partes reconhecendo a existencia e exigibilidade do debito existente no montante acima, por mutuo consenso acordaram que sera pago PARCELADO EM [X] ([extenso]) PARCELAS, de acordo com a tabela abaixo:

| Forma | Condominio | Honorarios | Data de vencimento |
|---|---|---|---|
| Entrada | R$ [valor] | R$ [valor] | [data] |
| 1a Parcela | R$ [valor] | - | [data] |
| 2a Parcela | R$ [valor] | - | [data] |
| ... | ... | ... | ... |

**Clausula 3 — Meio de Pagamento**

O pagamento ora acordado devera ser efetuado por meio de [boleto bancario / PIX / deposito] emitido pelo credor e entregue previamente, caso o [boleto/comprovante] nao chegue por qualquer motivo que seja ate a data do vencimento, o devedor/condomino devera solicitar ao condominio, por e-mail ou pessoalmente por WhatsApp do advogado ([telefone]).

**Clausula 4 — Irrevogabilidade**

O presente acordo e feito em carater irrevogavel, as partes renunciam, desde logo, ao direito de interpor qualquer procedimento judicial que contrarie ou obste o presente acordo, enquanto estiver sendo plenamente satisfeito.

**Clausula 5 — Inadimplemento e Multa Convencional**

O presente acordo devera ser quitado juntamente com a cobranca relativa a cota condominial do mes em curso e os honorarios advocaticios aprovado em assembleia, sendo que a falta de pagamento, seja do presente acordo ou dos honorarios advocaticios aqui estipulados, implicara na antecipacao da divida, ficando o Condominio habilitado a promover a cobranca judicial, com todos os acrescimos legais, bem como multa convencional no importe de [X]% ([extenso]) ao saldo devedor calculado sobre o valor do acordo, correspondente a R$ [valor total] ([extenso]), acrescido da correcao do valor total pelo INPC, seguindo-se a execucao de quantia certa, em cumprimento a sentenca, nos termos do art. 523 do CPC/2015.

> Art. 523. No caso de condenacao em quantia certa, ou ja fixada em liquidacao, e no caso de decisao sobre parcela incontroversa, o cumprimento definitivo da sentenca far-se-a a requerimento do exequente, sendo o executado intimado para pagar o debito, no prazo de 15 (quinze) dias, acrescido de custas, se houver. § 1o Nao ocorrendo pagamento voluntario no prazo do caput, o debito sera acrescido de multa de dez por cento e, tambem, de honorarios de advogado de dez por cento. § 2o Efetuado o pagamento parcial no prazo previsto no caput, a multa e os honorarios previstos no § 1o incidirao sobre o restante. § 3o Nao efetuado tempestivamente o pagamento voluntario, sera expedido, desde logo, mandado de penhora e avaliacao, seguindo-se os atos de expropriacao.

**Clausula 6 — Quitacao**

Com o total adimplemento do acordo, extingue todas as obrigacoes decorrentes da relacao e dos fatos discutidos nestes autos, motivo pelo qual as partes darao entre si ampla, geral, reciproca e irrevogavel quitacao, para nada mais discutir e/ou exigir quanto ao merito da presente lide.

**Clausula 7 — Direito a Voto em Assembleia**

[Se aplicavel:] Com o presente acordo, podera o condomino participar da assembleia de condominio com direito a voto, sendo que caso torne-se eventualmente inadimplente, perde automaticamente este direito.

**Clausula 8 — Assinatura**

[Se DIGITAL:]
O presente instrumento sera assinado eletronicamente pelas partes, mediante certificacao digital no padrao ICP-Brasil, nos termos da Medida Provisoria n. 2.200-2/2001, que instituiu a Infraestrutura de Chaves Publicas Brasileira, garantindo autenticidade, integridade e validade juridica ao documento. As partes reconhecem que a assinatura digital possui presuncao de veracidade quanto ao signatario, dispensando-se a exigencia de testemunhas para fins de constituicao de titulo executivo extrajudicial, conforme entendimento consolidado pelo Superior Tribunal de Justica (REsp 1.495.920/DF) e art. 784, III, do Codigo de Processo Civil.

[Se FISICA:]
O presente instrumento sera assinado pelas partes e por duas testemunhas, constituindo titulo executivo extrajudicial nos termos do art. 784, III, do Codigo de Processo Civil.

### CLAUSULAS ADICIONAIS (SE JUDICIAL)

**Clausula 9 — Homologacao Judicial** *(somente se judicial)*

As partes requerem a homologacao do presente acordo pelo Juizo da [vara], nos termos do art. 487, III, "b", do CPC/2015, com a consequente extincao do feito com resolucao de merito.

**Clausula 10 — Desbloqueio de Valores** *(somente se houver pedido de desbloqueio)*

As partes requerem o imediato desbloqueio dos valores constrictos na conta [banco/agencia/conta] do devedor, no montante de R$ [valor], em razao da celebracao do presente acordo, devendo o valor ser restituido ao devedor em ate [X] dias uteis apos a homologacao.

### FECHO

E, por estarem justas e contratadas, as partes assinam o presente termo [eletronicamente, dispensada a assinatura de testemunhas em razao da certificacao digital ICP-Brasil / na presenca das testemunhas abaixo].

[Cidade], [dia] de [mes] de [ano]

### BLOCO DE ASSINATURAS

```
[NOME DO CONDOMINIO]
Credor
CNPJ: [CNPJ]
[Assinado digitalmente / ___________________________]


PAULO SEVERINO DO NASCIMENTO SILVA
Advogado - OAB/PB 20.556
[Assinado digitalmente / ___________________________]


[NOME DO DEVEDOR]
Devedor
CPF: [CPF]
[Assinado digitalmente / ___________________________]


[Se representado por advogado:]
[NOME DO ADVOGADO DO DEVEDOR]
Advogado(a) - OAB/[UF] [numero]
Procurador(a) do Devedor
[Assinado digitalmente / ___________________________]


[Se assinatura fisica:]
TESTEMUNHA 1: ___________________________
Nome:
CPF:

TESTEMUNHA 2: ___________________________
Nome:
CPF:
```

---

## REGRAS DE GERACAO

1. **Todos os valores devem ser expressos em numeral E por extenso** entre parenteses.
2. **Nenhum dado pode ser inventado.** Se o usuario nao fornecer, perguntar.
3. **Honorarios:** sempre discriminar separadamente na tabela de parcelas (entrada inclui honorarios, demais parcelas so condominio, salvo indicacao contraria).
4. **Meses inadimplentes:** listar todos individualmente, sem abreviar com "a" (ex: "janeiro/2023 a dezembro/2023"). Listar cada mes.
5. **Art. 523 CPC:** sempre incluir a nota de rodape com o texto integral do artigo.
6. **Se judicial:** incluir clausulas de homologacao e, se aplicavel, desbloqueio de valores.
7. **Se extrajudicial:** omitir clausulas judiciais, manter clausula de titulo executivo extrajudicial (art. 784, III, CPC).
8. **Formatacao:** Century Gothic, tamanho 12, espacamento 1,5, texto justificado, conforme padrao do escritorio.
9. **Citacoes jurisprudenciais:** buscar e verificar no Jusbrasil (conta paulonascimentosilva86@gmail.com) antes de inserir.
10. **REsp 1.495.920/DF:** citacao obrigatoria na clausula de assinatura digital para fundamentar a dispensa de testemunhas.
