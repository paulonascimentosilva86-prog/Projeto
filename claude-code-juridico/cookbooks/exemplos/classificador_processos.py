"""
Classificador de Processos - Triagem Automatizada
Baseado em: anthropics/claude-cookbooks/capabilities/classification

Classifica novos casos nas areas do escritorio e recomenda
o agente especializado e os comandos adequados.
"""

import anthropic
import json


client = anthropic.Anthropic()
MODEL = "claude-sonnet-4-20250514"

# Mapeamento dos agentes e comandos por area
AREAS_ESCRITORIO = {
    "TRABALHISTA": {
        "agente": "Agente Trabalhista",
        "comandos": [
            "/peticao-trabalhista", "/defesa-trabalhista", "/acordo-trabalhista",
            "/justa-causa", "/simulador-reclamatoria", "/insalubridade-periculosidade",
            "/compliance-trabalhista",
        ],
        "descricao": "Reclamatorias, defesas, calculos trabalhistas, acordos, justa causa",
    },
    "CIVEL": {
        "agente": "Agente Civel",
        "comandos": [
            "/peticao-civel", "/execucao-cumprimento", "/acao-consumo",
            "/embargos-impugnacao",
        ],
        "descricao": "Peticoes civeis, consumidor, responsabilidade civil, execucoes",
    },
    "CONDOMINIAL": {
        "agente": "Agente Condominial",
        "comandos": [
            "/execucao-condominial", "/calculadora-condominial", "/workflow-cobranca",
            "/defesa-condomino", "/destituicao-sindico", "/convencao-regimento",
            "/atas-assembleia", "/mediacao-condominial", "/notificacao-condominial",
        ],
        "descricao": "Execucao de cotas, assembleias, convencao, destituicao, mediacao",
    },
    "IMOBILIARIO": {
        "agente": "Agente Imobiliario",
        "comandos": [
            "/contrato-locacao", "/acao-despejo", "/acao-renovatoria",
            "/revisional-aluguel", "/compra-venda-imovel", "/due-diligence",
            "/usucapiao", "/adjudicacao", "/distrato-imobiliario",
            "/reintegracao-posse", "/reurb",
        ],
        "descricao": "Locacao, compra/venda, despejo, usucapiao, due diligence, posse",
    },
    "FAMILIA": {
        "agente": "Agente Familia",
        "comandos": [
            "/divorcio", "/alimentos", "/inventario", "/guarda-visitas",
        ],
        "descricao": "Divorcio, alimentos, guarda, inventario, sucessoes",
    },
}


def classificar_caso(descricao: str) -> dict:
    """
    Classifica um caso usando Claude e retorna area, urgencia,
    agente recomendado e comandos sugeridos.
    """
    areas_texto = "\n".join(
        f"- **{nome}**: {info['descricao']}"
        for nome, info in AREAS_ESCRITORIO.items()
    )

    resposta = client.messages.create(
        model=MODEL,
        max_tokens=1024,
        messages=[{
            "role": "user",
            "content": f"""Voce e o sistema de triagem do escritorio Paulo Nascimento - Advocacia Integrada.
Classifique o caso abaixo.

## Areas Disponiveis
{areas_texto}

## Caso para Classificacao
{descricao}

## Responda APENAS em JSON valido (sem markdown):
{{
    "area_principal": "NOME_DA_AREA",
    "area_secundaria": "NOME_DA_AREA ou null",
    "urgencia": "ALTA ou MEDIA ou BAIXA",
    "tipo_demanda": "descricao curta do tipo (ex: execucao, defesa, consultoria)",
    "justificativa": "1-2 frases explicando a classificacao",
    "tem_prazo_correndo": true ou false,
    "prazo_estimado_dias": numero ou null
}}""",
        }],
    )

    texto = resposta.content[0].text.strip()
    # Limpar possivel markdown
    if texto.startswith("```"):
        texto = texto.split("\n", 1)[1].rsplit("```", 1)[0]

    resultado = json.loads(texto)

    # Enriquecer com dados do escritorio
    area = resultado["area_principal"]
    if area in AREAS_ESCRITORIO:
        resultado["agente_recomendado"] = AREAS_ESCRITORIO[area]["agente"]
        resultado["comandos_sugeridos"] = AREAS_ESCRITORIO[area]["comandos"][:3]

    area_sec = resultado.get("area_secundaria")
    if area_sec and area_sec in AREAS_ESCRITORIO:
        resultado["agente_secundario"] = AREAS_ESCRITORIO[area_sec]["agente"]

    return resultado


def triagem_batch(casos: list[str]) -> list[dict]:
    """Classifica multiplos casos de uma vez"""
    return [classificar_caso(caso) for caso in casos]


def imprimir_resultado(resultado: dict):
    """Exibe resultado da classificacao de forma formatada"""
    print(f"  Area Principal: {resultado['area_principal']}")
    if resultado.get("area_secundaria"):
        print(f"  Area Secundaria: {resultado['area_secundaria']}")
    print(f"  Urgencia: {resultado['urgencia']}")
    print(f"  Tipo: {resultado.get('tipo_demanda', 'N/A')}")
    print(f"  Agente: {resultado.get('agente_recomendado', 'N/A')}")
    if resultado.get("comandos_sugeridos"):
        print(f"  Comandos: {', '.join(resultado['comandos_sugeridos'])}")
    if resultado.get("tem_prazo_correndo"):
        prazo = resultado.get("prazo_estimado_dias", "?")
        print(f"  ATENCAO: Prazo correndo! (~{prazo} dias)")
    print(f"  Justificativa: {resultado['justificativa']}")


# --- Exemplo de Uso ---
if __name__ == "__main__":
    casos_exemplo = [
        "Cliente foi demitido sem justa causa apos 5 anos de empresa. "
        "Nao recebeu verbas rescisorias. Quer entrar com reclamatoria.",

        "Condomino deve 12 meses de cota condominial. Sindico quer "
        "entrar com execucao. Ja foi notificado extrajudicialmente.",

        "Casal quer se divorciar consensualmente. Tem 2 filhos menores "
        "e um apartamento financiado. Acordo sobre guarda e alimentos.",

        "Inquilino comercial com contrato de 5 anos quer renovar. "
        "Proprietario recusou. Contrato vence em 45 dias.",

        "Cliente recebeu citacao para execucao condominial. Prazo de "
        "3 dias para pagar. Alega que ja pagou 4 das 6 parcelas cobradas.",
    ]

    print("=" * 60)
    print("TRIAGEM AUTOMATIZADA DE CASOS")
    print("Escritorio Paulo Nascimento - Advocacia Integrada")
    print("=" * 60)

    for i, caso in enumerate(casos_exemplo, 1):
        print(f"\n--- Caso {i} ---")
        print(f"Descricao: {caso[:80]}...")
        try:
            resultado = classificar_caso(caso)
            imprimir_resultado(resultado)
        except Exception as e:
            print(f"  Erro na classificacao: {e}")
