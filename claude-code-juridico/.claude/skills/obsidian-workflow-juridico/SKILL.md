---
name: obsidian-workflow-juridico
description: Workflow diario para vault juridico. Processa Inbox, organiza notas, atualiza MOCs, controla prazos e gera daily notes. Use quando o usuario pedir para organizar o vault, processar inbox, ou criar nota diaria.
---

# Workflow Juridico para Obsidian

Skill personalizada para automatizar o fluxo de trabalho diario do escritorio Paulo Nascimento Advocacia Integrada no Obsidian.

## Processar Inbox

Quando solicitado a processar a Inbox (`00-Inbox/`):

1. Ler todas as notas em `00-Inbox/`
2. Para cada nota, identificar o tipo (cliente, processo, jurisprudencia, reuniao, estudo)
3. Adicionar frontmatter YAML adequado se ausente
4. Mover para a pasta correta:
   - Dados de cliente → `01-Clientes/`
   - Info de processo → `02-Processos/{Area}/`
   - Decisoes/acordaos → `04-Jurisprudencia/`
   - Notas de reuniao → `06-Reunioes/`
   - Artigos/pesquisas → `05-Estudos/`
   - Conteudo marketing → `08-Marketing/`
5. Criar wikilinks bidirecionais entre notas relacionadas
6. Atualizar MOCs relevantes

## Daily Note

Quando solicitado a criar daily note:

1. Criar nota em `99-Templates/daily/` com data atual
2. Buscar no vault por prazos que vencem hoje ou amanha
3. Listar audiencias agendadas
4. Puxar tarefas pendentes de dias anteriores
5. Formato usando template `template-daily.md`

## Controle de Prazos

Buscar notas com tag `#prazo` ou propriedade `proxima_audiencia`:

1. Varrer `02-Processos/` por frontmatter com datas proximas
2. Gerar callout `> [!warning]` para prazos em 48h
3. Gerar callout `> [!danger]` para prazos vencidos
4. Atualizar MOC de prazos

## Atualizar MOCs

Maps of Content a manter atualizados:

- `MOC-Trabalhista.md` - Todos os processos trabalhistas
- `MOC-Civel.md` - Todos os processos civeis
- `MOC-Condominial.md` - Todos os processos condominiais
- `MOC-Imobiliario.md` - Todos os processos imobiliarios
- `MOC-Familia.md` - Todos os processos de familia
- `MOC-Clientes.md` - Indice de todos os clientes
- `MOC-Prazos.md` - Prazos ativos organizados por data

Cada MOC deve:
- Listar wikilinks para todas as notas da area
- Agrupar por status (ativo, arquivado, urgente)
- Incluir contadores (total, ativos, arquivados)

## Pesquisa no Vault

Quando o usuario fizer perguntas sobre o vault:

1. Buscar em todas as notas por termos relevantes
2. Seguir wikilinks para contexto adicional
3. Responder com base no conteudo encontrado
4. Citar as notas fonte com wikilinks

## Convencoes

- Nomes de arquivo: kebab-case sem acentos
- Tags padrao: #cliente #processo #urgente #audiencia #prazo #pago #pendente
- Areas: Trabalhista, Civel, Condominial, Imobiliario, Familia
- Datas YAML: YYYY-MM-DD
- Callouts para alertas: `> [!warning]` prazos, `> [!danger]` vencidos, `> [!tip]` estrategias
