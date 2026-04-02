# Guia de Cookbooks - Claude para Advocacia

Referencia baseada no repositorio oficial [anthropics/claude-cookbooks](https://github.com/anthropics/claude-cookbooks).
Adaptado para o escritorio Paulo Nascimento - Advocacia Integrada.

---

## Indice

1. [RAG - Recuperacao de Conhecimento Juridico](#1-rag---recuperacao-de-conhecimento-juridico)
2. [Classificacao de Documentos e Processos](#2-classificacao-de-documentos-e-processos)
3. [Sumarizacao de Pecas e Decisoes](#3-sumarizacao-de-pecas-e-decisoes)
4. [Tool Use - Ferramentas Juridicas](#4-tool-use---ferramentas-juridicas)
5. [Padroes de Agentes](#5-padroes-de-agentes)
6. [Claude Agent SDK](#6-claude-agent-sdk)
7. [Multimodal - Analise de Documentos Visuais](#7-multimodal---analise-de-documentos-visuais)
8. [Recursos Adicionais](#8-recursos-adicionais)

---

## 1. RAG - Recuperacao de Conhecimento Juridico

**Cookbook original:** `capabilities/retrieval_augmented_generation/guide.ipynb`

### O que e RAG?
Retrieval Augmented Generation permite que o Claude acesse bases de conhecimento externas antes de gerar respostas. Para advocacia, isso significa consultar:
- Jurisprudencia atualizada dos tribunais
- Legislacao vigente e suas alteracoes
- Minutas e modelos do escritorio
- Historico de processos e estrategias anteriores

### Aplicacoes no Escritorio

| Caso de Uso | Descricao | Comando Relacionado |
|-------------|-----------|---------------------|
| Pesquisa jurisprudencial | Buscar decisoes relevantes por tema, tribunal e periodo | `/pesquisa-jurisprudencia` |
| Base de minutas | Recuperar modelos similares para novos processos | `/minuta-padrao` |
| Legislacao condominial | Consultar CC/2002, Lei 4.591/64, convencoes | `/execucao-condominial` |
| Precedentes trabalhistas | TST, TRT com teses vinculantes | `/peticao-trabalhista` |

### Exemplo Pratico

```python
import anthropic

client = anthropic.Anthropic()

# Simula RAG com contexto juridico
def pesquisar_jurisprudencia(tema, tribunal="STJ"):
    """Busca jurisprudencia relevante na base de dados"""
    # Aqui voce conectaria com sua base de dados real
    # (Elasticsearch, Pinecone, banco de dados proprio)
    return resultados_da_busca

# Enriquece o prompt com conhecimento recuperado
contexto = pesquisar_jurisprudencia("execucao condominial inadimplencia")

resposta = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=4096,
    system="Voce e um advogado especialista em direito condominial brasileiro.",
    messages=[{
        "role": "user",
        "content": f"""Com base na jurisprudencia abaixo, elabore a fundamentacao 
        juridica para uma execucao de cotas condominiais:
        
        Jurisprudencia encontrada:
        {contexto}
        
        Dados do caso:
        - Debito: R$ 15.000,00 (jan/2024 a jun/2024)
        - Condominio: Edificio Solar das Palmeiras
        - Devedor: Joao da Silva
        """
    }]
)
```

### Como Implementar

1. **Escolha um banco vetorial**: Pinecone, Weaviate, ChromaDB ou pgvector
2. **Indexe seus documentos**: jurisprudencia, legislacao, minutas
3. **Crie embeddings**: Use Voyage AI ou outro servico de embeddings
4. **Integre com Claude**: Passe o contexto recuperado junto com o prompt

> Veja: `cookbooks/exemplos/rag_juridico.py`

---

## 2. Classificacao de Documentos e Processos

**Cookbook original:** `capabilities/classification/guide.ipynb`

### Aplicacoes no Escritorio

| Caso de Uso | Descricao | Beneficio |
|-------------|-----------|-----------|
| Triagem de processos | Classificar novos processos por area e urgencia | Encaminhar ao agente correto |
| Tipo de peca | Identificar se e peticao, contestacao, recurso | Aplicar modelo adequado |
| Risco processual | Avaliar probabilidade de exito | Orientar estrategia |
| Classificacao de despesas | Categorizar custas e honorarios | Relatorio financeiro |

### Exemplo Pratico

```python
import anthropic

client = anthropic.Anthropic()

def classificar_processo(descricao_caso):
    """Classifica um caso nas areas do escritorio"""
    resposta = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1024,
        messages=[{
            "role": "user",
            "content": f"""Classifique o caso abaixo nas categorias do escritorio.

Categorias disponiveis:
1. TRABALHISTA - Reclamatorias, defesas, acordos, calculos
2. CIVEL - Peticoes civeis, consumidor, responsabilidade civil
3. CONDOMINIAL - Execucao de cotas, assembleias, destituicao
4. IMOBILIARIO - Locacao, compra/venda, despejo, usucapiao
5. FAMILIA - Divorcio, alimentos, guarda, inventario

Caso: {descricao_caso}

Responda em JSON:
{{
    "area_principal": "CATEGORIA",
    "area_secundaria": "CATEGORIA ou null",
    "urgencia": "ALTA|MEDIA|BAIXA",
    "agente_recomendado": "nome do agente",
    "comandos_sugeridos": ["/comando1", "/comando2"],
    "justificativa": "breve explicacao"
}}"""
        }]
    )
    return resposta.content[0].text

# Exemplo de uso
caso = """Cliente mora em condominio e esta sendo cobrado por cotas que 
alega ja ter pago. Recebeu citacao para execucao de titulo extrajudicial. 
Prazo de 3 dias para pagar ou oferecer embargos."""

resultado = classificar_processo(caso)
print(resultado)
# Resultado esperado: CONDOMINIAL, urgencia ALTA, /defesa-condomino
```

> Veja: `cookbooks/exemplos/classificador_processos.py`

---

## 3. Sumarizacao de Pecas e Decisoes

**Cookbook original:** `capabilities/summarization/guide.ipynb`

### Aplicacoes no Escritorio

| Caso de Uso | Descricao | Comando Relacionado |
|-------------|-----------|---------------------|
| Resumo de sentencas | Extrair dispositivo e fundamentacao chave | `/analise-processo` |
| Sintese de autos | Resumir processo inteiro para cliente | `/relatorio-cliente` |
| Parecer rapido | Resumo executivo para decisao do advogado | `/conversor-linguagem` |
| Acompanhamento | Resumo de movimentacoes processuais | `/relatorio-cliente` |

### Exemplo Pratico

```python
import anthropic

client = anthropic.Anthropic()

def resumir_decisao(texto_decisao):
    """Resume uma decisao judicial para linguagem acessivel"""
    resposta = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=2048,
        system="""Voce e um assistente juridico do escritorio Paulo Nascimento.
        Resuma decisoes judiciais em linguagem clara e acessivel para o cliente.
        Sempre inclua: resultado, proximos passos, e prazos importantes.""",
        messages=[{
            "role": "user",
            "content": f"""Resuma a decisao abaixo para enviar ao cliente:

{texto_decisao}

Formato do resumo:
1. **Resultado**: O que o juiz decidiu (1-2 frases simples)
2. **O que isso significa**: Explicacao em linguagem acessivel
3. **Proximos passos**: O que precisa ser feito agora
4. **Prazos**: Datas importantes a observar
5. **Recomendacao**: Orientacao do escritorio"""
        }]
    )
    return resposta.content[0].text
```

> Veja: `cookbooks/exemplos/sumarizador_decisoes.py`

---

## 4. Tool Use - Ferramentas Juridicas

**Cookbook original:** `tool_use/` (calculator_tool, customer_service_agent, etc.)

### O que e Tool Use?
Permite que o Claude chame funcoes externas durante a conversa. Para advocacia, isso significa:
- Calcular debitos automaticamente
- Consultar andamentos processuais
- Gerar documentos formatados
- Consultar tabelas de custas

### Ferramentas para o Escritorio

```python
import anthropic
import json

client = anthropic.Anthropic()

# Define ferramentas juridicas
ferramentas = [
    {
        "name": "calcular_debito_condominial",
        "description": "Calcula debito condominial com multa, juros e correcao monetaria",
        "input_schema": {
            "type": "object",
            "properties": {
                "valor_cota": {"type": "number", "description": "Valor da cota condominial em reais"},
                "meses_atraso": {"type": "integer", "description": "Numero de meses em atraso"},
                "taxa_juros_mensal": {"type": "number", "description": "Taxa de juros mensal (padrao 0.01 = 1%)"},
                "multa_percentual": {"type": "number", "description": "Percentual de multa (padrao 0.02 = 2%)"},
                "honorarios_percentual": {"type": "number", "description": "Percentual de honorarios (padrao 0.30 = 30%)"}
            },
            "required": ["valor_cota", "meses_atraso"]
        }
    },
    {
        "name": "consultar_prazo_processual",
        "description": "Consulta prazos processuais por tipo de acao e procedimento",
        "input_schema": {
            "type": "object",
            "properties": {
                "tipo_acao": {"type": "string", "description": "Tipo da acao (execucao, conhecimento, recurso)"},
                "fase": {"type": "string", "description": "Fase processual (citacao, contestacao, recurso)"},
                "justica": {"type": "string", "description": "Ramo da justica (trabalho, estadual, federal)"}
            },
            "required": ["tipo_acao", "fase"]
        }
    },
    {
        "name": "gerar_notificacao_extrajudicial",
        "description": "Gera notificacao extrajudicial com dados do devedor e do debito",
        "input_schema": {
            "type": "object",
            "properties": {
                "nome_devedor": {"type": "string"},
                "cpf_cnpj": {"type": "string"},
                "endereco": {"type": "string"},
                "descricao_debito": {"type": "string"},
                "valor_total": {"type": "number"},
                "prazo_dias": {"type": "integer", "description": "Prazo em dias para pagamento"}
            },
            "required": ["nome_devedor", "descricao_debito", "valor_total", "prazo_dias"]
        }
    }
]

# Implementacao das ferramentas
def calcular_debito_condominial(valor_cota, meses_atraso, taxa_juros_mensal=0.01, 
                                 multa_percentual=0.02, honorarios_percentual=0.30):
    """Calcula debito condominial conforme convencao padrao"""
    total_principal = valor_cota * meses_atraso
    multa = total_principal * multa_percentual
    juros = sum(valor_cota * taxa_juros_mensal * (meses_atraso - i) for i in range(meses_atraso))
    subtotal = total_principal + multa + juros
    honorarios = subtotal * honorarios_percentual
    total = subtotal + honorarios
    
    return {
        "principal": round(total_principal, 2),
        "multa_2pct": round(multa, 2),
        "juros_1pct_am": round(juros, 2),
        "subtotal": round(subtotal, 2),
        "honorarios_30pct": round(honorarios, 2),
        "total_executado": round(total, 2)
    }

def consultar_prazo_processual(tipo_acao, fase, justica="estadual"):
    """Retorna prazos processuais"""
    prazos = {
        ("execucao", "embargos", "estadual"): {"prazo": 15, "unidade": "dias uteis", "base_legal": "Art. 915, CPC"},
        ("execucao", "pagamento", "estadual"): {"prazo": 3, "unidade": "dias uteis", "base_legal": "Art. 829, CPC"},
        ("conhecimento", "contestacao", "estadual"): {"prazo": 15, "unidade": "dias uteis", "base_legal": "Art. 335, CPC"},
        ("conhecimento", "contestacao", "trabalho"): {"prazo": 0, "unidade": "audiencia", "base_legal": "Art. 847, CLT"},
        ("recurso", "apelacao", "estadual"): {"prazo": 15, "unidade": "dias uteis", "base_legal": "Art. 1.003, CPC"},
    }
    return prazos.get((tipo_acao, fase, justica), {"prazo": "consultar", "base_legal": "verificar CPC/CLT"})

# Uso com Claude
resposta = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=4096,
    tools=ferramentas,
    messages=[{
        "role": "user",
        "content": """Preciso calcular o debito de um condomino que deve 
        6 meses de cota no valor de R$ 850,00. Aplique multa de 2%, 
        juros de 1% ao mes e honorarios de 30%. Depois me diga o 
        prazo para ele pagar apos ser citado na execucao."""
    }]
)
```

> Veja: `cookbooks/exemplos/tools_juridicos.py`

---

## 5. Padroes de Agentes

**Cookbook original:** `patterns/agents/` (basic_workflows, orchestrator_workers, evaluator_optimizer)

### Padroes Aplicaveis ao Escritorio

#### 5.1 Roteamento (Routing)
Direciona o caso para o agente especializado correto.

```
Cliente entra com demanda
    ├── Trabalhista? → Agente Trabalhista
    ├── Civel? → Agente Civel  
    ├── Condominial? → Agente Condominial
    ├── Imobiliario? → Agente Imobiliario
    └── Familia? → Agente Familia
```

#### 5.2 Encadeamento (Prompt Chaining)
Sequencia de etapas para gerar uma peca processual:

```
Analise do caso → Classificacao → Fundamentacao juridica → Redacao da peca → Revisao
```

#### 5.3 Orquestrador-Trabalhadores (Orchestrator-Workers)
O agente principal coordena sub-agentes:

```
Agente Principal (Orquestrador)
    ├── Worker 1: Pesquisa jurisprudencia
    ├── Worker 2: Calcula valores
    ├── Worker 3: Redige peca
    └── Worker 4: Revisa formatacao
```

#### 5.4 Avaliador-Otimizador (Evaluator-Optimizer)
Loop de melhoria continua para pecas processuais:

```
Redacao inicial → Avaliacao (completude, fundamentacao, formatacao) → Otimizacao → Re-avaliacao
```

### Mapeamento com Agentes do Escritorio

| Padrao | Agentes Envolvidos | Uso |
|--------|-------------------|-----|
| Roteamento | Todos os 6 agentes | Triagem inicial de casos |
| Encadeamento | Agente da area + Produtividade | Elaboracao de pecas |
| Orquestrador | Produtividade coordena outros | Casos multidisciplinares |
| Avaliador | Agente da area revisa propria saida | Controle de qualidade |

> Veja: `cookbooks/exemplos/padroes_agentes.py`

---

## 6. Claude Agent SDK

**Cookbook original:** `claude_agent_sdk/` (5 notebooks + implementacoes)

### O que e o Agent SDK?
O Claude Agent SDK permite construir agentes autonomos que podem:
- Executar codigo
- Navegar na web
- Usar ferramentas externas via MCP
- Coordenar sub-agentes

### Aplicacoes no Escritorio

#### 6.1 Agente de Pesquisa Juridica
Baseado no `00_The_one_liner_research_agent.ipynb`:

```python
from claude_agent_sdk import ClaudeSDKClient, ClaudeAgentOptions

# Agente que pesquisa jurisprudencia na web
client = ClaudeSDKClient()
resultado = client.query(
    prompt="Pesquise jurisprudencia recente do STJ sobre responsabilidade "
           "solidaria de condominos por divida condominial em 2024-2025",
    options=ClaudeAgentOptions(
        system_prompt="Voce e um pesquisador juridico especializado em "
                      "direito condominial brasileiro. Busque decisoes dos "
                      "tribunais superiores e TJs estaduais.",
        tools=["WebSearch", "Read"]
    )
)
```

#### 6.2 Agente Chefe de Staff Juridico
Baseado no `01_The_chief_of_staff_agent.ipynb`:
- Coordena os 6 agentes especializados
- Prioriza tarefas e prazos
- Gera relatorios consolidados

#### 6.3 Agente com MCP (Model Context Protocol)
Baseado no `02_The_observability_agent.ipynb`:
- Conecta com sistemas de gestao processual
- Integra com APIs de tribunais
- Acessa bancos de dados juridicos

### Instalacao do Agent SDK

```bash
# Instalar dependencias
pip install claude-code-sdk
# ou com uv
uv pip install claude-code-sdk
```

> Veja: `cookbooks/exemplos/agent_sdk_juridico.py`

---

## 7. Multimodal - Analise de Documentos Visuais

**Cookbook original:** `multimodal/` (vision, charts, transcription)

### Aplicacoes no Escritorio

| Caso de Uso | Cookbook Base | Aplicacao |
|-------------|-------------|-----------|
| Ler contratos escaneados | `how_to_transcribe_text.ipynb` | Digitalizar contratos antigos |
| Analisar plantas/mapas | `best_practices_for_vision.ipynb` | Due diligence imobiliaria |
| Extrair dados de planilhas | `reading_charts_graphs_powerpoints.ipynb` | Prestacao de contas condominial |
| Fotos de provas | `getting_started_with_vision.ipynb` | Documentacao de danos |

### Exemplo: Analisar Documento Escaneado

```python
import anthropic
import base64

client = anthropic.Anthropic()

# Ler imagem do documento
with open("contrato_escaneado.jpg", "rb") as f:
    imagem_base64 = base64.standard_b64encode(f.read()).decode("utf-8")

resposta = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": [
            {
                "type": "image",
                "source": {
                    "type": "base64",
                    "media_type": "image/jpeg",
                    "data": imagem_base64
                }
            },
            {
                "type": "text",
                "text": """Transcreva este documento juridico escaneado.
                Identifique: partes envolvidas, objeto, valores, prazos e clausulas principais.
                Formate a saida de forma estruturada."""
            }
        ]
    }]
)
```

---

## 8. Recursos Adicionais

### Links Oficiais
- **Repositorio de Cookbooks:** https://github.com/anthropics/claude-cookbooks
- **Documentacao da API:** https://docs.anthropic.com
- **Claude Agent SDK:** https://github.com/anthropics/claude-code-sdk
- **Comunidade Discord:** https://www.anthropic.com/discord

### Cookbooks Complementares Uteis

| Cookbook | Arquivo | Utilidade para Advocacia |
|---------|---------|--------------------------|
| JSON Mode | `misc/how_to_enable_json_mode.ipynb` | Estruturar dados de processos |
| Prompt Caching | `misc/prompt_caching.ipynb` | Economizar tokens em consultas repetitivas |
| SQL Queries | `misc/how_to_make_sql_queries.ipynb` | Consultar banco de dados de processos |
| Moderacao | `misc/building_moderation_filter.ipynb` | Filtrar conteudo sensivel de clientes |
| Avaliacao | `misc/building_evals.ipynb` | Testar qualidade das pecas geradas |
| PDF Upload | `misc/pdf_upload_summarization.ipynb` | Processar PDFs de processos |

### Proximos Passos Recomendados

1. **Implementar RAG** com base de jurisprudencia do escritorio
2. **Configurar Tool Use** com as calculadoras existentes
3. **Testar Agent SDK** para automacao de pesquisa
4. **Adicionar visao** para analise de documentos escaneados
5. **Criar evals** para validar qualidade das pecas geradas
