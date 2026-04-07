from PIL import Image, ImageDraw, ImageFont
import textwrap

# Dimensions (tall infographic for WhatsApp)
W = 1080
PADDING = 50
SECTION_GAP = 40

# Colors
BG_COLOR = "#FFF8F0"
HEADER_BG = "#1A1A1A"
HEADER_TEXT = "#FFFFFF"
SECTION_BG = "#FDF0E0"
ACCENT = "#C85A2A"
DARK_TEXT = "#1A1A1A"
SUBTITLE_TEXT = "#5A3A1A"
BADGE_BG = "#C85A2A"
BADGE_TEXT = "#FFFFFF"
DIVIDER_COLOR = "#E0C8A8"

# Try to load fonts
def get_font(size, bold=False):
    paths = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
    ]
    for p in paths:
        try:
            return ImageFont.truetype(p, size)
        except:
            pass
    return ImageFont.load_default()

font_title_big = get_font(42, bold=True)
font_title = get_font(32, bold=True)
font_subtitle = get_font(18, bold=False)
font_heading = get_font(22, bold=True)
font_body = get_font(19, bold=False)
font_body_bold = get_font(19, bold=True)
font_badge = get_font(16, bold=True)
font_small = get_font(15, bold=False)
font_number = get_font(28, bold=True)
font_code = get_font(16, bold=False)

sections = [
    {
        "num": "01",
        "title": "CHAT",
        "subtitle": "claude.ai / App Mobile / Grátis para começar",
        "badge": "Nível Conversação",
        "setup": [
            "Crie uma conta gratuita em claude.ai ou baixe o app mobile",
            "Abra Configurações → Memória — adicione seu cargo, objetivos e preferências",
            "Crie um Projeto por fluxo de trabalho com instruções e arquivos específicos",
            "Defina o estilo personalizado e modelo padrão (Haiku / Sonnet / Opus)",
        ],
        "features": [
            ("Memória", "aprende seu cargo e preferências permanentemente"),
            ("Projetos", "espaços de trabalho isolados com instruções específicas"),
            ("Artefatos", "gera código, documentos, diagramas e apps inline"),
            ("Análise de arquivos", "carrega PDFs, imagens, CSVs, planilhas"),
        ],
        "usecases": [
            "Redigir conteúdo, e-mails e posts para redes sociais com a sua voz",
            "Resumir relatórios, artigos e transcrições de reuniões",
            "Analisar planilhas, dados e modelos financeiros",
        ],
    },
    {
        "num": "02",
        "title": "COWORK",
        "subtitle": "Agente Desktop / $20/mês Plano Pro mínimo",
        "badge": "Nível Fluxo de Trabalho",
        "setup": [
            "Baixe o app desktop do Claude (Plano Pro, $20/mês)",
            "Crie uma pasta de contexto: about-me.md, brand-voice.md, working-style.md",
            "Escreva Instruções Globais + de Pasta (carregamento automático por sessão)",
            "Conecte apps via Configurações → Conectores (50+ gratuitos)",
        ],
        "features": [
            ("Acesso ao sistema de arquivos", "lê e escreve nas suas pastas locais"),
            ("50+ Conectores", "Slack, Drive, Notion, LinkedIn, Gmail"),
            ("11 Plugins", "marketing, vendas, finanças, dados, jurídico"),
            ("Tarefas Agendadas", "diário, semanal ou intervalos cron personalizados"),
        ],
        "usecases": [
            "Briefings diários às 7h a partir de 200+ perfis de concorrentes",
            "Triagem do Slack por urgência entregue toda manhã",
            "Posts do LinkedIn ranqueados por engajamento com temas extraídos",
        ],
    },
    {
        "num": "03",
        "title": "CODE",
        "subtitle": "Agente Terminal / Planos de $20-200/mês",
        "badge": "Nível Sistema Operacional",
        "setup": [
            "Instale: npm i -g @anthropic-ai/claude-code",
            "Execute claude /init → gera o CLAUDE.md (200-500 linhas)",
            "Defina o modo de permissão: Ask First, Auto Edit ou Bypass",
            "Comece com /plan — pesquisa somente leitura antes de construir",
        ],
        "features": [
            ("CLAUDE.md", "contexto persistente do projeto, carrega a cada sessão"),
            ("Agentes paralelos", "agentes simultâneos para 5-10x de produtividade"),
            ("Skills", "fluxos de trabalho em markdown por um comando slash"),
            ("Servidores MCP", "Slack, Ahrefs, Notion, Figma, LinkedIn, CRM"),
        ],
        "usecases": [
            "Construir funcionalidades e entregar código em produção de forma autônoma",
            "Prospecção, outreach, propostas e CRM direto do terminal",
            "48 skills substituindo $600-1K/mês em SaaS. Economiza 15-20 hrs/semana",
        ],
    },
]


def draw_rounded_rect(draw, xy, radius, fill):
    x0, y0, x1, y1 = xy
    draw.rounded_rectangle(xy, radius=radius, fill=fill)


def wrap_text(text, font, max_width, draw):
    words = text.split()
    lines = []
    current = ""
    for w in words:
        test = f"{current} {w}".strip()
        bbox = draw.textbbox((0, 0), test, font=font)
        if bbox[2] - bbox[0] > max_width:
            if current:
                lines.append(current)
            current = w
        else:
            current = test
    if current:
        lines.append(current)
    return lines


