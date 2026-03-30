# QA System Features — Paulo Nascimento Advocacia Integrada

**Research Date:** 2026-03-28
**Context:** 48 slash commands, 6 specialized agents, 5 legal calculators on Claude Code CLI. No database. No automated tests. Primary risk: a wrong calculation or an incomplete petition causes real financial harm to clients.

---

## Summary

This document categorizes QA features into three tiers:
1. **Table Stakes** — Must have. Directly prevents financial or legal harm.
2. **Differentiators** — High value, strategic. Worth building after table stakes are solid.
3. **Anti-Features** — Things that sound useful but are too complex, have poor ROI, or conflict with the stateless architecture.

---

## Table Stakes (Must Have)

These are the non-negotiable QA features. Skipping any of them leaves the firm exposed to malpractice-grade errors.

---

### 1. Calculator Validation — Financial Precision

**What it is:** Automated tests that run each calculator with known inputs and assert deterministic, correct outputs.

**Why it's table stakes:**
A wrong condominial debt figure, a miscalculated rent adjustment, or an underestimated labor claim creates direct financial harm — either to the client (undercollection) or to the firm (professional liability). Claude as an LLM can make arithmetic errors. The only way to catch them is to run the calculation with known values and compare against expected outputs.

**Calculators to cover:**

| Calculator | Command | Key Risk | What to Validate |
|---|---|---|---|
| Condominial Debt | `/calculadora-condominial` | Compound error across 12+ months | Multa 2%, juros 1%/month pro rata die, INPC accumulation, honorarios 30%, monthly subtotals, grand total |
| Rent Adjustment | `/calculadora-aluguel` | Wrong index or wrong base period | IGP-M/IPCA/INPC application, annualized vs. accumulated calculation, edge case: negative IGP-M |
| Distrato Imobiliario | `/calculadora-distrato` | Lei 13.786/2018 penalty caps | Retention percentages (25%/50%), VGV base, penalty within legal ceiling |
| Labor Claim (Reclamatoria) | `/simulador-reclamatoria` | Cascading reflexo errors | FGTS 8% base, multa 40%, overtime rate (220h base), aviso previo cap (90 days), dano moral tiers (art. 223-G CLT) |
| Insalubridade/Periculosidade | `/insalubridade-periculosidade` | Wrong base (minimum wage vs. salary) | Grau minimo/medio/maximo (10/20/40%), reflexos on 13th, ferias, FGTS |

**Test approach:** Bash scripts with fixed inputs and `grep`/`awk` assertions on numeric output. No external dependencies. Run as pre-commit or on-demand.

**Complexity: Low-Medium.** Each calculator has well-defined formulas. The hard part is building a representative test fixture that covers edge cases (pro rata days, INPC variability placeholder). Estimativa: 2-4 days.

---

### 2. Petition Structure Validation — Blocking Hooks

**What it is:** A `PostToolUse` hook that returns `exit 1` when a generated petition is missing mandatory legal elements, blocking the output until the problem is fixed.

**Why it's table stakes:**
The existing `validar-peticao.sh` already checks 5 elements but always exits 0 — alerts are ignorable. This is documented as a MEDIUM concern in CONCERNS.md. In practice, a petition without an `endereçamento`, a `pedidos` section, or a `qualificação das partes` is void and will be returned by the court.

**Elements requiring hard blocks (exit 1):**

| Element | Why Blocking | Detection Pattern |
|---|---|---|
| Endereçamento | Without it, the petition has no recipient | `excelentissimo\|meritissimo\|ao juizo` |
| Qualificação das partes | Identity of plaintiff and defendant is procedurally required | `qualificado\|qualificacao\|CPF\|CNPJ` |
| Dos Pedidos | A petition without a request is literally nothing | `dos pedidos\|requer\|requerem` |

**Elements that can remain soft warnings (exit 0):**

| Element | Why Warning Only |
|---|---|
| Dos Fatos | Some motions (embargos, impugnação) have abbreviated fact sections |
| Fundamentação Jurídica | Some urgent motions defer full legal basis |
| Valor da Causa | Required but often forgotten; warning is appropriate |

