# Integracao NotebookLM MCP — Paulo Nascimento, Advocacia Integrada

> Servidor MCP que conecta o Claude Code ao Google NotebookLM (Gemini 2.5)
> Fonte: https://github.com/PleasePrompto/notebooklm-mcp

---

## Status da Instalacao

| Item | Status |
|---|---|
| Servidor MCP | Instalado (notebooklm-mcp@latest via npx) |
| Perfil | Full (16 ferramentas ativas) |
| Versao | 1.1.0 |
| Conta Google | paulo.nascimento@pnadvintegrada.com |
| Autenticacao | **PENDENTE** (bloqueio de rede neste ambiente; auto-login configurado para ambiente local) |
| Auto-login | Configurado (email pre-definido, senha sera solicitada no primeiro uso) |
| Chrome | Instalado (symlink para Chromium do Playwright) |
| Config | `/root/.config/notebooklm-mcp/settings.json` (profile: full, autoLogin: true) |

---

## Autenticacao — Estado Atual e Proximos Passos

### Bloqueio identificado (ambiente cloud)

O proxy deste ambiente bloqueia `notebooklm.google.com` (HTTP 403, `host_not_allowed`).
O `accounts.google.com` responde normalmente, mas o redirecionamento para o NotebookLM falha.

### O que ja foi feito:

1. MCP instalado e 16 ferramentas respondendo (testado com get_health, list_notebooks, etc.)
2. Chrome disponibilizado via symlink do Chromium do Playwright
3. Xvfb (display virtual) configurado e testado
4. Auto-login configurado em `settings.json` e nas env vars do MCP:
   - `AUTO_LOGIN_ENABLED=true`
   - `LOGIN_EMAIL=paulo.nascimento@pnadvintegrada.com`
5. Senha **nao armazenada** em arquivo (sera solicitada ou passada via `LOGIN_PASSWORD` env var)

### Para completar o login (ambiente local ou com acesso a internet pleno):

**Opcao 1: Auto-login (recomendado)**
Passar a senha como variavel de ambiente na sessao:
```bash
export LOGIN_PASSWORD="[sua_senha]"
```
O MCP fara o login automaticamente ao abrir o navegador.

**Opcao 2: Login interativo**
Na sessao do Claude Code com navegador:
```
"Log me in to NotebookLM com a conta paulo.nascimento@pnadvintegrada.com"
```
O MCP abrira o Chrome para login manual.

**Opcao 3: Re-autenticacao**
```
"Re-authenticate no NotebookLM com paulo.nascimento@pnadvintegrada.com"
```

Apos o login, as credenciais ficam salvas em `/root/.local/share/notebooklm-mcp/chrome_profile/` e persistem por 24h.

---

## 16 Ferramentas Disponiveis

### Pesquisa e Consulta (uso principal)

| Ferramenta | Descricao | Aplicacao no Escritorio |
|---|---|---|
| `ask_question` | Faz perguntas ao NotebookLM sobre o conteudo dos notebooks (Gemini 2.5 + RAG) | Consultar legislacao, doutrina, modelos de pecas, anotacoes de casos armazenados |
| `search_notebooks` | Busca notebooks por nome, descricao, topicos ou tags | Encontrar material relevante para o caso em andamento |
| `select_notebook` | Define notebook ativo padrao para perguntas | Selecionar o notebook da area do caso (trabalhista, condominial, etc.) |

### Gestao de Biblioteca

| Ferramenta | Descricao | Aplicacao no Escritorio |
|---|---|---|
| `add_notebook` | Adiciona notebook a biblioteca | Cadastrar novo notebook com legislacao, jurisprudencia ou modelos |
| `list_notebooks` | Lista todos os notebooks com metadados | Ver acervo completo de conhecimento do escritorio |
| `get_notebook` | Detalhes de um notebook especifico | Verificar conteudo e fontes de um notebook |
| `update_notebook` | Atualiza metadados do notebook | Manter descrições e tags atualizadas |
| `remove_notebook` | Remove notebook (requer confirmacao) | Limpar notebooks obsoletos |
| `get_library_stats` | Estatisticas da biblioteca | Visao geral do acervo |

### Gestao de Sessoes

| Ferramenta | Descricao | Aplicacao no Escritorio |
|---|---|---|
| `list_sessions` | Lista sessoes ativas | Monitorar pesquisas em andamento |
| `close_session` | Fecha sessao especifica | Encerrar pesquisa concluida |
| `reset_session` | Limpa historico da sessao | Recomecar pesquisa com contexto limpo |

### Administracao

| Ferramenta | Descricao | Aplicacao no Escritorio |
|---|---|---|
| `get_health` | Status do servidor e autenticacao | Verificar se tudo esta funcionando |
| `setup_auth` | Autenticacao Google (primeiro login) | Login inicial |
| `re_auth` | Reautenticacao ou troca de conta | Trocar conta se necessario |
| `cleanup_data` | Limpeza completa de dados | Resetar instalacao |

---

## Notebooks Recomendados para o Escritorio