# First pass: calculate total height
dummy = Image.new("RGB", (W, 100))
dd = ImageDraw.Draw(dummy)

def calc_section_height(s):
    h = 0
    h += 60  # title bar
    h += 15  # gap
    # COMO CONFIGURAR
    h += 30  # heading
    for i, item in enumerate(s["setup"]):
        lines = wrap_text(f"{i+1}. {item}", font_body, W - PADDING*2 - 60, dd)
        h += len(lines) * 26 + 6
    h += 20
    # PRINCIPAIS RECURSOS
    h += 30
    for feat_name, feat_desc in s["features"]:
        lines = wrap_text(f"• {feat_name} — {feat_desc}", font_body, W - PADDING*2 - 60, dd)
        h += len(lines) * 26 + 6
    h += 20
    # USE PARA
    h += 30
    for uc in s["usecases"]:
        lines = wrap_text(f"> {uc}", font_body, W - PADDING*2 - 60, dd)
        h += len(lines) * 26 + 6
    h += 30  # bottom padding
    return h

total_h = 0
total_h += 130  # header
total_h += 20
for s in sections:
    total_h += calc_section_height(s) + SECTION_GAP
total_h += 40  # footer

# Create image
img = Image.new("RGB", (W, total_h), BG_COLOR)
draw = ImageDraw.Draw(img)

# Header
draw_rounded_rect(draw, (0, 0, W, 120), 0, HEADER_BG)
title_text = "OS 3 NÍVEIS DO CLAUDE"
bbox = draw.textbbox((0, 0), title_text, font=font_title_big)
tw = bbox[2] - bbox[0]
draw.text(((W - tw) // 2, 20), title_text, fill=HEADER_TEXT, font=font_title_big)

sub_text = "A maioria das pessoas nunca passa do Chat"
bbox2 = draw.textbbox((0, 0), sub_text, font=font_subtitle)
sw = bbox2[2] - bbox2[0]
draw.text(((W - sw) // 2, 75), sub_text, fill="#AAAAAA", font=font_subtitle)

y = 140

for s in sections:
    section_h = calc_section_height(s)

    # Section background
    draw_rounded_rect(draw, (PADDING - 20, y, W - PADDING + 20, y + section_h), 16, SECTION_BG)

    # Title bar with number
    bar_y = y + 10
    # Number circle
    cx, cy = PADDING + 10, bar_y + 20
    draw.ellipse((cx - 18, cy - 18, cx + 18, cy + 18), fill=ACCENT)
    draw.text((cx - 10, cy - 14), s["num"], fill=BADGE_TEXT, font=font_number)

    # Title
    draw.text((cx + 30, bar_y + 4), s["title"], fill=DARK_TEXT, font=font_title)

    # Subtitle
    draw.text((cx + 30, bar_y + 38), s["subtitle"], fill=SUBTITLE_TEXT, font=font_small)

    # Badge
    badge_text = s["badge"]
    bb = draw.textbbox((0, 0), badge_text, font=font_badge)
    bw = bb[2] - bb[0]
    bx = W - PADDING - bw - 30
    draw_rounded_rect(draw, (bx, bar_y + 8, bx + bw + 24, bar_y + 36), 12, BADGE_BG)
    draw.text((bx + 12, bar_y + 11), badge_text, fill=BADGE_TEXT, font=font_badge)

    cy = bar_y + 70
    left = PADDING + 10
    content_w = W - PADDING * 2 - 60

    # COMO CONFIGURAR
    draw.text((left, cy), "⚙ COMO CONFIGURAR", fill=ACCENT, font=font_heading)
    cy += 32
    for i, item in enumerate(s["setup"]):
        lines = wrap_text(f"{i+1}. {item}", font_body, content_w, draw)
        for line in lines:
            draw.text((left + 10, cy), line, fill=DARK_TEXT, font=font_body)
            cy += 26
        cy += 6
    cy += 12

    # Divider
    draw.line((left, cy, W - PADDING - 10, cy), fill=DIVIDER_COLOR, width=1)
    cy += 12

    # PRINCIPAIS RECURSOS
    draw.text((left, cy), "★ PRINCIPAIS RECURSOS", fill=ACCENT, font=font_heading)
    cy += 32
    for feat_name, feat_desc in s["features"]:
        full = f"• {feat_name} — {feat_desc}"
        lines = wrap_text(full, font_body, content_w, draw)
        for line in lines:
            draw.text((left + 10, cy), line, fill=DARK_TEXT, font=font_body)
            cy += 26
        cy += 6
    cy += 12

    # Divider
    draw.line((left, cy, W - PADDING - 10, cy), fill=DIVIDER_COLOR, width=1)
    cy += 12

    # USE PARA
    draw.text((left, cy), "→ USE PARA", fill=ACCENT, font=font_heading)
    cy += 32
    for uc in s["usecases"]:
        lines = wrap_text(f"> {uc}", font_body, content_w, draw)
        for line in lines:
            draw.text((left + 10, cy), line, fill=SUBTITLE_TEXT, font=font_body)
            cy += 26
        cy += 6

    y += section_h + SECTION_GAP

img.save("/home/user/Projeto/OS_3_NIVEIS_DO_CLAUDE.png", "PNG", quality=95)
print(f"Imagem salva: {W}x{total_h}px")
