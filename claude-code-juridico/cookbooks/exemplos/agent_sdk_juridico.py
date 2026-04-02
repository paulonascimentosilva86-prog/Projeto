"""
Claude Agent SDK - Agentes Autonomos para Advocacia
Baseado em: anthropics/claude-cookbooks/claude_agent_sdk/

Demonstra como criar agentes autonomos usando o Claude Code SDK
para automacao de tarefas juridicas.

Requisitos:
    pip install claude-code-sdk
    # ou: uv pip install claude-code-sdk
"""

import asyncio
import json

# Nota: Importe real requer claude-code-sdk instalado
# from claude_code_sdk import query, ClaudeCodeOptions
# Para demonstracao, usamos a API direta do Anthropic

import anthropic


client = anthropic.Anthropic()
MODEL = "claude-sonnet-4-20250514"


# =====================================================
# AGENTE 1: Pesquisador Juridico
# Baseado em: 00_The_one_liner_research_agent.ipynb
# =====================================================

def agente_pesquisador(tema: str, tribunal: str = "STJ") -> str:
    """
    Agente que pesquisa e sintetiza informacoes juridicas.
    Em producao com Agent SDK, usaria WebSearch e Read tools.
    """
    resposta = client.messages.create(
        model=MODEL,
        max_tokens=4096,
        system=(
            f"Voce e um pesquisador juridico especializado. "
            f"Foco: decisoes do {tribunal} e legislacao brasileira. "
            f"Sempre cite: tribunal, numero do processo, data e ementa. "
            f"Organize por relevancia e recencia."
        ),
        messages=[{
            "role": "user",
            "content": f"""Pesquise e sintetize o entendimento atual sobre:

TEMA: {tema}

Organize sua pesquisa em:
1. Tese predominante (com citacoes)
2. Teses divergentes (se houver)
3. Legislacao aplicavel
4. Tendencia jurisprudencial recente
5. Recomendacao pratica para o advogado"""
        }]
    )
    return resposta.content[0].text


# =====================================================
# AGENTE 2: Coordenador (Chief of Staff)
# Baseado em: 01_The_chief_of_staff_agent.ipynb
# =====================================================

class AgenteCoordenador:
    """
    Coordena os agentes especializados do escritorio.
    Gerencia prioridades, prazos e distribuicao de trabalho.
    """

    def __init__(self):
        self.fila_tarefas = []
        self.historico = []

    def priorizar(self, casos: list[dict]) -> list[dict]:
        """Prioriza casos por urgencia e complexidade"""
        prompt_casos = json.dumps(casos, ensure_ascii=False, indent=2)

        resposta = client.messages.create(
            model=MODEL,
            max_tokens=2048,
            system=(
                "Voce e o coordenador do escritorio Paulo Nascimento. "
                "Priorize os casos considerando: prazos processuais, "
                "valor da causa, complexidade e risco de prescricao."
            ),
            messages=[{
                "role": "user",
                "content": f"""Priorize estes casos e defina a ordem de atendimento:

{prompt_casos}

Responda em JSON:
[
    {{
        "caso": "identificacao",
        "prioridade": 1,
        "urgencia": "CRITICA|ALTA|MEDIA|BAIXA",
        "agente_designado": "area",
        "justificativa": "razao da prioridade",
        "prazo_limite": "DD/MM/AAAA ou null"
    }}
]"""
            }]
        )

        texto = resposta.content[0].text.strip()
        if texto.startswith("```"):
            texto = texto.split("\n", 1)[1].rsplit("```", 1)[0]

        try:
            return json.loads(texto)
        except json.JSONDecodeError:
            return casos

    def gerar_relatorio_diario(self, atividades: list[dict]) -> str:
        """Gera relatorio consolidado do dia"""
        resposta = client.messages.create(
            model=MODEL,
            max_tokens=2048,
            system=(
                "Voce e o assistente de gestao do escritorio. "
                "Gere relatorios claros e objetivos para o advogado titular."
            ),
            messages=[{
                "role": "user",
                "content": f"""Gere o relatorio diario do escritorio:

ATIVIDADES DO DIA:
{json.dumps(atividades, ensure_ascii=False, indent=2)}

Formato:
- Resumo executivo (3 linhas)
- Casos atendidos (tabela)
- Prazos proximos (proximos 5 dias uteis)
- Pendencias e alertas
- Financeiro resumido"""
            }]
        )
        return resposta.content[0].text


# =====================================================
# AGENTE 3: Analista de Documentos
# Usa capacidades multimodal do Claude
# =====================================================

def agente_analista_documentos(texto_documento: str, tipo: str = "contrato") -> dict:
    """
    Analisa documentos juridicos e extrai informacoes estruturadas.
    """
    resposta = client.messages.create(
        model=MODEL,
        max_tokens=4096,
        system=(
            "Voce e um analista juridico especializado em revisao de documentos. "
            "Extraia todas as informacoes relevantes de forma estruturada. "
            "Identifique riscos, clausulas problematicas e pontos de atencao."
        ),
        messages=[{
            "role": "user",
            "content": f"""Analise este {tipo} e extraia as informacoes em JSON:

{texto_documento}

Estrutura esperada:
{{
    "tipo_documento": "...",
    "partes": {{
        "parte_1": {{"nome": "...", "qualificacao": "...", "papel": "..."}},
        "parte_2": {{"nome": "...", "qualificacao": "...", "papel": "..."}}
    }},
    "objeto": "descricao do objeto",
    "valores": {{
        "valor_principal": 0.00,
        "multas": "...",
        "juros": "...",
        "correcao": "..."
    }},
    "prazos": [
        {{"descricao": "...", "data": "DD/MM/AAAA", "tipo": "fatal|dilatatorio"}}
    ],
    "clausulas_relevantes": [
        {{"numero": "X", "resumo": "...", "risco": "ALTO|MEDIO|BAIXO"}}
    ],
    "riscos_identificados": ["..."],
    "recomendacoes": ["..."]
}}"""
        }]
    )

    texto = resposta.content[0].text.strip()
    if texto.startswith("```"):
        texto = texto.split("\n", 1)[1].rsplit("```", 1)[0]

    try:
        return json.loads(texto)
    except json.JSONDecodeError:
        return {"analise_texto": resposta.content[0].text}


