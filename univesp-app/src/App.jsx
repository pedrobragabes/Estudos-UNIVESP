import { useState, useEffect, useCallback, useRef } from "react";
import GeminiTutor from "./GeminiTutor";
import FormulaSheet from "./FormulaSheet";

const FLASHCARDS = {
  calculo: {
    name: "Calculo I", icon: "\u222B", color: "#f59e0b",
    cards: [
      // L'Hospital
      { q: "Quando usar a 1a Regra de L'Hospital?", a: "Quando lim f(x)/g(x) resulta em 0/0.\nDeriva numerador e denominador separadamente:\nlim f(x)/g(x) = lim f'(x)/g'(x)", difficulty: 1, topic: "L'Hospital" },
      { q: "Quando usar a 2a Regra de L'Hospital?", a: "Quando lim f(x)/g(x) resulta em \u221E/\u221E.\nMesma regra, pode aplicar mais de uma vez.", difficulty: 1, topic: "L'Hospital" },
      { q: "Resolva: lim(x\u21920) (3x\u00B2+5x)/sen(x)", a: "0/0 \u2192 L'Hospital\nDeriva cima: 6x+5\nDeriva baixo: cos(x)\nlim(x\u21920) (6x+5)/cos(x) = 5/1 = 5", difficulty: 2, topic: "L'Hospital" },
      { q: "Resolva: lim(x\u2192+\u221E) e^x/3x\u00B2", a: "\u221E/\u221E \u2192 L'Hospital (2 vezes)\n= lim e^x/6x = lim e^x/6 = +\u221E", difficulty: 2, topic: "L'Hospital" },
      { q: "lim(x\u21920) sen(x)/x = ?", a: "0/0 \u2192 L'Hospital\ncos(x)/1 \u2192 cos(0)/1 = 1\n(Limite fundamental!)", difficulty: 1, topic: "L'Hospital" },
      // Derivacao
      { q: "Regra do Produto: (f\u00B7g)' = ?", a: "f'\u00B7g + f\u00B7g'\nEx: (2x)e^x \u2192 2e^x + 2xe^x", difficulty: 1, topic: "Derivacao" },
      { q: "Derive: f(x) = (3x\u00B2+5)e^x", a: "Produto: f' = 6x\u00B7e^x + (3x\u00B2+5)\u00B7e^x\n= (3x\u00B2+6x+5)e^x", difficulty: 2, topic: "Derivacao" },
      { q: "Regra do Quociente: (f/g)' = ?", a: "(f'\u00B7g \u2212 f\u00B7g') / g\u00B2", difficulty: 1, topic: "Derivacao" },
      { q: "Derive: f(x) = 2x/(x+1)", a: "f' = [2(x+1) \u2212 2x\u00B71]/(x+1)\u00B2 = 2/(x+1)\u00B2", difficulty: 2, topic: "Derivacao" },
      { q: "Derivadas fundamentais:", a: "(x^n)'=nx^(n-1)  (e^x)'=e^x  (ln x)'=1/x\n(sen x)'=cos x  (cos x)'=-sen x\n(constante)'=0", difficulty: 1, topic: "Derivacao" },
      // Cadeia
      { q: "Regra da Cadeia: [f(g(x))]' = ?", a: "f'(g(x)) \u00B7 g'(x)\nDeriva fora mantendo dentro \u00D7 derivada de dentro.", difficulty: 1, topic: "Cadeia" },
      { q: "Derive: sen(x\u00B2+5x)", a: "cos(x\u00B2+5x) \u00B7 (2x+5)", difficulty: 2, topic: "Cadeia" },
      { q: "Derive: (x\u00B2+5x)^10", a: "10(x\u00B2+5x)^9 \u00B7 (2x+5)", difficulty: 2, topic: "Cadeia" },
      { q: "Derive: e^(3x\u00B2+1)", a: "e^(3x\u00B2+1) \u00B7 6x\n(derivada de fora = e^u, vezes derivada de dentro = 6x)", difficulty: 2, topic: "Cadeia" },
      // Comportamento
      { q: "Como saber se f e crescente ou decrescente?", a: "f'(x) > 0 \u2192 crescente\nf'(x) < 0 \u2192 decrescente", difficulty: 1, topic: "Comportamento" },
      { q: "f(x)=4x\u00B3+5x\u00B2. Pontos criticos?", a: "f'=12x\u00B2+10x = 2x(6x+5)=0\nx=0 ou x=-5/6", difficulty: 2, topic: "Comportamento" },
      // Max/Min
      { q: "Teste da 2a derivada para max/min?", a: "No ponto critico p (f'(p)=0):\nf''(p)>0 \u2192 MINIMO (\u222A)\nf''(p)<0 \u2192 MAXIMO (\u2229)", difficulty: 1, topic: "Max/Min" },
      { q: "f(x)=4x\u00B3+5x\u00B2. Classifique os pontos criticos.", a: "f''(x)=24x+10\nf''(0)=10>0 \u2192 MINIMO\nf''(-5/6)=-10<0 \u2192 MAXIMO", difficulty: 2, topic: "Max/Min" },
      { q: "Ponto de inflexao e onde:", a: "f''(x) = 0 (e muda de sinal)\nE onde a concavidade muda.", difficulty: 1, topic: "Max/Min" },
      // Taxa
      { q: "Relacao posicao, velocidade, aceleracao?", a: "v(t)=x'(t)  a(t)=v'(t)\nx(t)=\u222Bv(t)dt  v(t)=\u222Ba(t)dt", difficulty: 1, topic: "Taxa" },
      { q: "v(t)=3t\u00B2-2t, x(0)=0. Ache a(t) e x(t).", a: "a(t)=6t-2\nx(t)=t\u00B3-t\u00B2 (c=0)", difficulty: 2, topic: "Taxa" },
      // Integrais
      { q: "Integrais fundamentais:", a: "\u222Bx^n dx = x^(n+1)/(n+1) + C\n\u222Be^x dx = e^x + C\n\u222B(1/x)dx = ln|x| + C", difficulty: 1, topic: "Integrais" },
      { q: "Teorema Fundamental do Calculo:", a: "\u222B de a ate b f(x)dx = F(b) - F(a)\nonde F'(x) = f(x)\nA integral definida = area sob a curva.", difficulty: 1, topic: "Integrais" },
      { q: "Integracao por substituicao:", a: "Se \u222Bf(g(x))\u00B7g'(x)dx, faca u=g(x), du=g'(x)dx\nEx: \u222B2x\u00B7e^(x\u00B2)dx \u2192 u=x\u00B2, du=2xdx \u2192 e^u+C = e^(x\u00B2)+C", difficulty: 2, topic: "Integrais" },
      { q: "\u222Bsen(x)dx e \u222Bcos(x)dx = ?", a: "\u222Bsen(x)dx = -cos(x) + C\n\u222Bcos(x)dx = sen(x) + C", difficulty: 1, topic: "Integrais" },
    ]
  },
  python: {
    name: "Algoritmos e Prog.", icon: "\uD83D\uDC0D", color: "#22c55e",
    cards: [
      { q: "O que e um algoritmo?", a: "Sequencia FINITA de passos bem definidos\npara resolver um problema.\nTem: entrada, processamento, saida.", difficulty: 1, topic: "Intro" },
      { q: "Tipos primitivos em Python?", a: "int, float, str, bool, NoneType\ninput() SEMPRE retorna str!", difficulty: 1, topic: "Tipos" },
      { q: "Diferenca / vs // vs %", a: "/ divisao real (float)\n// divisao inteira (trunca)\n% modulo (resto)\n10/3=3.33  10//3=3  10%3=1", difficulty: 1, topic: "Tipos" },
      { q: "Conversao de tipos em Python:", a: "int('5') \u2192 5\nfloat('3.14') \u2192 3.14\nstr(42) \u2192 '42'\nbool(0) \u2192 False, bool(1) \u2192 True", difficulty: 1, topic: "Tipos" },
      { q: "if/elif/else em Python:", a: "if cond1:\n    bloco1\nelif cond2:\n    bloco2\nelse:\n    bloco3\nIndentacao OBRIGATORIA", difficulty: 1, topic: "Condicao" },
      { q: "Operadores logicos em Python:", a: "and: ambos True\nor: pelo menos um True\nnot: inverte\nOrdem: not > and > or", difficulty: 1, topic: "Condicao" },
      { q: "for vs while:", a: "for: sabe quantas vezes\nwhile: nao sabe\nbreak sai, continue pula", difficulty: 1, topic: "Repeticao" },
      { q: "range() como funciona?", a: "range(n): 0 ate n-1\nrange(a,b): a ate b-1\nrange(a,b,p): passo p\nNAO inclui o fim!", difficulty: 1, topic: "Repeticao" },
      { q: "while - estrutura basica:", a: "cont = 0\nwhile cont < 5:\n    print(cont)\n    cont += 1\nCuidado com loop infinito!", difficulty: 1, topic: "Repeticao" },
      { q: "Listas \u2014 metodos principais:", a: ".append(x) .insert(i,x) .remove(x)\n.pop(i) len() .sort()\nIndice comeca em 0!", difficulty: 2, topic: "Listas" },
      { q: "Fatiamento de listas:", a: "lista[ini:fim:passo]\nlista[::-1] \u2192 invertida\nlista[-1] \u2192 ultimo", difficulty: 2, topic: "Listas" },
      { q: "Matriz (lista de listas):", a: "m=[[1,2],[3,4]]\nm[0][0]\u21921  m[1][1]\u21924\nfor linha in m: for elem in linha:", difficulty: 2, topic: "Listas" },
      { q: "O que e depuracao?", a: "Encontrar e reduzir erros.\n3 tipos: sintaxe, runtime, logico\nPython tem pdb.", difficulty: 1, topic: "Depuracao" },
      { q: "3 tipos de erros:", a: "Sintaxe: codigo invalido\nRuntime: crash na execucao (1/0)\nLogico: roda mas resultado errado", difficulty: 1, topic: "Depuracao" },
      { q: "Escopo de variavel:", a: "Local: dentro da funcao\nGlobal: fora, todo modulo\nFuncao le global mas nao altera sem 'global'", difficulty: 2, topic: "Funcoes" },
      { q: "def e return:", a: "def nome(params): return valor\nprint()\u2192tela  return\u2192devolve\nSem return \u2192 retorna None", difficulty: 1, topic: "Funcoes" },
    ]
  },
  computacao: {
    name: "Conceitos Computacao", icon: "\uD83D\uDCBB", color: "#8b5cf6",
    cards: [
      // Introducao e Historia (Semana 1)
      { q: "O que e computacao?", a: "Ciencia que estuda o processamento\nautomatico de informacoes.\nEntrada \u2192 Processamento \u2192 Saida", difficulty: 1, topic: "Introducao" },
      { q: "O que e um algoritmo? (conceito geral)", a: "Sequencia finita e ordenada de passos\npara resolver um problema.\nExiste antes do computador (ex: receita de bolo).", difficulty: 1, topic: "Introducao" },
      { q: "Hardware vs Software:", a: "Hardware: parte fisica (CPU, RAM, HD)\nSoftware: parte logica (programas, SO)\nUm nao funciona sem o outro.", difficulty: 1, topic: "Introducao" },
      { q: "Geracoes de computadores:", a: "1a Valvulas (ENIAC, 1946)\n2a Transistores\n3a CIs (Circuitos Integrados)\n4a Microprocessadores\n5a IA/Quantica", difficulty: 1, topic: "Introducao" },
      { q: "ENIAC - primeiro computador eletronico:", a: "1946, Universidade da Pensilvania\n30 toneladas, 18.000 valvulas\nCriado para calculos balisticos (guerra).", difficulty: 1, topic: "Introducao" },
      // Representacao de Dados (Semana 2)
      { q: "Bit, Byte e unidades:", a: "Bit:0/1  Byte:8bits\n1KB=1024B  1MB=1024KB\n1GB=1024MB  1TB=1024GB", difficulty: 1, topic: "Dados" },
      { q: "Conversao decimal\u2192binario:", a: "Divisoes por 2, restos de baixo pra cima.\n13 = 1101 (base 2)\n13/2=6r1, 6/2=3r0, 3/2=1r1, 1/2=0r1", difficulty: 1, topic: "Dados" },
      { q: "Conversao binario\u2192decimal:", a: "Multiplica cada bit pela potencia de 2.\n1101 = 1x8 + 1x4 + 0x2 + 1x1 = 13", difficulty: 1, topic: "Dados" },
      { q: "Hexadecimal:", a: "Base16: 0-9, A(10), B(11)...F(15)\nCada digito hex = 4 bits\nFF = 1111 1111 = 255", difficulty: 1, topic: "Dados" },
      { q: "Tabela ASCII:", a: "Cada caractere = um numero.\n'A'=65, 'a'=97, '0'=48\nASCII: 7 bits = 128 caracteres\nUnicode: milhares de caracteres.", difficulty: 2, topic: "Dados" },
      // Aritmetica Binaria (Semana 3)
      { q: "Soma binaria - regras:", a: "0+0=0\n0+1=1\n1+0=1\n1+1=10 (0 e vai-um)\n1+1+1=11 (1 e vai-um)", difficulty: 1, topic: "Aritmetica" },
      { q: "Some: 1011 + 0110 =", a: "  1011\n+ 0110\n------\n 10001\n(11+6=17 em decimal, confere!)", difficulty: 2, topic: "Aritmetica" },
      { q: "Complemento de 2:", a: "Para representar negativos:\n1) Inverte todos os bits\n2) Soma 1\nEx: 5=0101 \u2192 1010+1 = 1011 = -5", difficulty: 2, topic: "Aritmetica" },
      { q: "Subtracao binaria com complemento de 2:", a: "A - B = A + complemento2(B)\nEx: 7-3 = 0111 + 1101 = 10100\nDescarta o carry \u2192 0100 = 4", difficulty: 2, topic: "Aritmetica" },
      // Portas Logicas (Semana 4)
      { q: "Portas logicas basicas:", a: "AND: ambas 1 \u2192 1\nOR: qualquer 1 \u2192 1\nNOT: inverte\nXOR: diferentes \u2192 1", difficulty: 1, topic: "Logica" },
      { q: "Portas NAND e NOR:", a: "NAND = NOT(AND) \u2192 so da 0 se ambas 1\nNOR = NOT(OR) \u2192 so da 1 se ambas 0\nNAND e porta UNIVERSAL!", difficulty: 1, topic: "Logica" },
      { q: "Algebra Booleana - identidades:", a: "A AND 1=A   A AND 0=0\nA OR 1=1    A OR 0=A\nA AND A=A   A OR A=A\nA AND (NOT A)=0   A OR (NOT A)=1", difficulty: 2, topic: "Logica" },
      { q: "De Morgan:", a: "NOT(A AND B) = NOT A OR NOT B\nNOT(A OR B) = NOT A AND NOT B\nQuebre a barra, troque a operacao!", difficulty: 2, topic: "Logica" },
      // Hardware (Semana 5)
      { q: "Arquitetura von Neumann:", a: "CPU(ULA+UC)+Memoria+E/S+Barramento\nDados e instrucoes na MESMA memoria\n(Arquitetura Harvard: memorias separadas)", difficulty: 1, topic: "Hardware" },
      { q: "Componentes da CPU:", a: "ULA: calculos aritmeticos e logicos\nUC: controla execucao das instrucoes\nRegistradores: memoria ultra-rapida na CPU", difficulty: 1, topic: "Hardware" },
      { q: "Barramentos:", a: "Barramento de Dados: transporta dados\nBarramento de Endereco: indica posicao na memoria\nBarramento de Controle: sinais de comando", difficulty: 1, topic: "Hardware" },
      { q: "Hierarquia de memoria:", a: "Registradores \u2192 Cache \u2192 RAM \u2192 SSD/HD\nMais rapido = menor e mais caro\nMais lento = maior e mais barato", difficulty: 1, topic: "Hardware" },
      { q: "RAM vs ROM:", a: "RAM: volatil, leitura/escrita, rapida\nROM: nao-volatil, so leitura\nRAM perde dados ao desligar!", difficulty: 1, topic: "Hardware" },
      // SO (Semana 6)
      { q: "Funcoes do SO:", a: "Gerencia: processos, memoria,\narquivos, dispositivos E/S\nInterface entre usuario e hardware.", difficulty: 1, topic: "SO" },
      { q: "Processo vs Thread:", a: "Processo: memoria propria, isolado\nThread: compartilha memoria, mais leve\nUm processo pode ter varias threads.", difficulty: 2, topic: "SO" },
      { q: "Compilador vs Interpretador:", a: "Compilador: traduz TUDO antes de executar (C, Java)\nInterpretador: linha a linha (Python)\nCompilado = mais rapido na execucao.", difficulty: 1, topic: "SO" },
      { q: "Gerenciamento de processos:", a: "Estados: Pronto, Executando, Bloqueado\nEscalonador decide quem executa\nMultitarefa: alterna processos rapidamente.", difficulty: 2, topic: "SO" },
      // Redes (Semana 7)
      { q: "Modelo OSI - 7 camadas:", a: "7.Aplicacao 6.Apresentacao 5.Sessao\n4.Transporte 3.Rede 2.Enlace 1.Fisica\nMnemonico: All People Seem To Need Data Processing", difficulty: 2, topic: "Redes" },
      { q: "TCP vs UDP:", a: "TCP: confiavel, ordenado, com conexao (HTTP, email)\nUDP: rapido, sem garantia, sem conexao (jogos, streaming)", difficulty: 1, topic: "Redes" },
      { q: "IP e DNS:", a: "IP: endereco numerico do computador na rede\nIPv4: 192.168.0.1 (32 bits)\nDNS: traduz nomes (google.com) em IPs", difficulty: 1, topic: "Redes" },
      { q: "Cloud Computing:", a: "IaaS: infraestrutura (EC2, servidores)\nPaaS: plataforma (Heroku, dev sem gerenciar server)\nSaaS: software pronto (Gmail, Google Docs)", difficulty: 1, topic: "Redes" },
    ]
  }
};

