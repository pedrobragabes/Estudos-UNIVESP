import { useState, useEffect, useCallback } from "react";

const FLASHCARDS = {
  calculo: {
    name: "Cálculo I", icon: "∫", color: "#f59e0b",
    cards: [
      { q: "Quando usar a 1ª Regra de L'Hospital?", a: "Quando lim f(x)/g(x) resulta em 0/0.\nDeriva numerador e denominador separadamente:\nlim f(x)/g(x) = lim f'(x)/g'(x)", difficulty: 1, topic: "L'Hospital" },
      { q: "Quando usar a 2ª Regra de L'Hospital?", a: "Quando lim f(x)/g(x) resulta em ∞/∞.\nMesma regra, pode aplicar mais de uma vez.", difficulty: 1, topic: "L'Hospital" },
      { q: "Resolva: lim(x→0) (3x²+5x)/sen(x)", a: "0/0 → L'Hospital\nDeriva cima: 6x+5\nDeriva baixo: cos(x)\nlim(x→0) (6x+5)/cos(x) = 5/1 = 5", difficulty: 2, topic: "L'Hospital" },
      { q: "Resolva: lim(x→+∞) eˣ/3x²", a: "∞/∞ → L'Hospital (2 vezes)\n= lim eˣ/6x = lim eˣ/6 = +∞", difficulty: 2, topic: "L'Hospital" },
      { q: "Regra do Produto: (f·g)' = ?", a: "f'·g + f·g'\nEx: (2x)eˣ → 2eˣ + 2xeˣ", difficulty: 1, topic: "Derivação" },
      { q: "Derive: f(x) = (3x²+5)eˣ", a: "Produto: f' = 6x·eˣ + (3x²+5)·eˣ\n= (3x²+6x+5)eˣ", difficulty: 2, topic: "Derivação" },
      { q: "Regra do Quociente: (f/g)' = ?", a: "(f'·g − f·g') / g²", difficulty: 1, topic: "Derivação" },
      { q: "Derive: f(x) = 2x/(x+1)", a: "f' = [2(x+1) − 2x·1]/(x+1)² = 2/(x+1)²", difficulty: 2, topic: "Derivação" },
      { q: "Regra da Cadeia: [f(g(x))]' = ?", a: "f'(g(x)) · g'(x)\nDeriva fora mantendo dentro × derivada de dentro.", difficulty: 1, topic: "Cadeia" },
      { q: "Derive: sen(x²+5x)", a: "cos(x²+5x) · (2x+5)", difficulty: 2, topic: "Cadeia" },
      { q: "Derive: (x²+5x)¹⁰", a: "10(x²+5x)⁹ · (2x+5)", difficulty: 2, topic: "Cadeia" },
      { q: "Como saber se f é crescente ou decrescente?", a: "f'(x) > 0 → crescente\nf'(x) < 0 → decrescente", difficulty: 1, topic: "Comportamento" },
      { q: "f(x)=4x³+5x². Pontos críticos?", a: "f'=12x²+10x = 2x(6x+5)=0\nx=0 ou x=−5/6", difficulty: 2, topic: "Comportamento" },
      { q: "Teste da 2ª derivada para max/min?", a: "No ponto crítico p (f'(p)=0):\nf''(p)>0 → MÍNIMO (∪)\nf''(p)<0 → MÁXIMO (∩)", difficulty: 1, topic: "Max/Min" },
      { q: "f(x)=4x³+5x². Classifique os pontos críticos.", a: "f''(x)=24x+10\nf''(0)=10>0 → MÍNIMO\nf''(−5/6)=−10<0 → MÁXIMO", difficulty: 2, topic: "Max/Min" },
      { q: "Relação posição, velocidade, aceleração?", a: "v(t)=x'(t)  a(t)=v'(t)\nx(t)=∫v(t)dt  v(t)=∫a(t)dt", difficulty: 1, topic: "Taxa" },
      { q: "v(t)=3t²−2t, x(0)=0. Ache a(t) e x(t).", a: "a(t)=6t−2\nx(t)=t³−t² (c=0)", difficulty: 2, topic: "Taxa" },
      { q: "Derivadas fundamentais:", a: "(xⁿ)'=nxⁿ⁻¹  (eˣ)'=eˣ  (ln x)'=1/x\n(sen x)'=cos x  (cos x)'=−sen x\n(constante)'=0", difficulty: 1, topic: "Derivação" },
      { q: "∫xⁿ dx = ?", a: "xⁿ⁺¹/(n+1) + C\n∫eˣ dx = eˣ+C\n∫(1/x)dx = ln|x|+C", difficulty: 1, topic: "Integrais" },
    ]
  },
  python: {
    name: "Algoritmos e Prog.", icon: "🐍", color: "#22c55e",
    cards: [
      { q: "Tipos primitivos em Python?", a: "int, float, str, bool, NoneType\ninput() SEMPRE retorna str!", difficulty: 1, topic: "Tipos" },
      { q: "Diferença / vs // vs %", a: "/ divisão real (float)\n// divisão inteira (trunca)\n% módulo (resto)\n10/3=3.33  10//3=3  10%3=1", difficulty: 1, topic: "Tipos" },
      { q: "if/elif/else em Python:", a: "if cond1:\n    bloco1\nelif cond2:\n    bloco2\nelse:\n    bloco3\nIndentação OBRIGATÓRIA", difficulty: 1, topic: "Condição" },
      { q: "for vs while:", a: "for: sabe quantas vezes\nwhile: não sabe\nbreak sai, continue pula", difficulty: 1, topic: "Repetição" },
      { q: "range() como funciona?", a: "range(n): 0 até n-1\nrange(a,b): a até b-1\nrange(a,b,p): passo p\nNÃO inclui o fim!", difficulty: 1, topic: "Repetição" },
      { q: "Listas — métodos principais:", a: ".append(x) .insert(i,x) .remove(x)\n.pop(i) len() .sort()\nÍndice começa em 0!", difficulty: 2, topic: "Listas" },
      { q: "Fatiamento de listas:", a: "lista[ini:fim:passo]\nlista[::-1] → invertida\nlista[-1] → último", difficulty: 2, topic: "Listas" },
      { q: "Matriz (lista de listas):", a: "m=[[1,2],[3,4]]\nm[0][0]→1  m[1][1]→4\nfor linha in m: for elem in linha:", difficulty: 2, topic: "Listas" },
      { q: "O que é depuração?", a: "Encontrar e reduzir erros.\n3 tipos: sintaxe, runtime, lógico\nPython tem pdb.", difficulty: 1, topic: "Depuração" },
      { q: "3 tipos de erros:", a: "Sintaxe: código inválido\nRuntime: crash na execução (1/0)\nLógico: roda mas resultado errado", difficulty: 1, topic: "Depuração" },
      { q: "Escopo de variável:", a: "Local: dentro da função\nGlobal: fora, todo módulo\nFunção lê global mas não altera sem 'global'", difficulty: 2, topic: "Funções" },
      { q: "def e return:", a: "def nome(params): return valor\nprint()→tela  return→devolve\nSem return → retorna None", difficulty: 1, topic: "Funções" },
    ]
  },
  computacao: {
    name: "Conceitos Computação", icon: "💻", color: "#8b5cf6",
    cards: [
      { q: "Gerações de computadores:", a: "1ª Válvulas 2ª Transistores\n3ª CIs 4ª Microprocessadores\n5ª IA/Quântica", difficulty: 1, topic: "História" },
      { q: "Bit, Byte e unidades:", a: "Bit:0/1  Byte:8bits\n1KB=1024B  1MB=1024KB\n1GB=1024MB  1TB=1024GB", difficulty: 1, topic: "Dados" },
      { q: "Conversão decimal→binário:", a: "Divisões por 2, restos de baixo pra cima.\n13 = 1101₂", difficulty: 1, topic: "Dados" },
      { q: "Hexadecimal:", a: "Base16: 0-9,A-F\nCada dígito=4bits\nFF=255", difficulty: 1, topic: "Dados" },
      { q: "Complemento de 2:", a: "1)Inverte bits 2)Soma 1\n5=0101→1010→1011=−5", difficulty: 2, topic: "Dados" },
      { q: "Portas lógicas:", a: "AND:ambas1→1  OR:qualquer1→1\nNOT:inverte  XOR:diferentes→1", difficulty: 1, topic: "Lógica" },
      { q: "De Morgan:", a: "NOT(A AND B) = NOT A OR NOT B\nNOT(A OR B) = NOT A AND NOT B", difficulty: 2, topic: "Lógica" },
      { q: "Arquitetura von Neumann:", a: "CPU(ULA+UC)+Memória+E/S+Barramento\nDados e instruções na MESMA memória", difficulty: 1, topic: "Hardware" },
      { q: "Hierarquia de memória:", a: "Registradores→Cache→RAM→SSD/HD\nMais rápido=menor e mais caro", difficulty: 1, topic: "Hardware" },
      { q: "RAM vs ROM:", a: "RAM: volátil, leitura/escrita\nROM: não-volátil, só leitura", difficulty: 1, topic: "Hardware" },
      { q: "Funções do SO:", a: "Gerencia: processos, memória, arquivos, E/S", difficulty: 1, topic: "SO" },
      { q: "Processo vs Thread:", a: "Processo: memória própria, isolado\nThread: compartilha memória, mais leve", difficulty: 2, topic: "SO" },
      { q: "Compilador vs Interpretador:", a: "Compilador: tudo antes (C)\nInterpretador: linha a linha (Python)", difficulty: 1, topic: "SO" },
      { q: "Modelo OSI:", a: "7camadas: Aplicação,Apresentação,Sessão,\nTransporte,Rede,Enlace,Física", difficulty: 2, topic: "Redes" },
      { q: "TCP vs UDP:", a: "TCP: confiável,ordenado (HTTP)\nUDP: rápido,sem garantia (jogos)", difficulty: 1, topic: "Redes" },
      { q: "Cloud Computing:", a: "IaaS(EC2) PaaS(Heroku) SaaS(Gmail)", difficulty: 1, topic: "Redes" },
    ]
  }
};

