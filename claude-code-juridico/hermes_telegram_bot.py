#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
HERMES - Telegram Bot Integration
Integração com Telegram Bot API
"""

import os
import subprocess
import logging
import asyncio
from typing import Optional
from dotenv import load_dotenv
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import (
    Application, CommandHandler, MessageHandler, CallbackQueryHandler,
    filters, ContextTypes
)

load_dotenv()

# Configuração de logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Token Telegram
TELEGRAM_BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')
if not TELEGRAM_BOT_TOKEN:
    logger.error("TELEGRAM_BOT_TOKEN não configurado!")
    raise ValueError("TELEGRAM_BOT_TOKEN é obrigatório")

# Mapeamento de skills
SKILLS = {
    'exec_cond': {
        'name': 'Execução Condominial',
        'skill': 'execucao-condominial',
        'description': 'Petição de execução de cotas condominiais'
    },
    'pet_trab': {
        'name': 'Peticão Trabalhista',
        'skill': 'peticao-trabalhista',
        'description': 'Reclamatória trabalhista completa'
    },
    'contrato_loc': {
        'name': 'Contrato Locação',
        'skill': 'contrato-locacao',
        'description': 'Contrato de locação residencial/comercial'
    },
    'analise': {
        'name': 'Análise de Processo',
        'skill': 'analise-processo',
        'description': 'Triagem e análise rápida de processo'
    },
    'conversor': {
        'name': 'Conversor de Linguagem',
        'skill': 'conversor-linguagem',
        'description': 'Traduz juridiquês para linguagem acessível'
    },
    'divorcio': {
        'name': 'Divórcio',
        'skill': 'divorcio',
        'description': 'Peticão de divórcio judicial/extrajudicial'
    },
}

# Intenções para NLU básico
INTENT_KEYWORDS = {
    'exec_cond': ['execução', 'cota', 'condominial', 'cobrança', 'condomínio'],
    'pet_trab': ['trabalhista', 'reclamação', 'emprego', 'CLT', 'rescisão'],
    'contrato_loc': ['locação', 'aluguel', 'contrato', 'imóvel'],
    'divorcio': ['divórcio', 'separação', 'alimentos', 'guarda'],
    'analise': ['análise', 'processo', 'triagem', 'parecer'],
    'conversor': ['significado', 'traduz', 'o que é', 'explica'],
}


def detect_intent(text: str) -> Optional[str]:
    """
    Detecta intenção baseada em palavras-chave
    """
    text_lower = text.lower()

    for skill_id, keywords in INTENT_KEYWORDS.items():
        if any(kw in text_lower for kw in keywords):
            logger.info(f"Intent detectada: {skill_id}")
            return skill_id

    return None


def execute_skill(skill: str) -> tuple[bool, str]:
    """
    Executa um skill do Claude Code
    Retorna: (sucesso: bool, resultado: str)
    """
    try:
        logger.info(f"Executando skill: {skill}")

        cmd = f"claude run /{skill}"
        result = subprocess.run(
            cmd,
            shell=True,
            capture_output=True,
            text=True,
            timeout=30
        )

        if result.returncode == 0:
            logger.info(f"Skill {skill} executada com sucesso")
            output = result.stdout.strip()[:1000]  # Limitar tamanho
            return True, output
        else:
            error_msg = result.stderr.strip()[:300]
            logger.error(f"Erro ao executar {skill}: {error_msg}")
            return False, error_msg

    except subprocess.TimeoutExpired:
        logger.error(f"Timeout ao executar skill {skill}")
        return False, "⏱️ Tempo de execução excedido. Tente novamente."
    except Exception as e:
        logger.error(f"Erro inesperado: {str(e)}")
        return False, f"❌ Erro: {str(e)}"


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """
    Comando /start - Mostra menu principal
    """
    keyboard = [
        [InlineKeyboardButton("📋 Execução Condominial", callback_data='exec_cond')],
        [InlineKeyboardButton("⚖️ Peticão Trabalhista", callback_data='pet_trab')],
        [InlineKeyboardButton("🏠 Contrato Locação", callback_data='contrato_loc')],
        [InlineKeyboardButton("🔍 Análise de Processo", callback_data='analise')],
        [InlineKeyboardButton("📚 Conversor", callback_data='conversor')],
        [InlineKeyboardButton("💔 Divórcio", callback_data='divorcio')],
    ]

    reply_markup = InlineKeyboardMarkup(keyboard)

    await update.message.reply_text(
        """🤖 *HERMES - Assistente Jurídico*