const QUIZ_BANK = {
  calculo: [
    { q: "Calcule o limite aplicando a Regra de L'Hospital:", context: "lim(x\u21920) (3x\u00B2 + 5x) / sen(x)\n\nSubstituindo x=0 diretamente: 0/0 \u2014 forma indeterminada.\nDerive numerador e denominador separadamente.", correct: "5", wrongs: ["0", "3", "\u221E", "1"], difficulty: 2, topic: "L'Hospital" },
    { q: "L'Hospital se aplica quando o limite da:", correct: "0/0 ou \u221E/\u221E", wrongs: ["0/1", "qualquer fracao", "1/0", "\u221E\u00B70"], difficulty: 1, topic: "L'Hospital" },
    { q: "Calcule o limite (pode aplicar L'Hospital mais de uma vez):", context: "lim(x\u2192+\u221E) e^x / 3x\u00B2\n\nAo tender x\u2192+\u221E: numerador \u2192 \u221E e denominador \u2192 \u221E \u2014 forma \u221E/\u221E.", correct: "+\u221E", wrongs: ["0", "1/3", "3", "Nao existe"], difficulty: 2, topic: "L'Hospital" },
    { q: "lim(x\u21920) sen(x)/x =", correct: "1", wrongs: ["0", "\u221E", "sen(1)", "Nao existe"], difficulty: 1, topic: "L'Hospital" },
    { q: "Derivada de x^5:", correct: "5x^4", wrongs: ["x^4", "5x^5", "4x^5", "x^4/5"], difficulty: 1, topic: "Derivacao" },
    { q: "Derivada de e^x:", correct: "e^x", wrongs: ["xe^(x-1)", "x\u00B7e^x", "e^(x+1)", "1/e^x"], difficulty: 1, topic: "Derivacao" },
    { q: "Derivada de sen(x):", correct: "cos(x)", wrongs: ["-cos(x)", "sen(x)", "-sen(x)", "1/cos(x)"], difficulty: 1, topic: "Derivacao" },
    { q: "Derivada de cos(x):", correct: "-sen(x)", wrongs: ["sen(x)", "cos(x)", "-cos(x)", "1/sen(x)"], difficulty: 1, topic: "Derivacao" },
    { q: "Derivada de ln(x):", correct: "1/x", wrongs: ["x", "ln(x)/x", "e^x", "1/x\u00B2"], difficulty: 1, topic: "Derivacao" },
    { q: "Derivada de x\u00B3 + 2x:", correct: "3x\u00B2 + 2", wrongs: ["x\u00B2 + 2", "3x\u00B2 + 2x", "3x + 2", "x^4/4 + x\u00B2"], difficulty: 1, topic: "Derivacao" },
    { q: "Derive f(x) = x\u00B2 \u00B7 e^x:", context: "Regra do produto: (u \u00B7 v)' = u'v + uv'\nu = x\u00B2  \u2192  u' = 2x\nv = e^x  \u2192  v' = e^x", correct: "(x\u00B2 + 2x) \u00B7 e^x", wrongs: ["2x \u00B7 e^x", "x\u00B2 \u00B7 e^x", "2x \u00B7 e^(x-1)", "2x\u00B2 \u00B7 e^x"], difficulty: 2, topic: "Derivacao" },
    { q: "Derive f(x) = sen(x) / x:", context: "Regra do quociente: (u/v)' = (u'v \u2212 uv') / v\u00B2\nu = sen(x)  \u2192  u' = cos(x)\nv = x  \u2192  v' = 1", correct: "(x\u00B7cos(x) \u2212 sen(x)) / x\u00B2", wrongs: ["cos(x)/x", "(cos(x) \u2212 sen(x))/x\u00B2", "cos(x)/1", "(x\u00B7sen(x) \u2212 cos(x))/x\u00B2"], difficulty: 2, topic: "Derivacao" },
    { q: "Derivada de (2x)e^x:", correct: "2e^x + 2xe^x", wrongs: ["2e^x", "2xe^x", "(2x+2)e^(x-1)", "2e^x\u00B7e^x"], difficulty: 2, topic: "Derivacao" },
    { q: "Derivada de 2x/(x+1):", correct: "2/(x+1)\u00B2", wrongs: ["2/(x+1)", "2x/(x+1)\u00B2", "(2x+2)/(x+1)\u00B2", "1/(x+1)"], difficulty: 2, topic: "Derivacao" },
    { q: "Derivada de 7x\u00B3 - 2x + 4:", correct: "21x\u00B2 - 2", wrongs: ["7x\u00B2 - 2", "21x\u00B3 - 2", "21x\u00B2 - 2x", "7x\u00B2 - 2x + 4"], difficulty: 1, topic: "Derivacao" },
    { q: "[f(g(x))]' pela regra da cadeia:", correct: "f'(g(x)) \u00B7 g'(x)", wrongs: ["f'(x)\u00B7g'(x)", "f(g'(x))", "f'(g'(x))", "f(g(x))\u00B7g'(x)"], difficulty: 1, topic: "Cadeia" },
    { q: "Derivada de sen(x\u00B2+5x):", correct: "cos(x\u00B2+5x)\u00B7(2x+5)", wrongs: ["cos(x\u00B2+5x)", "cos(2x+5)", "sen(x\u00B2+5x)\u00B7(2x+5)", "-cos(x\u00B2+5x)\u00B7(2x+5)"], difficulty: 2, topic: "Cadeia" },
    { q: "Derivada de (x\u00B2+5x)^10:", correct: "10(x\u00B2+5x)^9\u00B7(2x+5)", wrongs: ["10(x\u00B2+5x)^9", "(x\u00B2+5x)^9\u00B7(2x+5)", "10(2x+5)^9", "10x(x\u00B2+5x)^9"], difficulty: 2, topic: "Cadeia" },
    { q: "Derivada de e^(3x\u00B2+1):", correct: "6x\u00B7e^(3x\u00B2+1)", wrongs: ["e^(3x\u00B2+1)", "3x\u00B2\u00B7e^(3x\u00B2+1)", "(6x+1)\u00B7e^(3x\u00B2+1)", "e^(6x)"], difficulty: 2, topic: "Cadeia" },
    { q: "Se f'(x) > 0 no intervalo, f e:", correct: "Crescente", wrongs: ["Decrescente", "Constante", "Concava pra cima", "Tem maximo"], difficulty: 1, topic: "Comportamento" },
    { q: "Ponto critico e onde:", correct: "f'(p) = 0", wrongs: ["f(p) = 0", "f''(p) = 0", "f'(p) > 0", "f(p) = f'(p)"], difficulty: 1, topic: "Max/Min" },
    { q: "f'(p)=0 e f''(p)>0 \u2192 p e:", correct: "Minimo local", wrongs: ["Maximo local", "Ponto de inflexao", "Indefinido", "Maximo global"], difficulty: 1, topic: "Max/Min" },
    { q: "f'(p)=0 e f''(p)<0 \u2192 p e:", correct: "Maximo local", wrongs: ["Minimo local", "Ponto de inflexao", "Ponto de sela", "Indefinido"], difficulty: 1, topic: "Max/Min" },
    { q: "Classifique o ponto critico x = 0 da funcao:", context: "f(x) = 4x\u00B3 + 5x\u00B2\nf'(x) = 12x\u00B2 + 10x = 0  \u2192  x = 0  ou  x = \u22125/6\nf''(x) = 24x + 10  \u2192  f''(0) = 10", correct: "Minimo local (f'' > 0)", wrongs: ["Maximo local (f'' < 0)", "Ponto de inflexao", "Inconclusivo", "Maximo global"], difficulty: 2, topic: "Max/Min" },
    { q: "Qual e a aceleracao a(t) desse objeto?", context: "A velocidade de um objeto e dada por: v(t) = 3t\u00B2 - 2t\nRelacao: a(t) = v'(t)", correct: "6t - 2", wrongs: ["3t\u00B2 - 2t", "t\u00B3 - t\u00B2", "6t\u00B2 - 2", "3t - 2"], difficulty: 1, topic: "Taxa" },
    { q: "Qual e a velocidade do objeto em t = 2s?", context: "A posicao de um objeto e: x(t) = t\u00B3 - t\u00B2\nRelacao cinematica: v(t) = x'(t)", correct: "8 m/s", wrongs: ["4 m/s", "6 m/s", "12 m/s", "2 m/s"], difficulty: 2, topic: "Taxa" },
    { q: "\u222Bx\u00B3 dx =", correct: "x^4/4 + C", wrongs: ["3x\u00B2", "x^4+C", "x\u00B3/3+C", "4x^4+C"], difficulty: 1, topic: "Integrais" },
    { q: "\u222Bsen(x) dx =", correct: "-cos(x) + C", wrongs: ["cos(x) + C", "sen(x) + C", "-sen(x) + C", "1/cos(x) + C"], difficulty: 1, topic: "Integrais" },
    { q: "Calcule a integral definida:", context: "\u222B\u2080\u00B9 2x dx\n\nTFC: \u222B[a,b] f(x)dx = F(b) \u2212 F(a), onde F'(x) = f(x)", correct: "1", wrongs: ["2", "0", "0.5", "4"], difficulty: 2, topic: "Integrais" },
    { q: "Resolva a integral por substituicao:", context: "\u222B 2x \u00B7 e^(x\u00B2) dx\n\nFaca: u = x\u00B2  \u2192  du = 2x dx\nEntao a integral vira: \u222B e^u du", correct: "e^(x\u00B2) + C", wrongs: ["2x \u00B7 e^(x\u00B2) + C", "x\u00B2 \u00B7 e^(x\u00B2) + C", "e^(2x) + C", "2e^(x\u00B2) + C"], difficulty: 2, topic: "Integrais" },
  ],
  python: [
    { q: "O que e um algoritmo?", correct: "Sequencia finita de passos para resolver um problema", wrongs: ["Um programa de computador", "Uma linguagem de programacao", "Um tipo de dado", "Um comando Python"], difficulty: 1, topic: "Intro" },
    { q: "10 // 3 =", correct: "3", wrongs: ["3.33", "3.0", "4", "1"], difficulty: 1, topic: "Tipos" },
    { q: "10 % 3 =", correct: "1", wrongs: ["3", "3.33", "0", "10"], difficulty: 1, topic: "Tipos" },
    { q: "type(input('x: ')) e sempre:", correct: "str", wrongs: ["int", "float", "depende da entrada", "auto"], difficulty: 1, topic: "Tipos" },
    { q: "type(3.0) retorna:", correct: "float", wrongs: ["int", "str", "number", "double"], difficulty: 1, topic: "Tipos" },
    { q: "2 ** 4 =", correct: "16", wrongs: ["8", "6", "24", "2"], difficulty: 1, topic: "Tipos" },
    { q: "bool(0), bool(''), bool([]) sao:", correct: "False, False, False", wrongs: ["True, True, True", "False, True, False", "True, False, True", "0, '', []"], difficulty: 2, topic: "Tipos" },
    { q: "'abc'[1] =", correct: "'b'", wrongs: ["'a'", "'c'", "Erro", "'ab'"], difficulty: 1, topic: "Tipos" },
    { q: "int('7') + float('3.0') =", correct: "10.0", wrongs: ["10", "'73.0'", "Erro", "73"], difficulty: 1, topic: "Tipos" },
    { q: "Qual e a saida do programa?", context: "x = 5\nif x > 3:\n    print('A')\nelif x > 4:\n    print('B')", correct: "A", wrongs: ["B", "A e B", "Nada imprime", "Erro de sintaxe"], difficulty: 2, topic: "Condicao" },
    { q: "not (True and False) =", correct: "True", wrongs: ["False", "None", "Erro", "0"], difficulty: 2, topic: "Condicao" },
    { q: "5 > 3 and 2 < 1 =", correct: "False", wrongs: ["True", "Erro", "None", "5"], difficulty: 1, topic: "Condicao" },
    { q: "Qual sequencia de valores e impressa?", context: "for i in range(3):\n    print(i)", correct: "0, 1, 2", wrongs: ["1, 2, 3", "0, 1, 2, 3", "3", "1, 2"], difficulty: 1, topic: "Repeticao" },
    { q: "Qual sequencia e impressa pelo laco abaixo?", context: "for i in range(1, 8, 2):\n    print(i)", correct: "1, 3, 5, 7", wrongs: ["1, 2, 3, 4, 5, 6, 7", "2, 4, 6, 8", "1, 3, 5", "0, 2, 4, 6"], difficulty: 2, topic: "Repeticao" },
    { q: "range(5) gera:", correct: "0, 1, 2, 3, 4", wrongs: ["1, 2, 3, 4, 5", "0, 1, 2, 3, 4, 5", "5", "1, 2, 3, 4"], difficulty: 1, topic: "Repeticao" },
    { q: "break em um loop:", correct: "Sai do loop completamente", wrongs: ["Pula iteracao", "Encerra programa", "Reinicia loop", "Pausa execucao"], difficulty: 1, topic: "Repeticao" },
    { q: "continue em um loop:", correct: "Pula para proxima iteracao", wrongs: ["Sai do loop", "Encerra programa", "Reinicia do zero", "Pausa"], difficulty: 1, topic: "Repeticao" },
    { q: "O que o programa abaixo imprime?", context: "for i in range(5):\n    if i == 3:\n        break\n    print(i)", correct: "0, 1, 2", wrongs: ["0, 1, 2, 3", "0, 1, 2, 4", "0, 1, 2, 3, 4", "3"], difficulty: 2, topic: "Repeticao" },
    { q: "[10,20,30][-1] =", correct: "30", wrongs: ["10", "Erro", "-1", "20"], difficulty: 1, topic: "Listas" },
    { q: "l=[1,2,3]; l.append([4,5]); len(l)=", correct: "4", wrongs: ["5", "3", "6", "Erro"], difficulty: 2, topic: "Listas" },
    { q: "[1,2,3,4,5][1:4] =", correct: "[2, 3, 4]", wrongs: ["[1,2,3,4]", "[2,3]", "[1,2,3]", "[2,3,4,5]"], difficulty: 2, topic: "Listas" },
    { q: "[1,2,3][::-1] =", correct: "[3, 2, 1]", wrongs: ["[1,2,3]", "Erro", "[3,2]", "[1,3]"], difficulty: 2, topic: "Listas" },
    { q: "m=[[1,2],[3,4]]; m[1][0] =", correct: "3", wrongs: ["1", "2", "4", "Erro"], difficulty: 2, topic: "Listas" },
    { q: "Qual e a saida do programa?", context: "def f(x):\n    return x * 2\n\nprint(f(3))", correct: "6", wrongs: ["3", "x*2", "None", "Erro"], difficulty: 1, topic: "Funcoes" },
    { q: "Qual e a saida do programa? (atencao ao return)", context: "def f(x):\n    x * 2    # sem return!\n\nprint(f(3))", correct: "None", wrongs: ["6", "3", "Erro", "0"], difficulty: 2, topic: "Funcoes" },
    { q: "Qual valor e impresso? (escopo de variaveis)", context: "x = 10\n\ndef f():\n    x = 5   # variavel LOCAL\n\nf()\nprint(x)", correct: "10", wrongs: ["5", "Erro", "None", "15"], difficulty: 3, topic: "Funcoes" },
    { q: "print(1/0) gera erro de:", correct: "Runtime (ZeroDivisionError)", wrongs: ["Sintaxe", "Logico", "Nao gera erro", "TypeError"], difficulty: 1, topic: "Depuracao" },
    { q: "Erro logico e quando:", correct: "Roda mas resultado errado", wrongs: ["Python nao executa", "Crash na execucao", "Falta parentese", "Variavel nao existe"], difficulty: 1, topic: "Depuracao" },
    { q: "Depuracao serve para:", correct: "Encontrar e reduzir erros", wrongs: ["Compilar codigo", "Otimizar performance", "Documentar", "Converter tipos"], difficulty: 1, topic: "Depuracao" },
  ],
  computacao: [
    { q: "O que e computacao?", correct: "Processamento automatico de informacoes", wrongs: ["So programacao", "So hardware", "So internet", "So matematica"], difficulty: 1, topic: "Introducao" },
    { q: "1a geracao de computadores usava:", correct: "Valvulas", wrongs: ["Transistores", "CIs", "Microprocessadores", "Reles"], difficulty: 1, topic: "Introducao" },
    { q: "ENIAC foi criado em:", correct: "1946", wrongs: ["1960", "1975", "1935", "1955"], difficulty: 1, topic: "Introducao" },
    { q: "1 byte =", correct: "8 bits", wrongs: ["4 bits", "16 bits", "1024 bits", "2 bits"], difficulty: 1, topic: "Dados" },
    { q: "Qual a representacao binaria do numero decimal 13?", context: "Metodo: divida por 2 e anote os restos; leia de baixo para cima.\n13 / 2 = 6 resto 1\n 6 / 2 = 3 resto 0\n 3 / 2 = 1 resto 1\n 1 / 2 = 0 resto 1", correct: "1101", wrongs: ["1011", "1110", "1001", "1111"], difficulty: 1, topic: "Dados" },
    { q: "Converta 1010\u2082 para decimal:", context: "Metodo: multiplique cada bit pela potencia de 2 correspondente.\n b\u2083\u00D78 + b\u2082\u00D74 + b\u2081\u00D72 + b\u2080\u00D71\n  1 \u00D78 +  0 \u00D74 +  1 \u00D72 +  0 \u00D71", correct: "10", wrongs: ["8", "12", "5", "1010"], difficulty: 1, topic: "Dados" },
    { q: "FF hex =", correct: "255", wrongs: ["256", "16", "15", "127"], difficulty: 1, topic: "Dados" },
    { q: "11001 (base 2) em decimal:", correct: "25", wrongs: ["19", "27", "21", "24"], difficulty: 2, topic: "Dados" },
    { q: "Qual e o complemento de 2 do numero +5 = 0101?", context: "Representacao de negativos em binario (complemento de 2):\nPasso 1: Inverta todos os bits\nPasso 2: Some 1 ao resultado", correct: "Inverte \u2192 1010, soma 1 \u2192 1011 (representa \u22125)", wrongs: ["Apenas inverte \u2192 1010", "Subtrai de 1111 \u2192 1010", "Soma 1 diretamente \u2192 0110", "Inverte e subtrai 1 \u2192 1001"], difficulty: 2, topic: "Aritmetica" },
    { q: "Qual o codigo decimal do caractere 'A' na tabela ASCII?", context: "Tabela ASCII (referencia parcial):\n'0' (zero)   = 48\n'a' (minsculo) = 97\n'espaco'     = 32", correct: "65", wrongs: ["97", "48", "32", "90"], difficulty: 2, topic: "Dados" },
    { q: "1011 + 0110 em binario =", correct: "10001", wrongs: ["1101", "10010", "1111", "10000"], difficulty: 2, topic: "Aritmetica" },
    { q: "Na soma binaria, 1+1 =", correct: "10 (0 e vai-um)", wrongs: ["2", "11", "0", "1"], difficulty: 1, topic: "Aritmetica" },
    { q: "AND so retorna 1 quando:", correct: "Ambas entradas sao 1", wrongs: ["Qualquer e 1", "Ambas sao 0", "Sao diferentes", "Pelo menos uma e 0"], difficulty: 1, topic: "Logica" },
    { q: "XOR retorna 1 quando:", correct: "Entradas sao diferentes", wrongs: ["Ambas 1", "Ambas 0", "Qualquer e 1", "Nenhuma e 1"], difficulty: 1, topic: "Logica" },
    { q: "NOT(A AND B) por De Morgan:", correct: "NOT A OR NOT B", wrongs: ["NOT A AND NOT B", "A OR B", "NOT(A OR B)", "A AND NOT B"], difficulty: 2, topic: "Logica" },
    { q: "1 AND 0 =", correct: "0", wrongs: ["1", "10", "Erro", "Indefinido"], difficulty: 1, topic: "Logica" },
    { q: "0 OR 1 =", correct: "1", wrongs: ["0", "01", "Erro", "Indefinido"], difficulty: 1, topic: "Logica" },
    { q: "1 XOR 1 =", correct: "0", wrongs: ["1", "2", "11", "Erro"], difficulty: 2, topic: "Logica" },
    { q: "Por que a porta NAND e chamada de 'porta universal'?", context: "NAND = NOT(AND)\nTabela verdade: 0,0\u21921 | 0,1\u21921 | 1,0\u21921 | 1,1\u21920\nEx: NOT A = NAND(A,A) | AND = NOT(NAND(A,B))", correct: "Pode implementar qualquer outra porta logica sozinha", wrongs: ["E a operacao mais rapida em hardware", "Usa menos energia que as demais", "E a porta mais simples de fabricar", "Aceita mais de duas entradas"], difficulty: 2, topic: "Logica" },
    { q: "Na Arquitetura de von Neumann, onde ficam dados e instrucoes?", context: "Arquitetura de von Neumann: CPU + Memoria + Barramento + E/S\nArquitetura Harvard (alternativa): usa memorias separadas para\ndados e instrucoes.", correct: "Na mesma memoria", wrongs: ["Em memorias separadas (como na Harvard)", "Somente na CPU", "No barramento de dados", "Em registradores"], difficulty: 1, topic: "Hardware" },
    { q: "ULA e responsavel por:", correct: "Calculos aritmeticos e logicos", wrongs: ["Controlar execucao", "Armazenar dados", "Conectar perifericos", "Gerenciar memoria"], difficulty: 1, topic: "Hardware" },
    { q: "Memoria mais rapida:", correct: "Registradores", wrongs: ["Cache L1", "RAM", "SSD", "Cache L3"], difficulty: 1, topic: "Hardware" },
    { q: "RAM e memoria:", correct: "Volatil, leitura e escrita", wrongs: ["Nao-volatil, so leitura", "Volatil, so leitura", "Nao-volatil, leitura/escrita", "Permanente"], difficulty: 1, topic: "Hardware" },
    { q: "Barramento de dados serve para:", correct: "Transportar dados entre componentes", wrongs: ["Indicar enderecos", "Enviar sinais de controle", "Armazenar dados", "Conectar a internet"], difficulty: 1, topic: "Hardware" },
    { q: "Compilador:", correct: "Traduz tudo antes de executar", wrongs: ["Traduz linha por linha", "Apenas verifica erros", "So funciona com Python", "E um tipo de SO"], difficulty: 1, topic: "SO" },
    { q: "Thread vs processo:", correct: "Thread compartilha memoria do processo", wrongs: ["Thread tem memoria propria", "Thread e mais pesada", "Processo compartilha memoria", "Sao sinonimos"], difficulty: 2, topic: "SO" },
    { q: "SO gerencia:", correct: "Processos, memoria, arquivos e E/S", wrongs: ["So processos", "So hardware", "So arquivos", "So interface grafica"], difficulty: 1, topic: "SO" },
    { q: "TCP vs UDP \u2014 TCP e:", correct: "Confiavel e ordenado", wrongs: ["Mais rapido", "Sem confirmacao", "Usado em jogos", "Sem conexao"], difficulty: 1, topic: "Redes" },
    { q: "Qual camada do modelo OSI e responsavel pelo roteamento entre redes distintas?", context: "Modelo OSI (7 camadas):\n7-Aplicacao | 6-Apresentacao | 5-Sessao\n4-Transporte | 3-Rede | 2-Enlace | 1-Fisica", correct: "Camada de Rede (3)", wrongs: ["Camada de Transporte (4)", "Camada de Enlace (2)", "Camada Fisica (1)", "Camada de Sessao (5)"], difficulty: 2, topic: "Redes" },
    { q: "IaaS, PaaS, SaaS sao modelos de:", correct: "Cloud Computing", wrongs: ["Redes locais", "Sistemas operacionais", "Protocolos", "Tipos de memoria"], difficulty: 1, topic: "Redes" },
    { q: "DNS traduz:", correct: "Nomes de dominio em IPs", wrongs: ["IPs em MACs", "Dados em binario", "Pacotes em frames", "Emails em URLs"], difficulty: 1, topic: "Redes" },
  ]
};

