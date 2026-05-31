# Claude Code Juridico - Paulo Nascimento Advocacia Integrada

## Sobre
Sistema de agentes e skills especializados para escritorio de advocacia full service.
Areas: Trabalhista, Civel, Condominial, Imobiliario, Familia/Sucessoes.

## Perfil do Escritorio
- **Escritorio:** Paulo Nascimento - Advocacia Integrada
- **Porte:** Medio (mix PF e PJ)
- **Modelo:** Full service
- **Maior demanda:** Trabalhista + Civel + Condominial/Imobiliario
- **Foco condominial:** Execucao de cotas condominiais (ambos os polos)
- **Foco imobiliario:** Locacao, compra/venda, posse/regularizacao, construtoras

## Comandos Disponiveis (Slash Commands)

### FASE 1 - Fundacao (Core)
- `/peticao-trabalhista` - Gera peticao trabalhista completa (reclamatoria)
- `/defesa-trabalhista` - Contestacao trabalhista para polo passivo (empregador)
- `/execucao-condominial` - Execucao de cotas condominiais (skill principal)
- `/calculadora-condominial` - Planilha de debito condominial discriminada
- `/workflow-cobranca` - Pipeline: notificacao → protesto → acao judicial
- `/peticao-civel` - Peticao civel generica com fundamentacao
- `/execucao-cumprimento` - Cumprimento de sentenca / execucao de titulo
- `/acao-consumo` - Peticao consumerista com jurimetria
- `/conversor-linguagem` - Traduz juridiques para linguagem acessivel
- `/analise-processo` - Triagem e analise rapida de processo

### FASE 2 - Expansao
- `/contrato-locacao` - Contrato de locacao (residencial/comercial)
- `/acao-despejo` - Peticao de despejo (todas modalidades)
- `/acao-renovatoria` - Acao renovatoria de locacao comercial
- `/revisional-aluguel` - Acao revisional de aluguel
- `/defesa-condomino` - Embargos a execucao condominial
- `/destituicao-sindico` - Acao de destituicao de sindico
- `/convencao-regimento` - Convencao e regimento interno condominial
- `/atas-assembleia` - Atas e convocacoes de assembleia
- `/mediacao-condominial` - Mediacao e conciliacao condominial
- `/compra-venda-imovel` - Contrato de compra e venda de imovel
- `/due-diligence` - Checklist de due diligence imobiliaria
- `/notificacao-condominial` - Notificacoes extrajudiciais condominiais
- `/divorcio` - Peticao de divorcio (judicial/extrajudicial)
- `/alimentos` - Acao de alimentos/revisional/exoneratoria
- `/inventario` - Inventario e partilha (judicial/extrajudicial)
- `/guarda-visitas` - Guarda e regulamentacao de visitas
- `/justa-causa` - Analisador de justa causa (art. 482 CLT)
- `/acordo-trabalhista` - Acordo extrajudicial (art. 855-B CLT)
- `/simulador-reclamatoria` - Simulador de valor de condenacao trabalhista
- `/insalubridade-periculosidade` - Calculadora de adicionais com reflexos
- `/compliance-trabalhista` - Checklist de conformidade trabalhista
- `/embargos-impugnacao` - Embargos a execucao, impugnacao, embargos de terceiro

### FASE 3 - Diferenciacao
- `/usucapiao` - Peticao de usucapiao (judicial/extrajudicial)
- `/adjudicacao` - Adjudicacao compulsoria
- `/distrato-imobiliario` - Distrato conforme Lei 13.786/2018
- `/reintegracao-posse` - Peticao possessoria com liminar
- `/reurb` - Regularizacao fundiaria urbana
- `/lgpd` - Diagnostico de conformidade LGPD
- `/gerador-conteudo` - Marketing juridico (artigos, posts, FAQ)

### Calculadoras
- `/calculadora-condominial` - Planilha de debito condominial discriminada
- `/calculadora-distrato` - Calculo de distrato imobiliario (Lei 13.786/2018)
- `/calculadora-aluguel` - Reajuste de aluguel por indice (IGP-M, IPCA, INPC)
- `/insalubridade-periculosidade` - Adicionais trabalhistas com reflexos
- `/simulador-reclamatoria` - Estimativa de condenacao trabalhista (3 cenarios)

### Produtividade e Comunicacao
- `/relatorio-cliente` - Relatorio de andamento processual
- `/proposta-honorarios` - Proposta profissional de honorarios
- `/parecer-custos` - Estimativa de custas e despesas processuais
- `/minuta-padrao` - Banco de minutas adaptativas
- `/modelo-email` - Modelos de e-mail e mensagem ao cliente
- `/pesquisa-jurisprudencia` - Pesquisa jurisprudencial dirigida
- `/pesquisa-profunda` - Pesquisa em tempo real na web + fontes curadas para NotebookLM
- `/conversor-linguagem` - Traduz juridiques para linguagem acessivel
- `/analise-processo` - Triagem e analise rapida de processo

## Agentes Especializados
- **Agente Trabalhista** - Especialista em direito do trabalho
- **Agente Civel** - Especialista em direito civil e processual
- **Agente Condominial** - Especialista em direito condominial
- **Agente Imobiliario** - Especialista em direito imobiliario
- **Agente Familia** - Especialista em familia e sucessoes
- **Agente Produtividade** - Gestao, comunicacao e produtividade

## Convencoes
- Todas as peticoes seguem formatacao ABNT e normas do tribunal destino
- Valores monetarios em R$ com 2 casas decimais
- Datas no formato DD/MM/AAAA
- Referencias legais sempre com artigo, diploma e ano
- Jurisprudencia citada com tribunal, numero e data
- Calculos condominiais: multa 2% + juros 1% a.m. + INPC + honorarios 30%
