"""
Tools Juridicos - Ferramentas para Claude com Tool Use
Baseado em: anthropics/claude-cookbooks/tool_use/

Implementa ferramentas que o Claude pode chamar durante conversas:
calculadoras, consultas de prazos, gerador de notificacoes.
"""

import anthropic
import json
from datetime import datetime, timedelta


client = anthropic.Anthropic()
MODEL = "claude-sonnet-4-20250514"


# === DEFINICAO DAS FERRAMENTAS ===

FERRAMENTAS = [
    {
        "name": "calcular_debito_condominial",
        "description": (
            "Calcula debito condominial com multa de 2%, juros de 1% ao mes, "
            "correcao monetaria pelo INPC e honorarios advocaticios de 30%. "
            "Retorna planilha discriminada do debito."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "valor_cota": {
                    "type": "number",
                    "description": "Valor mensal da cota condominial em reais",
                },
                "meses_atraso": {
                    "type": "integer",
                    "description": "Quantidade de meses em atraso",
                },
                "taxa_juros": {
                    "type": "number",
                    "description": "Taxa de juros mensal (padrao: 0.01 = 1%)",
                    "default": 0.01,
                },
                "multa": {
                    "type": "number",
                    "description": "Percentual de multa moratoria (padrao: 0.02 = 2%)",
                    "default": 0.02,
                },
                "honorarios": {
                    "type": "number",
                    "description": "Percentual de honorarios (padrao: 0.30 = 30%)",
                    "default": 0.30,
                },
            },
            "required": ["valor_cota", "meses_atraso"],
        },
    },
    {
        "name": "consultar_prazo",
        "description": (
            "Consulta prazos processuais por tipo de acao, fase e ramo da justica. "
            "Retorna prazo em dias, base legal e observacoes."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "tipo_acao": {
                    "type": "string",
                    "enum": ["execucao", "conhecimento", "recurso", "cautelar"],
                    "description": "Tipo da acao",
                },
                "fase": {
                    "type": "string",
                    "description": "Fase processual (citacao, contestacao, embargos, apelacao, etc.)",
                },
                "justica": {
                    "type": "string",
                    "enum": ["estadual", "trabalho", "federal"],
                    "description": "Ramo da justica (padrao: estadual)",
                    "default": "estadual",
                },
            },
            "required": ["tipo_acao", "fase"],
        },
    },
    {
        "name": "calcular_custas",
        "description": (
            "Estima custas processuais com base no valor da causa, "
            "tipo de acao e estado (UF). Valores aproximados."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "valor_causa": {
                    "type": "number",
                    "description": "Valor da causa em reais",
                },
                "tipo_acao": {
                    "type": "string",
                    "description": "Tipo da acao",
                },
                "uf": {
                    "type": "string",
                    "description": "Estado (UF) do foro (padrao: SP)",
                    "default": "SP",
                },
            },
            "required": ["valor_causa", "tipo_acao"],
        },
    },
    {
        "name": "verificar_prescricao",
        "description": (
            "Verifica se o direito de acao esta prescrito com base no tipo de "
            "pretensao e data do fato gerador."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "tipo_pretensao": {
                    "type": "string",
                    "description": "Tipo da pretensao (condominial, trabalhista, civil, locacao, alimentos)",
                },
                "data_fato": {
                    "type": "string",
                    "description": "Data do fato gerador no formato DD/MM/AAAA",
                },
            },
            "required": ["tipo_pretensao", "data_fato"],
        },
    },
]


# === IMPLEMENTACAO DAS FERRAMENTAS ===

def calcular_debito_condominial(valor_cota, meses_atraso, taxa_juros=0.01,
                                 multa=0.02, honorarios=0.30):
    """Calcula debito condominial discriminado"""
    parcelas = []
    total_principal = 0
    total_juros = 0
    total_multa = 0

    hoje = datetime.now()

    for i in range(meses_atraso):
        mes_ref = hoje - timedelta(days=30 * (meses_atraso - i))
        meses_juros = meses_atraso - i
        valor_juros = valor_cota * taxa_juros * meses_juros
        valor_multa = valor_cota * multa

        parcelas.append({
            "referencia": mes_ref.strftime("%m/%Y"),
            "principal": round(valor_cota, 2),
            "multa_2pct": round(valor_multa, 2),
            "juros_1pct_x_meses": round(valor_juros, 2),
            "subtotal_parcela": round(valor_cota + valor_multa + valor_juros, 2),
        })

        total_principal += valor_cota
        total_juros += valor_juros
        total_multa += valor_multa

    subtotal = total_principal + total_multa + total_juros
    valor_honorarios = subtotal * honorarios
    total_geral = subtotal + valor_honorarios

    return {
        "parcelas": parcelas,
        "resumo": {
            "total_principal": round(total_principal, 2),
            "total_multa": round(total_multa, 2),
            "total_juros": round(total_juros, 2),
            "subtotal": round(subtotal, 2),
            "honorarios_advocaticios": round(valor_honorarios, 2),
            "percentual_honorarios": f"{honorarios * 100:.0f}%",
            "total_executado": round(total_geral, 2),
        },
        "parametros": {
            "multa": f"{multa * 100:.0f}%",
            "juros": f"{taxa_juros * 100:.0f}% a.m.",
            "honorarios": f"{honorarios * 100:.0f}%",
            "base_legal": "Art. 1.336, CC/2002 c/c Art. 784, X, CPC/2015",
        },
    }


