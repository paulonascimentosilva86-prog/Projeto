#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
HERMES - WhatsApp Bot Integration
Integração com Twilio para WhatsApp
"""

import os
import subprocess
import json
import logging
from typing import Dict, Optional
from dotenv import load_dotenv
from flask import Flask, request
from twilio.rest import Client
from twilio.twiml.messaging_response import MessagingResponse

load_dotenv()

# Configuração de logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Inicializar Flask
app = Flask(__name__)

# Credenciais Twilio
TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID')
TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN')
TWILIO_PHONE = os.getenv('TWILIO_PHONE', '+5511999999999')

# Verificar credenciais
if not TWILIO_ACCOUNT_SID or not TWILIO_AUTH_TOKEN:
    logger.warning("Credenciais Twilio não configuradas. Bot operará em modo teste.")
    client = None
else:
    client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

# Mapeamento de intenções para skills
INTENT_MAPPING = {
    "execução condominial": "execucao-condominial",
    "execução de cota": "execucao-condominial",
    "cobrança condominial": "calculadora-condominial",
    "reclamação trabalhista": "peticao-trabalhista",
    "peticão trabalhista": "peticao-trabalhista",
    "contrato de locação": "contrato-locacao",
    "contrato locação": "contrato-locacao",
    "divórcio": "divorcio",
    "divorcio": "divorcio",
    "alimentos": "alimentos",
    "inventário": "inventario",
    "guarda": "guarda-visitas",
    "análise de processo": "analise-processo",
    "analise processo": "analise-processo",
    "tradução": "conversor-linguagem",
    "traducao": "conversor-linguagem",
    "traduz": "conversor-linguagem",
}


def parse_intent(text: str) -> Optional[str]:
    """
    Mapeia linguagem natural para skill do Claude Code
    """
    text_lower = text.lower().strip()

    # Busca exata
    for intent, skill in INTENT_MAPPING.items():
        if intent in text_lower:
            logger.info(f"Intent detectada: {intent} → {skill}")
            return skill

    # Se não encontrar, usar análise genérica
    if any(word in text_lower for word in ["execução", "cota", "condominial"]):
        return "execucao-condominial"
    elif any(word in text_lower for word in ["trabalhista", "reclamação", "peticão"]):
        return "peticao-trabalhista"
    elif any(word in text_lower for word in ["locação", "aluguel", "contrato"]):
        return "contrato-locacao"
    elif any(word in text_lower for word in ["divórcio", "alimentos", "inventário"]):
        return "divorcio"

    return None


def execute_skill(skill: str, context: Optional[Dict] = None) -> Dict:
    """
    Executa um skill do Claude Code via CLI
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
            return {
                "status": "success",
                "skill": skill,
                "result": result.stdout[:500]  # Limitar tamanho da resposta
            }
        else:
            logger.error(f"Erro ao executar skill {skill}: {result.stderr}")
            return {
                "status": "error",
                "skill": skill,
                "error": result.stderr[:300]
            }

    except subprocess.TimeoutExpired:
        logger.error(f"Timeout ao executar skill {skill}")
        return {
            "status": "error",
            "skill": skill,
            "error": "Tempo de execução excedido"
        }
    except Exception as e:
        logger.error(f"Erro inesperado ao executar skill {skill}: {str(e)}")
        return {
            "status": "error",
            "skill": skill,
            "error": str(e)
        }


def format_response(result: Dict) -> str:
    """
    Formata resposta do skill para WhatsApp
    """
    if result["status"] == "success":
        return f"""✅ *Hermes - Assistente Jurídico*

Skill executada: /{result['skill']}

_{result['result']}_

Precisa de mais ajuda? Envie uma mensagem descrevendo sua demanda jurídica."""
    else:
        return f"""❌ *Erro ao processar requisição*

Skill: /{result.get('skill', 'desconhecido')}
Erro: {result.get('error', 'Erro desconhecido')}

Por favor, tente novamente ou descreva com mais detalhes sua demanda."""


@app.route("/whatsapp/webhook", methods=["POST"])
def whatsapp_webhook():
    """
    Webhook para receber mensagens do WhatsApp via Twilio
    """
    try:
        # Extrair dados da requisição
        sender = request.form.get("From")
        message_text = request.form.get("Body", "").strip()

        logger.info(f"Mensagem recebida de {sender}: {message_text}")

        # Criar resposta Twilio
        response = MessagingResponse()

        if not message_text:
            response.message("Olá! Envie uma descrição de sua demanda jurídica para que eu possa ajudar.")
            return str(response)

        # Detectar intenção
        skill = parse_intent(message_text)

        if not skill:
            response.message(
                "Desculpe, não consegui identificar sua demanda. "
                "Tipos de serviços disponíveis:\n"
                "• Execução Condominial\n"
                "• Peticão Trabalhista\n"
                "• Contratos de Locação\n"
                "• Divórcio e Alimentos\n\n"
                "Descreva melhor seu caso."
            )
            return str(response)

        # Executar skill
        result = execute_skill(skill)
        formatted_response = format_response(result)

        response.message(formatted_response)

        logger.info(f"Resposta enviada para {sender}")
        return str(response)

    except Exception as e:
        logger.error(f"Erro no webhook WhatsApp: {str(e)}")
        response = MessagingResponse()
        response.message("Erro ao processar sua mensagem. Por favor, tente novamente.")
        return str(response)


@app.route("/whatsapp/health", methods=["GET"])
def health_check():
    """Health check endpoint"""
    return {
        "status": "ok",
        "service": "hermes-whatsapp-bot",
        "twilio_configured": client is not None
    }


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    logger.info(f"Iniciando WhatsApp Bot na porta {port}")
    app.run(host="0.0.0.0", port=port, debug=False)
