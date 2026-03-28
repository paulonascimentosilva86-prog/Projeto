# Vault Juridico - Paulo Nascimento Advocacia Integrada

## Sobre este Vault
Segundo cerebro do escritorio de advocacia. Todas as notas sao Markdown puro,
conectadas por wikilinks, organizadas em pastas tematicas.

## Estrutura de Pastas
- `00-Inbox/` - Notas rapidas, capturas, itens a processar
- `01-Clientes/` - Ficha de cada cliente (PF e PJ)
- `02-Processos/` - Processos organizados por area (Trabalhista, Civel, Condominial, Imobiliario, Familia)
- `03-Modelos/` - Minutas e templates reutilizaveis
- `04-Jurisprudencia/` - Decisoes relevantes por tema
- `05-Estudos/` - Artigos, anotacoes de estudo, pesquisas
- `06-Reunioes/` - Atas de reunioes com clientes e audiencias
- `07-Financeiro/` - Controle de honorarios e custas
- `08-Marketing/` - Conteudo juridico, posts, roteiros
- `99-Templates/` - Templates Obsidian para notas padronizadas

## Convencoes
- Nomes de arquivo: kebab-case sem acentos (ex: `joao-silva-reclamatoria.md`)
- Wikilinks para conectar: `[[cliente]]`, `[[processo]]`, `[[jurisprudencia]]`
- Tags padrao: #cliente, #processo, #urgente, #audiencia, #prazo, #pago, #pendente
- Frontmatter YAML obrigatorio em todas as notas
- Datas no formato YYYY-MM-DD (para ordenacao do Obsidian)
- Valores monetarios em R$ com 2 casas decimais

## Areas de Atuacao
- Trabalhista (reclamatorias, defesas, acordos)
- Civel (consumo, execucoes, embargos)
- Condominial (execucao de cotas, defesa, assembleias)
- Imobiliario (locacao, compra/venda, usucapiao)
- Familia/Sucessoes (divorcio, alimentos, inventario)

## Regras para o Claude
- Sempre usar wikilinks `[[nota]]` para referenciar outras notas
- Criar frontmatter YAML em toda nota nova
- Notas novas na Inbox (`00-Inbox/`) ate serem classificadas
- Ao processar Inbox, mover para pasta correta e adicionar links
- Manter MOCs (Maps of Content) atualizados por area
- Usar callouts `> [!warning]` para prazos e urgencias
- Usar callouts `> [!tip]` para estrategias e dicas processuais