def consultar_prazo(tipo_acao, fase, justica="estadual"):
    """Consulta prazos processuais"""
    tabela = {
        ("execucao", "pagamento", "estadual"): {
            "prazo": 3, "unidade": "dias uteis",
            "base_legal": "Art. 829, CPC/2015",
            "observacao": "Prazo para pagamento voluntario sob pena de penhora",
        },
        ("execucao", "embargos", "estadual"): {
            "prazo": 15, "unidade": "dias uteis",
            "base_legal": "Art. 915, CPC/2015",
            "observacao": "Contado da juntada do mandado de citacao",
        },
        ("execucao", "impugnacao", "estadual"): {
            "prazo": 15, "unidade": "dias uteis",
            "base_legal": "Art. 525, CPC/2015",
            "observacao": "Cumprimento de sentenca - impugnacao",
        },
        ("conhecimento", "contestacao", "estadual"): {
            "prazo": 15, "unidade": "dias uteis",
            "base_legal": "Art. 335, CPC/2015",
            "observacao": "Contado da audiencia de conciliacao ou citacao",
        },
        ("conhecimento", "contestacao", "trabalho"): {
            "prazo": 0, "unidade": "em audiencia",
            "base_legal": "Art. 847, CLT",
            "observacao": "Defesa apresentada em audiencia (oral ou escrita)",
        },
        ("recurso", "apelacao", "estadual"): {
            "prazo": 15, "unidade": "dias uteis",
            "base_legal": "Art. 1.003, par. 5, CPC/2015",
            "observacao": "Contado da intimacao da sentenca",
        },
        ("recurso", "agravo_instrumento", "estadual"): {
            "prazo": 15, "unidade": "dias uteis",
            "base_legal": "Art. 1.003, par. 5, CPC/2015",
            "observacao": "Contado da intimacao da decisao interlocutoria",
        },
        ("recurso", "recurso_ordinario", "trabalho"): {
            "prazo": 8, "unidade": "dias uteis",
            "base_legal": "Art. 895, CLT",
            "observacao": "Contado da intimacao/publicacao da sentenca",
        },
        ("cautelar", "contestacao", "estadual"): {
            "prazo": 5, "unidade": "dias uteis",
            "base_legal": "Art. 306, CPC/2015",
            "observacao": "Tutela cautelar antecedente",
        },
    }

    chave = (tipo_acao, fase, justica)
    resultado = tabela.get(chave)

    if resultado:
        return resultado
    return {
        "prazo": "nao encontrado",
        "observacao": f"Prazo para {tipo_acao}/{fase}/{justica} nao catalogado. Consultar CPC/CLT.",
    }


def calcular_custas(valor_causa, tipo_acao, uf="SP"):
    """Estima custas processuais (valores aproximados TJSP 2024)"""
    # Tabela simplificada - TJSP
    if uf == "SP":
        if valor_causa <= 0:
            taxa = 0
        elif valor_causa <= 50000:
            taxa = valor_causa * 0.01  # 1%
        elif valor_causa <= 500000:
            taxa = 500 + (valor_causa - 50000) * 0.005  # 0.5% sobre excedente
        else:
            taxa = 2750 + (valor_causa - 500000) * 0.003

        taxa = min(taxa, 97070)  # Teto TJSP
        taxa = max(taxa, 106.30)  # Minimo

    else:
        taxa = valor_causa * 0.01  # Estimativa generica

    return {
        "valor_causa": round(valor_causa, 2),
        "custas_iniciais": round(taxa, 2),
        "uf": uf,
        "tipo_acao": tipo_acao,
        "observacao": "Valores aproximados. Confirme na tabela oficial do tribunal.",
        "fonte": f"Tabela de custas TJ{uf} - valores de referencia",
    }


