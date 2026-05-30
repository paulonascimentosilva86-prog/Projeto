#!/usr/bin/env python3
"""
Síntese de Voz (TTS) para documentos e vídeos jurídicos
Paulo Nascimento - Advocacia Integrada

Uso:
  python3 tts.py "Texto a narrar" --saida naracao.mp3
  python3 tts.py --arquivo peticao.txt --saida peticao.mp3
  python3 tts.py --arquivo texto.txt --velocidade 0.9

Modelos disponíveis (Coqui TTS):
  tts_models/pt/cv/vits            — português, rápido
  tts_models/multilingual/multi-dataset/xtts_v2  — multilingual, alta qualidade
"""

import argparse
import sys
import os
from pathlib import Path

def verificar_dependencias():
    try:
        from TTS.api import TTS
        return TTS
    except ImportError:
        print("ERRO: Coqui TTS não instalado.")
        print("Execute: pip3 install TTS")
        sys.exit(1)

def gerar_audio(
    texto: str = None,
    arquivo_entrada: str = None,
    saida: str = "audio_juridico.mp3",
    modelo: str = "tts_models/pt/cv/vits",
    velocidade: float = 1.0,
):
    TTS = verificar_dependencias()

    if arquivo_entrada:
        if not os.path.exists(arquivo_entrada):
            print(f"ERRO: Arquivo '{arquivo_entrada}' não encontrado.")
            sys.exit(1)
        with open(arquivo_entrada, "r", encoding="utf-8") as f:
            texto = f.read()

    if not texto:
        print("ERRO: Forneça um texto ou arquivo de entrada.")
        sys.exit(1)

    # Trunca textos muito longos (TTS tem limite de tokens)
    MAX_CHARS = 5000
    if len(texto) > MAX_CHARS:
        print(f"Aviso: Texto truncado para {MAX_CHARS} caracteres.")
        texto = texto[:MAX_CHARS] + "..."

    print(f"Carregando modelo TTS: {modelo}")
    tts = TTS(model_name=modelo, progress_bar=True)

    print(f"Gerando áudio... ({len(texto)} caracteres)")
    tts.tts_to_file(text=texto, file_path=saida, speed=velocidade)

    tamanho = os.path.getsize(saida) / 1024
    print(f"\nÁudio gerado: {saida} ({tamanho:.1f} KB)")

def main():
    parser = argparse.ArgumentParser(
        description="Síntese de voz para documentos jurídicos",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("texto", nargs="?", help="Texto direto a sintetizar")
    group.add_argument("--arquivo", help="Arquivo .txt com o texto a sintetizar")

    parser.add_argument("--saida", default="audio_juridico.mp3", help="Arquivo de saída (default: audio_juridico.mp3)")
    parser.add_argument(
        "--modelo",
        default="tts_models/pt/cv/vits",
        help="Modelo TTS a usar",
    )
    parser.add_argument(
        "--velocidade",
        type=float,
        default=1.0,
        help="Velocidade da fala: 0.8 = lento, 1.0 = normal, 1.2 = rápido",
    )

    args = parser.parse_args()
    gerar_audio(
        texto=args.texto,
        arquivo_entrada=args.arquivo,
        saida=args.saida,
        modelo=args.modelo,
        velocidade=args.velocidade,
    )

if __name__ == "__main__":
    main()
