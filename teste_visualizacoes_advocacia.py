"""
Teste Prático — Skills de Visualização de Dados para Advocacia
Paulo Nascimento - Advocacia Integrada

Gera 6 gráficos reais usando dados simulados para demonstrar
as skills de visualização adaptadas à prática jurídica.

Requisitos: pip install matplotlib seaborn numpy pandas
"""

import matplotlib
matplotlib.use('Agg')  # Backend não-interativo para salvar arquivos

import matplotlib.pyplot as plt
import matplotlib.ticker as mticker
import seaborn as sns
import numpy as np
import os
from datetime import datetime, timedelta

# Configuração global
sns.set_theme(style="whitegrid", font_scale=1.1)
AZUL_MARINHO = "#1B2A4A"
AZUL_CLARO = "#6B8EC4"
VERMELHO = "#C0392B"
VERDE = "#27AE60"
DOURADO = "#C4A35A"
CINZA = "#BDC3C7"
CINZA_ESCURO = "#7F8C8D"

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "graficos_teste")
os.makedirs(OUTPUT_DIR, exist_ok=True)


def formato_reais(valor, _pos=None):
    """Formata valores em Reais brasileiro."""
    return f"R$ {valor:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")


def teste_skill_1_evolucao_debito_condominial():
    """
    SKILL 1: Gráfico de Linha — Evolução do Débito Condominial
    Mostra a escalada da dívida ao longo de 12 meses.
    """
    meses = [f"{m:02d}/2025" for m in range(1, 13)]
    cota_mensal = 850.00

    principal = []
    com_encargos = []
    com_honorarios = []

    for i in range(1, 13):
        # Principal acumulado
        p = cota_mensal * i
        principal.append(p)

        # Com encargos: multa 2% + juros 1% a.m. + correção INPC (~0.4% a.m.)
        encargo_acum = 0
        for j in range(i):
            meses_atraso = i - j
            valor_cota = cota_mensal
            multa = valor_cota * 0.02
            juros = valor_cota * 0.01 * meses_atraso
            correcao = valor_cota * 0.004 * meses_atraso
            encargo_acum += valor_cota + multa + juros + correcao
        com_encargos.append(encargo_acum)

        # Com honorários 30%
        com_honorarios.append(encargo_acum * 1.30)

    fig, ax = plt.subplots(figsize=(12, 6))
    ax.plot(meses, principal, color=AZUL_MARINHO, linewidth=2.5, marker='o',
            markersize=5, label="Principal Acumulado")
    ax.plot(meses, com_encargos, color=VERMELHO, linewidth=2.5, marker='s',
            markersize=5, label="Com Encargos Legais (multa + juros + INPC)")
    ax.plot(meses, com_honorarios, color=DOURADO, linewidth=2.5, marker='^',
            markersize=5, label="Total com Honorários (30%)")

    # Anotação no ponto final
    ax.annotate(formato_reais(com_honorarios[-1]),
                xy=(11, com_honorarios[-1]),
                xytext=(9, com_honorarios[-1] + 1500),
                fontsize=11, fontweight='bold', color=DOURADO,
                arrowprops=dict(arrowstyle='->', color=DOURADO))

    ax.set_title("Evolução do Débito Condominial — Condomínio Residencial Exemplo",
                 fontsize=14, fontweight='bold', color=AZUL_MARINHO, pad=15)
    ax.set_xlabel("Mês de Referência", fontsize=11)
    ax.set_ylabel("Valor (R$)", fontsize=11)
    ax.yaxis.set_major_formatter(mticker.FuncFormatter(formato_reais))
    ax.legend(loc='upper left', frameon=True, framealpha=0.9)
    plt.xticks(rotation=45, ha='right')
    plt.tight_layout()

    caminho = os.path.join(OUTPUT_DIR, "skill1_debito_condominial.png")
    fig.savefig(caminho, dpi=150, bbox_inches='tight')
    plt.close(fig)
    print(f"  [OK] Skill 1 — Evolução do Débito Condominial -> {caminho}")
    return True


