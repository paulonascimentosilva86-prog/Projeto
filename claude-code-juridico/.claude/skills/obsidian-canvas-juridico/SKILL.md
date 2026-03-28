---
name: obsidian-canvas-juridico
description: Gera mapas visuais (Canvas) do vault juridico. Cria visualizacoes de processos, relacoes entre clientes, fluxos de trabalho e dashboards. Use quando o usuario pedir um mapa visual, canvas, diagrama de relacoes ou dashboard do vault.
---

# Canvas Juridico para Obsidian

Gera arquivos `.canvas` (JSON Canvas) para visualizar relacoes e fluxos no vault juridico.

## Tipos de Canvas

### 1. Mapa de Cliente
Visualiza todas as conexoes de um cliente:
- No central: ficha do cliente
- Nos conectados: processos vinculados
- Cores por status: verde (ganho), amarelo (em andamento), vermelho (urgente)
- Grupos por area do direito

### 2. Dashboard do Escritorio
Visao geral do escritorio:
- Grupo por area (Trabalhista, Civel, Condominial, Imobiliario, Familia)
- Dentro de cada grupo: processos ativos
- Nos de alerta para prazos proximos
- Conectores mostrando relacoes entre processos

### 3. Fluxo Processual
Fluxograma de um processo especifico:
- Etapas: Distribuicao → Citacao → Contestacao → Audiencia → Sentenca → Recurso
- Status atual destacado em cor
- Documentos vinculados em cada etapa
- Prazos como nos de texto

### 4. Mapa do Vault
Visao macro de todo o vault:
- Nos para cada pasta principal
- Contadores de notas por pasta
- Conexoes entre areas (ex: cliente com processos em multiplas areas)

## Regras de Geracao

- IDs: strings hex de 16 caracteres lowercase
- Cores: "1" vermelho (urgente), "2" laranja (atencao), "3" amarelo (pendente), "4" verde (ok), "5" ciano (info), "6" roxo (estudo)
- Dimensoes padrao de nos: 250x60 para texto simples, 400x200 para cards detalhados
- Espacamento: 50px entre nos adjacentes
- Grupos com 20px de padding
- Usar `fromEnd: "arrow"` para direcao do fluxo
- Referenciar notas do vault com tipo "file" e path relativo

## Exemplo de Canvas de Cliente

```json
{
  "nodes": [
    {"id": "a1b2c3d4e5f6a7b8", "type": "file", "file": "01-Clientes/joao-silva.md", "x": 0, "y": 0, "width": 400, "height": 200, "color": "5"},
    {"id": "b2c3d4e5f6a7b8c9", "type": "file", "file": "02-Processos/Trabalhista/joao-silva-reclamatoria.md", "x": -300, "y": 300, "width": 350, "height": 150, "color": "4"},
    {"id": "c3d4e5f6a7b8c9d0", "type": "file", "file": "02-Processos/Condominial/joao-silva-execucao.md", "x": 300, "y": 300, "width": 350, "height": 150, "color": "3"}
  ],
  "edges": [
    {"id": "d4e5f6a7b8c9d0e1", "fromNode": "a1b2c3d4e5f6a7b8", "toNode": "b2c3d4e5f6a7b8c9", "fromSide": "bottom", "toSide": "top", "toEnd": "arrow", "label": "Reclamatoria"},
    {"id": "e5f6a7b8c9d0e1f2", "fromNode": "a1b2c3d4e5f6a7b8", "toNode": "c3d4e5f6a7b8c9d0", "fromSide": "bottom", "toSide": "top", "toEnd": "arrow", "label": "Execucao"}
  ]
}
```
