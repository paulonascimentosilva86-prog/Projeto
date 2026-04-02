"""
Padroes de Agentes - Workflows para Escritorio de Advocacia
Baseado em: anthropics/claude-cookbooks/patterns/agents/

Implementa os 4 padroes principais:
1. Roteamento - Direciona caso para agente correto
2. Encadeamento - Pipeline sequencial de pecas
3. Orquestrador-Trabalhadores - Coordenacao multi-agente
4. Avaliador-Otimizador - Loop de melhoria de pecas
"""

import anthropic
import json


client = anthropic.Anthropic()
MODEL = "claude-sonnet-4-20250514"


# =====================================================
# PADRAO 1: ROTEAMENTO (Routing)
# Direciona o caso para o agente especializado correto
# =====================================================

SYSTEM_PROMPTS_AGENTES = {
    "trabalhista": (
        "Voce e o Agente Trabalhista do escritorio Paulo Nascimento. "
        "Especialista em CLT, reclamatorias, defesas trabalhistas, "
        "calculos de verbas, acordos e compliance trabalhista."
    ),
    "civel": (
        "Voce e o Agente Civel do escritorio Paulo Nascimento. "
        "Especialista em peticoes civeis, acoes de consumidor, "
        "execucoes, cumprimento de sentenca e responsabilidade civil."
    ),
    "condominial": (
        "Voce e o Agente Condominial do escritorio Paulo Nascimento. "
        "Especialista em execucao de cotas condominiais, assembleias, "
        "convencao, destituicao de sindico e mediacao condominial. "
        "Calculos: multa 2% + juros 1% a.m. + INPC + honorarios 30%."
    ),
    "imobiliario": (
        "Voce e o Agente Imobiliario do escritorio Paulo Nascimento. "
        "Especialista em locacao, compra/venda, despejo, usucapiao, "
        "due diligence, distrato e regularizacao fundiaria."
    ),
    "familia": (
        "Voce e o Agente Familia do escritorio Paulo Nascimento. "
        "Especialista em divorcio, alimentos, guarda, visitas, "
        "inventario e sucessoes."
    ),
}


def rotear_caso(descricao_caso: str) -> dict:
    """
    PADRAO ROTEAMENTO: Classifica e encaminha para agente correto.
    """
    # Etapa 1: Classificar
    classificacao = client.messages.create(
        model=MODEL,
        max_tokens=256,
        messages=[{
            "role": "user",
            "content": f"""Classifique este caso em UMA area: trabalhista, civel, condominial, imobiliario, familia.

Caso: {descricao_caso}

Responda APENAS com o nome da area em minusculo, sem pontuacao.""",
        }],
    )

    area = classificacao.content[0].text.strip().lower()
    if area not in SYSTEM_PROMPTS_AGENTES:
        area = "civel"  # fallback

    # Etapa 2: Encaminhar para agente especializado
    resposta = client.messages.create(
        model=MODEL,
        max_tokens=2048,
        system=SYSTEM_PROMPTS_AGENTES[area],
        messages=[{
            "role": "user",
            "content": f"""Analise este caso e faca uma avaliacao inicial:

{descricao_caso}

Inclua:
1. Tipo de acao recomendada
2. Fundamentacao legal principal
3. Chances de exito (alta/media/baixa)
4. Proximos passos recomendados""",
        }],
    )

    return {
        "area_roteada": area,
        "agente": f"Agente {area.capitalize()}",
        "analise": resposta.content[0].text,
    }


# =====================================================
# PADRAO 2: ENCADEAMENTO (Prompt Chaining)
# Pipeline sequencial para gerar peca processual
# =====================================================