def teste_skill_2_real_vs_orcado_condominio():
    """
    SKILL 2: Gráfico de Barras — Despesas Reais vs Orçadas do Condomínio
    """
    categorias = ["Pessoal", "Manutenção", "Água/Esgoto", "Energia",
                  "Elevadores", "Seguro", "Fundo Reserva", "Outros"]
    orcado = [96000, 24000, 18000, 12000, 15000, 8000, 12000, 6000]
    realizado = [102000, 31000, 19500, 11000, 22000, 8000, 12000, 9500]

    x = np.arange(len(categorias))
    largura = 0.35

    fig, ax = plt.subplots(figsize=(12, 6))
    barras_real = ax.bar(x - largura / 2, realizado, largura, label="Realizado",
                         color=AZUL_MARINHO, edgecolor='white')
    barras_orc = ax.bar(x + largura / 2, orcado, largura, label="Orçado",
                        color=AZUL_CLARO, edgecolor='white')

    # Destacar variações > 15%
    for i, (r, o) in enumerate(zip(realizado, orcado)):
        variacao = ((r - o) / o) * 100
        if abs(variacao) > 15:
            ax.annotate(f"+{variacao:.0f}%", xy=(x[i] - largura / 2, r),
                        xytext=(0, 8), textcoords='offset points',
                        fontsize=10, fontweight='bold', color=VERMELHO,
                        ha='center')

    ax.set_title("Prestação de Contas 2025 — Realizado vs Orçamento",
                 fontsize=14, fontweight='bold', color=AZUL_MARINHO, pad=15)
    ax.set_subtitle_text = ""
    ax.set_xlabel("Categoria de Despesa", fontsize=11)
    ax.set_ylabel("Valor (R$)", fontsize=11)
    ax.set_xticks(x)
    ax.set_xticklabels(categorias, rotation=30, ha='right')
    ax.yaxis.set_major_formatter(mticker.FuncFormatter(formato_reais))
    ax.legend(frameon=True, framealpha=0.9)

    # Linha do total orçado
    total_orc = sum(orcado)
    ax.axhline(y=total_orc / len(categorias), color=CINZA_ESCURO,
               linestyle='--', linewidth=1, alpha=0.5)

    plt.tight_layout()
    caminho = os.path.join(OUTPUT_DIR, "skill2_real_vs_orcado.png")
    fig.savefig(caminho, dpi=150, bbox_inches='tight')
    plt.close(fig)
    print(f"  [OK] Skill 2 — Real vs Orçado Condomínio -> {caminho}")
    return True


def teste_skill_3_cascata_trabalhista():
    """
    SKILL 3: Gráfico de Cascata — Composição do Crédito Trabalhista
    """
    categorias = [
        "Salário Base\n(12 meses)",
        "Horas Extras\n+ Reflexos",
        "Insalubridade",
        "Verbas\nRescisórias",
        "FGTS\n+ Multa 40%",
        "Dano Moral",
        "Multas\n(467/477 CLT)",
        "TOTAL DO\nCRÉDITO"
    ]
    valores = [36000, 18500, 7200, 12800, 9600, 15000, 4800, 0]
    total = sum(valores[:-1])
    valores[-1] = total

    fig, ax = plt.subplots(figsize=(14, 7))

    # Cascata
    acumulado = 0
    cores = []
    bottoms = []
    for i, v in enumerate(valores):
        if i == len(valores) - 1:  # Total
            cores.append(AZUL_MARINHO)
            bottoms.append(0)
        else:
            cores.append(VERDE)
            bottoms.append(acumulado)
            acumulado += v

    barras = ax.bar(categorias, valores, bottom=bottoms, color=cores,
                    edgecolor='white', linewidth=1.5, width=0.6)

    # Rótulos de valor
    for i, (barra, v, b) in enumerate(zip(barras, valores, bottoms)):
        ax.text(barra.get_x() + barra.get_width() / 2, b + v + total * 0.01,
                formato_reais(v), ha='center', va='bottom',
                fontsize=9, fontweight='bold',
                color=AZUL_MARINHO if i == len(valores) - 1 else VERDE)

    # Linhas conectoras
    for i in range(len(valores) - 2):
        y = bottoms[i] + valores[i]
        ax.plot([i + 0.3, i + 0.7], [y, y], color=CINZA_ESCURO,
                linewidth=0.8, linestyle='--')

    ax.set_title("Composição do Crédito Trabalhista — Reclamação Nº 0001234-56.2025.5.01.0001",
                 fontsize=13, fontweight='bold', color=AZUL_MARINHO, pad=15)
    ax.set_ylabel("Valor (R$)", fontsize=11)
    ax.yaxis.set_major_formatter(mticker.FuncFormatter(formato_reais))
    ax.set_xlim(-0.5, len(categorias) - 0.5)

    plt.tight_layout()
    caminho = os.path.join(OUTPUT_DIR, "skill3_cascata_trabalhista.png")
    fig.savefig(caminho, dpi=150, bbox_inches='tight')
    plt.close(fig)
    print(f"  [OK] Skill 3 — Cascata Trabalhista -> {caminho}")
    return True