**Extended validation — petition-type-aware checks:**
Beyond generic structure, specific petition types have additional mandatory elements:

- **Execução Condominial** (`/execucao-condominial`): Must include the debt schedule (planilha de débito). Missing planilha = petition rejected at filing.
- **Petição Trabalhista** (`/peticao-trabalhista`): Must identify CTPS data or contract term; must have a pedido de tutela for urgent cases.
- **Ação de Despejo** (`/acao-despejo`): Must specify the legal ground (falta de pagamento, fim de contrato, etc.) as it determines procedure.
- **Distrato Imobiliário** (`/distrato-imobiliario`): Must reference Lei 13.786/2018 explicitly.

**Complexity: Low.** The shell hook infrastructure already exists. Converting exit 0 to exit 1 for critical elements takes one hour. Adding petition-type awareness takes 1-2 days (one condition block per petition type).

---

### 3. Legal Reference Validation — Agent Base Legal Integrity

**What it is:** A structured review process (checklist + semi-automated grep) to verify that legal citations in agents and commands are current, correctly formatted, and not referencing superseded norms.

**Why it's table stakes:**
The 6 agents contain inline legal bases (leis, súmulas, artigos). CONCERNS.md flags this as MEDIUM risk: "Referências a leis, súmulas e jurisprudência podem ficar desatualizadas." Claude's training has a knowledge cutoff. Commands cite Reforma Trabalhista provisions, Lei do Inquilinato amendments, and TST súmulas that can be revised.

**What to validate:**

| Area | Key References | Risk |
|---|---|---|
| Trabalhista | Art. 477 CLT (aviso previo), Súmula 437 TST (intrajornada), Art. 223-G CLT (dano moral), Art. 791-A CLT (honorarios) | Post-Reforma Trabalhista (Lei 13.467/2017) revisions; ongoing TST revisão |
| Condominial | Art. 1.336 CC (multa 2%), Art. 784 CPC (título executivo extrajudicial) | Stable; low risk |
| Imobiliário | Lei 8.245/91 (locações), Lei 13.786/2018 (distrato), Lei 14.118/2021 (MCMV) | Lei 14.711/2023 (Marco Legal das Garantias) may affect locação commands |
| Cível | Art. 85 CPC (honorarios), Art. 702 CPC (embargos) | Stable; low risk |
| Família | Art. 1.694-1.710 CC (alimentos), Resolução CNJ 35/2007 (extrajudicial) | Stable; low risk |

**Validation mechanism:**
1. A `references-audit.sh` script greps all `.md` files for legal citation patterns (`art\. \d`, `lei \d`, `sumula \d`) and outputs a structured list.
2. A human reviewer (or agent) checks the list against current law quarterly.
3. A format linter ensures citations follow the office convention (`art. 1.336, §1º, CC` not free-form text).

**Complexity: Low-Medium.** Automated extraction is simple bash + regex. The hard part is the legal review itself, which requires human expertise. The tool reduces that effort from "read everything" to "review a list." Estimativa: 1-2 days for tooling, ongoing quarterly review.

---

## Differentiators

These features go beyond preventing errors and add strategic value. They should be built after table stakes are solid.

---

### 4. Radar de Prazos (Deadline Intelligence)

**What it is:** A command that takes a trigger event (petition filed, decision served, citation completed) and generates a complete deadline schedule with dates, legal basis, holidays, and suspension flags.

**Why it's a differentiator:**
Missing a deadline is the single most consequential error in litigation — it cannot be undone. No existing command covers this. The PROJECT.md already identifies this as the first strategic skill to build.

**What it covers:**

| Trigger | Deadlines Generated |
|---|---|
| Citação em ação | Contestação (15 dias CPC geral; 30 dias Fazenda Pública) |
| Sentença prolatada | Apelação (15 dias), Embargos de Declaração (5 dias) |
| Acórdão publicado | RE/REsp (15 dias), Agravo (15 dias) |
| Notificação extrajudicial | Response window, prescription clock restart |
| Citação trabalhista | Audiência (1a tentativa), contestação |
| Prazo condominial | Defesa do executado (3 dias embargos à execução, art. 915 CPC) |

