# /transcrever-audio

Transcreve e analisa juridicamente um arquivo de áudio ou vídeo.

## Uso
```
/transcrever-audio [arquivo] [tipo]
```
- **arquivo**: caminho para mp3, mp4, m4a, wav ou ogg
- **tipo**: `consulta` | `audiencia` | `reuniao` | `depoimento` (default: consulta)

## O que este comando faz

### Etapa 1 — Transcrição
Execute a transcrição com Whisper:
```bash
python3 tools/transcrever.py $ARGUMENTS --modelo medium --timestamps
```

### Etapa 2 — Análise Jurídica da Transcrição
Após transcrever, analise o conteúdo com foco em:

**Partes envolvidas**
- Identifique todas as pessoas mencionadas e seus papéis (cliente, advogado, parte contrária, testemunha)
- Extraia dados de contato citados (nome, CPF/CNPJ se mencionados)

**Fatos Relevantes**
- Liste os fatos narrados em ordem cronológica
- Destaque datas, valores e obrigações mencionados
- Identifique admissões, confissões ou declarações importantes

**Questões Jurídicas Detectadas**
- Classifique a área do direito envolvida
- Aponte possíveis teses ou fundamentos legais
- Identifique riscos jurídicos para o escritório

**Prazos e Urgências**
- Extraia qualquer prazo mencionado
- Sinalize urgências ou situações que exijam ação imediata

**Documentos Necessários**
- Liste documentos mencionados ou que devem ser solicitados ao cliente

### Etapa 3 — Resumo Executivo
Gere um resumo em linguagem simples (máx. 5 linhas) para compartilhar com o cliente.

### Etapa 4 — Próximos Passos Recomendados
Sugira os comandos mais adequados para dar continuidade:
- `/peticao-trabalhista` — se trabalhista
- `/execucao-condominial` — se condominial
- `/peticao-civel` — se cível
- `/modelo-email` — para comunicar ao cliente
- `/proposta-honorarios` — se for nova causa

## Observação sobre privacidade
Transcrições contêm dados sensíveis de clientes. Os arquivos são salvos localmente em `transcricoes/` e não são enviados para nenhum serviço externo (Whisper roda offline).