const MODES = { MENU: "menu", STUDY: "study", QUIZ: "quiz", EXAM: "exam", AI_TUTOR: "ai_tutor", FORMULAS: "formulas" };
function shuffle(arr) { const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }

function loadStats() {
  try { const d = localStorage.getItem("univesp-stats-v5"); return d ? JSON.parse(d) : {}; } catch { return {}; }
}
function saveStats(s) {
  try { localStorage.setItem("univesp-stats-v5", JSON.stringify(s)); } catch {}
}

export default function App() {
  const [mode, setMode] = useState(MODES.MENU);
  const [prevMode, setPrevMode] = useState(MODES.MENU);
  const [subject, setSubject] = useState(null);
  const [ci, setCi] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [stats, setStats] = useState(loadStats);
  const [qs, setQs] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [done, setDone] = useState(false);
  const [sel, setSel] = useState(null);
  const [fTopic, setFTopic] = useState(null);
  const [diff, setDiff] = useState("normal");
  const [daysLeft] = useState(() => Math.max(0, Math.ceil((new Date("2026-03-26") - new Date()) / 86400000)));
  const [aiSubject, setAiSubject] = useState("calculo");
  const [aiQ, setAiQ] = useState("");
  const [timerVal, setTimerVal] = useState(90);
  const [diffFilter, setDiffFilter] = useState(null);
  const kbRef = useRef({});

  const save = useCallback((s)=>{ setStats(s); saveStats(s); },[]);
  const mark = useCallback((k,ok)=>{ const p=stats[k]||{c:0,w:0}; save({...stats,[k]:{c:p.c+(ok?1:0),w:p.w+(ok?0:1)}}); },[stats,save]);

  const fc = subject ? FLASHCARDS[subject] : null;
  const filtered = fc ? fc.cards.map((c,i)=>({...c,oi:i}))
    .filter(c=>!fTopic||c.topic===fTopic)
    .filter(c=>{if(!diffFilter)return true;if(diffFilter==='wrong'){const k=`c-${subject}-${c.oi}`;return stats[k]&&stats[k].w>0;}return c.difficulty===diffFilter;}) : [];
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

  const go = (m,s,d)=>{ setMode(m);setSubject(s);setCi(0);setFlipped(false);setSel(null);setAnswers([]);setDone(false);setDiff(d||"normal");setFTopic(null);setDiffFilter(null); };
  const startQuiz=(s,d)=>{ go(MODES.QUIZ,s,d); setQs(mkQuiz(s,d)); };
  const startExam=()=>{ go(MODES.EXAM,null,"exam"); setQs(mkExam()); };

  const answer=(i)=>{ if(sel!==null)return; setSel(i); const q=qs[ci]; const ok=i===q.ci; mark(`q-${q.subj||subject}-${q.qi}`,ok); setAnswers([...answers,{sel:i,ok}]); };
  const next=()=>{ if(ci+1>=qs.length)setDone(true); else{setCi(ci+1);setSel(null);} };

  const getStat=(s)=>{ const b=QUIZ_BANK[s]; let at=0,r=0; b.forEach((_,i)=>{const k=`q-${s}-${i}`;if(stats[k]){at+=stats[k].c+stats[k].w;r+=stats[k].c;}}); return{t:b.length,at,r,p:at>0?Math.round(r/at*100):0}; };

  const dl=(d)=>d===1?"Facil":d===2?"Medio":"Dificil";
  const dc=(d)=>d===1?"#22c55e":d===2?"#f59e0b":"#ef4444";
  const isQ=mode===MODES.QUIZ||mode===MODES.EXAM;

  const resetStats = () => { if(confirm("Zerar todas as estatisticas?")) { save({}); }};

  // Always expose latest values to keyboard handler without re-registering listener
  kbRef.current = { mode, flipped, ci, sel, done, isQ, filtered, cur, qs, subject, mark, answer, next };

  // Keyboard shortcuts (registered once)
  useEffect(() => {
    const h = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      const { mode, flipped, ci, sel, done, isQ, filtered, cur, qs, subject, mark, answer, next } = kbRef.current;
      if (mode === MODES.STUDY && cur) {
        if (e.code === 'Space') { e.preventDefault(); setFlipped(f => !f); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); setFlipped(false); setCi(c => Math.max(0, c - 1)); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); setFlipped(false); setCi(c => Math.min(filtered.length - 1, c + 1)); }
        else if (e.key === '1' && flipped) { mark(`c-${subject}-${cur.oi}`, false); setFlipped(false); setCi(c => Math.min(filtered.length - 1, c + 1)); }
        else if (e.key === '2' && flipped) { mark(`c-${subject}-${cur.oi}`, true); setFlipped(false); setCi(c => Math.min(filtered.length - 1, c + 1)); }
      } else if (isQ && !done && qs.length > 0) {
        const q = qs[ci];
        if (['1','2','3','4'].includes(e.key) && sel === null) { const idx = parseInt(e.key) - 1; if (idx < q.opts.length) answer(idx); }
        else if (e.key === 'Enter' && sel !== null) { next(); }
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Timer countdown — reset when question changes or mode leaves quiz
  useEffect(() => {
    if (!isQ || done || sel !== null) return;
    setTimerVal(90);
    const id = setInterval(() => setTimerVal(v => Math.max(0, v - 1)), 1000);
    return () => clearInterval(id);
  }, [ci, isQ, done, sel]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-submit when timer hits 0
  useEffect(() => {
    if (timerVal !== 0 || !isQ || done || sel !== null || qs.length === 0) return;
    const q = qs[ci];
    const wi = q.opts.findIndex((_, i) => i !== q.ci);
    answer(wi >= 0 ? wi : 0);
  }, [timerVal]); // eslint-disable-line react-hooks/exhaustive-deps

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
            {mode!==MODES.MENU&&<button className="b" onClick={()=>{setMode(MODES.MENU);setFTopic(null);}} style={{background:"rgba(255,255,255,.08)",color:"#94a3b8",padding:"6px 12px",fontSize:12}}>&larr; Menu</button>}
            <h1 style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:18,fontWeight:700}}>UNIVESP <span style={{color:"#6366f1"}}>Study</span></h1>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {mode===MODES.MENU && <button className="b" onClick={resetStats} style={{background:"rgba(255,255,255,.05)",color:"#64748b",padding:"4px 8px",fontSize:10}}>Zerar</button>}
            <div style={{background:daysLeft<=1?"rgba(239,68,68,.2)":"rgba(245,158,11,.2)",padding:"4px 10px",borderRadius:6,fontSize:12,color:daysLeft<=1?"#fca5a5":"#fcd34d"}}>{daysLeft===0?"HOJE!":`${daysLeft}d`}</div>
          </div>
        </div>
      </div>

      <div style={{maxWidth:680,margin:"0 auto"}}>
        {mode===MODES.MENU&&(
          <div>
            <button className="b" onClick={startExam} style={{width:"100%",marginBottom:8,background:"linear-gradient(135deg,rgba(239,68,68,.2),rgba(245,158,11,.2))",border:"1px solid rgba(239,68,68,.3)",color:"#fca5a5",padding:"14px 0",fontSize:14,fontWeight:600}}>SIMULADO PROVA - 15 questoes mistas</button>
            <button className="b" onClick={()=>{setAiQ("");setPrevMode(mode);setMode(MODES.AI_TUTOR);}} style={{width:"100%",marginBottom:6,background:"linear-gradient(135deg,rgba(99,102,241,.12),rgba(139,92,246,.12))",border:"1px solid rgba(99,102,241,.25)",color:"#a5b4fc",padding:"11px 0",fontSize:13,fontWeight:500}}>Tutor IA &mdash; tire duvidas sobre qualquer topico</button>
            <button className="b" onClick={()=>setMode(MODES.FORMULAS)} style={{width:"100%",marginBottom:12,background:"linear-gradient(135deg,rgba(245,158,11,.1),rgba(234,179,8,.07))",border:"1px solid rgba(245,158,11,.2)",color:"#fbbf24",padding:"11px 0",fontSize:13,fontWeight:500}}>Folha de Formulas &mdash; derivadas, integrais, L'Hospital</button>
            {(()=>{
              const weak=[];
              Object.entries(QUIZ_BANK).forEach(([s,bank])=>{
                const tm={};
                bank.forEach((q,i)=>{const st=stats[`q-${s}-${i}`];if(!st)return;if(!tm[q.topic])tm[q.topic]={c:0,w:0};tm[q.topic].c+=st.c;tm[q.topic].w+=st.w;});
                Object.entries(tm).forEach(([topic,ts])=>{const tot=ts.c+ts.w;if(tot>=2){const acc=Math.round(ts.c/tot*100);if(acc<70)weak.push({s,topic,acc,color:FLASHCARDS[s].color,icon:FLASHCARDS[s].icon});}});
              });
              weak.sort((a,b)=>a.acc-b.acc);
              if(!weak.length)return null;
              return(
                <div style={{background:"rgba(239,68,68,.06)",border:"1px solid rgba(239,68,68,.2)",borderRadius:12,padding:14,marginBottom:12}}>
                  <div style={{fontSize:12,color:"#f87171",fontWeight:600,marginBottom:8}}>Pontos Fracos &mdash; Revisar!</div>
                  {weak.slice(0,5).map(({s,topic,acc,color,icon})=>(
                    <div key={`${s}-${topic}`} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                      <span style={{fontSize:12,color:"#94a3b8"}}>{icon} {topic}</span>
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        <span style={{fontSize:11,color:"#ef4444",fontWeight:600}}>{acc}%</span>
                        <button className="b" onClick={()=>{go(MODES.STUDY,s);setFTopic(topic);}} style={{fontSize:10,padding:"2px 8px",background:`${color}20`,color,border:`1px solid ${color}30`}}>Revisar</button>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
            <div style={{display:"grid",gap:12}}>
              {Object.entries(FLASHCARDS).map(([k,s])=>{const st=getStat(k);return(
                <div key={k} style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",borderRadius:12,padding:16,borderLeft:`3px solid ${s.color}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <div><span style={{fontSize:18,marginRight:8}}>{s.icon}</span><span style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:15,fontWeight:600}}>{s.name}</span>
                      <span style={{fontSize:11,color:"#64748b",marginLeft:8}}>{FLASHCARDS[k].cards.length} cards / {QUIZ_BANK[k].length} quiz</span>
                    </div>
                    {st.at>0&&<span className="tg" style={{background:`${s.color}22`,color:s.color}}>{st.p}%</span>}
                  </div>
                  {st.at>0&&<div style={{marginBottom:10}}><div className="pb"><div className="pf" style={{width:`${st.p}%`,background:s.color}}/></div><div style={{fontSize:11,color:"#64748b",marginTop:3}}>{st.r}/{st.at} acertos</div></div>}
                  <div style={{display:"flex",gap:6}}>
                    <button className="b" onClick={()=>{go(MODES.STUDY,k);}} style={{flex:1,background:`${s.color}15`,color:s.color,padding:"9px 0",fontSize:12}}>Cards</button>
                    <button className="b" onClick={()=>startQuiz(k,"normal")} style={{flex:1,background:`${s.color}15`,color:s.color,padding:"9px 0",fontSize:12}}>Normal</button>
                    <button className="b" onClick={()=>startQuiz(k,"hard")} style={{flex:1,background:`${s.color}25`,color:s.color,padding:"9px 0",fontSize:12,fontWeight:600}}>Dificil</button>
                  </div>
                </div>
              );})}
            </div>
          </div>
        )}

        {mode===MODES.STUDY&&fc&&(
          <div>
            <div style={{marginBottom:4,display:"flex",flexWrap:"wrap",gap:0}}>
              <span className={`ch ${!fTopic?'a':''}`} onClick={()=>{setFTopic(null);setCi(0);setFlipped(false);}}>Todos</span>
              {topics(subject).map(t=><span key={t} className={`ch ${fTopic===t?'a':''}`} onClick={()=>{setFTopic(fTopic===t?null:t);setCi(0);setFlipped(false);}}>{t}</span>)}
            </div>
            <div style={{marginBottom:10,display:"flex",flexWrap:"wrap",gap:0}}>
              {[1,2,3].map(d=><span key={d} className={`ch ${diffFilter===d?'a':''}`} style={{color:diffFilter===d?dc(d):'inherit'}} onClick={()=>{setDiffFilter(diffFilter===d?null:d);setCi(0);setFlipped(false);}}>{dl(d)}</span>)}
              <span className={`ch ${diffFilter==='wrong'?'a':''}`} style={{color:diffFilter==='wrong'?'#ef4444':'inherit'}} onClick={()=>{setDiffFilter(diffFilter==='wrong'?null:'wrong');setCi(0);setFlipped(false);}}>Errei</span>
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
                <button className="b" onClick={()=>{mark(`c-${subject}-${cur.oi}`,false);setFlipped(false);setCi(Math.min(ci+1,filtered.length-1));}} style={{flex:1,background:"rgba(239,68,68,.15)",color:"#fca5a5",padding:"11px 0",fontSize:13}}>Errei</button>
                <button className="b" onClick={()=>{mark(`c-${subject}-${cur.oi}`,true);setFlipped(false);setCi(Math.min(ci+1,filtered.length-1));}} style={{flex:1,background:"rgba(34,197,94,.15)",color:"#86efac",padding:"11px 0",fontSize:13}}>Acertei</button>
              </div>}
              <div style={{display:"flex",gap:6}}>
                <button className="b" disabled={ci===0} onClick={()=>{setFlipped(false);setCi(ci-1);}} style={{flex:1,background:"rgba(255,255,255,.05)",color:ci===0?"#334155":"#94a3b8",padding:"9px 0",fontSize:12}}>&larr;</button>
                <button className="b" onClick={()=>{setFlipped(false);setCi(Math.floor(Math.random()*filtered.length));}} style={{background:"rgba(255,255,255,.05)",color:"#94a3b8",padding:"9px 14px",fontSize:12}}>Aleatorio</button>
                <button className="b" disabled={ci>=filtered.length-1} onClick={()=>{setFlipped(false);setCi(ci+1);}} style={{flex:1,background:"rgba(255,255,255,.05)",color:ci>=filtered.length-1?"#334155":"#94a3b8",padding:"9px 0",fontSize:12}}>&rarr;</button>
              </div>
              <button className="b" onClick={()=>{setAiSubject(subject);setAiQ(`Explica este conceito: ${cur.q}`);setPrevMode(mode);setMode(MODES.AI_TUTOR);}} style={{width:"100%",marginTop:8,background:"rgba(99,102,241,.08)",color:"#818cf8",padding:"8px 0",fontSize:12,border:"1px solid rgba(99,102,241,.18)"}}>Nao entendi &mdash; Perguntar ao Tutor IA</button>
              <div style={{fontSize:10,color:"#334155",textAlign:"center",marginTop:6}}>Space=virar &middot; &larr;/&rarr;=navegar &middot; 1=Errei &middot; 2=Acertei</div>
            </>}
            {!cur&&<div style={{textAlign:"center",padding:40,color:"#475569",fontSize:13}}>Nenhum card com este filtro</div>}
          </div>
        )}

        {isQ&&!done&&qs.length>0&&(()=>{const q=qs[ci];const sc=q.subj||subject;const clr=FLASHCARDS[sc]?.color||"#6366f1";return(
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:13,fontWeight:700,minWidth:34,color:timerVal>60?"#22c55e":timerVal>30?"#f59e0b":"#ef4444"}}>{timerVal}s</span>
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
              {q.context&&<div style={{fontSize:12,color:"#94a3b8",background:"rgba(99,102,241,.06)",border:"1px solid rgba(99,102,241,.18)",borderRadius:8,padding:"10px 14px",marginBottom:14,lineHeight:1.75,whiteSpace:"pre-wrap"}}><span style={{fontSize:10,color:"#818cf8",display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:600}}>Dado</span>{q.context}</div>}
              <div style={{fontSize:14,lineHeight:1.6}}>{q.q}</div>
            </div>
            {q.opts.map((o,i)=>{let c="ob";if(sel!==null){if(i===q.ci)c+=" ok";else if(i===sel)c+=" no";}return(
              <button key={i} className={c} disabled={sel!==null} onClick={()=>answer(i)}>
                <span style={{fontWeight:700,marginRight:10,opacity:.5}}>{String.fromCharCode(65+i)}</span>{o}
              </button>
            );})}
            {sel!==null&&sel!==q.ci&&<button className="b" onClick={()=>{const sc=q.subj||subject;setAiSubject(sc);setAiQ(`Por que errei? Questao: "${q.q}" | Eu respondi: "${q.opts[sel]}" | Resposta correta: "${q.correct}". Explica o conceito de forma clara.`);setPrevMode(mode);setMode(MODES.AI_TUTOR);}} style={{width:"100%",marginTop:8,background:"rgba(99,102,241,.08)",color:"#818cf8",padding:"9px 0",fontSize:12,border:"1px solid rgba(99,102,241,.18)"}}>
              Por que errei? &mdash; Perguntar ao Tutor IA
            </button>}
            {sel!==null&&<button className="b" onClick={next} style={{width:"100%",marginTop:6,background:mode===MODES.EXAM?"rgba(239,68,68,.2)":`${clr}25`,color:mode===MODES.EXAM?"#fca5a5":clr,padding:"12px 0",fontSize:13}}>
              {ci+1>=qs.length?"Ver Resultado":"Proxima"}
            </button>}
            <div style={{fontSize:10,color:"#334155",textAlign:"center",marginTop:6}}>1/2/3/4=responder &middot; Enter=proxima</div>
          </div>
        );})()}

        {mode===MODES.AI_TUTOR&&<GeminiTutor subject={aiSubject} initialQuestion={aiQ} onBack={()=>setMode(prevMode)} />}
        {mode===MODES.FORMULAS&&<FormulaSheet onBack={()=>setMode(MODES.MENU)} />}

        {isQ&&done&&(()=>{const ok=answers.filter(a=>a.ok).length;const t=qs.length;const p=Math.round(ok/t*100);return(
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:52,marginBottom:8}}>{p>=70?"🎉":p>=40?"💪":"📚"}</div>
            <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:32,fontWeight:700}}>{ok}/{t}</div>
            <div style={{fontSize:14,color:p>=70?"#86efac":"#94a3b8",marginBottom:4}}>{p}%</div>
            <div style={{fontSize:13,color:"#94a3b8",marginBottom:18}}>{p>=70?"Meta de aprovacao atingida!":"Revisa os flashcards e tenta de novo."}</div>
            {mode===MODES.EXAM&&<div style={{background:"rgba(255,255,255,.04)",borderRadius:10,padding:14,marginBottom:14,textAlign:"left"}}>
              <div style={{fontSize:12,color:"#64748b",marginBottom:8}}>Por materia:</div>
              {Object.entries(FLASHCARDS).map(([k,s])=>{const sq=qs.map((q,i)=>({...q,ai:i})).filter(q=>q.subj===k);const sc=sq.filter(q=>answers[q.ai]?.ok).length;return sq.length>0?(
                <div key={k} style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontSize:12}}>{s.icon} {s.name}</span>
                  <span style={{fontSize:12,color:sc>=Math.ceil(sq.length*0.7)?"#86efac":"#fca5a5",fontWeight:600}}>{sc}/{sq.length}</span>
                </div>
              ):null;})}
            </div>}
            <div style={{display:"flex",gap:8}}>
              {mode===MODES.EXAM?<button className="b" onClick={startExam} style={{flex:1,background:"rgba(239,68,68,.2)",color:"#fca5a5",padding:"12px 0",fontSize:13}}>Nova Prova</button>
              :<><button className="b" onClick={()=>startQuiz(subject,diff)} style={{flex:1,background:`${FLASHCARDS[subject].color}20`,color:FLASHCARDS[subject].color,padding:"12px 0",fontSize:13}}>Repetir</button>
              <button className="b" onClick={()=>{go(MODES.STUDY,subject);}} style={{flex:1,background:"rgba(255,255,255,.05)",color:"#94a3b8",padding:"12px 0",fontSize:13}}>Cards</button></>}
              <button className="b" onClick={()=>setMode(MODES.MENU)} style={{flex:1,background:"rgba(255,255,255,.05)",color:"#94a3b8",padding:"12px 0",fontSize:13}}>Menu</button>
            </div>
          </div>
        );})()}
      </div>
    </div>
  );
}
