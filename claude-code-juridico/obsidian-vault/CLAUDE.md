# Vault Juridico - Paulo Nascimento Advocacia Integrada

## Sobre este Vault
Segundo cerebro do escritorio de advocacia. Todas as notas sao Markdown puro,
conectadas por wikilinks, organizadas em pastas tematicas.
Sempre em portugues brasileiro.

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
- `09-Projetos/` - Projetos do escritorio com controle de status
- `Diario/` - Notas diarias no formato `YYYY-MM-DD.md`
- `99-Templates/` - Templates Obsidian para notas padronizadas

## Convencoes Obrigatorias

### Idioma
- Tudo em portugues brasileiro, sempre

### Links Internos
- Sempre usar wikilinks `[[nota]]` para referenciar outras notas
- Exemplos: `[[joao-silva]]`, `[[processo-reclamatoria-001]]`, `[[MOC-Trabalhista]]`
- Links com alias quando necessario: `[[joao-silva|Joao da Silva]]`

### Frontmatter YAML
- Todo arquivo DEVE ter frontmatter com pelo menos: titulo, tags e data
- Exemplo minimo:
  ```yaml
  ---
  titulo: "Nome da Nota"
  data: 2026-03-28
  tags:
    - tipo-da-nota
  ---
  ```

### Notas Diarias
- Salvas em `Diario/YYYY-MM-DD.md` (ex: `Diario/2026-03-28.md`)
- Usar template `99-Templates/daily/template-daily.md`

### Status de Projetos
Projetos em `09-Projetos/` devem ter status no frontmatter:
- `ideia` - Projeto em fase de concepcao
- `pesquisando` - Em fase de pesquisa e levantamento
- `em-andamento` - Execucao ativa
- `aguardando` - Pausado, esperando resposta/acao externa
- `concluido` - Finalizado
- `arquivado` - Encerrado sem continuidade

### Outras Convencoes
- Nomes de arquivo: kebab-case sem acentos (ex: `joao-silva-reclamatoria.md`)
- Tags padrao: #cliente, #processo, #urgente, #audiencia, #prazo, #pago, #pendente
- Datas no formato YYYY-MM-DD (para ordenacao do Obsidian)
- Valores monetarios em R$ com 2 casas decimais
- Callouts `> [!warning]` para prazos e urgencias
- Callouts `> [!danger]` para prazos vencidos
- Callouts `> [!tip]` para estrategias e dicas processuais

## Areas de Atuacao
- Trabalhista (reclamatorias, defesas, acordos)
- Civel (consumo, execucoes, embargos)
- Condominial (execucao de cotas, defesa, assembleias)
- Imobiliario (locacao, compra/venda, usucapiao)
- Familia/Sucessoes (divorcio, alimentos, inventario)

## Regras para o Claude
- Escrever tudo em portugues brasileiro
- Sempre usar wikilinks `[[nota]]` para referenciar outras notas
- Criar frontmatter YAML com titulo, tags e data em toda nota nova
- Notas novas na Inbox (`00-Inbox/`) ate serem classificadas
- Notas diarias em `Diario/YYYY-MM-DD.md`
- Projetos em `09-Projetos/` com status obrigatorio no frontmatter
- Ao processar Inbox, mover para pasta correta e adicionar links
- Manter MOCs (Maps of Content) atualizados por area