**Intelligence layer (differentiating beyond a simple calculator):**
- Brazilian national holidays auto-excluded
- Tribunal-specific recesses (Jan, Jul) flagged
- Suspensions under art. 220 CPC (Aug 20 - Sep 20) flagged
- "Working days" vs. "calendar days" distinction enforced
- Alert tiers: 10 days out (yellow), 5 days (orange), 1 day (red)

**Complexity: Medium.** The calculation logic is straightforward but the holiday/suspension calendar requires a maintained data fixture. No real-time API needed — a bundled calendar file works. Estimativa: 3-5 days.

---

### 5. Document Data Extraction

**What it is:** A command that ingests a document (holerite, CTPS, contrato de trabalho, contrato de locação) and extracts structured data fields ready for use in other commands.

**Why it's a differentiator:**
Currently, the user must manually transcribe values from source documents into commands like `/simulador-reclamatoria` or `/calculadora-condominial`. This is error-prone and time-consuming. An extractor closes the loop between "raw document" and "calculated output."

**Document types and extracted fields:**

| Document | Extracted Fields | Downstream Use |
|---|---|---|
| Holerite (payslip) | Salario base, adicionais, INSS, FGTS, descontos, competencia | `/simulador-reclamatoria`, `/insalubridade-periculosidade` |
| CTPS (work record) | Data admissao, data demissao, funcao, salario registrado, anotacoes | `/peticao-trabalhista`, `/simulador-reclamatoria` |
| Contrato de Trabalho | Carga horaria, salario, clausulas de adicional, prazos | `/defesa-trabalhista`, `/justa-causa` |
| Contrato de Locação | Aluguel vigente, indice, data inicio, reajuste, multa contratual | `/calculadora-aluguel`, `/acao-despejo` |
| Boleto/Demonstrativo condominial | Competencias, valores, vencimentos, multas ja aplicadas | `/calculadora-condominial`, `/execucao-condominial` |

**Complexity: Medium.** Within Claude Code CLI, this relies entirely on the LLM's extraction capability from pasted text. No OCR, no file parsing library. The command is essentially a highly structured extraction prompt with output schema validation. Estimativa: 2-3 days.

**Constraint:** Without OCR, users must paste document text. PDF extraction requires the user to copy-paste content or use an external tool first. This is acceptable given the platform constraint (no backend).

---

### 6. Assessoria para Construtoras (Construction Company Advisory Package)

**What it is:** A specialized command bundle covering the legal workflow of real estate developers: memorial de incorporação, quadro de áreas NBR 12.721, patrimônio de afetação, RET (Regime Especial de Tributação), and end-buyer contract templates.

**Why it's a differentiator:**
The PROJECT.md notes "Foco imobiliario: construtoras" as a growth area. This is a high-ticket advisory niche. No existing command covers incorporação or patrimônio de afetação, which are highly specialized. A firm with this capability stands apart from generalist competitors.

**Command bundle:**

| Command | Function | Legal Basis |
|---|---|---|
| `/memorial-incorporacao` | Checklist and draft for Lei 4.591/64 registration | Lei 4.591/64 art. 32 |
| `/quadro-areas-nbr` | NBR 12.721 area table with private, common, and total calculations | NBR 12.721:2006 |
| `/patrimonio-afetacao` | Patrimônio de afetação setup: checklist, RET election, segregation docs | Lei 10.931/2004 |
| `/contrato-promessa-cv` | Buyer contract compliant with Lei 13.786/2018 and CDC | Lei 13.786/2018, CDC art. 54 |
| `/habite-se-checklist` | Documentation checklist for habite-se and CND | Municipal codes + INSS |

**QA considerations for this package:**
- Contract calculations (penalty caps per Lei 13.786/2018) should be validated with the same rigor as the existing distrato calculator.
- Area calculations must follow NBR 12.721 exactly — errors here have CRI registration implications.

**Complexity: High.** Incorporação law is dense and highly technical. Each command requires deep domain accuracy. This is the most complex feature in this document. Estimativa: 2-3 weeks across the full bundle. Recommended to build commands incrementally, starting with `/memorial-incorporacao` and `/contrato-promessa-cv`.

