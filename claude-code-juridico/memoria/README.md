# Memória Persistente — Paulo Nascimento Advocacia Integrada

Este diretório é o **cérebro acumulado** do escritório.
Cada pesquisa feita com `/pesquisa-agente` é salva aqui automaticamente.

## Estrutura

```
memoria/
├── jurisprudencia/     ← Pesquisas por tema (geradas pelo /pesquisa-agente)
├── teses/              ← Teses jurídicas consolidadas e estratégias
└── escritorio/         ← Perfil, parâmetros e configurações do escritório
    └── perfil-escritorio.md
```

## Como usar

**Pesquisar e salvar automaticamente:**
```
/pesquisa-agente horas extras bancário TST polo autor
```

**Reutilizar pesquisa existente:**
Ao usar qualquer slash command de peça, o Claude consultará automaticamente
a pasta `memoria/jurisprudencia/` se houver arquivo sobre o tema.

## Convenção de nomes

Arquivos em `jurisprudencia/` seguem o padrão:
`[tema-em-slug].md`

Exemplos:
- `horas-extras-bancario.md`
- `execucao-cotas-condominiais.md`
- `dano-moral-trabalhista.md`
- `despejo-falta-pagamento.md`

## Manutenção

- Atualizar pesquisas com mais de **6 meses**
- Usar `/pesquisa-agente` com o mesmo tema para atualizar (o agente detecta e atualiza)
