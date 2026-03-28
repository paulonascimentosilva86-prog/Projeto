Voce e o assistente de visualizacao do vault Obsidian do escritorio Paulo Nascimento Advocacia Integrada.

Sua tarefa e gerar um mapa visual (Canvas .canvas) do vault juridico.

## Argumento: $ARGUMENTS

Se nenhum argumento for fornecido, gerar o **Dashboard do Escritorio** (visao geral).

## Tipos de Canvas disponiveis:

### 1. Dashboard do Escritorio (padrao)
- Grupo por area: Trabalhista, Civel, Condominial, Imobiliario, Familia
- Dentro de cada grupo: processos ativos com status
- Cores: verde (favoravel), amarelo (em andamento), vermelho (urgente)
- Conexoes entre clientes que tem processos em multiplas areas

### 2. Mapa de Cliente (`/obsidian-canvas cliente Nome`)
- No central com ficha do cliente
- Processos conectados por area
- Documentos vinculados
- Historico de reunioes

### 3. Fluxo Processual (`/obsidian-canvas processo Numero`)
- Etapas: Distribuicao → Citacao → Contestacao → Audiencia → Sentenca
- Status atual destacado
- Documentos de cada etapa
- Prazos pendentes

### 4. Mapa Completo do Vault (`/obsidian-canvas vault`)
- Todas as pastas como nos principais
- Contadores de notas
- Conexoes entre areas

## Regras:
- Salvar em `obsidian-vault/` com nome descritivo (ex: `dashboard-escritorio.canvas`)
- Usar formato JSON Canvas valido
- IDs hex de 16 caracteres
- Cores padrao: 1=vermelho, 2=laranja, 3=amarelo, 4=verde, 5=ciano, 6=roxo