# =====================================================
# AGENTE 4: Gerador de Conteudo
# Marketing juridico e comunicacao
# =====================================================

def agente_conteudo(tema: str, formato: str = "artigo") -> str:
    """
    Gera conteudo de marketing juridico.
    Formatos: artigo, post_linkedin, faq, newsletter, video_script
    """
    instrucoes_formato = {
        "artigo": "Artigo de blog com 800-1200 palavras. Tom profissional mas acessivel.",
        "post_linkedin": "Post para LinkedIn com 150-300 palavras. Engajador e informativo.",
        "faq": "5-8 perguntas frequentes com respostas claras e objetivas.",
        "newsletter": "Newsletter mensal do escritorio. Breve, com destaques e dicas.",
        "video_script": "Roteiro para video de 2-3 minutos. Linguagem simples e direta.",
    }

    instrucao = instrucoes_formato.get(formato, instrucoes_formato["artigo"])

    resposta = client.messages.create(
        model=MODEL,
        max_tokens=4096,
        system=(
            "Voce e o redator de conteudo do escritorio Paulo Nascimento - "
            "Advocacia Integrada. Crie conteudo juridico educativo que "
            "posicione o escritorio como autoridade. Respeite o Codigo de "
            "Etica da OAB (vedacao a captacao de clientela). Tom: "
            "profissional, acessivel, educativo."
        ),
        messages=[{
            "role": "user",
            "content": f"""Crie conteudo sobre o tema abaixo:

TEMA: {tema}
FORMATO: {formato}
INSTRUCOES: {instrucao}

Areas de atuacao do escritorio para contextualizar:
- Trabalhista, Civel, Condominial, Imobiliario, Familia

Inclua call-to-action sutil e profissional ao final."""
        }]
    )
    return resposta.content[0].text


# =====================================================
# EXEMPLO COM AGENT SDK (quando instalado)
# =====================================================

EXEMPLO_AGENT_SDK = """
# Exemplo real com Claude Code SDK (requer instalacao):
# pip install claude-code-sdk

import asyncio
from claude_code_sdk import query, ClaudeCodeOptions

async def pesquisa_juridica_autonoma():
    '''Agente autonomo que pesquisa na web e gera relatorio'''

    resultado = await query(
        prompt=(
            "Pesquise jurisprudencia recente do STJ sobre "
            "responsabilidade solidaria em dividas condominiais. "
            "Analise as decisoes de 2024-2025 e produza um relatorio "
            "com as principais teses e tendencias."
        ),
        options=ClaudeCodeOptions(
            system_prompt=(
                "Voce e um pesquisador juridico do escritorio "
                "Paulo Nascimento - Advocacia Integrada. "
                "Use ferramentas de busca web para encontrar "
                "jurisprudencia atualizada."
            ),
            allowed_tools=["WebSearch", "Read"],
            max_turns=10,
        )
    )

    # Processar resultado
    for mensagem in resultado:
        if hasattr(mensagem, 'content'):
            for bloco in mensagem.content:
                if hasattr(bloco, 'text'):
                    print(bloco.text)

# asyncio.run(pesquisa_juridica_autonoma())
"""


# === EXEMPLOS DE USO ===
if __name__ == "__main__":
    print("=" * 60)
    print("AGENTE PESQUISADOR JURIDICO")
    print("=" * 60)

    resultado = agente_pesquisador(
        tema="responsabilidade do adquirente por divida condominial anterior",
        tribunal="STJ"
    )
    print(resultado[:1000])

    print(f"\n{'=' * 60}")
    print("AGENTE COORDENADOR - PRIORIZACAO")
    print("=" * 60)

    coordenador = AgenteCoordenador()
    casos = [
        {"id": 1, "descricao": "Execucao condominial - 12 meses atraso", "valor": 18000, "prazo": "15/04/2026"},
        {"id": 2, "descricao": "Reclamatoria trabalhista - prescricao em 30 dias", "valor": 45000, "prazo": "02/05/2026"},
        {"id": 3, "descricao": "Divorcio consensual - sem urgencia", "valor": 5000, "prazo": None},
        {"id": 4, "descricao": "Despejo por falta de pagamento - liminar", "valor": 36000, "prazo": "10/04/2026"},
    ]

    priorizados = coordenador.priorizar(casos)
    print(json.dumps(priorizados, ensure_ascii=False, indent=2))

    print(f"\n{'=' * 60}")
    print("AGENTE DE CONTEUDO - POST LINKEDIN")
    print("=" * 60)

    post = agente_conteudo(
        tema="Direitos do condomino inadimplente: o que a lei garante?",
        formato="post_linkedin"
    )
    print(post)

    print(f"\n{'=' * 60}")
    print("NOTA: Agent SDK")
    print("=" * 60)
    print(EXEMPLO_AGENT_SDK)
