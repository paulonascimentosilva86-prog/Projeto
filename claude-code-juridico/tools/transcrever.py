#!/usr/bin/env python3
"""
Transcrição de áudio jurídico usando Whisper (OpenAI)
Paulo Nascimento - Advocacia Integrada

Uso:
  python3 transcrever.py audio.mp3
  python3 transcrever.py audio.mp4 --idioma pt --saida relatorio.txt
  python3 transcrever.py audio.m4a --modelo large --timestamps
"""

import argparse
import sys
import os
from datetime import datetime
from pathlib import Path

def verificar_dependencias():
    try:
        import whisper
        return whisper
    except ImportError:
        print("ERRO: openai-whisper não instalado.")
        print("Execute: pip3 install openai-whisper")
        sys.exit(1)

def formatar_timestamp(segundos: float) -> str:
    h = int(segundos // 3600)
    m = int((segundos % 3600) // 60)
    s = int(segundos % 60)
    return f"{h:02d}:{m:02d}:{s:02d}"

def transcrever(
    arquivo: str,
    modelo: str = "medium",
    idioma: str = "pt",
    timestamps: bool = False,
    saida: str = None,
) -> str:
    whisper = verificar_dependencias()

    if not os.path.exists(arquivo):
        print(f"ERRO: Arquivo '{arquivo}' não encontrado.")
        sys.exit(1)

    print(f"Carregando modelo '{modelo}'...")
    model = whisper.load_model(modelo)

    print(f"Transcrevendo: {arquivo}")
    print("Aguarde — isso pode levar alguns minutos dependendo do tamanho do áudio...")

    resultado = model.transcribe(arquivo, language=idioma, verbose=False)

    nome_arquivo = Path(arquivo).stem
    data_hora = datetime.now().strftime("%d/%m/%Y às %H:%M")

    linhas = [
        "=" * 60,
        "TRANSCRIÇÃO JURÍDICA",
        "Paulo Nascimento - Advocacia Integrada",
        "=" * 60,
        f"Arquivo: {arquivo}",
        f"Data: {data_hora}",
        f"Modelo: {modelo} | Idioma: {idioma}",
        f"Duração detectada: {formatar_timestamp(resultado.get('duration', 0) if isinstance(resultado, dict) else 0)}",
        "=" * 60,
        "",
    ]

    if timestamps and "segments" in resultado:
        linhas.append("TRANSCRIÇÃO COM MARCAÇÕES DE TEMPO:")
        linhas.append("")
        for seg in resultado["segments"]:
            inicio = formatar_timestamp(seg["start"])
            fim = formatar_timestamp(seg["end"])
            texto = seg["text"].strip()
            linhas.append(f"[{inicio} → {fim}]")
            linhas.append(texto)
            linhas.append("")
    else:
        linhas.append("TRANSCRIÇÃO COMPLETA:")
        linhas.append("")
        linhas.append(resultado["text"].strip())

    linhas += [
        "",
        "=" * 60,
        "FIM DA TRANSCRIÇÃO",
        "=" * 60,
    ]

    texto_final = "\n".join(linhas)

    if saida:
        with open(saida, "w", encoding="utf-8") as f:
            f.write(texto_final)
        print(f"\nTranscrição salva em: {saida}")
    else:
        arquivo_saida = f"transcricoes/{nome_arquivo}_{datetime.now().strftime('%Y%m%d_%H%M')}.txt"
        os.makedirs("transcricoes", exist_ok=True)
        with open(arquivo_saida, "w", encoding="utf-8") as f:
            f.write(texto_final)
        print(f"\nTranscrição salva em: {arquivo_saida}")

    print(texto_final)
    return texto_final

def main():
    parser = argparse.ArgumentParser(
        description="Transcrição de áudio jurídico com Whisper",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("arquivo", help="Arquivo de áudio/vídeo (mp3, mp4, m4a, wav, ogg)")
    parser.add_argument(
        "--modelo",
        choices=["tiny", "base", "small", "medium", "large"],
        default="medium",
        help="Tamanho do modelo (default: medium). 'large' = máxima precisão.",
    )
    parser.add_argument("--idioma", default="pt", help="Idioma do áudio (default: pt)")
    parser.add_argument(
        "--timestamps",
        action="store_true",
        help="Incluir marcações de tempo na transcrição",
    )
    parser.add_argument("--saida", help="Arquivo de saída (default: transcricoes/<nome>_<data>.txt)")

    args = parser.parse_args()
    transcrever(
        arquivo=args.arquivo,
        modelo=args.modelo,
        idioma=args.idioma,
        timestamps=args.timestamps,
        saida=args.saida,
    )

if __name__ == "__main__":
    main()