def teste_skill_5_distribuicao_despesas():
    """
    SKILL 5: Gráfico de Rosca — Distribuição de Despesas Condominiais
    """
    categorias = ["Pessoal\n(porteiros, zelador)", "Manutenção\ne reparos",
                  "Água/Esgoto", "Energia", "Elevadores",
                  "Seguro predial", "Fundo de\nreserva", "Outros"]
    valores = [102000, 31000, 19500, 11000, 22000, 8000, 12000, 9500]
    total = sum(valores)
    percentuais = [v / total * 100 for v in valores]

    # Ordenar da maior para a menor
    dados = sorted(zip(valores, categorias, percentuais), reverse=True)
    valores_ord = [d[0] for d in dados]
    cats_ord = [d[1] for d in dados]
    pct_ord = [d[2] for d in dados]

    cores = [AZUL_MARINHO, "#2C3E6B", "#3D528C", AZUL_CLARO,
             "#8EAAD4", CINZA_ESCURO, CINZA, "#D5D8DC"]

    fig, ax = plt.subplots(figsize=(10, 8))
    wedges, texts, autotexts = ax.pie(
        valores_ord, labels=cats_ord, autopct=lambda p: f"{p:.1f}%",
        colors=cores, startangle=90, pctdistance=0.8,
        wedgeprops=dict(width=0.4, edgecolor='white', linewidth=2))

    for t in autotexts:
        t.set_fontsize(9)
        t.set_fontweight('bold')
    for t in texts:
        t.set_fontsize(9)

    # Texto central
    ax.text(0, 0, f"Total Anual\n{formato_reais(total)}",
            ha='center', va='center', fontsize=13, fontweight='bold',
            color=AZUL_MARINHO)

    ax.set_title("Composição das Despesas — Condomínio Residencial Exemplo — 2025",
                 fontsize=13, fontweight='bold', color=AZUL_MARINHO, pad=20)

    plt.tight_layout()
    caminho = os.path.join(OUTPUT_DIR, "skill5_distribuicao_despesas.png")
    fig.savefig(caminho, dpi=150, bbox_inches='tight')
    plt.close(fig)
    print(f"  [OK] Skill 5 — Distribuição de Despesas Condominiais -> {caminho}")
    return True


