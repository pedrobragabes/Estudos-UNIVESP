export default function FormulaSheet({ onBack }) {
  const sections = [
    {
      title: "L'Hospital",
      color: "#f59e0b",
      items: [
        ["Condicao", "Limite resulta em 0/0 ou \u221e/\u221e"],
        ["Formula", "lim f(x)/g(x) = lim f'(x)/g'(x)"],
        ["Limite fundamental", "lim(x\u21920) sen(x)/x = 1"],
        ["Repetir?", "Sim, se resultado ainda for 0/0 ou \u221e/\u221e"],
      ]
    },
    {
      title: "Derivadas Fundamentais",
      color: "#22c55e",
      items: [
        ["(x^n)'", "n\u00b7x^(n-1)"],
        ["(e^x)'", "e^x"],
        ["(ln x)'", "1/x"],
        ["(sen x)'", "cos x"],
        ["(cos x)'", "-sen x"],
        ["(constante)'", "0"],
      ]
    },
    {
      title: "Regras de Derivacao",
      color: "#6366f1",
      items: [
        ["Produto", "(f\u00b7g)' = f'\u00b7g + f\u00b7g'"],
        ["Quociente", "(f/g)' = (f'\u00b7g \u2212 f\u00b7g') / g\u00b2"],
        ["Cadeia", "[f(g(x))]' = f'(g(x)) \u00b7 g'(x)"],
      ]
    },
    {
      title: "Analise de Funcoes",
      color: "#ec4899",
      items: [
        ["Crescente", "f'(x) > 0"],
        ["Decrescente", "f'(x) < 0"],
        ["Ponto critico", "f'(p) = 0"],
        ["Minimo local", "f'(p)=0 e f''(p) > 0  (\u222a)"],
        ["Maximo local", "f'(p)=0 e f''(p) < 0  (\u2229)"],
        ["Pt de inflexao", "f''(x) = 0 (e muda de sinal)"],
      ]
    },
    {
      title: "Integrais",
      color: "#8b5cf6",
      items: [
        ["\u222bx^n dx", "x^(n+1)/(n+1) + C"],
        ["\u222be^x dx", "e^x + C"],
        ["\u222b(1/x) dx", "ln|x| + C"],
        ["\u222bsen(x) dx", "-cos(x) + C"],
        ["\u222bcos(x) dx", "sen(x) + C"],
        ["Teo. Fundamental", "\u222b[a,b] f dx = F(b) \u2212 F(a)  onde F'=f"],
        ["Substituicao", "u=g(x), du=g'(x)dx  \u2192  \u222bf(u)du"],
      ]
    },
    {
      title: "Cinematica",
      color: "#06b6d4",
      items: [
        ["Velocidade", "v(t) = x'(t)"],
        ["Aceleracao", "a(t) = v'(t)"],
        ["Posicao", "x(t) = \u222bv(t)dt"],
      ]
    },
  ];

  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <button
          onClick={onBack}
          style={{ background: "rgba(255,255,255,.08)", color: "#94a3b8", padding: "6px 12px", fontSize: 12, border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "inherit" }}
        >
          &larr; Menu
        </button>
        <span style={{ fontSize: 15, fontWeight: 700 }}>Folha de Formulas</span>
        <span style={{ fontSize: 11, color: "#64748b" }}>Calculo I</span>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        {sections.map(sec => (
          <div
            key={sec.title}
            style={{ background: "rgba(255,255,255,.03)", border: `1px solid ${sec.color}30`, borderLeft: `3px solid ${sec.color}`, borderRadius: 10, padding: "12px 14px" }}
          >
            <div style={{ fontSize: 11, fontWeight: 600, color: sec.color, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>
              {sec.title}
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                {sec.items.map(([label, formula]) => (
                  <tr key={label}>
                    <td style={{ fontSize: 11, color: "#64748b", paddingRight: 12, paddingBottom: 5, width: "35%", verticalAlign: "top" }}>{label}</td>
                    <td style={{ fontSize: 12, color: "#e2e8f0", paddingBottom: 5, whiteSpace: "pre-wrap", fontFamily: "inherit" }}>{formula}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}
