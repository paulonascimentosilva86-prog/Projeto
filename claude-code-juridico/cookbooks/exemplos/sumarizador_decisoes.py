"""
Sumarizador de Decisoes Judiciais
Baseado em: anthropics/claude-cookbooks/capabilities/summarization

Resume decisoes judiciais em linguagem acessivel para clientes
e em formato tecnico para advogados.
"""

import anthropic


client = anthropic.Anthropic()
MODEL = "claude-sonnet-4-20250514"


def resumir_para_cliente(texto_decisao: str) -> str:
    """
    Resume decisao judicial em linguagem acessivel para o cliente.
    Foco: clareza, proximos passos e prazos.
    """
    resposta = client.messages.create(
        model=MODEL,
        max_tokens=2048,
        system=(
            "Voce e um comunicador do escritorio Paulo Nascimento. "
            "Traduza decisoes judiciais para linguagem simples e clara. "
            "O cliente nao tem formacao juridica. Evite jargoes. "
            "Sempre informe: resultado, impacto pratico e proximos passos."
        ),
        messages=[{
            "role": "user",
            "content": f"""Resuma esta decisao para enviar ao cliente:

{texto_decisao}

Formato:
1. **O que aconteceu**: resultado da decisao em 1-2 frases simples
2. **O que isso significa para voce**: impacto pratico
3. **Proximos passos**: o que precisa ser feito
4. **Prazos importantes**: datas a observar
5. **Nossa recomendacao**: orientacao do escritorio

Use linguagem simples e direta. Maximo 300 palavras."""
        }]
    )
    return resposta.content[0].text


def resumir_para_advogado(texto_decisao: str) -> str:
    """
    Resume decisao em formato tecnico para o advogado.
    Foco: fundamentacao, teses aceitas/rejeitadas, precedentes.
    """
    resposta = client.messages.create(
        model=MODEL,
        max_tokens=2048,
        system=(
            "Voce e um analista juridico. Resuma decisoes de forma tecnica "
            "e objetiva para advogados. Foco em teses e precedentes."
        ),
        messages=[{
            "role": "user",
            "content": f"""Analise tecnicamente esta decisao:

{texto_decisao}

Formato:
1. **Dispositivo**: resultado objetivo
2. **Fundamentos adotados**: teses acolhidas com artigos citados
3. **Teses rejeitadas**: argumentos nao aceitos
4. **Precedentes citados**: jurisprudencia mencionada
5. **Impacto processual**: reflexos no andamento
6. **Recurso cabivel**: tipo, prazo e chances
7. **Observacoes estrategicas**: pontos de atencao"""
        }]
    )
    return resposta.content[0].text


def resumir_lote_movimentacoes(movimentacoes: list[str]) -> str:
    """
    Resume multiplas movimentacoes processuais em relatorio unico.
    Ideal para acompanhamento periodico do cliente.
    """
    movs_texto = "\n---\n".join(
        f"Movimentacao {i+1}:\n{mov}" for i, mov in enumerate(movimentacoes)
    )

    resposta = client.messages.create(
        model=MODEL,
        max_tokens=2048,
        system=(
            "Voce e o assistente de acompanhamento processual do escritorio "
            "Paulo Nascimento. Resuma movimentacoes de forma clara e objetiva."
        ),
        messages=[{
            "role": "user",
            "content": f"""Resuma estas movimentacoes processuais em um relatorio unico:

{movs_texto}

Formato do relatorio:
- **Status geral**: situacao atual do processo (1 frase)
- **Movimentacoes relevantes**: lista das movimentacoes importantes
- **Proxima etapa esperada**: o que deve acontecer em seguida
- **Acao necessaria**: se o escritorio precisa fazer algo
- **Previsao**: estimativa de tempo para proxima etapa"""
        }]
    )
    return resposta.content[0].text


def extrair_dados_estruturados(texto_decisao: str) -> str:
    """
    Extrai dados estruturados de uma decisao para alimentar o sistema.
    """
    resposta = client.messages.create(
        model=MODEL,
        max_tokens=1024,
        messages=[{
            "role": "user",
            "content": f"""Extraia dados estruturados desta decisao em JSON:

{texto_decisao}

JSON esperado:
{{
    "tipo_decisao": "sentenca|acordao|despacho|decisao_interlocutoria",
    "resultado": "procedente|improcedente|parcialmente_procedente|extinto",
    "juiz_relator": "nome",
    "data_decisao": "DD/MM/AAAA",
    "valor_condenacao": 0.00,
    "honorarios_sucumbencia": "percentual ou valor",
    "custas": "vencido|rateadas|gratuidade",
    "recurso_cabivel": "tipo do recurso",
    "prazo_recurso": "X dias uteis",
    "temas_principais": ["tema1", "tema2"],
    "artigos_citados": ["Art. X, Lei Y"],
    "jurisprudencia_citada": ["tribunal - numero"]
}}"""
        }]
    )
    return resposta.content[0].text


# === EXEMPLO DE USO ===
if __name__ == "__main__":
    # Decisao de exemplo (simulada)
    decisao_exemplo = """
    SENTENCA

    Processo n. 1234567-89.2024.8.26.0100
    Classe: Execucao de Titulo Extrajudicial
    Exequente: Condominio Edificio Solar das Palmeiras
    Executado: Joao da Silva

    Vistos.

    Trata-se de execucao de titulo extrajudicial ajuizada pelo Condominio
    exequente em face do executado, cobrando cotas condominiais vencidas
    no periodo de janeiro a outubro de 2024, no valor atualizado de
    R$ 15.847,32.

    O executado foi citado e nao apresentou embargos no prazo legal,
    tampouco efetuou o pagamento do debito.

    Diante da ausencia de oposicao do executado, e estando o titulo
    executivo extrajudicial revestido de certeza, liquidez e exigibilidade,
    nos termos do art. 784, X, do CPC, DEFIRO a penhora online via SISBAJUD
    ate o valor de R$ 15.847,32, acrescido de custas e honorarios.

    Fixo honorarios advocaticios em 10% sobre o valor da execucao,
    nos termos do art. 827 do CPC.

    Intime-se. Cumpra-se.

    Sao Paulo, 15 de marco de 2026.
    Dr. Carlos Eduardo Mendes
    Juiz de Direito
    """

    print("=" * 60)
    print("RESUMO PARA O CLIENTE")
    print("=" * 60)
    print(resumir_para_cliente(decisao_exemplo))

    print(f"\n{'=' * 60}")
    print("RESUMO TECNICO PARA O ADVOGADO")
    print("=" * 60)
    print(resumir_para_advogado(decisao_exemplo))

    print(f"\n{'=' * 60}")
    print("DADOS ESTRUTURADOS")
    print("=" * 60)
    print(extrair_dados_estruturados(decisao_exemplo))
