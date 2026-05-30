# /gerar-audio

Converte texto jurídico em áudio narrado (Text-to-Speech).
Ideal para: narrar vídeos Remotion, gerar áudios de notificações, criar conteúdo acessível ao cliente.

## Uso
```
/gerar-audio [texto_ou_arquivo] [destino]
```

## Casos de uso

### 1. Narrar um documento jurídico
```bash
python3 tools/tts.py --arquivo transcricoes/notificacao.txt --saida audio/notificacao.mp3
```

### 2. Gerar narração para vídeo Remotion
```bash
python3 tools/tts.py "A importância do advogado para o seu condomínio." \
  --saida remotion-videos/public/naracao-intro.mp3 \
  --velocidade 0.9
```

### 3. Criar áudio de notificação ao cliente
Solicite ao Claude:
- O texto a ser narrado (resumo de andamento processual, notificação, etc.)
- O nome do arquivo de saída

### Fluxo completo sugerido

**Passo 1**: Gere o texto com outro comando:
```
/relatorio-cliente → salva texto_relatorio.txt
```

**Passo 2**: Converta para áudio:
```bash
python3 tools/tts.py --arquivo texto_relatorio.txt --saida relatorio_audio.mp3
```

**Passo 3**: Compartilhe com o cliente via WhatsApp ou e-mail.

## Modelos disponíveis

| Modelo | Idioma | Qualidade | Velocidade |
|--------|--------|-----------|------------|
| `tts_models/pt/cv/vits` | Português | Boa | Rápida |
| `tts_models/multilingual/multi-dataset/xtts_v2` | Multi | Alta | Lenta |

## Narração para Vídeos Remotion

Para adicionar narração a um vídeo existente:
1. Gere o áudio com este comando
2. Coloque o arquivo em `remotion-videos/public/`
3. Use `<Audio src={staticFile("naracao.mp3")} />` no componente Remotion

## Observação
Textos muito longos (> 5.000 caracteres) são truncados automaticamente.
Divida petições extensas em seções para narrar separadamente.
