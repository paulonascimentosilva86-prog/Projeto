# MODELO — NOTIFICACAO EXTRAJUDICIAL DE COTAS CONDOMINIAIS

> Skill vinculada: #22 Notificacoes Extrajudiciais Condominiais / #17 Workflow de Cobranca Condominial
> Uso: Gerar notificacao extrajudicial para cobranca de cotas condominiais inadimplentes
> Etapa pre-judicial do pipeline de cobranca (notificacao → protesto → acao judicial)
> Todas as citacoes jurisprudenciais devem ser buscadas no Jusbrasil (conta paulonascimentosilva86@gmail.com)

---

## DADOS A COLETAR ANTES DA GERACAO DO DOCUMENTO

Antes de gerar a notificacao, o sistema deve perguntar ao usuario todos os campos abaixo. Nenhum campo pode ser inventado ou presumido.

### BLOCO 1 — Dados do Condominio (Notificante)

| # | Pergunta | Formato |
|---|---|---|
| 1.1 | Nome completo do condominio | Texto livre |
| 1.2 | CNPJ do condominio | XX.XXX.XXX/XXXX-XX |
| 1.3 | Endereco completo do condominio | Rua, numero, bairro, cidade, UF, CEP |

### BLOCO 2 — Dados do Notificado (Devedor)

| # | Pergunta | Formato |
|---|---|---|
| 2.1 | Nome completo do notificado | Texto livre |
| 2.2 | CPF do notificado | XXX.XXX.XXX-XX |
| 2.3 | Endereco completo do notificado | Rua, numero, bloco, apto, bairro, cidade, UF, CEP |
| 2.4 | O notificado e responsavel por mais de uma unidade? | SIM / NAO |
| 2.5 | Se SIM, quais unidades? | Lista (ex: 102 09, 104 09, 104 11) |
| 2.6 | Se NAO, qual a unidade devedora? | Ex: Bloco 17, Apto 204 |

### BLOCO 3 — Dados do Debito

| # | Pergunta | Formato |
|---|---|---|
| 3.1 | Meses inadimplentes por unidade | Lista de meses/anos por unidade |
| 3.2 | Ha planilha ou detalhamento de valores em anexo? | SIM / NAO |
| 3.3 | Valor total do debito (se ja calculado) | R$ X.XXX,XX (opcional nesta fase) |

### BLOCO 4 — Condicoes da Notificacao

| # | Pergunta | Formato |
|---|---|---|
| 4.1 | Prazo para pagamento/contato (em dias corridos) | Numero inteiro (padrao: 3 dias) |
| 4.2 | Telefone/WhatsApp do advogado para contato | (XX) XXXXX-XXXX |
| 4.3 | E-mail do advogado para contato | Texto livre |
| 4.4 | Horario de atendimento para contato | Ex: horario comercial |
| 4.5 | Local e data da notificacao | Cidade/UF, dia/mes/ano |

---

## ESTRUTURA DO DOCUMENTO GERADO

O documento gerado deve seguir rigorosamente a estrutura abaixo.

---

### CABECALHO

```
NOTIFICACAO EXTRAJUDICIAL

[Cidade/UF], [dia] de [mes] de [ano]
Assunto: Notificacao Extrajudicial, Dividas de Taxas Condominiais
```

### DESTINATARIO

```
Ao Senhor(a) [NOME COMPLETO DO NOTIFICADO], inscrito(a) no CPF sob o
n. [CPF], residente e domiciliado(a) na [endereco completo da unidade].
```

### VOCATIVO

```
Prezado(a) Senhor(a) [NOME DO NOTIFICADO],
```

### CORPO DA NOTIFICACAO

**Paragrafo 1 — Identificacao do notificante e objeto**

[NOME DO CONDOMINIO], inscrito no CNPJ n. [CNPJ], com endereco na [endereco completo], neste ato representado pelo juridico e bastante procurador Dr. Paulo Severino Do Nascimento Silva, OAB/PB 20.556, e-mail: paulo.nascimento@pnadvintegrada.com, vem, por meio desta, notificar Vossa Senhoria sobre a ausencia de pagamento de taxas condominiais [da unidade X / das unidades X, Y e Z], conforme detalhamento anexo.

**Paragrafo 2 — Prazo para quitacao**

Ressaltamos que a quitacao do debito devera ser realizada no prazo maximo de [X] ([extenso]) dias corridos, a contar do recebimento desta notificacao, sob pena de execucao judicial para a cobranca do montante devido, acrescido de despesas processuais e honorarios advocaticios, conforme previsto na legislacao vigente e no Regimento Interno deste condominio.