Apos o login, criar os seguintes notebooks no NotebookLM (https://notebooklm.google.com) e adicionar as fontes correspondentes:

### Notebooks por Area do Direito

| Notebook | Fontes Sugeridas | Tags |
|---|---|---|
| **Condominial** | CC arts. 1.331-1.358; Lei 4.591/64; CPC arts. 784 e 829; modelos de peticoes condominiais; jurisprudencia STJ sobre obrigacao propter rem | condominial, cobranca, execucao, assembleia |
| **Trabalhista** | CLT; Lei 13.467/2017 (Reforma); Sumulas TST; NRs; modelos de reclamatoria e contestacao | trabalhista, clt, tst, verbas |
| **Civil** | CC/2002; CPC/2015; CDC (Lei 8.078/90); modelos de peticao civel; jurisprudencia STJ responsabilidade civil | civel, consumidor, execucao, obrigacoes |
| **Imobiliario** | Lei 8.245/91; Lei 13.786/2018; Lei 6.015/73; Lei 13.465/2017; modelos de contrato; jurisprudencia posse e propriedade | imobiliario, locacao, despejo, usucapiao |
| **Familia e Sucessoes** | CC/2002 Livros IV e V; Lei 11.441/2007; ECA; modelos de divorcio e inventario | familia, alimentos, guarda, inventario |

### Notebooks Transversais

| Notebook | Fontes Sugeridas | Tags |
|---|---|---|
| **Modelos do Escritorio** | Todos os modelos de pecas, acordos, notificacoes, minutas padrao do escritorio | modelos, templates, minutas |
| **Jurisprudencia Selecionada** | Julgados mais usados pelo escritorio, organizados por tema | jurisprudencia, precedentes, sumulas |
| **Calculos Juridicos** | Tabelas de indices (INPC, IGP-M, IPCA), formulas de calculo, planilhas modelo | calculos, indices, correcao |
| **LGPD e Compliance** | Lei 13.709/2018, regulamentos ANPD, modelos de politica de privacidade | lgpd, compliance, dados |

---

## Integracao com o Pipeline Juridico

### Com o Workflow RIPEV (WORKFLOW_PECAS_JURIDICAS.md)

| Fase RIPEV | Como o NotebookLM auxilia |
|---|---|
| **1. Pesquisar** | `ask_question` para consultar legislacao e doutrina nos notebooks; complementa a pesquisa no Jusbrasil |
| **2. Inovar** | `ask_question` para explorar teses e estrategias a partir do acervo do escritorio |
| **3. Planejar** | `search_notebooks` para encontrar modelos de estrutura similares ja utilizados |
| **4. Executar** | `ask_question` para consultar redacao de pecas anteriores como referencia |
| **5. Validar** | `ask_question` para verificar fundamentacao contra o acervo do escritorio |

### Com os Contextos Juridicos (CONTEXTOS_JURIDICOS.md)

Ao ativar um contexto (`/contexto condominial`), o notebook correspondente deve ser selecionado:
```
Ao ativar /contexto condominial → select_notebook "Condominial"
Ao ativar /contexto trabalhista → select_notebook "Trabalhista"
Ao ativar /contexto civil → select_notebook "Civil"
Ao ativar /contexto imobiliario → select_notebook "Imobiliario"
Ao ativar /contexto familia → select_notebook "Familia e Sucessoes"
```

### Com a Pesquisa Jurisprudencial (PLUGIN_JURISPRUDENCIA_NACIONAL.md)

**REGRA MANTIDA:** O Jusbrasil continua sendo o caminho unico e obrigatorio para pesquisa de jurisprudencia. O NotebookLM serve como:
- Acervo organizado de jurisprudencia ja pesquisada e validada
- Consulta rapida a precedentes ja utilizados em pecas anteriores
- Base de conhecimento complementar (doutrina, legislacao, modelos)

O NotebookLM **nao substitui** o Jusbrasil. A hierarquia e:
1. **Jusbrasil** (pesquisa primaria e obrigatoria de jurisprudencia)
2. **NotebookLM** (acervo do escritorio, doutrina, modelos, legislacao)
3. **Sites dos tribunais** (validacao complementar)

---

## Configuracao Tecnica

| Item | Valor |
|---|---|
| Comando MCP | `npx notebooklm-mcp@latest` |
| Tipo | stdio |
| Config | `/root/.config/notebooklm-mcp/settings.json` |
| Dados | `/root/.local/share/notebooklm-mcp/` |
| Chrome Profile | `/root/.local/share/notebooklm-mcp/chrome_profile/` |
| Biblioteca | `/root/.local/share/notebooklm-mcp/library.json` |
| Max Sessoes | 10 |
| Timeout Sessao | 900s (15 minutos) |
| Modo | Headless + Stealth |

Para alterar o perfil de ferramentas:
```bash
npx notebooklm-mcp config set profile minimal   # 5 ferramentas (consulta)
npx notebooklm-mcp config set profile standard   # 10 ferramentas (consulta + biblioteca)
npx notebooklm-mcp config set profile full        # 16 ferramentas (tudo)
```

---

*Integracao NotebookLM MCP para Paulo Nascimento - Advocacia Integrada*
*16 ferramentas | Gemini 2.5 + RAG | Conta: paulo.nascimento@pnadvintegrada.com*
*Gerado em 23/03/2026*
