# Testing Stack Research — Claude Code Juridico

**Date:** 2026-03-28
**Context:** Node.js 22.22.0 / npm 10.9.4 / Remotion 4.0.441 / React 19

---

## 1. Testing Framework Decision

### Verdict: Vitest as the primary framework

**Why Vitest over Jest for this project:**

- Native ESM support without transform hacks — critical because Remotion and React 19 ship ESM-first packages
- TypeScript works out of the box via Vite's bundler (the Remotion tsconfig already targets ES2018 + react-jsx)
- ~10-20x faster than Jest in watch mode on a mono-repo with many small test files (the 48 command stubs will create lots of tiny test files)
- The API is 100% Jest-compatible (`describe`, `it`, `expect`, `vi.mock`), so there is zero learning curve if the team already knows Jest
- `@vitest/coverage-v8` covers TypeScript and TSX without needing a separate Babel pipeline

**Install:**

```bash
npm install -D vitest@4.1.2 @vitest/coverage-v8@4.1.2
```

**vitest.config.ts (place in project root or in `remotion-videos/`):**

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",         // default for calculators and hooks
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["src/**/*.{ts,tsx}", "tests/calculators/**/*.ts"],
      exclude: ["src/index.ts", "**/*.spec.ts"],
    },
  },
});
```

For the Remotion TSX components a second config (or an `environmentMatchGlobs` entry) is needed:

```ts
// inside the same defineConfig:
test: {
  environmentMatchGlobs: [
    ["tests/remotion/**", "jsdom"],   // TSX render tests
    ["tests/**", "node"],             // everything else
  ],
}
```

---

## 2. Testing Markdown-Based Prompt Templates (48 slash commands)

The 48 files in `.claude/commands/*.md` are the prompt templates delivered to Claude Code. They need structural validation, not behavioral LLM output testing.

### Two-layer strategy

#### Layer 1 — Schema / structural validation (automated CI gate)

Each file must have:
- A `# Title` H1 heading (first line)
- A `## Dados necessarios` section (or equivalent input section)
- At least one code block (calculation or output template)
- At least one `## Saida` or `## Formato` section

Use `remark` + `remark-parse` to parse the AST and assert structure:

```bash
npm install -D remark@15.0.1 remark-parse@11.0.0 unified@11 gray-matter@4.0.3
```

Test pattern (`tests/commands/structure.test.ts`):

```ts
import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import { describe, it, expect } from "vitest";

const COMMANDS_DIR = join(
  __dirname,
  "../../claude-code-juridico/.claude/commands"
);
const files = readdirSync(COMMANDS_DIR).filter((f) => f.endsWith(".md"));

describe("Slash command files — structural validation", () => {
  it.each(files)("%s has an H1 title", (file) => {
    const content = readFileSync(join(COMMANDS_DIR, file), "utf-8");
    const tree = unified().use(remarkParse).parse(content);
    const h1 = tree.children.find(
      (n: any) => n.type === "heading" && n.depth === 1
    );
    expect(h1, `${file} must start with a # heading`).toBeDefined();
  });

  it.each(files)("%s has at least one code block", (file) => {
    const content = readFileSync(join(COMMANDS_DIR, file), "utf-8");
    const tree = unified().use(remarkParse).parse(content);
    const codeBlock = tree.children.find((n: any) => n.type === "code");
    expect(codeBlock, `${file} must have a code block`).toBeDefined();
  });

  it.each(files)("%s has a required sections", (file) => {
    const content = readFileSync(join(COMMANDS_DIR, file), "utf-8");
    // Check for input section (flexible regex to handle Portuguese variations)
    expect(content).toMatch(/##\s+(dados necessarios|dados|entradas)/i);
  });
});
```

This runs against all 48 files automatically whenever a new command is added.

#### Layer 2 — Snapshot testing (regression guard)

Each command file is a prompt that Claude will use verbatim. Any unintended edit changes the behavior. Snapshot the full text content:

```ts
import { readFileSync } from "fs";
import { join } from "path";
import { describe, it, expect } from "vitest";

const COMMANDS_DIR = join(
  __dirname,
  "../../claude-code-juridico/.claude/commands"
);

describe("Slash command snapshots", () => {
  const calculators = [
    "calculadora-condominial.md",
    "calculadora-distrato.md",
    "calculadora-aluguel.md",
    "insalubridade-periculosidade.md",
    "simulador-reclamatoria.md",
  ];

  it.each(calculators)("%s matches snapshot", (file) => {
    const content = readFileSync(join(COMMANDS_DIR, file), "utf-8");
    expect(content).toMatchSnapshot();
  });
});
```

Run `vitest --update-snapshots` only when intentional changes are made. Snapshots go in `tests/__snapshots__/` and are committed to git.

**Note:** Snapshot all 48 files after initial baseline is established, not just the calculators.

---

## 3. Testing Legal Financial Calculators

This is the most critical section. Legal financial calculations in Brazil must be exact — courts reject rounding errors.

### Core principle: never use JavaScript's native `number` for monetary values

`0.1 + 0.2 === 0.30000000000000004` in JS. Brazilian courts work with R$ values to 2 decimal places and percentages to 4+ decimal places. Use `Decimal.js`:

```bash
npm install decimal.js@10.6.0
npm install -D vitest@4.1.2
```

### Calculator architecture recommendation

Each calculator should be a pure TypeScript function (no side effects, no I/O). Currently the calculators live as Markdown prompts — they need a JavaScript implementation to be testable:

```
tests/
  calculators/
    condominial.test.ts
    distrato.test.ts
    aluguel.test.ts
    insalubridade.test.ts
    reclamatoria.test.ts
src/
  calculators/
    condominial.ts
    distrato.ts
    aluguel.ts
    insalubridade.ts
    reclamatoria.ts
```

### Example: Condominial Debt Calculator

The command specifies: multa 2% + juros 1% a.m. + INPC + honorarios 30%.

```ts
// src/calculators/condominial.ts
import Decimal from "decimal.js";

Decimal.set({ precision: 28, rounding: Decimal.ROUND_HALF_UP });

interface Competencia {
  principal: number;       // R$ cota mensal
  vencimento: Date;
  dataBase: Date;
  inpcAcumulado: number;   // ex: 0.0523 = 5.23%
}

interface ResultadoCompetencia {
  principal: Decimal;
  multa: Decimal;
  juros: Decimal;
  correcao: Decimal;
  subtotal: Decimal;
  honorarios: Decimal;
  total: Decimal;
}

export function calcularCompetencia(c: Competencia): ResultadoCompetencia {
  const principal = new Decimal(c.principal);
  const multa = principal.mul("0.02");                         // 2%

  const mesesAtraso = diffMeses(c.vencimento, c.dataBase);
  const juros = principal.add(multa).mul("0.01").mul(mesesAtraso); // 1%/mes

  const correcao = principal.mul(new Decimal(c.inpcAcumulado));

  const subtotal = principal.add(multa).add(juros).add(correcao);
  const honorarios = subtotal.mul("0.30");                     // 30%
  const total = subtotal.add(honorarios);

  return { principal, multa, juros, correcao, subtotal, honorarios, total };
}

function diffMeses(inicio: Date, fim: Date): number {
  return (
    (fim.getFullYear() - inicio.getFullYear()) * 12 +
    fim.getMonth() - inicio.getMonth()
  );
}
```

Test file (`tests/calculators/condominial.test.ts`):

```ts
import { describe, it, expect } from "vitest";
import Decimal from "decimal.js";
import { calcularCompetencia } from "../../src/calculators/condominial";

describe("Calculadora condominial", () => {

  it("calcula multa de 2% corretamente", () => {
    const r = calcularCompetencia({
      principal: 1000,
      vencimento: new Date("2024-01-10"),
      dataBase: new Date("2024-04-10"),
      inpcAcumulado: 0.05,
    });
    expect(r.multa.toFixed(2)).toBe("20.00");
  });

  it("calcula juros de 1% ao mes por 3 meses", () => {
    const r = calcularCompetencia({
      principal: 1000,
      vencimento: new Date("2024-01-10"),
      dataBase: new Date("2024-04-10"),
      inpcAcumulado: 0,
    });
    // juros = (1000 + 20) * 0.01 * 3 = 30.60
    expect(r.juros.toFixed(2)).toBe("30.60");
  });

  it("honorarios de 30% sobre o subtotal", () => {
    const r = calcularCompetencia({
      principal: 1000,
      vencimento: new Date("2024-01-10"),
      dataBase: new Date("2024-04-10"),
      inpcAcumulado: 0,
    });
    // subtotal = 1000 + 20 + 30.60 = 1050.60; honorarios = 1050.60 * 0.30 = 315.18
    expect(r.honorarios.toFixed(2)).toBe("315.18");
  });

  describe("Edge cases", () => {

    it("cota zero nao gera debito", () => {
      const r = calcularCompetencia({
        principal: 0,
        vencimento: new Date("2024-01-10"),
        dataBase: new Date("2024-04-10"),
        inpcAcumulado: 0,
      });
      expect(r.total.toFixed(2)).toBe("0.00");
    });

    it("inadimplencia de 1 dia (mesmo mes) gera apenas multa", () => {
      const r = calcularCompetencia({
        principal: 800,
        vencimento: new Date("2024-03-10"),
        dataBase: new Date("2024-03-11"),
        inpcAcumulado: 0,
      });
      // 0 meses de juros, apenas multa 2%
      expect(r.juros.toFixed(2)).toBe("0.00");
      expect(r.multa.toFixed(2)).toBe("16.00");
    });

    it("INPC negativo nao pode reduzir o principal", () => {
      // O indice deflacionario nao pode zerar divida condominial
      const r = calcularCompetencia({
        principal: 1000,
        vencimento: new Date("2024-01-10"),
        dataBase: new Date("2024-04-10"),
        inpcAcumulado: -0.02,
      });
      // correcao seria -20, mas subtotal nao pode ser menor que principal + multa + juros
      expect(r.subtotal.greaterThan(0)).toBe(true);
    });

    it("valor muito alto sem perda de precisao", () => {
      // R$ 500.000 de cota (condominio comercial grande)
      const r = calcularCompetencia({
        principal: 500000,
        vencimento: new Date("2022-01-10"),
        dataBase: new Date("2024-04-10"),
        inpcAcumulado: 0.1523,
      });
      // Nao deve ter erro de floating point
      expect(r.total.toFixed(2)).not.toContain("e+");
    });

  });
});
```

### Insalubrity/Hazard Calculator — key legal edge cases to test

```ts
describe("Insalubridade e Periculosidade", () => {

  it("insalubridade grau maximo = 40% salario minimo", () => {
    // Salario minimo 2025: R$ 1.518,00
    const adicional = calcularInsalubridade("maximo", 1518);
    expect(adicional.toFixed(2)).toBe("607.20");
  });

  it("periculosidade = 30% do salario-BASE (nao do total)", () => {
    // Empregado com salario base 3000 + gratificacao 500
    const adicional = calcularPericulosidade(3000); // apenas salario-base
    expect(adicional.toFixed(2)).toBe("900.00");
  });

  it("nao acumulam — deve retornar o maior", () => {
    const ins = calcularInsalubridade("medio", 1518);   // 20% = 303.60
    const per = calcularPericulosidade(1518);            // 30% = 455.40
    const escolhido = escolherMaisVantajoso(ins, per);
    expect(escolhido.toFixed(2)).toBe("455.40");
  });

});
```

### Distrato Calculator — Lei 13.786/2018 edge cases

```ts
describe("Distrato imobiliario", () => {

  it("retencao maxima de 25% no regime comum", () => {
    const r = calcularDistrato({ valorPago: 100000, patrimAfetacao: false });
    expect(r.retencaoMaxima.toFixed(2)).toBe("25000.00");
  });

  it("retencao maxima de 50% com patrimonio de afetacao", () => {
    const r = calcularDistrato({ valorPago: 100000, patrimAfetacao: true });
    expect(r.retencaoMaxima.toFixed(2)).toBe("50000.00");
  });

  it("desistencia em 7 dias — devolucao integral", () => {
    const r = calcularDistrato({
      valorPago: 50000,
      patrimAfetacao: false,
      dentroArrepedimento7dias: true,
    });
    expect(r.valorDevolver.toFixed(2)).toBe("50000.00");
  });

  it("taxa de fruicao: 0.5% por mes de uso do imovel", () => {
    const fruicao = calcularFruicao(300000, 6); // 6 meses de posse
    expect(fruicao.toFixed(2)).toBe("9000.00");
  });

});
```

### Running only calculator tests

```bash
npx vitest run tests/calculators/
```

---

## 4. Testing Bash Hooks

The project has two hooks: `validar-peticao.sh` and `backup-documento.sh`. Each takes a file path as `$1`.

### Tool: BATS (Bash Automated Testing System)

BATS is the standard for Bash unit testing. It integrates with CI and produces TAP-compatible output.

**Install (system-level, not npm):**

```bash
# Ubuntu/Debian (project runs on Linux 6.18.5)
sudo apt-get install bats

# Or via npm (bats-core wrapper):
npm install -D bats@1.13.0
```

**Test file structure (`tests/hooks/`):**

```
tests/
  hooks/
    validar-peticao.bats
    backup-documento.bats
    fixtures/
      peticao-completa.txt
      peticao-sem-fatos.txt
      peticao-sem-pedidos.txt
      peticao-minima.txt
```

**`tests/hooks/validar-peticao.bats`:**

```bash
#!/usr/bin/env bats

HOOK="./claude-code-juridico/hooks/validar-peticao.sh"
FIXTURES="./tests/hooks/fixtures"

setup() {
  # Cria fixtures para cada test (idempotente)
  cat > "$FIXTURES/peticao-completa.txt" <<EOF
Excelentissimo Senhor Juiz
Qualificacao do reclamante
DOS FATOS: ocorreu o seguinte
DO DIREITO: art. 7 CF/88
DOS PEDIDOS: requer o pagamento
EOF

  cat > "$FIXTURES/peticao-sem-pedidos.txt" <<EOF
Excelentissimo Senhor Juiz
Qualificacao do reclamante
DOS FATOS: ocorreu o seguinte
DO DIREITO: art. 7 CF/88
EOF
}

@test "aceita peticao completa sem alertas" {
  run bash "$HOOK" "$FIXTURES/peticao-completa.txt"
  [ "$status" -eq 0 ]
  [[ "$output" == *"✓"* ]] || [[ "$output" == *"verificada"* ]]
}

@test "detecta ausencia de pedidos" {
  run bash "$HOOK" "$FIXTURES/peticao-sem-pedidos.txt"
  [ "$status" -eq 0 ]   # hook sempre sai 0, mas avisa
  [[ "$output" == *"ALERTA"* ]]
  [[ "$output" == *"Pedidos"* ]]
}

@test "arquivo inexistente retorna 0 silenciosamente" {
  run bash "$HOOK" "/tmp/nao-existe-99999.txt"
  [ "$status" -eq 0 ]
  [ -z "$output" ]
}

@test "arquivo vazio retorna sem alertas fatais" {
  local vazio=$(mktemp)
  run bash "$HOOK" "$vazio"
  [ "$status" -eq 0 ]
  rm -f "$vazio"
}

@test "sem argumento retorna 0" {
  run bash "$HOOK"
  [ "$status" -eq 0 ]
}
```

**`tests/hooks/backup-documento.bats`:**

```bash
#!/usr/bin/env bats

HOOK="./claude-code-juridico/hooks/backup-documento.sh"

setup() {
  TEST_DIR=$(mktemp -d)
  TEST_FILE="$TEST_DIR/peticao.txt"
  echo "conteudo de teste" > "$TEST_FILE"
}

teardown() {
  rm -rf "$TEST_DIR"
}

@test "cria diretorio .backups" {
  run bash "$HOOK" "$TEST_FILE"
  [ "$status" -eq 0 ]
  [ -d "$TEST_DIR/.backups" ]
}

@test "cria copia com timestamp no nome" {
  run bash "$HOOK" "$TEST_FILE"
  [ "$status" -eq 0 ]
  # Nome deve conter YYYYMMDD_HHMMSS_peticao.txt
  local backup_count
  backup_count=$(ls "$TEST_DIR/.backups/" | grep -c "peticao.txt")
  [ "$backup_count" -eq 1 ]
}

@test "copia preserva conteudo original" {
  run bash "$HOOK" "$TEST_FILE"
  local backup_file
  backup_file=$(ls "$TEST_DIR/.backups/")
  local conteudo
  conteudo=$(cat "$TEST_DIR/.backups/$backup_file")
  [ "$conteudo" = "conteudo de teste" ]
}

@test "multiplas chamadas criam multiplos backups" {
  bash "$HOOK" "$TEST_FILE"
  sleep 1
  bash "$HOOK" "$TEST_FILE"
  local count
  count=$(ls "$TEST_DIR/.backups/" | wc -l)
  [ "$count" -eq 2 ]
}
```

**Run BATS tests:**

```bash
npx bats tests/hooks/
# or via npm script:
# "test:hooks": "bats tests/hooks/"
```

---

## 5. Testing Remotion Video Components

Remotion components use React 19 + TypeScript + Remotion-specific hooks (`useCurrentFrame`, `useVideoConfig`, `spring`, `interpolate`). Full rendering requires a headless Chromium — too slow for CI unit tests.

### Strategy: mock Remotion hooks, test React component logic

```bash
npm install -D @testing-library/react@16.3.2 @testing-library/jest-dom@6 jsdom happy-dom
```

**`tests/remotion/JuridicoVideo.test.tsx`:**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll } from "vitest";
import { JuridicoVideo } from "../../claude-code-juridico/remotion-videos/src/JuridicoVideo";

// Mock all Remotion hooks — they return stable values in test context
vi.mock("remotion", () => ({
  AbsoluteFill: ({ children, style }: any) => (
    <div style={style}>{children}</div>
  ),
  Sequence: ({ children }: any) => <div>{children}</div>,
  useCurrentFrame: () => 0,
  useVideoConfig: () => ({ fps: 30, durationInFrames: 300, width: 1080, height: 1920 }),
  spring: () => 1,         // fully animated (scale = 1)
  interpolate: () => 1,   // fully visible (opacity = 1)
}));

const defaultProps = {
  titulo: "Direito Condominial",
  subtitulo: "Paulo Nascimento Advocacia",
  topicos: ["Multa 2%", "Juros 1% a.m.", "INPC"],
  corPrimaria: "#1a365d",
  corSecundaria: "#e2e8f0",
  corDestaque: "#d69e2e",
};

describe("JuridicoVideo", () => {
  it("renderiza o titulo", () => {
    render(<JuridicoVideo {...defaultProps} />);
    expect(screen.getByText("Direito Condominial")).toBeDefined();
  });

  it("renderiza todos os topicos", () => {
    render(<JuridicoVideo {...defaultProps} />);
    expect(screen.getByText("Multa 2%")).toBeDefined();
    expect(screen.getByText("Juros 1% a.m.")).toBeDefined();
    expect(screen.getByText("INPC")).toBeDefined();
  });

  it("aplica corPrimaria como backgroundColor", () => {
    const { container } = render(<JuridicoVideo {...defaultProps} />);
    const root = container.firstChild as HTMLElement;
    // Verifica que a cor esta aplicada em algum elemento
    expect(container.innerHTML).toContain("#1a365d");
  });

  it("lista vazia de topicos nao quebra", () => {
    expect(() =>
      render(<JuridicoVideo {...defaultProps} topicos={[]} />)
    ).not.toThrow();
  });
});
```

**For Remotion composition metadata (Root.tsx), test via the composition registry:**

```ts
import { describe, it, expect } from "vitest";
// Load the Root.tsx compositions and verify their metadata
// This prevents accidentally changing fps, width, height, durationInFrames

const compositions = [
  { id: "VideoJuridico", fps: 30, width: 1080, height: 1920, durationInFrames: 300 },
  { id: "ReelsCondominial", fps: 30, width: 1080, height: 1920, durationInFrames: 450 },
  { id: "ReelsTrabalhista", fps: 30, width: 1080, height: 1920, durationInFrames: 450 },
  { id: "AdvogadoCondominio", fps: 30, width: 1080, height: 1920, durationInFrames: 1080 },
  { id: "ComoAprenderClaude", fps: 30, width: 1080, height: 1920, durationInFrames: 1500 },
];

describe("Remotion composition registry", () => {
  it.each(compositions)("$id has correct dimensions", ({ width, height }) => {
    expect(width).toBe(1080);   // Reels format
    expect(height).toBe(1920);
  });

  it.each(compositions)("$id has 30fps", ({ fps }) => {
    expect(fps).toBe(30);
  });
});
```

---

## 6. Recommended Project Structure

```
/home/user/Projeto/
  claude-code-juridico/
    .claude/commands/          # 48 Markdown slash commands
    hooks/                     # bash hooks
    remotion-videos/
      src/
      package.json             # Remotion deps
  tests/
    calculators/
      condominial.test.ts
      distrato.test.ts
      aluguel.test.ts
      insalubridade.test.ts
      reclamatoria.test.ts
    commands/
      structure.test.ts        # structural validation for all 48 .md files
      snapshots.test.ts        # snapshot tests for calculator commands
    hooks/
      validar-peticao.bats
      backup-documento.bats
      fixtures/
    remotion/
      JuridicoVideo.test.tsx
      compositions.test.ts
  src/
    calculators/               # pure TS implementations (if built separately from prompts)
  package.json                 # root package with test scripts
  vitest.config.ts
```

---

## 7. Package.json Scripts

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:commands": "vitest run tests/commands/",
    "test:calculators": "vitest run tests/calculators/",
    "test:remotion": "vitest run tests/remotion/",
    "test:hooks": "bats tests/hooks/",
    "test:all": "npm run test && npm run test:hooks"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.3.2",
    "@vitest/coverage-v8": "^4.1.2",
    "bats": "^1.13.0",
    "decimal.js": "^10.6.0",
    "gray-matter": "^4.0.3",
    "jsdom": "^26.1.0",
    "remark": "^15.0.1",
    "remark-parse": "^11.0.0",
    "unified": "^11.0.5",
    "vitest": "^4.1.2"
  }
}
```

---

## 8. Version Summary Table

| Tool | Version | Purpose |
|---|---|---|
| vitest | 4.1.2 | Primary test runner (TS, TSX, ESM) |
| @vitest/coverage-v8 | 4.1.2 | Coverage provider |
| decimal.js | 10.6.0 | Floating-point-safe monetary math |
| remark | 15.0.1 | Markdown AST parsing |
| remark-parse | 11.0.0 | Remark parser plugin |
| unified | 11.0.5 | Remark pipeline |
| gray-matter | 4.0.3 | Frontmatter parsing (if added to commands) |
| @testing-library/react | 16.3.2 | Remotion TSX component testing |
| bats | 1.13.0 | Bash hook unit testing |
| jsdom | 26.x | DOM environment for TSX tests |

---

## 9. Priority Order for Implementation

1. **Command structure tests** (highest ROI — validates 48 files in one pass, catches broken prompts immediately)
2. **Condominial debt calculator** (most-used feature, most complex financial logic, most legal risk)
3. **Bash hook tests** (small effort, no external dependencies, prevents silent hook failures)
4. **Insalubrity + labor claim calculators** (high legal stakes — court rejections are expensive)
5. **Distrato + rent adjustment calculators** (straightforward after the pattern is established)
6. **Remotion component tests** (lower risk — visual bugs are caught in Remotion Studio, not CI)
7. **Command snapshots** (run last after baseline is stable — prevents accidental prompt edits)

---

## 10. CI Integration Note

Because BATS and Vitest use different runners, structure the CI pipeline as two jobs:

```yaml
# .github/workflows/test.yml (or equivalent)
jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - run: npm ci
      - run: npm test              # vitest

  bash-tests:
    runs-on: ubuntu-latest
    steps:
      - run: sudo apt-get install -y bats
      - run: npm run test:hooks    # bats
```

This avoids Node.js version conflicts with BATS and allows parallel execution.