def teste_skill_6_jurimetria_dano_moral():
    """
    SKILL 6: Histograma — Distribuição de Valores de Dano Moral (Jurimetria)
    """
    np.random.seed(42)
    # Simular 200 decisões de dano moral por negativação indevida
    valores = np.random.lognormal(mean=8.8, sigma=0.6, size=200)
    valores = np.clip(valores, 2000, 50000)

    fig, ax = plt.subplots(figsize=(12, 6))

    n, bins, patches = ax.hist(valores, bins=20, color=AZUL_MARINHO,
                                edgecolor='white', linewidth=1, alpha=0.85,
                                density=False, label="Decisões")

    # Curva de distribuição
    from scipy import stats
    kde_x = np.linspace(valores.min(), valores.max(), 200)
    kde = stats.gaussian_kde(valores)
    ax2 = ax.twinx()
    ax2.plot(kde_x, kde(kde_x), color=VERMELHO, linewidth=2.5, label="Distribuição")
    ax2.set_ylabel("")
    ax2.set_yticks([])

    # Percentis
    p25 = np.percentile(valores, 25)
    mediana = np.median(valores)
    p75 = np.percentile(valores, 75)

    for val, nome, cor in [(p25, "P25", CINZA_ESCURO),
                           (mediana, "Mediana", DOURADO),
                           (p75, "P75", CINZA_ESCURO)]:
        ax.axvline(x=val, color=cor, linestyle='--', linewidth=2, alpha=0.8)
        ax.annotate(f"{nome}\n{formato_reais(val)}",
                    xy=(val, ax.get_ylim()[1] * 0.85),
                    fontsize=9, fontweight='bold', color=cor,
                    ha='center', va='top',
                    bbox=dict(boxstyle='round,pad=0.3', facecolor='white',
                              edgecolor=cor, alpha=0.9))

    ax.set_title("Jurimetria — Valores de Dano Moral por Negativação Indevida — TJSP",
                 fontsize=13, fontweight='bold', color=AZUL_MARINHO, pad=15)
    ax.set_xlabel("Valor da Indenização (R$)", fontsize=11)
    ax.set_ylabel("Número de Decisões", fontsize=11)
    ax.xaxis.set_major_formatter(mticker.FuncFormatter(formato_reais))

    ax.text(0.98, 0.95, f"Base: {len(valores)} decisões analisadas",
            transform=ax.transAxes, ha='right', va='top',
            fontsize=10, style='italic', color=CINZA_ESCURO)

    plt.tight_layout()
    caminho = os.path.join(OUTPUT_DIR, "skill6_jurimetria_dano_moral.png")
    fig.savefig(caminho, dpi=150, bbox_inches='tight')
    plt.close(fig)
    print(f"  [OK] Skill 6 — Jurimetria Dano Moral -> {caminho}")
    return True


