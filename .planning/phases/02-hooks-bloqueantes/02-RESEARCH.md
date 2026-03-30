# Research: Phase 02 — Hooks Bloqueantes

## 1. Estado Atual

O hook `validar-peticao.sh` atual:
- Sempre retorna `exit 0` (nunca bloqueia)
- Usa `grep -qi` para buscar 5 elementos
- Emite `[ALERTA]` informativo mas não impede nada
- Recebe `$1` como caminho do arquivo

O `settings.json` configura hooks em `PostToolUse` para o evento `Write`.

## 2. Arquitetura do Hook Bloqueante

### Abordagem: Refatorar `validar-peticao.sh`

Transformar de alertas (exit 0) para bloqueio (exit 1):

```bash
# Antes: exit 0 sempre
# Depois: exit 1 se elementos essenciais faltam
```

### Detecção de Elementos (grep patterns)

**Endereçamento (HOOK-01):**
- Patterns: `excelentissimo|exmo|meritissimo|juiz|vara|comarca|tribunal|foro`
- Falso positivo: baixo — esses termos só aparecem em endereçamento

**Qualificação das partes (HOOK-02):**
- Patterns: `qualificacao|qualificado|requerente|reclamante|autor|exequente|CPF|CNPJ|nacionalidade|estado civil`
- Precisa de pelo menos 2 matches para evitar falso positivo

**Pedidos (HOOK-03):**
- Patterns: `dos pedidos|requer|ante o exposto|diante do exposto|pede deferimento`
- Seção "DOS PEDIDOS" é o marcador mais forte

**Validação por tipo (HOOK-04):**
- Condominial: `planilha|discrimina|debito condominial|cota condominial`
- Trabalhista: `verbas|FGTS|aviso previo|rescisoria|salario|horas extras`
- Tipo detectado pelo conteúdo: se menciona "condominial" → exige planilha; se menciona "trabalhista/reclamante" → exige verbas

## 3. BATS (Bash Automated Testing System)

### Instalação
```bash
npm install --save-dev bats  # via npm
# ou
git clone https://github.com/bats-core/bats-core.git
```

### Estrutura de Teste
```bash
tests/hooks/
├── validar-peticao.bats    # testes BATS
└── fixtures/
    ├── peticao-completa.txt
    ├── peticao-sem-enderecamento.txt
    ├── peticao-sem-qualificacao.txt
    ├── peticao-sem-pedidos.txt
    ├── peticao-vazia.txt
    ├── peticao-condominial-sem-planilha.txt
    ├── peticao-condominial-completa.txt
    ├── peticao-trabalhista-sem-verbas.txt
    └── peticao-trabalhista-completa.txt
```

### Formato BATS
```bash
#!/usr/bin/env bats

@test "peticao completa retorna exit 0" {
  run bash hooks/validar-peticao.sh fixtures/peticao-completa.txt
  [ "$status" -eq 0 ]
}

@test "peticao sem enderecamento retorna exit 1" {
  run bash hooks/validar-peticao.sh fixtures/peticao-sem-enderecamento.txt
  [ "$status" -eq 1 ]
  [[ "$output" == *"Enderecamento"* ]]
}
```

## 4. Fixtures (Petições de Teste)

Cada fixture deve ser um arquivo .txt com conteúdo mínimo mas realista:

**Petição completa** (todos elementos presentes):
- EXMO. SR. JUIZ DE DIREITO DA X VARA...
- QUALIFICAÇÃO: nome, CPF, nacionalidade...
- DOS FATOS: narrativa...
- DO DIREITO: fundamentação...
- DOS PEDIDOS: Requer...

**Petição incompleta**: Cada variante remove exatamente 1 elemento.

**Petição vazia**: Arquivo com 0 bytes ou apenas espaços.

## 5. Plano de Waves

### Wave 1: Infra + Hook refatorado (1 plan)
- Instalar BATS via npm
- Refatorar `validar-peticao.sh` para exit 1
- Criar fixtures de teste

### Wave 2: Testes BATS (1 plan)
- Escrever testes BATS para todos os cenários
- Validação por tipo (condominial/trabalhista)

Total: 2 plans, execução sequencial (Wave 2 depende de Wave 1).

## 6. Riscos e Mitigações

| Risco | Mitigação |
|-------|-----------|
| Falso positivo em petição válida | Patterns amplos com múltiplos sinônimos |
| Falso negativo (não detecta ausência) | Fixtures reais baseadas nos commands |
| BATS não disponível no sistema | Instalar via npm como devDependency |
| Hook quebra workflow do Claude Code | Testar com fixtures antes de ativar |
