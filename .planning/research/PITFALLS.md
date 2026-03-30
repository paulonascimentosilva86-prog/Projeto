# Pitfalls — Legal Tech Testing & Validation

**Research Date:** 2026-03-28

## 1. Testing LLM Outputs

**The trap:** Trying to unit-test the *content* of Claude's responses. LLM outputs are non-deterministic — the same prompt produces different text each time.

**Warning signs:**
- Tests that pass/fail randomly
- Assertions on exact wording ("deve conter a frase X")
- Tests that break after model updates

**Prevention strategy:**
- Test **structure**, not content: "output has H2 section 'DOS PEDIDOS'" not "output contains exact paragraph"
- Test **calculators separately** from prompts: extract formulas into deterministic functions
- Use **contract testing**: define what sections/elements must exist, not what they say
- Reserve content testing for calculators only (deterministic math)

**Phase:** 1 (foundation — get this right first)

---

## 2. Calculator Precision (Floating Point)

**The trap:** JavaScript's `0.1 + 0.2 = 0.30000000000000004`. In a condominial debt calculation with months of compound interest + INPC correction, small errors accumulate into significant differences.

**Warning signs:**
- Values off by R$ 0.01-0.10 in test assertions
- Rounding inconsistencies between calculators
- Different results depending on calculation order

**Prevention strategy:**
- Use `decimal.js` or integer-based math (store cents, not reais)
- Always round with `ROUND_HALF_UP` (matches Brazilian court standard)
- Test with known tribunal-verified values (JurisCalc/TJDFT as reference)
- Test edge cases: single month, 60+ months, zero principal, leap years

**Phase:** 1 (highest legal risk — wrong values = client harm)

---

## 3. Legal Reference Staleness

**The trap:** Commands and agents reference specific articles, laws, and court precedents (súmulas). These change: TST revises súmulas, new laws are enacted, STJ changes interpretation.

**Warning signs:**
- Citing revoked súmulas (e.g., Súmula 331 TST was partially modified)
- Referencing old article numbers after law amendments
- Missing recent legislation (e.g., Lei 14.382/2022 for adjudicação extrajudicial)

**Prevention strategy:**
- Create a `legal-references.json` catalog extracted from all 48 commands + 6 agents
- Script that greps all legal citations and outputs a checklist for quarterly human review
- Flag high-risk areas: Reforma Trabalhista (Lei 13.467/2017), súmulas TST, CPC 2015 amendments
- Do NOT automate legal accuracy — always human-reviewed

**Phase:** 2 (after calculators are tested, before expanding commands)

---

## 4. Over-Testing Prompts

**The trap:** Writing extensive tests for Markdown prompt templates. When the model updates or prompt engineering improves, all tests break and need rewriting. Testing becomes a burden that slows development.

**Warning signs:**
- More time maintaining tests than writing commands
- Tests that test the prompt structure, not the output quality
- Snapshot tests that are always "updated" without review

**Prevention strategy:**
- Only snapshot-test the **5 highest-volume commands** (execucao-condominial, peticao-trabalhista, peticao-civel, calculadora-condominial, contrato-locacao)
- Test structural invariants only: "has endereçamento section", "has pedidos section"
- Keep prompt tests minimal — 1-2 assertions per command, not 20
- Accept that prompt quality is verified by human use, not automated tests

**Phase:** 2 (after calculator tests prove the pattern works)

---

## 5. Hook Reliability (False Confidence)

**The trap:** Current `validar-peticao.sh` always exits 0. Users see "[VALIDACAO] ✓" and assume the petition is correct, but the hook only checks 5 surface-level patterns via grep. A petition could pass validation but be legally incomplete.

**Warning signs:**
- Hook says "✓" but petition is missing critical legal arguments
- Team stops reviewing petitions because "the system validated it"
- No one notices when the hook script itself has a bug

**Prevention strategy:**
- Make hooks **blocking** (exit 1) for truly mandatory elements: endereçamento, qualificação das partes, pedidos
- Keep **warnings** (exit 0) for elements that vary by petition type (e.g., tutela de urgência is not always needed)
- Add petition-type-aware validation: execução condominial needs planilha de débito, trabalhista needs verbas
- Test the hooks themselves with BATS (Bash Automated Testing System)
- Never claim hooks replace human review — they catch structural omissions only

**Phase:** 1 (quick fix, high impact)

---

## 6. Deadline Calculation Pitfalls

**The trap:** Brazilian procedural deadlines have complex rules: court holidays, recesso forense (Dec 20 - Jan 20), suspensions, and different counting methods (dias úteis vs corridos). Getting this wrong is the most dangerous error in legal practice.

**Warning signs:**
- Counting calendar days instead of business days (CPC art. 219)
- Ignoring recesso forense (art. 220 CPC)
- Not accounting for local court holidays (each tribunal has its own calendar)
- Start date miscalculation (exclusion of start day, inclusion of end day — art. 224 CPC)

**Prevention strategy:**
- Use a well-tested holiday calendar (feriados nacionais + recesso forense are fixed; estaduais/locais are configurable)
- Always count in **dias úteis** for procedural deadlines (CPC art. 219)
- Exception: material law deadlines (prescrição, decadência) count in dias corridos
- Test with known edge cases: deadline falling on weekend, deadline during recesso, deadline spanning feriado prolongado
- Add buffer warnings: "prazo fatal em 3 dias úteis"
- NEVER auto-submit — always inform the user, let them verify

**Phase:** 3 (Radar de Prazos feature — requires careful implementation)

---

## Summary: Risk Matrix

| Pitfall | Severity | Likelihood | Phase |
|---------|----------|------------|-------|
| Calculator precision | **CRITICAL** | High | 1 |
| Hook false confidence | **HIGH** | Already happening | 1 |
| LLM output testing | MEDIUM | High (if done wrong) | 1 |
| Legal reference staleness | **HIGH** | Certain over time | 2 |
| Over-testing prompts | MEDIUM | High | 2 |
| Deadline calculation | **CRITICAL** | High (if built wrong) | 3 |

---

*Pitfalls research: 2026-03-28*
*Review when adding new test categories*
