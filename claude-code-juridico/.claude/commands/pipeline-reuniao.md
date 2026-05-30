# /pipeline-reuniao

Pipeline completo para processar uma gravação de reunião ou consulta:
Áudio → Transcrição → Análise Jurídica → Relatório ao Cliente

## Uso
```
/pipeline-reuniao [arquivo_audio] [tipo]
```
- **arquivo**: caminho para o arquivo de áudio/vídeo
- **tipo**: `consulta` | `audiencia` | `reuniao` | `depoimento`

## Executar pipeline completo

```bash
bash tools/pipeline-audio.sh $ARGUMENTS
```

## O que acontece automaticamente

```
[1] Transcrição com Whisper (modelo medium, timestamps ativos)
       ↓
[2] Salvamento em transcricoes/<nome>_<data>.txt
       ↓
[3] Geração de relatório em transcricoes/<nome>_relatorio_<data>.txt
       ↓
[4] Análise jurídica pelo Claude (partes, fatos, prazos, riscos)
       ↓
[5] Sugestão de próximos passos e comandos relevantes
```

## Após o pipeline, o Claude irá

1. **Identificar a área do direito** e sugerir o agente especializado
2. **Extrair fatos, partes e valores** mencionados no áudio
3. **Alertar sobre prazos** citados na gravação
4. **Recomendar documentos** a solicitar ao cliente
5. **Propor rascunho de e-mail** de acompanhamento (`/modelo-email`)

## Exemplo de uso típico

```
Reunião de consulta com cliente trabalhista:
→ /pipeline-reuniao gravacoes/joao-silva-01.mp3 consulta

Audiência de instrução:
→ /pipeline-reuniao gravacoes/audiencia-reclamatoria.mp4 audiencia

Depoimento de testemunha:
→ /pipeline-reuniao gravacoes/testemunha-ana.m4a depoimento
```

## Formatos suportados
mp3, mp4, m4a, wav, ogg, webm, flac

## Privacidade
Todo processamento é local (Whisper offline). Nenhum áudio é enviado para servidores externos.