def verificar_prescricao(tipo_pretensao, data_fato):
    """Verifica prescricao da pretensao"""
    prazos_prescricao = {
        "condominial": {"anos": 5, "base_legal": "Art. 206, par. 5, I, CC/2002"},
        "trabalhista": {"anos": 2, "base_legal": "Art. 7, XXIX, CF/88 (ajuizamento)"},
        "trabalhista_verbas": {"anos": 5, "base_legal": "Art. 7, XXIX, CF/88 (verbas)"},
        "civil": {"anos": 10, "base_legal": "Art. 205, CC/2002 (regra geral)"},
        "civil_reparacao": {"anos": 3, "base_legal": "Art. 206, par. 3, V, CC/2002"},
        "locacao": {"anos": 3, "base_legal": "Art. 206, par. 3, I, CC/2002"},
        "alimentos": {"anos": 2, "base_legal": "Art. 206, par. 2, CC/2002"},
    }

    info = prazos_prescricao.get(tipo_pretensao, {
        "anos": "desconhecido",
        "base_legal": "Tipo nao catalogado",
    })

    try:
        data = datetime.strptime(data_fato, "%d/%m/%Y")
        if isinstance(info["anos"], int):
            data_prescricao = data.replace(year=data.year + info["anos"])
            prescrito = datetime.now() > data_prescricao
            dias_restantes = (data_prescricao - datetime.now()).days if not prescrito else 0
        else:
            prescrito = None
            dias_restantes = None
            data_prescricao = None
    except ValueError:
        return {"erro": "Data invalida. Use formato DD/MM/AAAA."}

    return {
        "tipo_pretensao": tipo_pretensao,
        "data_fato_gerador": data_fato,
        "prazo_prescricional": f"{info['anos']} anos",
        "base_legal": info["base_legal"],
        "data_prescricao": data_prescricao.strftime("%d/%m/%Y") if data_prescricao else "N/A",
        "prescrito": prescrito,
        "dias_restantes": dias_restantes,
        "alerta": "URGENTE: prescricao iminente!" if dias_restantes and dias_restantes < 90 else None,
    }


# === MAPEAMENTO DE FUNCOES ===

FUNCOES = {
    "calcular_debito_condominial": calcular_debito_condominial,
    "consultar_prazo": consultar_prazo,
    "calcular_custas": calcular_custas,
    "verificar_prescricao": verificar_prescricao,
}


def processar_tool_use(resposta):
    """Processa chamadas de ferramenta do Claude e retorna resultados"""
    resultados = []

    for bloco in resposta.content:
        if bloco.type == "tool_use":
            nome = bloco.name
            args = bloco.input

            if nome in FUNCOES:
                resultado = FUNCOES[nome](**args)
            else:
                resultado = {"erro": f"Ferramenta '{nome}' nao encontrada"}

            resultados.append({
                "type": "tool_result",
                "tool_use_id": bloco.id,
                "content": json.dumps(resultado, ensure_ascii=False),
            })

    return resultados


def conversar_com_ferramentas(pergunta: str) -> str:
    """
    Loop completo de conversa com ferramentas.
    Claude decide quais ferramentas usar e sintetiza os resultados.
    """
    mensagens = [{"role": "user", "content": pergunta}]

    while True:
        resposta = client.messages.create(
            model=MODEL,
            max_tokens=4096,
            system=(
                "Voce e um assistente juridico do escritorio Paulo Nascimento - "
                "Advocacia Integrada. Use as ferramentas disponiveis para calculos, "
                "consultas de prazos e verificacoes. Apresente os resultados de "
                "forma clara e profissional. Valores em R$ com 2 casas decimais. "
                "Datas em DD/MM/AAAA."
            ),
            tools=FERRAMENTAS,
            messages=mensagens,
        )

        # Se nao ha tool_use, retorna o texto final
        if resposta.stop_reason == "end_turn":
            for bloco in resposta.content:
                if hasattr(bloco, "text"):
                    return bloco.text
            return ""

        # Processar tool_use
        mensagens.append({"role": "assistant", "content": resposta.content})
        resultados = processar_tool_use(resposta)
        mensagens.append({"role": "user", "content": resultados})


# === EXEMPLO DE USO ===
if __name__ == "__main__":
    perguntas = [
        "Calcule o debito de um condomino que deve 8 meses de cota de R$ 1.200,00. "
        "Depois verifique se a divida mais antiga (de 01/03/2024) esta prescrita.",

        "Qual o prazo para embargar uma execucao condominial na justica estadual? "
        "E quanto custaria uma acao com valor de causa de R$ 25.000,00 em SP?",
    ]

    for i, pergunta in enumerate(perguntas, 1):
        print(f"\n{'=' * 60}")
        print(f"CONSULTA {i}")
        print(f"{'=' * 60}")
        print(f"Pergunta: {pergunta}\n")

        resposta = conversar_com_ferramentas(pergunta)
        print(resposta)