**Paragrafo 3 — Consequencias juridicas**

A ausencia de resposta a presente notificacao, dentro do prazo estipulado, sera interpretada como negativa de saldar a divida, acarretando o ingresso de acao judicial cabivel, com fulcro no artigo 1.336 e 389 do Codigo Civil, ressaltando que o proprio imovel podera sofrer penhora e ser alienado judicialmente, nos moldes do artigo 829 do CPC:

> Art. 829. O executado sera citado para pagar a divida no prazo de 3 (tres) dias, contado da citacao.
> § 1o Do mandado de citacao constarao, tambem, a ordem de penhora e a avaliacao a serem cumpridas pelo oficial de justica tao logo verificado o nao pagamento no prazo assinalado, de tudo lavrando-se auto, com intimacao do executado.
> § 2o A penhora recaira sobre os bens indicados pelo exequente, salvo se outros forem indicados pelo executado e aceitos pelo juiz, mediante demonstracao de que a constricao proposta lhe sera menos onerosa e nao trara prejuizo ao exequente.

**Paragrafo 4 — Canal para acordo amigavel**

O pagamento devera ser efetuado atraves da assessoria juridica do condominio para tratativas de acordo amigavel, portanto, entrar em contato atraves telefone/WhatsApp: [telefone], em [horario de atendimento], para a realizacao de acordo sobre o pagamento dos debitos relativos a(s) cota(s) condominial(is) do(s) mes(es) em atraso sob sua responsabilidade.

**Paragrafo 5 — Ressalva de quitacao**

Na hipotese de estar quite junto as taxas mensais, peco que entre em contato para que possamos regularizar.

**Paragrafo 6 — Encerramento**

Contamos com sua compreensao e colaboracao para a resolucao deste assunto de forma amigavel e celere, evitando, assim, maiores transtornos e custos adicionais.

### FECHO

```
Atenciosamente,


[ASSINADO ELETRONICAMENTE]
PAULO NASCIMENTO
ADVOGADO - OAB/PB 20.556
```

---

## REGRAS DE GERACAO

1. **Nenhum dado pode ser inventado.** Se o usuario nao fornecer, perguntar.
2. **Unidades:** se o notificado e responsavel por mais de uma unidade, listar todas no corpo da notificacao separadas por virgula e "e" antes da ultima.
3. **Prazo:** o padrao e 3 (tres) dias corridos, salvo indicacao contraria do usuario.
4. **Art. 829 CPC:** sempre incluir o texto integral do artigo com seus paragrafos.
5. **Arts. 1.336 e 389 CC:** sempre mencionar como fundamento legal da obrigacao condominial e da mora.
6. **Penhora do imovel:** sempre alertar expressamente sobre a possibilidade de penhora e alienacao judicial do imovel, conforme art. 829 CPC.
7. **Detalhamento do debito:** nesta fase (notificacao), o detalhamento pode ser remetido ao anexo. Nao e obrigatorio discriminar valores no corpo da notificacao, bastando a referencia "conforme detalhamento anexo".
8. **Tom:** firme, tecnico, sem agressividade. A notificacao deve comunicar a existencia do debito, o prazo e as consequencias, abrindo canal para acordo amigavel.
9. **Formatacao:** Century Gothic, tamanho 12, espacamento 1,5, texto justificado, conforme padrao do escritorio.
10. **Citacoes jurisprudenciais (se incluidas):** buscar e verificar no Jusbrasil (conta paulonascimentosilva86@gmail.com) antes de inserir.
11. **Pipeline de cobranca:** a notificacao e a primeira etapa. Se nao houver resposta no prazo, o proximo passo e o protesto ou a acao judicial, conforme orientacao do cliente.

---

## FUNDAMENTACAO LEGAL APLICAVEL

| Dispositivo | Conteudo | Aplicacao |
|---|---|---|
| Art. 1.336 CC | Deveres do condomino, incluindo contribuir para despesas condominiais | Fundamenta a obrigacao de pagar cotas |
| Art. 389 CC | Inadimplemento da obrigacao: perdas e danos, juros, atualizacao, honorarios | Fundamenta os acrescimos por mora |
| Art. 829 CPC | Execucao por quantia certa: citacao, penhora, avaliacao | Fundamenta a advertencia sobre execucao judicial |
| Art. 784, X, CPC | Titulo executivo extrajudicial: credito de cotas condominiais | Fundamenta a natureza executiva do debito condominial |
| Art. 1.345 CC | Obrigacao propter rem: adquirente responde por debitos anteriores | Fundamenta a vinculacao do debito ao imovel |
