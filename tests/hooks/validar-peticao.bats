#!/usr/bin/env bats

HOOK="claude-code-juridico/hooks/validar-peticao.sh"
FIXTURES="tests/hooks/fixtures"

# === Cenarios de sucesso (exit 0) ===

@test "peticao civel completa retorna exit 0" {
  run bash "$HOOK" "$FIXTURES/peticao-completa.txt"
  [ "$status" -eq 0 ]
  [[ "$output" == *"validada"* ]] || [[ "$output" == *"VALIDACAO"* ]]
}

@test "peticao condominial com planilha retorna exit 0" {
  run bash "$HOOK" "$FIXTURES/peticao-condominial-completa.txt"
  [ "$status" -eq 0 ]
}

@test "peticao trabalhista com verbas retorna exit 0" {
  run bash "$HOOK" "$FIXTURES/peticao-trabalhista-completa.txt"
  [ "$status" -eq 0 ]
}

# === Cenarios de bloqueio generico (exit 1) ===

@test "peticao vazia retorna exit 1" {
  run bash "$HOOK" "$FIXTURES/peticao-vazia.txt"
  [ "$status" -eq 1 ]
}

@test "peticao sem enderecamento retorna exit 1 com mensagem" {
  run bash "$HOOK" "$FIXTURES/peticao-sem-enderecamento.txt"
  [ "$status" -eq 1 ]
  [[ "$output" == *"Enderecamento"* ]] || [[ "$output" == *"enderecamento"* ]]
}

@test "peticao sem qualificacao retorna exit 1 com mensagem" {
  run bash "$HOOK" "$FIXTURES/peticao-sem-qualificacao.txt"
  [ "$status" -eq 1 ]
  [[ "$output" == *"Qualificacao"* ]] || [[ "$output" == *"qualificacao"* ]]
}

@test "peticao sem pedidos retorna exit 1 com mensagem" {
  run bash "$HOOK" "$FIXTURES/peticao-sem-pedidos.txt"
  [ "$status" -eq 1 ]
  [[ "$output" == *"Pedidos"* ]] || [[ "$output" == *"pedidos"* ]]
}

# === Cenarios de validacao por tipo (exit 1) ===

@test "peticao condominial sem planilha retorna exit 1" {
  run bash "$HOOK" "$FIXTURES/peticao-condominial-sem-planilha.txt"
  [ "$status" -eq 1 ]
  [[ "$output" == *"planilha"* ]] || [[ "$output" == *"Planilha"* ]]
}

@test "peticao trabalhista sem verbas retorna exit 1" {
  run bash "$HOOK" "$FIXTURES/peticao-trabalhista-sem-verbas.txt"
  [ "$status" -eq 1 ]
  [[ "$output" == *"verbas"* ]] || [[ "$output" == *"Verbas"* ]]
}

# === Casos limite ===

@test "arquivo inexistente retorna exit 1" {
  run bash "$HOOK" "/tmp/nao-existe-xyz-abc-123.txt"
  [ "$status" -eq 1 ]
}

@test "sem argumento retorna exit 1" {
  run bash "$HOOK"
  [ "$status" -eq 1 ]
}