def gerar_peca_encadeada(dados_caso: dict) -> dict:
    """
    PADRAO ENCADEAMENTO: Pipeline sequencial para peca processual.
    Etapas: Analise → Fundamentacao → Redacao → Formatacao
    """
    resultados = {}

    # Etapa 1: Analise dos fatos
    analise = client.messages.create(
        model=MODEL,
        max_tokens=1024,
        system="Voce e um analista juridico. Extraia e organize os fatos relevantes.",
        messages=[{
            "role": "user",
            "content": f"""Analise os dados do caso e organize os fatos juridicamente relevantes:

{json.dumps(dados_caso, ensure_ascii=False, indent=2)}

Liste os fatos em ordem cronologica, destacando os juridicamente relevantes.""",
        }],
    )
    resultados["fatos"] = analise.content[0].text

    # Etapa 2: Fundamentacao juridica
    fundamentacao = client.messages.create(
        model=MODEL,
        max_tokens=2048,
        system=(
            "Voce e um jurista especializado. Construa fundamentacao juridica "
            "solida com artigos de lei e jurisprudencia."
        ),
        messages=[{
            "role": "user",
            "content": f"""Com base nos fatos abaixo, construa a fundamentacao juridica:

FATOS:
{resultados['fatos']}

TIPO DE PECA: {dados_caso.get('tipo_peca', 'peticao inicial')}

Inclua: dispositivos legais, doutrina e jurisprudencia pertinentes.""",
        }],
    )
    resultados["fundamentacao"] = fundamentacao.content[0].text

    # Etapa 3: Redacao da peca
    redacao = client.messages.create(
        model=MODEL,
        max_tokens=4096,
        system=(
            "Voce e um advogado redator de pecas processuais. Redija pecas "
            "completas seguindo formatacao ABNT e normas do tribunal."
        ),
        messages=[{
            "role": "user",
            "content": f"""Redija a peca processual completa com base nas informacoes abaixo:

FATOS ANALISADOS:
{resultados['fatos']}

FUNDAMENTACAO JURIDICA:
{resultados['fundamentacao']}

DADOS ADICIONAIS:
- Autor: {dados_caso.get('autor', '[NOME DO AUTOR]')}
- Reu: {dados_caso.get('reu', '[NOME DO REU]')}
- Foro: {dados_caso.get('foro', '[FORO COMPETENTE]')}
- Valor da causa: R$ {dados_caso.get('valor_causa', '[VALOR]')}

Redija a peca completa com: qualificacao, fatos, direito, pedidos e valor da causa.""",
        }],
    )
    resultados["peca_final"] = redacao.content[0].text

    return resultados


# =====================================================
# PADRAO 3: ORQUESTRADOR-TRABALHADORES
# Agente principal coordena sub-agentes
# =====================================================

def orquestrar_caso_complexo(descricao_caso: str) -> dict:
    """
    PADRAO ORQUESTRADOR: Coordena multiplos agentes para caso complexo.
    Util para casos multidisciplinares.
    """
    # Orquestrador planeja a abordagem
    plano = client.messages.create(
        model=MODEL,
        max_tokens=1024,
        system=(
            "Voce e o coordenador do escritorio Paulo Nascimento. "
            "Planeje como dividir o trabalho entre os agentes especializados."
        ),
        messages=[{
            "role": "user",
            "content": f"""Analise este caso complexo e defina quais agentes devem atuar:

{descricao_caso}

Responda em JSON:
{{
    "agentes_necessarios": ["area1", "area2"],
    "tarefas": [
        {{"agente": "area", "tarefa": "descricao da tarefa"}},
    ],
    "ordem_execucao": "paralela ou sequencial",
    "prazo_urgente": true/false
}}""",
        }],
    )

    plano_texto = plano.content[0].text.strip()
    if plano_texto.startswith("```"):
        plano_texto = plano_texto.split("\n", 1)[1].rsplit("```", 1)[0]

    try:
        plano_json = json.loads(plano_texto)
    except json.JSONDecodeError:
        plano_json = {"agentes_necessarios": ["civel"], "tarefas": [{"agente": "civel", "tarefa": descricao_caso}]}

    # Executar tarefas com cada agente
    resultados_agentes = {}
    for tarefa in plano_json.get("tarefas", []):
        agente = tarefa["agente"]
        system_prompt = SYSTEM_PROMPTS_AGENTES.get(agente, SYSTEM_PROMPTS_AGENTES["civel"])

        resultado = client.messages.create(
            model=MODEL,
            max_tokens=2048,
            system=system_prompt,
            messages=[{
                "role": "user",
                "content": f"Execute a seguinte tarefa:\n\n{tarefa['tarefa']}",
            }],
        )
        resultados_agentes[agente] = resultado.content[0].text

    # Orquestrador sintetiza
    sintese = client.messages.create(
        model=MODEL,
        max_tokens=2048,
        system=(
            "Voce e o coordenador do escritorio. Sintetize os resultados "
            "dos agentes em uma orientacao unificada para o advogado responsavel."
        ),
        messages=[{
            "role": "user",
            "content": f"""Sintetize as analises dos agentes em uma orientacao unificada:

CASO: {descricao_caso}

RESULTADOS DOS AGENTES:
{json.dumps(resultados_agentes, ensure_ascii=False, indent=2)}

Produza uma orientacao consolidada com: estrategia geral, acoes por area, prazos e prioridades.""",
        }],
    )

    return {
        "plano": plano_json,
        "resultados_agentes": resultados_agentes,
        "orientacao_final": sintese.content[0].text,
    }


# =====================================================
# PADRAO 4: AVALIADOR-OTIMIZADOR
# Loop de melhoria continua para pecas
# =====================================================

