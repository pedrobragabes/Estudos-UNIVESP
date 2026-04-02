import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const SUBJECT_NAMES = {
  calculo: "Calculo I",
  python: "Algoritmos Python",
  computacao: "Conceitos de Computacao",
};

const SYSTEM_PROMPTS = {
  calculo: `Voce e um tutor de Calculo I da UNIVESP. Seja direto e objetivo. Use exemplos concretos.
Topicos da disciplina:
- L'Hospital: 0/0 ou inf/inf -> deriva numerador e denominador separadamente
- Regra do produto: (f*g)' = f'g + fg'
- Regra do quociente: (f/g)' = (f'g - fg') / g^2
- Regra da cadeia: [f(g(x))]' = f'(g(x)) * g'(x)
- Derivadas fundamentais: (x^n)'=nx^(n-1), (e^x)'=e^x, (ln x)'=1/x, (sen x)'=cos x, (cos x)'=-sen x
- Crescimento: f'(x)>0 crescente, f'(x)<0 decrescente
- Maximos/minimos: f'(p)=0 e f''(p)>0 -> minimo; f''(p)<0 -> maximo
- Taxa de variacao: v(t)=x'(t), a(t)=v'(t)
- Integrais: integral de x^n = x^(n+1)/(n+1)+C, de e^x = e^x+C, de 1/x = ln|x|+C
Responda em portugues. Seja conciso. Explique passo a passo quando o aluno pedir.`,

  python: `Voce e um tutor de Algoritmos e Programacao I (Python) da UNIVESP.
O aluno e programador profissional (Node.js/React) - nao explique conceitos triviais de programacao.
Foque nas pegadinhas academicas que caem na prova:
- input() SEMPRE retorna str
- range(n): 0 ate n-1, NAO inclui o fim. range(a,b,passo)
- // divisao inteira, % modulo (resto), ** potencia
- Indentacao obrigatoria (4 espacos)
- Escopo: variavel local NAO altera global sem 'global'
- return devolve valor, print() so exibe na tela. Sem return -> retorna None
- 3 tipos de erro: sintaxe (codigo invalido), runtime (crash ex: 1/0), logico (roda mas resultado errado)
- bool(0)=False, bool('')=False, bool([])=False
Responda em portugues. Curto e direto. Exemplos de codigo quando util.`,

  computacao: `Voce e um tutor de Conceitos de Computacao (COM140) da UNIVESP.
O aluno usa Docker/Linux/Proxmox - foque em nomenclatura academica formal, nao explique o que e virtualizacao.
Topicos:
- Geracoes: 1a valvulas (ENIAC 1946), 2a transistores, 3a circuitos integrados, 4a microprocessadores, 5a IA/quantica
- Binario/hex/ASCII: bit=0/1, byte=8bits, 1KB=1024B. 'A'=65, 'a'=97, '0'=48. FF hex=255
- Complemento de 2 (negativos): inverte bits + soma 1
- Portas: AND (ambas 1->1), OR (qualquer 1->1), NOT (inverte), XOR (diferentes->1), NAND=NOT(AND), NOR=NOT(OR)
- De Morgan: NOT(A AND B)=NOT A OR NOT B; NOT(A OR B)=NOT A AND NOT B
- Von Neumann: CPU(ULA+UC) + Memoria (dados E instrucoes juntos) + E/S + Barramento
- Hierarquia: Registradores > Cache > RAM > SSD/HD
- RAM: volatil, leitura/escrita. ROM: nao-volatil, so leitura
- Processo (memoria propria) vs Thread (compartilha memoria)
- Compilador (traduz tudo antes) vs Interpretador (linha a linha, Python)
- OSI 7 camadas: 7.Aplicacao 6.Apresentacao 5.Sessao 4.Transporte 3.Rede 2.Enlace 1.Fisica
- TCP: confiavel/ordenado. UDP: rapido/sem garantia
- IaaS (EC2), PaaS (Heroku), SaaS (Gmail)
Responda em portugues. Seja direto. Destaque numeros e definicoes formais que caem em prova.`,
};