---

## Anti-Features (Do Not Build)

These features were considered and explicitly rejected. Building them would consume disproportionate effort, conflict with architectural constraints, or create maintenance liabilities.

---

### A. Real-Time Index API Integration (INPC, IGP-M, IPCA)

**Why not:** The calculators reference live indices (INPC from BCB, IGP-M from FGV, IPCA from IBGE). Integrating real-time API calls would require a backend, API keys, error handling for downtime, and ongoing maintenance. The current model (user provides the index from Calculadora do Cidadão BCB) is deliberate and low-risk. The platform is stateless by design.

**Alternative:** Keep the current "user provides index" model. Add a comment in the calculator output that links to the official BCB calculator for verification.

**Complexity if built anyway: Very High.** Backend required. Out of scope for Claude Code CLI.

---

### B. Jurimetria / Judge/Court Analytics

**Why not:** Analyzing win rates by judge or court requires a continuously updated database of decisions. No such database is bundled or available via free API. Any implementation would be based on Claude's training data, which is unverifiable, non-exhaustive, and frozen at a knowledge cutoff — making the output unreliable for legal strategy decisions.

**Risk if built:** The firm could make strategic decisions (e.g., accepting or rejecting a settlement) based on fabricated statistics. This is worse than having no data.

**Complexity if built anyway: Extreme.** Requires proprietary court data feed or commercial jurimetry service (DataJud, Jusbrasil API). Out of scope permanently.

---

### C. Dashboard de Produtividade

**Why not:** A productivity dashboard requires data persistence across sessions. Every session in Claude Code CLI is independent — there is no state store. Tracking metrics like "petitions generated this week," "cases by practice area," or "calculator usage" would require a database and a frontend, which is a full product pivot, not a QA feature.

**Complexity if built anyway: Very High.** Requires SQLite/PostgreSQL, a web UI or CLI persistence layer. Architectural mismatch with current stack.

---

### D. Simulador de Cenários Processuais (Process Outcome Simulation)

**Why not:** Simulating litigation outcomes ("what are my chances if I go to trial?") requires statistically reliable data about specific courts, judges, and claim types. This data doesn't exist in a reliable, accessible form. Claude can generate plausible-sounding probabilities that are not grounded in real statistics — a dangerous output in a legal context.

**Risk if built:** Attorneys might over-rely on simulated probabilities for settlement decisions. This creates malpractice exposure.

**Complexity if built anyway: Extreme.** Same blockers as Jurimetria.

---

### E. Lead Qualification / CRM Integration

**Why not:** Out of scope for the tool's identity. Claude Code Jurídico is a document generation and legal analysis tool, not a CRM. Mixing lead qualification into the command ecosystem would dilute the product's focus and create complexity without legal value.

**Complexity if built anyway: High.** Requires integration with external CRM tools or a custom contact management system.

---

### F. Automated INSS / eSocial Compliance Monitoring

**Why not:** Compliance monitoring for eSocial, INSS, and FGTS requires real-time integration with Receita Federal and FGTS APIs, which require authenticated access (CPF/CNPJ of the employer). This is a payroll accounting product, not a legal document assistant. Building it would require OAuth flows, secure credential storage, and regulated data handling.

**Complexity if built anyway: Very High.** Regulated API access, credential management, and legal responsibility for accuracy.

---

## Priority Order

| Priority | Feature | Category | Effort |
|---|---|---|---|
| 1 | Calculator Validation (all 5) | Table Stakes | 2-4 days |
| 2 | Blocking Petition Hook (exit 1) | Table Stakes | 1-2 days |
| 3 | Legal Reference Audit Tooling | Table Stakes | 1-2 days |
| 4 | Radar de Prazos | Differentiator | 3-5 days |
| 5 | Document Data Extraction | Differentiator | 2-3 days |
| 6 | Construtoras Bundle | Differentiator | 2-3 weeks |

Build in this order. Do not start Differentiators until Table Stakes are green.

---

*Research: 2026-03-28*
*Scope: Paulo Nascimento - Advocacia Integrada QA System*