const QUIZ_BANK = {
  calculo: [
    { q: "lim(x→0) (3x²+5x)/sen(x) por L'Hospital =", correct: "5", wrongs: ["0", "3", "∞", "1"], difficulty: 2, topic: "L'Hospital" },
    { q: "L'Hospital se aplica quando o limite dá:", correct: "0/0 ou ∞/∞", wrongs: ["0/1", "qualquer fração", "1/0", "∞·0"], difficulty: 1, topic: "L'Hospital" },
    { q: "lim(x→+∞) eˣ/3x² =", correct: "+∞", wrongs: ["0", "1/3", "3", "Não existe"], difficulty: 2, topic: "L'Hospital" },
    { q: "Derivada de x⁵:", correct: "5x⁴", wrongs: ["x⁴", "5x⁵", "4x⁵", "x⁴/5"], difficulty: 1, topic: "Derivação" },
    { q: "Derivada de eˣ:", correct: "eˣ", wrongs: ["xeˣ⁻¹", "x·eˣ", "eˣ⁺¹", "1/eˣ"], difficulty: 1, topic: "Derivação" },
    { q: "Derivada de sen(x):", correct: "cos(x)", wrongs: ["-cos(x)", "sen(x)", "-sen(x)", "1/cos(x)"], difficulty: 1, topic: "Derivação" },
    { q: "Derivada de cos(x):", correct: "-sen(x)", wrongs: ["sen(x)", "cos(x)", "-cos(x)", "1/sen(x)"], difficulty: 1, topic: "Derivação" },
    { q: "Derivada de ln(x):", correct: "1/x", wrongs: ["x", "ln(x)/x", "eˣ", "1/x²"], difficulty: 1, topic: "Derivação" },
    { q: "Derivada de x³ + 2x:", correct: "3x² + 2", wrongs: ["x² + 2", "3x² + 2x", "3x + 2", "x⁴/4 + x²"], difficulty: 1, topic: "Derivação" },
    { q: "(f·g)' pela regra do produto:", correct: "f'g + fg'", wrongs: ["f'·g'", "(f+g)'", "f'g - fg'", "f'g'/fg"], difficulty: 1, topic: "Derivação" },
    { q: "(f/g)' pela regra do quociente:", correct: "(f'g - fg') / g²", wrongs: ["(f'g + fg')/g²", "f'/g'", "(fg' - f'g)/g²", "f'g - fg'"], difficulty: 1, topic: "Derivação" },
    { q: "Derivada de (2x)eˣ:", correct: "2eˣ + 2xeˣ", wrongs: ["2eˣ", "2xeˣ", "(2x+2)eˣ⁻¹", "2eˣ·eˣ"], difficulty: 2, topic: "Derivação" },
    { q: "Derivada de 2x/(x+1):", correct: "2/(x+1)²", wrongs: ["2/(x+1)", "2x/(x+1)²", "(2x+2)/(x+1)²", "1/(x+1)"], difficulty: 2, topic: "Derivação" },
    { q: "[f(g(x))]' pela regra da cadeia:", correct: "f'(g(x)) · g'(x)", wrongs: ["f'(x)·g'(x)", "f(g'(x))", "f'(g'(x))", "f(g(x))·g'(x)"], difficulty: 1, topic: "Cadeia" },
    { q: "Derivada de sen(x²+5x):", correct: "cos(x²+5x)·(2x+5)", wrongs: ["cos(x²+5x)", "cos(2x+5)", "sen(x²+5x)·(2x+5)", "-cos(x²+5x)·(2x+5)"], difficulty: 2, topic: "Cadeia" },
    { q: "Derivada de (x²+5x)¹⁰:", correct: "10(x²+5x)⁹·(2x+5)", wrongs: ["10(x²+5x)⁹", "(x²+5x)⁹·(2x+5)", "10(2x+5)⁹", "10x(x²+5x)⁹"], difficulty: 2, topic: "Cadeia" },
    { q: "Se f'(x) > 0 no intervalo, f é:", correct: "Crescente", wrongs: ["Decrescente", "Constante", "Côncava pra cima", "Tem máximo"], difficulty: 1, topic: "Comportamento" },
    { q: "Ponto crítico é onde:", correct: "f'(p) = 0", wrongs: ["f(p) = 0", "f''(p) = 0", "f'(p) > 0", "f(p) = f'(p)"], difficulty: 1, topic: "Max/Min" },
    { q: "f'(p)=0 e f''(p)>0 → p é:", correct: "Mínimo local", wrongs: ["Máximo local", "Ponto de inflexão", "Indefinido", "Máximo global"], difficulty: 1, topic: "Max/Min" },
    { q: "f'(p)=0 e f''(p)<0 → p é:", correct: "Máximo local", wrongs: ["Mínimo local", "Ponto de inflexão", "Ponto de sela", "Indefinido"], difficulty: 1, topic: "Max/Min" },
    { q: "f''(x)=24x+10. f''(0)=10. Logo x=0 é:", correct: "Mínimo (f''>0)", wrongs: ["Máximo", "Inflexão", "Inconclusivo", "Nem max nem min"], difficulty: 2, topic: "Max/Min" },
    { q: "v(t)=3t²-2t. Aceleração a(t)=", correct: "6t - 2", wrongs: ["3t²-2t", "t³-t²", "6t²-2", "3t-2"], difficulty: 1, topic: "Taxa" },
    { q: "Velocidade é a _____ da posição:", correct: "Derivada", wrongs: ["Integral", "Raiz", "Inversa", "Logaritmo"], difficulty: 1, topic: "Taxa" },
    { q: "∫x³ dx =", correct: "x⁴/4 + C", wrongs: ["3x²", "x⁴+C", "x³/3+C", "4x⁴+C"], difficulty: 1, topic: "Integrais" },
    { q: "Derivada de 7x³ - 2x + 4:", correct: "21x² - 2", wrongs: ["7x² - 2", "21x³ - 2", "21x² - 2x", "7x² - 2x + 4"], difficulty: 1, topic: "Derivação" },
  ],
  python: [
    { q: "10 // 3 =", correct: "3", wrongs: ["3.33", "3.0", "4", "1"], difficulty: 1, topic: "Tipos" },
    { q: "10 % 3 =", correct: "1", wrongs: ["3", "3.33", "0", "10"], difficulty: 1, topic: "Tipos" },
    { q: "type(input('x: ')) é sempre:", correct: "str", wrongs: ["int", "float", "depende da entrada", "auto"], difficulty: 1, topic: "Tipos" },
    { q: "type(3.0) retorna:", correct: "float", wrongs: ["int", "str", "number", "double"], difficulty: 1, topic: "Tipos" },
    { q: "2 ** 4 =", correct: "16", wrongs: ["8", "6", "24", "2"], difficulty: 1, topic: "Tipos" },
    { q: "bool(0), bool(''), bool([]) são:", correct: "False, False, False", wrongs: ["True, True, True", "False, True, False", "True, False, True", "0, '', []"], difficulty: 2, topic: "Tipos" },
    { q: "'abc'[1] =", correct: "'b'", wrongs: ["'a'", "'c'", "Erro", "'ab'"], difficulty: 1, topic: "Tipos" },
    { q: "x=5. if x>3: print('A')\\nelif x>4: print('B'). Saída:", correct: "A", wrongs: ["B", "A e B", "Erro", "Nada"], difficulty: 1, topic: "Condição" },
    { q: "not (True and False) =", correct: "True", wrongs: ["False", "None", "Erro", "0"], difficulty: 2, topic: "Condição" },
    { q: "for i in range(3): print(i). Saída:", correct: "0, 1, 2", wrongs: ["1, 2, 3", "0, 1, 2, 3", "3", "1, 2"], difficulty: 1, topic: "Repetição" },
    { q: "for i in range(1,8,2): print(i). Saída:", correct: "1, 3, 5, 7", wrongs: ["1,2,3,4,5,6,7", "2,4,6,8", "1,3,5", "2,4,6"], difficulty: 2, topic: "Repetição" },
    { q: "range(5) gera:", correct: "0, 1, 2, 3, 4", wrongs: ["1, 2, 3, 4, 5", "0, 1, 2, 3, 4, 5", "5", "1, 2, 3, 4"], difficulty: 1, topic: "Repetição" },
    { q: "break em um loop:", correct: "Sai do loop completamente", wrongs: ["Pula iteração", "Encerra programa", "Reinicia loop", "Pausa execução"], difficulty: 1, topic: "Repetição" },
    { q: "continue em um loop:", correct: "Pula para próxima iteração", wrongs: ["Sai do loop", "Encerra programa", "Reinicia do zero", "Pausa"], difficulty: 1, topic: "Repetição" },
    { q: "for i in range(5):\\n  if i==3: break\\n  print(i). Saída:", correct: "0, 1, 2", wrongs: ["0,1,2,3", "0,1,2,4", "3", "0,1,2,3,4"], difficulty: 2, topic: "Repetição" },
    { q: "[10,20,30][-1] =", correct: "30", wrongs: ["10", "Erro", "-1", "20"], difficulty: 1, topic: "Listas" },
    { q: "l=[1,2,3]; l.append([4,5]); len(l)=", correct: "4", wrongs: ["5", "3", "6", "Erro"], difficulty: 2, topic: "Listas" },
    { q: "[1,2,3,4,5][1:4] =", correct: "[2, 3, 4]", wrongs: ["[1,2,3,4]", "[2,3]", "[1,2,3]", "[2,3,4,5]"], difficulty: 2, topic: "Listas" },
    { q: "[1,2,3][::-1] =", correct: "[3, 2, 1]", wrongs: ["[1,2,3]", "Erro", "[3,2]", "[1,3]"], difficulty: 2, topic: "Listas" },
    { q: "m=[[1,2],[3,4]]; m[1][0] =", correct: "3", wrongs: ["1", "2", "4", "Erro"], difficulty: 2, topic: "Listas" },
    { q: "def f(x): return x*2\\nprint(f(3)). Saída:", correct: "6", wrongs: ["3", "x*2", "None", "Erro"], difficulty: 1, topic: "Funções" },
    { q: "def f(x): x*2\\nprint(f(3)). Saída:", correct: "None", wrongs: ["6", "3", "Erro", "0"], difficulty: 2, topic: "Funções" },
    { q: "x=10\\ndef f(): x=5\\nf()\\nprint(x). Saída:", correct: "10", wrongs: ["5", "Erro", "None", "15"], difficulty: 3, topic: "Funções" },
    { q: "print(1/0) gera erro de:", correct: "Runtime (ZeroDivisionError)", wrongs: ["Sintaxe", "Lógico", "Não gera erro", "TypeError"], difficulty: 1, topic: "Depuração" },
    { q: "Erro lógico é quando:", correct: "Roda mas resultado errado", wrongs: ["Python não executa", "Crash na execução", "Falta parêntese", "Variável não existe"], difficulty: 1, topic: "Depuração" },
    { q: "Depuração serve para:", correct: "Encontrar e reduzir erros", wrongs: ["Compilar código", "Otimizar performance", "Documentar", "Converter tipos"], difficulty: 1, topic: "Depuração" },
  ],
  computacao: [
    { q: "1ª geração de computadores usava:", correct: "Válvulas", wrongs: ["Transistores", "CIs", "Microprocessadores", "Relés"], difficulty: 1, topic: "História" },
    { q: "1 byte =", correct: "8 bits", wrongs: ["4 bits", "16 bits", "1024 bits", "2 bits"], difficulty: 1, topic: "Dados" },
    { q: "13 em binário:", correct: "1101", wrongs: ["1011", "1110", "1001", "1111"], difficulty: 1, topic: "Dados" },
    { q: "1010₂ em decimal:", correct: "10", wrongs: ["8", "12", "5", "1010"], difficulty: 1, topic: "Dados" },
    { q: "FF hex =", correct: "255", wrongs: ["256", "16", "15", "127"], difficulty: 1, topic: "Dados" },
    { q: "11001₂ em decimal:", correct: "25", wrongs: ["19", "27", "21", "24"], difficulty: 2, topic: "Dados" },
    { q: "Complemento de 2 de 0101 (5):", correct: "Inverte→1010, soma 1→1011", wrongs: ["Apenas inverte→1010", "Subtrai de 1111", "Soma 1→0110", "Inverte e subtrai 1"], difficulty: 2, topic: "Dados" },
    { q: "'A' na tabela ASCII:", correct: "65", wrongs: ["97", "48", "41", "90"], difficulty: 2, topic: "Dados" },
    { q: "AND só retorna 1 quando:", correct: "Ambas entradas são 1", wrongs: ["Qualquer é 1", "Ambas são 0", "São diferentes", "Pelo menos uma é 0"], difficulty: 1, topic: "Lógica" },
    { q: "XOR retorna 1 quando:", correct: "Entradas são diferentes", wrongs: ["Ambas 1", "Ambas 0", "Qualquer é 1", "Nenhuma é 1"], difficulty: 1, topic: "Lógica" },
    { q: "NOT(A AND B) por De Morgan:", correct: "NOT A OR NOT B", wrongs: ["NOT A AND NOT B", "A OR B", "NOT(A OR B)", "A AND NOT B"], difficulty: 2, topic: "Lógica" },
    { q: "1 AND 0 =", correct: "0", wrongs: ["1", "10", "Erro", "Indefinido"], difficulty: 1, topic: "Lógica" },
    { q: "0 OR 1 =", correct: "1", wrongs: ["0", "01", "Erro", "Indefinido"], difficulty: 1, topic: "Lógica" },
    { q: "1 XOR 1 =", correct: "0", wrongs: ["1", "2", "11", "Erro"], difficulty: 2, topic: "Lógica" },
    { q: "Na arq. von Neumann, dados e instruções ficam:", correct: "Na mesma memória", wrongs: ["Em memórias separadas", "Só na CPU", "No barramento", "Em registradores"], difficulty: 1, topic: "Hardware" },
    { q: "ULA é responsável por:", correct: "Cálculos aritméticos e lógicos", wrongs: ["Controlar execução", "Armazenar dados", "Conectar periféricos", "Gerenciar memória"], difficulty: 1, topic: "Hardware" },
    { q: "Memória mais rápida:", correct: "Registradores", wrongs: ["Cache L1", "RAM", "SSD", "Cache L3"], difficulty: 1, topic: "Hardware" },
    { q: "RAM é memória:", correct: "Volátil, leitura e escrita", wrongs: ["Não-volátil, só leitura", "Volátil, só leitura", "Não-volátil, leitura/escrita", "Permanente"], difficulty: 1, topic: "Hardware" },
    { q: "Compilador:", correct: "Traduz tudo antes de executar", wrongs: ["Traduz linha por linha", "Apenas verifica erros", "Só funciona com Python", "É um tipo de SO"], difficulty: 1, topic: "SO" },
    { q: "Thread vs processo:", correct: "Thread compartilha memória do processo", wrongs: ["Thread tem memória própria", "Thread é mais pesada", "Processo compartilha memória", "São sinônimos"], difficulty: 2, topic: "SO" },
    { q: "SO gerencia:", correct: "Processos, memória, arquivos e E/S", wrongs: ["Só processos", "Só hardware", "Só arquivos", "Só interface gráfica"], difficulty: 1, topic: "SO" },
    { q: "Software livre = quantas liberdades?", correct: "4", wrongs: ["2", "3", "5", "1"], difficulty: 1, topic: "SO" },
    { q: "TCP vs UDP — TCP é:", correct: "Confiável e ordenado", wrongs: ["Mais rápido", "Sem confirmação", "Usado em jogos", "Sem conexão"], difficulty: 1, topic: "Redes" },
    { q: "Modelo OSI tem quantas camadas?", correct: "7", wrongs: ["4", "5", "6", "3"], difficulty: 1, topic: "Redes" },
    { q: "Camada de Transporte no OSI é a:", correct: "4", wrongs: ["3", "5", "7", "2"], difficulty: 2, topic: "Redes" },
    { q: "IaaS, PaaS, SaaS são modelos de:", correct: "Cloud Computing", wrongs: ["Redes locais", "Sistemas operacionais", "Protocolos", "Tipos de memória"], difficulty: 1, topic: "Redes" },
    { q: "DNS traduz:", correct: "Nomes de domínio em IPs", wrongs: ["IPs em MACs", "Dados em binário", "Pacotes em frames", "Emails em URLs"], difficulty: 1, topic: "Redes" },
  ]
};

