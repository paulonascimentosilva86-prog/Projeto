"""
RAG Juridico - Recuperacao de Conhecimento para Advocacia
Baseado em: anthropics/claude-cookbooks/capabilities/retrieval_augmented_generation

Este exemplo demonstra como implementar RAG para pesquisa juridica
usando Claude + banco vetorial para o escritorio Paulo Nascimento.
"""

import anthropic
import json
from typing import Optional


# --- Configuracao ---
client = anthropic.Anthropic()
MODEL = "claude-sonnet-4-20250514"


# --- Base de Conhecimento Simulada ---
# Em producao, substitua por Pinecone, ChromaDB, pgvector, etc.

BASE_JURISPRUDENCIA = [
    {
        "id": "stj-resp-1874735",
        "tribunal": "STJ",
        "numero": "REsp 1.874.735/SP",
        "data": "15/03/2024",
        "tema": "execucao condominial",
        "ementa": "RECURSO ESPECIAL. CONDOMINIO. EXECUCAO DE COTAS CONDOMINIAIS. "
                  "OBRIGACAO PROPTER REM. RESPONSABILIDADE DO ATUAL PROPRIETARIO. "
                  "A obrigacao de pagar cotas condominiais e propter rem, vinculada "
                  "ao imovel, independentemente de quem figurou no contrato.",
        "decisao": "provido",
    },
    {
        "id": "tjsp-ac-2156789",
        "tribunal": "TJSP",
        "numero": "AC 2156789-45.2023.8.26.0100",
        "data": "20/06/2024",
        "tema": "multa condominial assembleia",
        "ementa": "APELACAO. CONDOMINIO. MULTA POR CONDUTA ANTISSOCIAL. ART. 1.337 CC. "
                  "NECESSIDADE DE QUORUM QUALIFICADO DE 3/4 DOS CONDOMINOS. "
                  "Multa aplicada em assembleia sem quorum qualificado e nula.",
        "decisao": "parcialmente provido",
    },
    {
        "id": "tst-rr-1023456",
        "tribunal": "TST",
        "numero": "RR 1023456-78.2023.5.02.0001",
        "data": "10/02/2024",
        "tema": "vinculo empregaticio condominio",
        "ementa": "RECURSO DE REVISTA. CONDOMINIO EDILICIO. PORTEIRO. VINCULO "
                  "EMPREGATICIO. TERCEIRIZACAO LICITA. Reconhecida a licitude da "
                  "terceirizacao de servicos de portaria em condominio residencial.",
        "decisao": "provido",
    },
]

BASE_LEGISLACAO = [
    {
        "id": "cc-art-1336",
        "diploma": "Codigo Civil (Lei 10.406/2002)",
        "artigo": "Art. 1.336",
        "texto": "Sao deveres do condomino: I - contribuir para as despesas do "
                 "condominio na proporcao das suas fracoes ideais, salvo disposicao "
                 "em contrario na convencao; II - nao realizar obras que comprometam "
                 "a seguranca da edificacao; III - nao alterar a forma e a cor da "
                 "fachada, das partes e esquadrias externas; IV - dar as suas partes "
                 "a mesma destinacao que tem a edificacao.",
    },
    {
        "id": "cc-art-1337",
        "diploma": "Codigo Civil (Lei 10.406/2002)",
        "artigo": "Art. 1.337",
        "texto": "O condomino, ou possuidor, que nao cumpre reiteradamente com os "
                 "seus deveres perante o condominio podera, por deliberacao de tres "
                 "quartos dos condominos restantes, ser constrangido a pagar multa "
                 "correspondente ate ao quintuplo do valor atribuido a contribuicao "
                 "para as despesas condominiais.",
    },
    {
        "id": "cpc-art-784",
        "diploma": "Codigo de Processo Civil (Lei 13.105/2015)",
        "artigo": "Art. 784, X",
        "texto": "Sao titulos executivos extrajudiciais: X - o credito referente "
                 "as contribuicoes ordinarias ou extraordinarias de condominio "
                 "edilicio, previstas na respectiva convencao ou aprovadas em "
                 "assembleia geral, desde que documentalmente comprovadas.",
    },
]


def buscar_jurisprudencia(tema: str, tribunal: Optional[str] = None) -> list[dict]:
    """
    Busca jurisprudencia na base de conhecimento.
    Em producao: use embeddings + banco vetorial para busca semantica.
    """
    resultados = []
    for juri in BASE_JURISPRUDENCIA:
        if tema.lower() in juri["tema"].lower() or tema.lower() in juri["ementa"].lower():
            if tribunal is None or juri["tribunal"] == tribunal:
                resultados.append(juri)
    return resultados


def buscar_legislacao(tema: str) -> list[dict]:
    """
    Busca legislacao relevante na base.
    Em producao: indexe toda a legislacao brasileira com embeddings.
    """
    resultados = []
    for lei in BASE_LEGISLACAO:
        if tema.lower() in lei["texto"].lower() or tema.lower() in lei["artigo"].lower():
            resultados.append(lei)
    return resultados


def formatar_contexto(jurisprudencia: list[dict], legislacao: list[dict]) -> str:
    """Formata o contexto recuperado para incluir no prompt"""
    partes = []

    if jurisprudencia:
        partes.append("=== JURISPRUDENCIA RELEVANTE ===")
        for j in jurisprudencia:
            partes.append(
                f"\n{j['tribunal']} - {j['numero']} ({j['data']})\n"
                f"Ementa: {j['ementa']}\n"
                f"Decisao: {j['decisao']}"
            )

    if legislacao:
        partes.append("\n=== LEGISLACAO APLICAVEL ===")
        for l in legislacao:
            partes.append(
                f"\n{l['diploma']} - {l['artigo']}\n"
                f"{l['texto']}"
            )

    return "\n".join(partes)


def consulta_rag(pergunta: str, area: str = "condominial") -> str:
    """
    Pipeline RAG completo:
    1. Busca contexto relevante
    2. Envia ao Claude com o contexto
    3. Retorna resposta fundamentada
    """
    # Etapa 1: Recuperacao
    jurisprudencia = buscar_jurisprudencia(area)
    legislacao = buscar_legislacao("condomin")
    contexto = formatar_contexto(jurisprudencia, legislacao)

    # Etapa 2: Geracao com contexto
    resposta = client.messages.create(
        model=MODEL,
        max_tokens=4096,
        system=(
            "Voce e um advogado especialista do escritorio Paulo Nascimento - "
            "Advocacia Integrada. Use APENAS as fontes fornecidas no contexto "
            "para fundamentar sua resposta. Cite artigos, jurisprudencia e "
            "diplomas legais de forma precisa. Se o contexto nao contiver "
            "informacao suficiente, indique isso claramente."
        ),
        messages=[{
            "role": "user",
            "content": f"""Contexto recuperado da base de conhecimento:

{contexto}

---

Pergunta do advogado: {pergunta}

Responda com fundamentacao juridica completa, citando as fontes acima.""",
        }],
    )

    return resposta.content[0].text


# --- Exemplo de Uso ---
if __name__ == "__main__":
    pergunta = (
        "Um condomino esta inadimplente ha 8 meses. Qual o procedimento "
        "correto para cobranca judicial? Quais os fundamentos legais?"
    )

    print("=" * 60)
    print("CONSULTA RAG - DIREITO CONDOMINIAL")
    print("=" * 60)
    print(f"\nPergunta: {pergunta}\n")
    print("-" * 60)

    resposta = consulta_rag(pergunta)
    print(resposta)