def teste_skill_8_mapa_risco_carteira():
    """
    SKILL 8: Gráfico de Bolhas — Mapa de Risco da Carteira Processual
    """
    processos = [
        {"num": "0012345", "tipo": "Trabalhista", "prob": 75, "tempo": 18, "valor": 120000},
        {"num": "0023456", "tipo": "Cível", "prob": 40, "tempo": 24, "valor": 85000},
        {"num": "0034567", "tipo": "Condominial", "prob": 90, "tempo": 8, "valor": 45000},
        {"num": "0045678", "tipo": "Trabalhista", "prob": 60, "tempo": 14, "valor": 200000},
        {"num": "0056789", "tipo": "Cível", "prob": 25, "tempo": 30, "valor": 150000},
        {"num": "0067890", "tipo": "Condominial", "prob": 85, "tempo": 6, "valor": 28000},
        {"num": "0078901", "tipo": "Trabalhista", "prob": 50, "tempo": 20, "valor": 95000},
        {"num": "0089012", "tipo": "Cível", "prob": 70, "tempo": 12, "valor": 60000},
    ]

    cores_tipo = {
        "Trabalhista": VERMELHO,
        "Cível": AZUL_MARINHO,
        "Condominial": VERDE,
    }

    fig, ax = plt.subplots(figsize=(12, 8))

    # Quadrantes
    ax.axhline(y=15, color=CINZA, linestyle='-', linewidth=0.8, alpha=0.5)
    ax.axvline(x=50, color=CINZA, linestyle='-', linewidth=0.8, alpha=0.5)

    ax.text(75, 28, "ATENÇÃO\nMÁXIMA", ha='center', va='center',
            fontsize=11, color=VERMELHO, alpha=0.3, fontweight='bold')
    ax.text(25, 28, "MONITORAR", ha='center', va='center',
            fontsize=11, color=AZUL_CLARO, alpha=0.3, fontweight='bold')
    ax.text(75, 4, "PRIORIZAR\nACORDO", ha='center', va='center',
            fontsize=11, color=DOURADO, alpha=0.3, fontweight='bold')
    ax.text(25, 4, "BAIXA\nPRIORIDADE", ha='center', va='center',
            fontsize=11, color=VERDE, alpha=0.3, fontweight='bold')

    exposicao_total = 0
    for p in processos:
        tamanho = p["valor"] / 500
        cor = cores_tipo[p["tipo"]]
        ax.scatter(p["prob"], p["tempo"], s=tamanho, c=cor, alpha=0.6,
                   edgecolors=cor, linewidth=1.5)
        ax.annotate(p["num"], (p["prob"], p["tempo"]),
                    fontsize=7, ha='center', va='center', color='white',
                    fontweight='bold')
        exposicao_total += p["valor"]

    # Legenda manual
    for tipo, cor in cores_tipo.items():
        ax.scatter([], [], c=cor, s=100, label=tipo, edgecolors=cor)
    ax.legend(loc='upper left', frameon=True, framealpha=0.9, title="Tipo de Processo")

    ax.set_title("Mapa de Risco — Carteira Judicial Empresa XYZ Ltda.",
                 fontsize=14, fontweight='bold', color=AZUL_MARINHO, pad=15)
    ax.set_xlabel("Probabilidade de Condenação (%)", fontsize=11)
    ax.set_ylabel("Tempo Estimado até Decisão (meses)", fontsize=11)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 35)

    ax.text(0.98, 0.02,
            f"Exposição total: {formato_reais(exposicao_total)} | {len(processos)} processos ativos",
            transform=ax.transAxes, ha='right', va='bottom',
            fontsize=10, fontweight='bold', color=AZUL_MARINHO,
            bbox=dict(boxstyle='round,pad=0.4', facecolor='white',
                      edgecolor=AZUL_MARINHO, alpha=0.9))

    plt.tight_layout()
    caminho = os.path.join(OUTPUT_DIR, "skill8_mapa_risco.png")
    fig.savefig(caminho, dpi=150, bbox_inches='tight')
    plt.close(fig)
    print(f"  [OK] Skill 8 — Mapa de Risco da Carteira -> {caminho}")
    return True


def main():
    """Executa todos os testes de visualização."""
    print("=" * 70)
    print("  TESTE — Skills de Visualização para Advocacia")
    print("  Paulo Nascimento - Advocacia Integrada")
    print("=" * 70)
    print()

    testes = [
        ("Skill 1: Evolução Débito Condominial (Linha)", teste_skill_1_evolucao_debito_condominial),
        ("Skill 2: Real vs Orçado Condomínio (Barras)", teste_skill_2_real_vs_orcado_condominio),
        ("Skill 3: Cascata Trabalhista (Cascata)", teste_skill_3_cascata_trabalhista),
        ("Skill 5: Despesas Condominiais (Rosca)", teste_skill_5_distribuicao_despesas),
        ("Skill 6: Jurimetria Dano Moral (Histograma)", teste_skill_6_jurimetria_dano_moral),
        ("Skill 8: Mapa de Risco Carteira (Bolhas)", teste_skill_8_mapa_risco_carteira),
    ]

    resultados = []
    for nome, func in testes:
        print(f"Gerando: {nome}...")
        try:
            resultado = func()
            resultados.append((nome, resultado))
        except Exception as e:
            print(f"  [ERRO] {nome}: {e}")
            resultados.append((nome, False))
        print()

    # Resumo
    print("=" * 70)
    print("  RESUMO DOS TESTES")
    print("=" * 70)
    aprovados = sum(1 for _, r in resultados if r)
    total = len(resultados)
    for nome, resultado in resultados:
        status = "APROVADO" if resultado else "FALHOU"
        print(f"  [{status}] {nome}")
    print()
    print(f"  Resultado: {aprovados}/{total} testes aprovados")
    print(f"  Gráficos salvos em: {OUTPUT_DIR}/")
    print("=" * 70)

    return aprovados == total


if __name__ == "__main__":
    sucesso = main()
    exit(0 if sucesso else 1)