const QUICK_ACTIONS = {
  calculo: [
    "Explica L'Hospital passo a passo",
    "Regra da cadeia com exemplo",
    "Como identificar maximo vs minimo?",
    "Integral por substituicao como funciona?",
  ],
  python: [
    "Diferenca entre print e return",
    "Por que range nao inclui o fim?",
    "Escopo local vs global - exemplo",
    "Tipos de erro com exemplos",
  ],
  computacao: [
    "Camadas OSI de cima pra baixo",
    "De Morgan com exemplo pratico",
    "RAM vs Cache vs Registrador",
    "IaaS vs PaaS vs SaaS diferenca",
  ],
};

export default function GeminiTutor({ subject, initialQuestion, onBack }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState(initialQuestion || "");
  const [loading, setLoading] = useState(false);
  const [currentSubject, setCurrentSubject] = useState(subject || "calculo");
  const chatRef = useRef(null);
  const bottomRef = useRef(null);

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  useEffect(() => {
    chatRef.current = null;
    setMessages([
      {
        role: "ai",
        text: `Ola! Sou seu tutor de ${SUBJECT_NAMES[currentSubject]}.\nQual parte voce nao entendeu? Pode perguntar qualquer coisa.`,
      },
    ]);
  }, [currentSubject]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;

    if (!apiKey) {
      setMessages((m) => [
        ...m,
        {
          role: "ai",
          text: "API key nao configurada.\nAdicione no arquivo .env.local:\nVITE_GEMINI_API_KEY=sua_chave_aqui\n\nDepois reinicie o servidor (npm run dev).",
        },
      ]);
      return;
    }

    setInput("");
    setMessages((m) => [...m, { role: "user", text: msg }]);
    setLoading(true);

    try {
      if (!chatRef.current) {
        const { GoogleGenerativeAI } = await import("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: "gemini-3.1-flash-lite-preview",
          systemInstruction: SYSTEM_PROMPTS[currentSubject],
        });
        chatRef.current = model.startChat({ history: [] });
      }

      const result = await chatRef.current.sendMessage(msg);
      setMessages((m) => [...m, { role: "ai", text: result.response.text() }]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        { role: "ai", text: `Erro: ${e.message}` },
      ]);
    }

    setLoading(false);
  };

  const SUBJECTS = [
    { id: "calculo", label: "Calculo I", color: "#f59e0b" },
    { id: "python", label: "Python", color: "#22c55e" },
    { id: "computacao", label: "Computacao", color: "#8b5cf6" },
  ];

  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <button
          onClick={onBack}
          style={{
            background: "rgba(255,255,255,.08)", color: "#94a3b8",
            padding: "6px 12px", fontSize: 12, border: "none",
            borderRadius: 8, cursor: "pointer", fontFamily: "inherit",
          }}
        >
          &larr; Menu
        </button>
        <span style={{ fontSize: 16, fontWeight: 700 }}>Tutor IA</span>
        <span style={{ fontSize: 11, color: "#64748b" }}>gemini-3-flash-preview</span>
      </div>

      {/* Subject tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        {SUBJECTS.map((s) => (
          <button
            key={s.id}
            onClick={() => setCurrentSubject(s.id)}
            style={{
              padding: "6px 14px", borderRadius: 8, fontFamily: "inherit",
              border: `1px solid ${currentSubject === s.id ? s.color : "rgba(255,255,255,.1)"}`,
              background: currentSubject === s.id ? `${s.color}18` : "transparent",
              color: currentSubject === s.id ? s.color : "#64748b",
              cursor: "pointer", fontSize: 12, fontWeight: currentSubject === s.id ? 600 : 400,
              transition: "all .15s",
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Chat window */}
      <div
        style={{
          background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.08)",
          borderRadius: 12, height: 360, overflowY: "auto", padding: "14px 16px",
          marginBottom: 10,
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              marginBottom: 12, display: "flex",
              justifyContent: m.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "82%", padding: "10px 14px", borderRadius: 10,
                fontSize: 13, lineHeight: 1.6,
                background: m.role === "user"
                  ? "rgba(99,102,241,.25)"
                  : "rgba(255,255,255,.05)",
                border: `1px solid ${m.role === "user" ? "rgba(99,102,241,.35)" : "rgba(255,255,255,.08)"}`,
                color: "#e2e8f0",
              }}
            >
              {m.role === "user" ? (
                <span style={{ whiteSpace: "pre-wrap" }}>{m.text}</span>
              ) : (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ children }) => <p style={{ margin: "0 0 8px", lineHeight: 1.6 }}>{children}</p>,
                    strong: ({ children }) => <strong style={{ color: "#f1f5f9", fontWeight: 700 }}>{children}</strong>,
                    em: ({ children }) => <em style={{ color: "#cbd5e1" }}>{children}</em>,
                    code: ({ inline, children }) =>
                      inline ? (
                        <code style={{
                          background: "rgba(99,102,241,.2)", padding: "1px 5px",
                          borderRadius: 4, fontFamily: "monospace", fontSize: 12, color: "#a5b4fc",
                        }}>{children}</code>
                      ) : (
                        <pre style={{
                          background: "rgba(0,0,0,.35)", border: "1px solid rgba(255,255,255,.1)",
                          borderRadius: 6, padding: "10px 12px", overflowX: "auto",
                          margin: "6px 0",
                        }}>
                          <code style={{ fontFamily: "monospace", fontSize: 12, color: "#a5b4fc" }}>{children}</code>
                        </pre>
                      ),
                    ul: ({ children }) => <ul style={{ margin: "4px 0", paddingLeft: 18 }}>{children}</ul>,
                    ol: ({ children }) => <ol style={{ margin: "4px 0", paddingLeft: 18 }}>{children}</ol>,
                    li: ({ children }) => <li style={{ margin: "2px 0" }}>{children}</li>,
                    h1: ({ children }) => <h1 style={{ fontSize: 15, margin: "8px 0 4px", color: "#f1f5f9" }}>{children}</h1>,
                    h2: ({ children }) => <h2 style={{ fontSize: 14, margin: "8px 0 4px", color: "#f1f5f9" }}>{children}</h2>,
                    h3: ({ children }) => <h3 style={{ fontSize: 13, margin: "6px 0 3px", color: "#f1f5f9" }}>{children}</h3>,
                    blockquote: ({ children }) => (
                      <blockquote style={{
                        borderLeft: "3px solid #6366f1", paddingLeft: 10,
                        margin: "6px 0", color: "#94a3b8",
                      }}>{children}</blockquote>
                    ),
                  }}
                >
                  {m.text}
                </ReactMarkdown>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 5, padding: "8px 4px" }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: 7, height: 7, borderRadius: "50%", background: "#6366f1",
                  animation: `dot-pulse .9s ${i * 0.25}s infinite`,
                }}
              />
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick actions */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }}>
        {QUICK_ACTIONS[currentSubject].map((q) => (
          <button
            key={q}
            onClick={() => send(q)}
            style={{
              padding: "4px 10px", borderRadius: 6, fontFamily: "inherit",
              border: "1px solid rgba(255,255,255,.1)", background: "rgba(255,255,255,.03)",
              color: "#94a3b8", cursor: "pointer", fontSize: 11, transition: "all .15s",
            }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="O que voce nao entendeu? (Enter para enviar, Shift+Enter para nova linha)"
          rows={3}
          style={{
            flex: 1, padding: "10px 14px",
            background: "rgba(255,255,255,.06)",
            border: "1px solid rgba(255,255,255,.12)",
            borderRadius: 8, color: "#e2e8f0", fontSize: 13,
            fontFamily: "inherit", outline: "none",
            resize: "none", lineHeight: 1.5,
          }}
        />
        <button
          onClick={() => send()}
          disabled={loading || !input.trim()}
          style={{
            padding: "10px 18px",
            background: loading || !input.trim() ? "rgba(99,102,241,.2)" : "#6366f1",
            border: "none", borderRadius: 8, color: "white",
            cursor: loading || !input.trim() ? "default" : "pointer",
            fontSize: 14, fontFamily: "inherit", transition: "all .15s",
          }}
        >
          {loading ? "..." : "\u2192"}
        </button>
      </div>

      <style>{`
        @keyframes dot-pulse {
          0%, 100% { opacity: .2; transform: scale(.8); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}