const MODES = { MENU: "menu", STUDY: "study", QUIZ: "quiz", EXAM: "exam" };
function shuffle(arr) { const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }

export default function App() {
  const [mode, setMode] = useState(MODES.MENU);
  const [subject, setSubject] = useState(null);
  const [ci, setCi] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [stats, setStats] = useState({});
  const [qs, setQs] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [done, setDone] = useState(false);
  const [sel, setSel] = useState(null);
  const [fTopic, setFTopic] = useState(null);
  const [diff, setDiff] = useState("normal");
  const [daysLeft] = useState(() => Math.max(0, Math.ceil((new Date("2026-03-26") - new Date()) / 86400000)));

  useEffect(() => { (async()=>{ try{const r=await window.storage.get("ss-v4");if(r?.value)setStats(JSON.parse(r.value));}catch{}})(); }, []);
  const save = useCallback(async(s)=>{ setStats(s); try{await window.storage.set("ss-v4",JSON.stringify(s));}catch{} },[]);
  const mark = useCallback((k,ok)=>{ const p=stats[k]||{c:0,w:0}; save({...stats,[k]:{c:p.c+(ok?1:0),w:p.w+(ok?0:1)}}); },[stats,save]);

  const fc = subject ? FLASHCARDS[subject] : null;
  const filtered = fc ? fc.cards.map((c,i)=>({...c,oi:i})).filter(c=>!fTopic||c.topic===fTopic) : [];
  const cur = filtered[ci];
  const topics = (s) => [...new Set(FLASHCARDS[s].cards.map(c=>c.topic))];

  const mkQuiz = (s,d) => {
    let pool = [...QUIZ_BANK[s]];
    if(d==="hard") pool=pool.filter(q=>q.difficulty>=2);
    if(pool.length<4) pool=[...QUIZ_BANK[s]];
    const n = d==="hard"?12:8;
    return shuffle(pool).slice(0,Math.min(n,pool.length)).map((q,i)=>{
      const opts=shuffle([q.correct,...shuffle(q.wrongs).slice(0,d==="hard"?4:3)]);
      return {...q,opts,ci:opts.indexOf(q.correct),qi:i};
    });
  };
  const mkExam = () => {
    const all=[]; Object.entries(QUIZ_BANK).forEach(([s,b])=>b.forEach(q=>all.push({...q,subj:s})));
    return shuffle(all).slice(0,15).map((q,i)=>{
      const opts=shuffle([q.correct,...shuffle(q.wrongs).slice(0,4)]);
      return {...q,opts,ci:opts.indexOf(q.correct),qi:i};
    });
  };

  const go = (m,s,d)=>{ setMode(m);setSubject(s);setCi(0);setFlipped(false);setSel(null);setAnswers([]);setDone(false);setDiff(d||"normal");setFTopic(null); };
  const startQuiz=(s,d)=>{ go(MODES.QUIZ,s,d); setQs(mkQuiz(s,d)); };
  const startExam=()=>{ go(MODES.EXAM,null,"exam"); setQs(mkExam()); };

  const answer=(i)=>{ if(sel!==null)return; setSel(i); const q=qs[ci]; const ok=i===q.ci; mark(`q-${q.subj||subject}-${q.qi}`,ok); setAnswers([...answers,{sel:i,ok}]); };
  const next=()=>{ if(ci+1>=qs.length)setDone(true); else{setCi(ci+1);setSel(null);} };

  const getStat=(s)=>{ const b=QUIZ_BANK[s]; let at=0,r=0; b.forEach((_,i)=>{const k=`q-${s}-${i}`;if(stats[k]){at+=stats[k].c+stats[k].w;r+=stats[k].c;}}); return{t:b.length,at,r,p:at>0?Math.round(r/at*100):0}; };

  const dl=(d)=>d===1?"Fácil":d===2?"Médio":"Difícil";
  const dc=(d)=>d===1?"#22c55e":d===2?"#f59e0b":"#ef4444";
  const isQ=mode===MODES.QUIZ||mode===MODES.EXAM;

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0a0a0f,#111827,#0a0a0f)",color:"#e2e8f0",fontFamily:"'JetBrains Mono','Fira Code',monospace",padding:16,boxSizing:"border-box"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Space+Grotesk:wght@400;500;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        .cf{perspective:1000px;cursor:pointer}.ci{transition:transform .5s;transform-style:preserve-3d;position:relative}.ci.f{transform:rotateY(180deg)}
        .cfs,.cbs{backface-visibility:hidden;position:absolute;top:0;left:0;width:100%;height:100%;border-radius:12px;padding:20px;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center}
        .cbs{transform:rotateY(180deg);overflow-y:auto}
        .b{border:none;cursor:pointer;border-radius:8px;font-family:inherit;font-weight:500;transition:all .15s}.b:hover{transform:translateY(-1px);filter:brightness(1.1)}.b:active{transform:translateY(0)}
        .ob{width:100%;text-align:left;padding:14px 16px;margin-bottom:8px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:8px;color:#e2e8f0;cursor:pointer;font-family:inherit;font-size:13px;line-height:1.4;transition:all .15s}
        .ob:hover:not(:disabled){background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.2)}
        .ob.ok{background:rgba(34,197,94,.2);border-color:#22c55e;color:#86efac}.ob.no{background:rgba(239,68,68,.2);border-color:#ef4444;color:#fca5a5}
        .pb{height:4px;background:rgba(255,255,255,.1);border-radius:2px;overflow:hidden}.pf{height:100%;border-radius:2px;transition:width .3s}
        .tg{display:inline-block;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:500}
        .ch{display:inline-block;padding:4px 10px;border-radius:6px;font-size:11px;cursor:pointer;border:1px solid rgba(255,255,255,.15);margin:2px;transition:all .15s}
        .ch:hover{border-color:rgba(255,255,255,.3)}.ch.a{background:rgba(255,255,255,.15);border-color:rgba(255,255,255,.4)}
      `}</style>

      <div style={{maxWidth:680,margin:"0 auto",marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            {mode!==MODES.MENU&&<button className="b" onClick={()=>{setMode(MODES.MENU);setFTopic(null);}} style={{background:"rgba(255,255,255,.08)",color:"#94a3b8",padding:"6px 12px",fontSize:12}}>← Menu</button>}
            <h1 style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:18,fontWeight:700}}>UNIVESP <span style={{color:"#6366f1"}}>Study</span></h1>
          </div>
          <div style={{background:daysLeft<=1?"rgba(239,68,68,.2)":"rgba(245,158,11,.2)",padding:"4px 10px",borderRadius:6,fontSize:12,color:daysLeft<=1?"#fca5a5":"#fcd34d"}}>{daysLeft===0?"HOJE!":`${daysLeft}d`}</div>
        </div>
      </div>

      <div style={{maxWidth:680,margin:"0 auto"}}>
        {mode===MODES.MENU&&(
          <div>
            <button className="b" onClick={startExam} style={{width:"100%",marginBottom:14,background:"linear-gradient(135deg,rgba(239,68,68,.2),rgba(245,158,11,.2))",border:"1px solid rgba(239,68,68,.3)",color:"#fca5a5",padding:"14px 0",fontSize:14,fontWeight:600}}>🔥 SIMULADO PROVA — 15 questões mistas</button>
            <div style={{display:"grid",gap:12}}>
              {Object.entries(FLASHCARDS).map(([k,s])=>{const st=getStat(k);return(
                <div key={k} style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",borderRadius:12,padding:16,borderLeft:`3px solid ${s.color}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <div><span style={{fontSize:18,marginRight:8}}>{s.icon}</span><span style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:15,fontWeight:600}}>{s.name}</span></div>
                    {st.at>0&&<span className="tg" style={{background:`${s.color}22`,color:s.color}}>{st.p}%</span>}
                  </div>
                  {st.at>0&&<div style={{marginBottom:10}}><div className="pb"><div className="pf" style={{width:`${st.p}%`,background:s.color}}/></div><div style={{fontSize:11,color:"#64748b",marginTop:3}}>{st.r}/{st.at} acertos · {QUIZ_BANK[k].length} questões</div></div>}
                  <div style={{display:"flex",gap:6}}>
                    <button className="b" onClick={()=>{go(MODES.STUDY,k);}} style={{flex:1,background:`${s.color}15`,color:s.color,padding:"9px 0",fontSize:12}}>📖 Cards</button>
                    <button className="b" onClick={()=>startQuiz(k,"normal")} style={{flex:1,background:`${s.color}15`,color:s.color,padding:"9px 0",fontSize:12}}>🎯 Normal</button>
                    <button className="b" onClick={()=>startQuiz(k,"hard")} style={{flex:1,background:`${s.color}25`,color:s.color,padding:"9px 0",fontSize:12,fontWeight:600}}>💀 Difícil</button>
                  </div>
                </div>
              );})}
            </div>
          </div>
        )}

        {mode===MODES.STUDY&&fc&&(
          <div>
            <div style={{marginBottom:10,display:"flex",flexWrap:"wrap",gap:0}}>
              <span className={`ch ${!fTopic?'a':''}`} onClick={()=>{setFTopic(null);setCi(0);setFlipped(false);}}>Todos</span>
              {topics(subject).map(t=><span key={t} className={`ch ${fTopic===t?'a':''}`} onClick={()=>{setFTopic(fTopic===t?null:t);setCi(0);setFlipped(false);}}>{t}</span>)}
            </div>
            {cur&&<>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <span style={{fontSize:12,color:"#94a3b8"}}>{ci+1}/{filtered.length}</span>
                <div style={{display:"flex",gap:4}}><span className="tg" style={{background:"rgba(255,255,255,.06)",color:"#94a3b8"}}>{cur.topic}</span><span className="tg" style={{background:`${dc(cur.difficulty)}22`,color:dc(cur.difficulty)}}>{dl(cur.difficulty)}</span></div>
              </div>
              <div className="pb" style={{marginBottom:12}}><div className="pf" style={{width:`${(ci+1)/filtered.length*100}%`,background:fc.color}}/></div>
              <div className="cf" onClick={()=>setFlipped(!flipped)} style={{height:260,marginBottom:12}}>
                <div className={`ci ${flipped?'f':''}`} style={{width:"100%",height:"100%"}}>
                  <div className="cfs" style={{background:"linear-gradient(135deg,rgba(255,255,255,.06),rgba(255,255,255,.02))",border:"1px solid rgba(255,255,255,.1)"}}>
                    <div style={{fontSize:10,color:"#64748b",marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>Pergunta</div>
                    <div style={{fontSize:14,lineHeight:1.6,whiteSpace:"pre-wrap"}}>{cur.q}</div>
                    <div style={{fontSize:10,color:"#475569",marginTop:12}}>toque para virar</div>
                  </div>
                  <div className="cbs" style={{background:`linear-gradient(135deg,${fc.color}15,${fc.color}05)`,border:`1px solid ${fc.color}40`}}>
                    <div style={{fontSize:10,color:fc.color,marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>Resposta</div>
                    <div style={{fontSize:12,lineHeight:1.7,whiteSpace:"pre-wrap"}}>{cur.a}</div>
                  </div>
                </div>
              </div>
              {flipped&&<div style={{display:"flex",gap:8,marginBottom:10}}>
                <button className="b" onClick={()=>{mark(`c-${subject}-${cur.oi}`,false);setFlipped(false);setCi(Math.min(ci+1,filtered.length-1));}} style={{flex:1,background:"rgba(239,68,68,.15)",color:"#fca5a5",padding:"11px 0",fontSize:13}}>✗ Errei</button>
                <button className="b" onClick={()=>{mark(`c-${subject}-${cur.oi}`,true);setFlipped(false);setCi(Math.min(ci+1,filtered.length-1));}} style={{flex:1,background:"rgba(34,197,94,.15)",color:"#86efac",padding:"11px 0",fontSize:13}}>✓ Acertei</button>
              </div>}
              <div style={{display:"flex",gap:6}}>
                <button className="b" disabled={ci===0} onClick={()=>{setFlipped(false);setCi(ci-1);}} style={{flex:1,background:"rgba(255,255,255,.05)",color:ci===0?"#334155":"#94a3b8",padding:"9px 0",fontSize:12}}>←</button>
                <button className="b" onClick={()=>{setFlipped(false);setCi(Math.floor(Math.random()*filtered.length));}} style={{background:"rgba(255,255,255,.05)",color:"#94a3b8",padding:"9px 14px",fontSize:12}}>🎲</button>
                <button className="b" disabled={ci>=filtered.length-1} onClick={()=>{setFlipped(false);setCi(ci+1);}} style={{flex:1,background:"rgba(255,255,255,.05)",color:ci>=filtered.length-1?"#334155":"#94a3b8",padding:"9px 0",fontSize:12}}>→</button>
              </div>
            </>}
          </div>
        )}

        {isQ&&!done&&qs.length>0&&(()=>{const q=qs[ci];const sc=q.subj||subject;const clr=FLASHCARDS[sc]?.color||"#6366f1";return(
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <span style={{fontSize:12,color:"#94a3b8"}}>{ci+1}/{qs.length}</span>
                {mode===MODES.EXAM&&q.subj&&<span className="tg" style={{background:`${clr}22`,color:clr}}>{FLASHCARDS[q.subj]?.icon} {FLASHCARDS[q.subj]?.name}</span>}
              </div>
              <div style={{display:"flex",gap:4}}>
                <span className="tg" style={{background:"rgba(255,255,255,.06)",color:"#94a3b8"}}>{q.topic}</span>
                <span className="tg" style={{background:`${dc(q.difficulty)}22`,color:dc(q.difficulty)}}>{dl(q.difficulty)}</span>
              </div>
            </div>
            <div className="pb" style={{marginBottom:12}}><div className="pf" style={{width:`${(ci+1)/qs.length*100}%`,background:mode===MODES.EXAM?"#ef4444":clr}}/></div>
            <div style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",borderRadius:12,padding:20,marginBottom:12}}>
              <div style={{fontSize:14,lineHeight:1.6}}>{q.q}</div>
            </div>
            {q.opts.map((o,i)=>{let c="ob";if(sel!==null){if(i===q.ci)c+=" ok";else if(i===sel)c+=" no";}return(
              <button key={i} className={c} disabled={sel!==null} onClick={()=>answer(i)}>
                <span style={{fontWeight:700,marginRight:10,opacity:.5}}>{String.fromCharCode(65+i)}</span>{o}
              </button>
            );})}
            {sel!==null&&<button className="b" onClick={next} style={{width:"100%",marginTop:8,background:mode===MODES.EXAM?"rgba(239,68,68,.2)":`${clr}25`,color:mode===MODES.EXAM?"#fca5a5":clr,padding:"12px 0",fontSize:13}}>
              {ci+1>=qs.length?"Ver Resultado →":"Próxima →"}
            </button>}
          </div>
        );})()}

        {isQ&&done&&(()=>{const ok=answers.filter(a=>a.ok).length;const t=qs.length;const p=Math.round(ok/t*100);return(
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:52,marginBottom:8}}>{p>=70?"🎉":p>=40?"💪":"📚"}</div>
            <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:32,fontWeight:700}}>{ok}/{t}</div>
            <div style={{fontSize:14,color:p>=70?"#86efac":"#94a3b8",marginBottom:4}}>{p}%</div>
            <div style={{fontSize:13,color:"#94a3b8",marginBottom:18}}>{ok>=2?"Meta de aprovação atingida!":"Revisa os flashcards e tenta de novo."}</div>
            {mode===MODES.EXAM&&<div style={{background:"rgba(255,255,255,.04)",borderRadius:10,padding:14,marginBottom:14,textAlign:"left"}}>
              <div style={{fontSize:12,color:"#64748b",marginBottom:8}}>Por matéria:</div>
              {Object.entries(FLASHCARDS).map(([k,s])=>{const sq=qs.map((q,i)=>({...q,ai:i})).filter(q=>q.subj===k);const sc=sq.filter(q=>answers[q.ai]?.ok).length;return sq.length>0?(
                <div key={k} style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontSize:12}}>{s.icon} {s.name}</span>
                  <span style={{fontSize:12,color:sc>=2?"#86efac":"#fca5a5",fontWeight:600}}>{sc}/{sq.length}</span>
                </div>
              ):null;})}
            </div>}
            <div style={{display:"flex",gap:8}}>
              {mode===MODES.EXAM?<button className="b" onClick={startExam} style={{flex:1,background:"rgba(239,68,68,.2)",color:"#fca5a5",padding:"12px 0",fontSize:13}}>🔥 Nova Prova</button>
              :<><button className="b" onClick={()=>startQuiz(subject,diff)} style={{flex:1,background:`${FLASHCARDS[subject].color}20`,color:FLASHCARDS[subject].color,padding:"12px 0",fontSize:13}}>🔄 Repetir</button>
              <button className="b" onClick={()=>{go(MODES.STUDY,subject);}} style={{flex:1,background:"rgba(255,255,255,.05)",color:"#94a3b8",padding:"12px 0",fontSize:13}}>📖 Cards</button></>}
              <button className="b" onClick={()=>setMode(MODES.MENU)} style={{flex:1,background:"rgba(255,255,255,.05)",color:"#94a3b8",padding:"12px 0",fontSize:13}}>Menu</button>
            </div>
          </div>
        );})()}
      </div>
    </div>
  );
}
