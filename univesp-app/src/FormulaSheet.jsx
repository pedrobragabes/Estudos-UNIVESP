export default function FormulaSheet({ onBack }) {
  const sections = [
    {
      title: "Conectivos Logicos",
      color: "#f59e0b",
      items: [
        ["Conjuncao", "A and B: so e verdadeira quando A e B sao verdadeiras"],
        ["Disjuncao", "A or B: so e falsa quando A e B sao falsas"],
        ["XOU", "A xor B: verdadeira quando os valores sao diferentes"],
        ["Negacao", "not A: inverte o valor logico de A"],
      ]
    },
    {
      title: "Condicional",
      color: "#22c55e",
      items: [
        ["A -> B", "So e falsa quando A = verdadeiro e B = falso"],
        ["Leitura", "Se A, entao B"],
        ["A <-> B", "Equivale a (A -> B) and (B -> A)"],
        ["Interpretacao", "A e B precisam ter o mesmo valor logico"],
      ]
    },
    {
      title: "Tautologia e Contradicao",
      color: "#6366f1",
      items: [
        ["Tautologia", "Sempre verdadeira (ex: A or not A)"],
        ["Contradicao", "Sempre falsa (ex: A and not A)"],
        ["Uso em prova", "Valida argumento quando formula final vira tautologia"],
      ]
    },
    {
      title: "Equivalencias",
      color: "#ec4899",
      items: [
        ["Definicao", "A e B sao equivalentes se A <-> B e tautologia"],
        ["Comutativa", "A or B <-> B or A ; A and B <-> B and A"],
        ["Associativa", "(A or B) or C <-> A or (B or C)"],
        ["Distributiva", "A and (B or C) <-> (A and B) or (A and C)"],
      ]
    },
    {
      title: "Leis Classicas",
      color: "#8b5cf6",
      items: [
        ["Neutros", "A or 0 -> A ; A and 1 -> A"],
        ["Complementares", "A or not A -> 1 ; A and not A -> 0"],
        ["De Morgan", "not(A or B) <-> (not A and not B)"],
        ["De Morgan", "not(A and B) <-> (not A or not B)"],
      ]
    },
    {
      title: "Simplificacao Rapida",
      color: "#06b6d4",
      items: [
        ["Expressao", "A and not(A and B)"],
        ["Passo 1", "A and (not A or not B)"],
        ["Passo 2", "(A and not A) or (A and not B)"],
        ["Resultado", "A and not B"],
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
        <span style={{ fontSize: 11, color: "#64748b" }}>COM150</span>
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