Bem-vindo ao Hermes! Escolha uma opção abaixo ou descreva sua demanda jurídica.

*Áreas disponíveis:*
• Condominial
• Trabalhista
• Imobiliário
• Família/Sucessões
• Análise de Processos""",
        reply_markup=reply_markup,
        parse_mode='Markdown'
    )

    logger.info(f"Usuário {update.effective_user.id} iniciou conversa")


async def handle_button(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """
    Manipula cliques em botões
    """
    query = update.callback_query
    skill_id = query.data

    if skill_id not in SKILLS:
        await query.answer("Opção inválida", show_alert=True)
        return

    skill_info = SKILLS[skill_id]
    await query.answer(f"Executando {skill_info['name']}...")

    # Executar skill
    success, result = execute_skill(skill_info['skill'])

    if success:
        response = f"""✅ *{skill_info['name']}*

_{result}_

Precisa de mais ajuda?"""
    else:
        response = f"""❌ *Erro ao executar {skill_info['name']}*

{result}

Por favor, tente novamente."""

    await query.edit_message_text(
        text=response,
        parse_mode='Markdown'
    )

    logger.info(f"Skill {skill_id} executada para usuário {query.from_user.id}")


async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """
    Manipula mensagens de texto
    """
    text = update.message.text

    logger.info(f"Mensagem de {update.effective_user.id}: {text}")

    # Detectar intenção
    intent = detect_intent(text)

    if not intent:
        await update.message.reply_text(
            """Desculpe, não consegui identificar sua demanda.

Por favor, escolha uma opção:
/start - Menu principal
/help - Ajuda

Ou descreva com mais detalhes sua demanda jurídica."""
        )
        return

    # Executar skill detectada
    skill_info = SKILLS[intent]
    await update.message.reply_text(
        f"🔄 Processando: *{skill_info['name']}*...",
        parse_mode='Markdown'
    )

    success, result = execute_skill(skill_info['skill'])

    if success:
        response = f"""✅ *{skill_info['name']}*

_{result}_

Precisa de mais ajuda?"""
    else:
        response = f"""❌ Erro ao executar {skill_info['name']}

{result}"""

    await update.message.reply_text(response, parse_mode='Markdown')


async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """
    Comando /help - Mostra ajuda
    """
    help_text = """*HERMES - Ajuda*

*Comandos disponíveis:*
/start - Menu principal
/help - Esta mensagem
/skills - Lista de skills disponíveis

*Como usar:*
1. Use /start para ver opções
2. Clique em um botão ou descreva sua demanda
3. Envie documentos ou informações adicionais se necessário"""

    await update.message.reply_text(help_text, parse_mode='Markdown')


async def skills_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """
    Comando /skills - Lista skills disponíveis
    """
    skills_text = "*Skills Disponíveis:*\n\n"

    for skill_id, info in SKILLS.items():
        skills_text += f"• *{info['name']}*\n  {info['description']}\n\n"

    await update.message.reply_text(skills_text, parse_mode='Markdown')


async def error_handler(update: object, context: ContextTypes.DEFAULT_TYPE) -> None:
    """
    Manipula erros
    """
    logger.error(f"Erro ao processar update: {context.error}")


def main() -> None:
    """
    Inicia o bot Telegram
    """
    # Criar application
    application = Application.builder().token(TELEGRAM_BOT_TOKEN).build()

    # Handlers
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("help", help_command))
    application.add_handler(CommandHandler("skills", skills_command))
    application.add_handler(CallbackQueryHandler(handle_button))
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))

    # Error handler
    application.add_error_handler(error_handler)

    # Start bot
    logger.info("Iniciando Telegram Bot...")
    application.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == "__main__":
    main()