def avaliar_e_otimizar(peca_texto: str, tipo_peca: str, max_iteracoes: int = 2) -> dict:
    """
    PADRAO AVALIADOR-OTIMIZADOR: Melhora iterativamente uma peca processual.
    """
    historico = []
    peca_atual = peca_texto

    for iteracao in range(max_iteracoes):
        # Etapa 1: Avaliar
        avaliacao = client.messages.create(
            model=MODEL,
            max_tokens=1024,
            system=(
                "Voce e um revisor juridico experiente. Avalie pecas processuais "
                "quanto a completude, fundamentacao, formatacao e persuasao."
            ),
            messages=[{
                "role": "user",
                "content": f"""Avalie esta {tipo_peca} e atribua notas de 1-10:

{peca_atual}

Responda em JSON:
{{
    "nota_geral": 8,
    "criterios": {{
        "completude": {{"nota": 8, "comentario": "..."}},
        "fundamentacao": {{"nota": 7, "comentario": "..."}},
        "formatacao": {{"nota": 9, "comentario": "..."}},
        "persuasao": {{"nota": 7, "comentario": "..."}},
        "tecnica_juridica": {{"nota": 8, "comentario": "..."}}
    }},
    "pontos_fortes": ["..."],
    "melhorias_necessarias": ["..."],
    "aprovada": true/false
}}""",
            }],
        )

        avaliacao_texto = avaliacao.content[0].text.strip()
        if avaliacao_texto.startswith("```"):
            avaliacao_texto = avaliacao_texto.split("\n", 1)[1].rsplit("```", 1)[0]

        try:
            avaliacao_json = json.loads(avaliacao_texto)
        except json.JSONDecodeError:
            avaliacao_json = {"nota_geral": 7, "aprovada": False, "melhorias_necessarias": ["revisar formatacao"]}

        historico.append({
            "iteracao": iteracao + 1,
            "avaliacao": avaliacao_json,
        })

        # Se aprovada ou nota alta, para
        if avaliacao_json.get("aprovada", False) or avaliacao_json.get("nota_geral", 0) >= 9:
            break

        # Etapa 2: Otimizar
        melhorias = avaliacao_json.get("melhorias_necessarias", [])
        otimizacao = client.messages.create(
            model=MODEL,
            max_tokens=4096,
            system=(
                "Voce e um advogado redator. Melhore a peca processual "
                "com base no feedback recebido, mantendo a estrutura geral."
            ),
            messages=[{
                "role": "user",
                "content": f"""Melhore esta {tipo_peca} com base no feedback:

PECA ATUAL:
{peca_atual}

MELHORIAS SOLICITADAS:
{json.dumps(melhorias, ensure_ascii=False)}

Reescreva a peca completa incorporando todas as melhorias.""",
            }],
        )

        peca_atual = otimizacao.content[0].text

    return {
        "peca_final": peca_atual,
        "iteracoes": len(historico),
        "historico_avaliacoes": historico,
        "aprovada": historico[-1]["avaliacao"].get("aprovada", False) if historico else False,
    }


# === EXEMPLOS DE USO ===
if __name__ == "__main__":
    print("=" * 60)
    print("PADRAO 1: ROTEAMENTO")
    print("=" * 60)

    caso_teste = (
        "Proprietario de apartamento em condominio residencial esta inadimplente "
        "ha 10 meses. Valor da cota: R$ 900,00. O condominio ja enviou "
        "notificacao extrajudicial sem resposta. Quer executar judicialmente."
    )

    resultado = rotear_caso(caso_teste)
    print(f"Area roteada: {resultado['area_roteada']}")
    print(f"Agente: {resultado['agente']}")
    print(f"Analise:\n{resultado['analise'][:500]}...")

    print(f"\n{'=' * 60}")
    print("PADRAO 2: ENCADEAMENTO")
    print("=" * 60)

    dados_caso = {
        "tipo_peca": "peticao inicial de execucao de titulo extrajudicial",
        "autor": "Condominio Edificio Solar das Palmeiras",
        "reu": "Joao da Silva",
        "foro": "Foro Central - Comarca de Sao Paulo/SP",
        "valor_causa": "15.000,00",
        "fatos": "Inadimplencia de 10 cotas condominiais de R$ 900,00 cada, "
                 "vencidas de jan/2024 a out/2024. Notificacao extrajudicial "
                 "enviada em nov/2024 sem resposta.",
    }

    resultado = gerar_peca_encadeada(dados_caso)
    print(f"Peca gerada com {len(resultado['peca_final'])} caracteres")
    print(f"Preview:\n{resultado['peca_final'][:500]}...")
