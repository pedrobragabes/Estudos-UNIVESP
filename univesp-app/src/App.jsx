import { useState, useEffect, useCallback, useRef } from "react";
import GeminiTutor from "./GeminiTutor";
import FormulaSheet from "./FormulaSheet";

const FLASHCARDS = {
  com150: {
    name: "Fundamentos Matematicos para Computacao (COM150 - Turma 004)", icon: "\u2211", color: "#f59e0b",
    cards: [
      { q: "Objetivo central de COM150:", a: "Construir base matematica para projeto de algoritmos e nocao de complexidade, com foco em logica e estruturas discretas.", difficulty: 1, topic: "Introducao" },
      { q: "O que e proposicao?", a: "Sentenca que pode ser avaliada como verdadeira ou falsa.", difficulty: 1, topic: "Proposicoes" },
      { q: "Exemplos que NAO sao proposicoes:", a: "Perguntas (ex: 'Quem ganhou o jogo?') e sentencas abertas sem contexto fechado (ex: 'x > 20').", difficulty: 1, topic: "Proposicoes" },
      { q: "Conjuncao A \u2227 B (E) e verdadeira quando:", a: "Somente quando A e B sao verdadeiras.", difficulty: 1, topic: "Conectivos" },
      { q: "Disjuncao inclusiva A \u2228 B (OU) e falsa quando:", a: "Somente quando A e B sao falsas.", difficulty: 1, topic: "Conectivos" },
      { q: "Disjuncao exclusiva A \u2295 B (XOU):", a: "Verdadeira quando os valores sao diferentes (um verdadeiro e outro falso).", difficulty: 2, topic: "Conectivos" },
      { q: "Negacao correta de 'A e B':", a: "Nao A OU nao B.\n(Lei de De Morgan)", difficulty: 2, topic: "Conectivos" },
      { q: "Condicional A \u2192 B e falsa em qual caso?", a: "Apenas quando A e verdadeira e B e falsa.", difficulty: 2, topic: "Condicional" },
      { q: "Bicondicional A \u2194 B significa:", a: "A e B tem o mesmo valor logico.\nEquivale a (A\u2192B) \u2227 (B\u2192A).", difficulty: 2, topic: "Condicional" },
      { q: "Tautologia:", a: "Formula sempre verdadeira para qualquer interpretacao.\nEx: A \u2228 \u00acA.", difficulty: 1, topic: "Tautologia" },
      { q: "Contradicao:", a: "Formula sempre falsa para qualquer interpretacao.\nEx: A \u2227 \u00acA.", difficulty: 1, topic: "Tautologia" },
      { q: "Equivalencia tautologica A \u21d4 B:", a: "Acontece quando A \u2194 B e tautologia, entao A pode substituir B em uma FBF.", difficulty: 2, topic: "Equivalencia" },
      { q: "Lei de De Morgan (1):", a: "\u00ac(A \u2228 B) \u21d4 (\u00acA \u2227 \u00acB)", difficulty: 2, topic: "Equivalencia" },
      { q: "Equivalencias uteis:", a: "Comutativa: A\u2228B\u21d4B\u2228A, A\u2227B\u21d4B\u2227A\nDistributiva: A\u2227(B\u2228C)\u21d4(A\u2227B)\u2228(A\u2227C)", difficulty: 3, topic: "Equivalencia" },
      { q: "Simplifique: A \u2227 \u00ac(A \u2227 B)", a: "A \u2227 \u00ac(A \u2227 B) \u21d4 A \u2227 (\u00acA \u2228 \u00acB) \u21d4 (A\u2227\u00acA) \u2228 (A\u2227\u00acB) \u21d4 A\u2227\u00acB", difficulty: 3, topic: "Equivalencia" },
      { q: "Generalizacao Universal (\u2200-introducao) e valida quando:", a: "Partimos de um elemento arbitrario do dominio, sem restricao extra.\nEsse elemento nao pode depender de hipotese aberta especifica.", difficulty: 3, topic: "Predicados" },
      { q: "Erro classico na Generalizacao Universal:", a: "Escolher um elemento especial (ex: 'se a e par') e depois concluir para todos.\nNesse caso a regra NAO pode ser aplicada.", difficulty: 3, topic: "Predicados" },
      { q: "Linguagem procedimental x declarativa:", a: "Procedimental: foco em COMO resolver (passo a passo).\nDeclarativa: foco em O QUE deve ser satisfeito (fatos e regras).", difficulty: 1, topic: "Paradigmas" },
      { q: "Prolog e exemplo de qual paradigma?", a: "Paradigma declarativo na programacao logica.", difficulty: 1, topic: "Paradigmas" },
    ]
  },
  com130: {
    name: "Fundamentos de Internet e Web (COM130 - Turma 004)", icon: "\uD83C\uDF10", color: "#06b6d4",
    cards: [
      { q: "Objetivo inicial das redes de computadores:", a: "Permitir comunicacao entre elementos computacionais e compartilhamento de recursos.", difficulty: 1, topic: "Redes" },
      { q: "Exemplos de elementos de rede:", a: "Usuarios/aplicacoes, switches, roteadores, servidores, links, meios cabeados/aereos e protocolos.", difficulty: 1, topic: "Redes" },
      { q: "Para um host conectar a rede ele precisa de:", a: "Placa de rede (NIC) conectada por um meio fisico a um elemento de comutacao.", difficulty: 1, topic: "Redes" },
      { q: "Switch x Roteador:", a: "Switch comuta em rede local.\nRoteador encaminha pacotes entre redes distintas.", difficulty: 1, topic: "Equipamentos" },
      { q: "Por que usar arquitetura em camadas?", a: "Para reduzir complexidade e separar responsabilidades por tarefas/protocolos.", difficulty: 1, topic: "Camadas" },
      { q: "Modelo OSI:", a: "Modelo de referencia com 7 camadas, importante para estudo conceitual.", difficulty: 1, topic: "Camadas" },
      { q: "Modelo TCP/IP:", a: "Modelo pratico, padrao de comunicacao em redes atuais, com 4 camadas.", difficulty: 1, topic: "Camadas" },
      { q: "TCP/IP e mais simples que OSI porque:", a: "Possui menos camadas e foco direto na implementacao real.", difficulty: 2, topic: "Camadas" },
      { q: "Funcao da camada de Aplicacao (TCP/IP):", a: "Representacao/formatacao das mensagens para as aplicacoes de rede.", difficulty: 2, topic: "TCP-IP" },
      { q: "Funcao da camada de Transporte (TCP/IP):", a: "Conexao ponto a ponto entre processos/aplicacoes via portas (TCP/UDP).", difficulty: 2, topic: "TCP-IP" },
      { q: "Funcao da camada de Internet (TCP/IP):", a: "Enderecamento logico dos hosts e roteamento de pacotes (IP).", difficulty: 2, topic: "TCP-IP" },
      { q: "Funcao da camada de Acesso a Rede (TCP/IP):", a: "Acesso ao meio fisico, transmissao binaria e codificacao/decodificacao de sinais.", difficulty: 2, topic: "TCP-IP" },
      { q: "Internet e o que?", a: "Conjunto de redes interconectadas que permite comunicacao entre aplicacoes distribuidas.", difficulty: 1, topic: "Internet" },
      { q: "WWW e o que?", a: "Sistema de documentos em hipermidia interligados por rede, normalmente sobre a Internet.", difficulty: 1, topic: "Internet" },
      { q: "Exemplos de aplicacoes de Internet:", a: "Email, streaming, compartilhamento de arquivos, pagamentos online e acesso seguro a dados.", difficulty: 1, topic: "Internet" },
      { q: "TCP pertence a qual camada e qual sua ideia central?", a: "Camada de Transporte. E orientado a conexao, segmenta dados e busca entrega confiavel.", difficulty: 2, topic: "TCP-IP" },
      { q: "UDP garante entrega como o TCP?", a: "Nao. E mais simples e rapido, sem garantia de entrega fim a fim.", difficulty: 2, topic: "TCP-IP" },
      { q: "DNS usa qual transporte?", a: "Tipicamente UDP pela rapidez, mas TCP tambem pode ser usado em casos especificos (ex: transferencia de zona e respostas grandes).", difficulty: 3, topic: "TCP-IP" },
      { q: "Endereco IP fica associado a que entidade?", a: "A uma interface de rede (porta/interface), nao ao equipamento inteiro.", difficulty: 2, topic: "Enderecamento" },
      { q: "Comprimento do endereco IPv4:", a: "32 bits.", difficulty: 1, topic: "Enderecamento" },
    ]
  },
  com120: {
    name: "Algoritmos e Programacao de Computadores II (COM120 - Turma 004)", icon: "\uD83D\uDCBB", color: "#22c55e",
    cards: [
      { q: "Como Python lida com variaveis na memoria?", a: "Nomes apontam para objetos alocados. A tabela de nomes guarda essas referencias.", difficulty: 1, topic: "Memoria" },
      { q: "Tipos imutaveis citados na aula:", a: "int, bool, float, str e complex (alem de tuplas no uso pratico).", difficulty: 1, topic: "Mutabilidade" },
      { q: "Tipos mutaveis mais usados:", a: "list, dict e set.", difficulty: 1, topic: "Mutabilidade" },
      { q: "Reatribuicao de imutavel (a=3 depois a=6):", a: "Cria nova associacao de nome para outro objeto; o valor anterior nao e alterado in-place.", difficulty: 2, topic: "Mutabilidade" },
      { q: "Lista e mutavel?", a: "Sim. Ex: d=[2,3,5,8,11]; d[3]=7 altera o proprio objeto lista.", difficulty: 1, topic: "Mutabilidade" },
      { q: "Aliasing com lista (b=a):", a: "a e b passam a referenciar o mesmo objeto; alterar por um nome afeta o outro.", difficulty: 2, topic: "Aliasing" },
      { q: "Aliasing com int (b=a; depois a=6):", a: "b continua apontando para 3, pois int e imutavel e a foi reassociada a outro objeto.", difficulty: 2, topic: "Aliasing" },
      { q: "Passagem de parametro com imutavel:", a: "Em funcao como g(x): x=5, a variavel externa nao muda.", difficulty: 2, topic: "Funcoes" },
      { q: "Passagem de parametro com lista mutavel:", a: "Em funcao como h(lst): lst[0]=5, a lista original pode ser modificada.", difficulty: 2, topic: "Funcoes" },
      { q: "Erro comum com estrutura aninhada:", a: "Tentar alterar item interno de tupla gera TypeError, mesmo se a tupla estiver dentro de lista.", difficulty: 3, topic: "Mutabilidade" },
      { q: "Como evitar efeito colateral em listas em funcoes?", a: "Criar copia antes de alterar (ex: lst.copy() ou lst[:]).", difficulty: 2, topic: "Boas praticas" },
      { q: "Resumo pratico para prova:", a: "Sempre pergunte: objeto e mutavel? Ha alias? A funcao altera in-place ou reatribui?", difficulty: 1, topic: "Boas praticas" },
      { q: "Em POO, o que e um objeto?", a: "Uma instancia de uma classe.", difficulty: 1, topic: "POO" },
      { q: "Atributo de instancia com mesmo nome de atributo de classe:", a: "O atributo da instancia sombreia o atributo da classe apenas naquele objeto.\nA classe e as outras instancias permanecem intactas.", difficulty: 2, topic: "POO" },
      { q: "Sintaxe de heranca em Python:", a: "class X(Y):", difficulty: 1, topic: "POO" },
      { q: "Troca de dados: estruturada x orientada a objetos", a: "Estruturada: principalmente por passagem de parametros entre procedimentos.\nPOO: objetos encapsulam estado (dados) e comportamento (metodos).", difficulty: 2, topic: "POO" },
      { q: "Para que serve __eq__(self, other)?", a: "Define como objetos da classe sao comparados com o operador ==.", difficulty: 2, topic: "POO" },
    ]
  }
};

const QUIZ_BANK = {
  com150: [
    { q: "Uma proposicao e:", correct: "Uma sentenca que pode ser verdadeira ou falsa", wrongs: ["Qualquer pergunta", "Uma frase sem valor logico", "Sempre uma equacao", "Somente frase verdadeira"], difficulty: 1, topic: "Proposicoes" },
    { q: "Qual NAO e proposicao?", correct: "Quem ganhou o jogo?", wrongs: ["A terra e plana", "Dois e primo", "1+2=3", "8=2^3"], difficulty: 1, topic: "Proposicoes" },
    { q: "A conjuncao A \u2227 B e verdadeira quando:", correct: "A e B sao verdadeiras", wrongs: ["Apenas A e verdadeira", "Apenas B e verdadeira", "Pelo menos uma e verdadeira", "Ambas sao falsas"], difficulty: 1, topic: "Conectivos" },
    { q: "A disjuncao inclusiva A \u2228 B e falsa quando:", correct: "A e B sao falsas", wrongs: ["A e verdadeira e B falsa", "A e falsa e B verdadeira", "A e B sao verdadeiras", "Apenas quando A e verdadeira"], difficulty: 1, topic: "Conectivos" },
    { q: "No XOU (A \u2295 B), o resultado e verdadeiro quando:", correct: "Os valores sao diferentes", wrongs: ["Ambos sao verdadeiros", "Ambos sao falsos", "Sempre que A for verdadeiro", "Sempre que B for falso"], difficulty: 2, topic: "Conectivos" },
    { q: "Negacao correta de 'O jogo e dificil e caro'", correct: "O jogo nao e dificil ou nao e caro", wrongs: ["O jogo nao e dificil e nao e caro", "O jogo e facil e barato", "O jogo e dificil ou caro", "O jogo e caro"], difficulty: 2, topic: "Conectivos" },
    { q: "A condicional A \u2192 B e falsa em:", correct: "A verdadeira e B falsa", wrongs: ["A verdadeira e B verdadeira", "A falsa e B verdadeira", "A falsa e B falsa", "Nunca e falsa"], difficulty: 2, topic: "Condicional" },
    { q: "A bicondicional A \u2194 B equivale a:", correct: "(A\u2192B) \u2227 (B\u2192A)", wrongs: ["(A\u2192B) \u2228 (B\u2192A)", "A\u2192B", "B\u2192A", "A \u2228 B"], difficulty: 2, topic: "Condicional" },
    { q: "A \u2228 \u00acA e exemplo de:", correct: "Tautologia", wrongs: ["Contradicao", "Equivalencia falsa", "Negacao dupla", "Condicional"], difficulty: 1, topic: "Tautologia" },
    { q: "A \u2227 \u00acA e exemplo de:", correct: "Contradicao", wrongs: ["Tautologia", "Bicondicional", "Disjuncao", "Implicacao valida"], difficulty: 1, topic: "Tautologia" },
    { q: "Equivalencia tautologica entre A e B ocorre quando:", correct: "A \u2194 B e tautologia", wrongs: ["A e B sempre falsas", "A \u2228 B e contradicao", "A implica B em um caso", "A e B tem mesmo tamanho"], difficulty: 2, topic: "Equivalencia" },
    { q: "Lei de De Morgan correta:", correct: "\u00ac(A \u2228 B) \u21d4 (\u00acA \u2227 \u00acB)", wrongs: ["\u00ac(A \u2228 B) \u21d4 (\u00acA \u2228 \u00acB)", "\u00ac(A \u2227 B) \u21d4 (\u00acA \u2227 \u00acB)", "\u00acA \u2228 B \u21d4 A \u2227 \u00acB", "A \u2228 B \u21d4 \u00acA \u2228 \u00acB"], difficulty: 3, topic: "Equivalencia" },
    { q: "Qual equivalencia distributiva esta correta?", correct: "A \u2227 (B \u2228 C) \u21d4 (A \u2227 B) \u2228 (A \u2227 C)", wrongs: ["A \u2227 (B \u2228 C) \u21d4 (A \u2228 B) \u2227 C", "A \u2228 (B \u2227 C) \u21d4 A \u2227 B \u2227 C", "A \u2228 B \u21d4 A \u2227 B", "A \u2227 B \u21d4 A \u2228 B"], difficulty: 3, topic: "Equivalencia" },
    { q: "Simplifique: A \u2227 \u00ac(A \u2227 B)", correct: "A \u2227 \u00acB", wrongs: ["\u00acA \u2227 B", "A \u2228 B", "\u00acA \u2228 \u00acB", "A \u2227 B"], difficulty: 3, topic: "Equivalencia" },
    { q: "Para aplicar Generalizacao Universal de P(a) para \u2200x P(x), o elemento a deve ser:", correct: "Arbitrario e sem restricao adicional", wrongs: ["Um elemento especial escolhido por hipotese", "Necessariamente o primeiro elemento do dominio", "Um exemplo particular para o qual P(a) vale", "Qualquer elemento par do dominio"], difficulty: 3, topic: "Predicados" },
    { q: "Quando a Generalizacao Universal NAO e valida?", correct: "Quando o elemento escolhido depende de uma hipotese aberta especifica", wrongs: ["Quando o dominio e finito", "Quando ha mais de um quantificador", "Quando a formula usa negacao", "Quando a prova usa tabela-verdade"], difficulty: 3, topic: "Predicados" },
    { q: "Em linguagens procedimentais, o foco principal e:", correct: "Descrever como resolver em passos/instrucoes", wrongs: ["Descrever apenas resultados finais", "Evitar algoritmos", "Declarar fatos sem fluxo de execucao", "Definir apenas tipos de dados"], difficulty: 1, topic: "Paradigmas" },
    { q: "Em linguagens declarativas como Prolog, o foco principal e:", correct: "Descrever o que deve ser satisfeito (fatos e regras)", wrongs: ["Detalhar cada passo de execucao", "Priorizar manipular ponteiros", "Otimizar loops de baixo nivel", "Substituir completamente a logica"], difficulty: 1, topic: "Paradigmas" },
  ],
  com130: [
    { q: "Objetivo primario das redes de computadores:", correct: "Permitir comunicacao e compartilhamento de recursos", wrongs: ["Substituir sistemas operacionais", "Eliminar protocolos", "Usar apenas rede sem fio", "Evitar servidores"], difficulty: 1, topic: "Redes" },
    { q: "Para conectar um host a rede, e necessario:", correct: "Placa de rede conectada por um link a um elemento de comutacao", wrongs: ["Apenas instalar navegador", "Somente um IP publico", "Ter dois roteadores", "Desativar protocolos"], difficulty: 1, topic: "Redes" },
    { q: "Em rede local, o elemento de comutacao tipico e:", correct: "Switch", wrongs: ["Firewall", "Proxy", "Roteador de borda", "DNS"], difficulty: 1, topic: "Equipamentos" },
    { q: "Para comunicar redes distintas, o equipamento principal e:", correct: "Roteador", wrongs: ["Switch", "Hub passivo", "Placa de video", "Servidor DHCP"], difficulty: 1, topic: "Equipamentos" },
    { q: "A organizacao em camadas existe principalmente para:", correct: "Reduzir complexidade e separar responsabilidades", wrongs: ["Aumentar numero de cabos", "Remover necessidade de protocolos", "Impedir interoperabilidade", "Substituir a Internet"], difficulty: 1, topic: "Camadas" },
    { q: "Sobre o modelo OSI:", correct: "E um modelo de referencia conceitual", wrongs: ["E o unico usado na pratica", "Tem 4 camadas", "Substitui TCP/IP na Internet", "Nao usa protocolos"], difficulty: 2, topic: "Camadas" },
    { q: "O modelo TCP/IP possui:", correct: "4 camadas", wrongs: ["3 camadas", "5 camadas", "7 camadas", "8 camadas"], difficulty: 1, topic: "Camadas" },
    { q: "Qual camada trata da representacao e formatacao de mensagens?", correct: "Aplicacao", wrongs: ["Transporte", "Internet", "Acesso a Rede", "Fisica"], difficulty: 2, topic: "TCP-IP" },
    { q: "Conexao ponto a ponto entre processos via portas e funcao da camada:", correct: "Transporte", wrongs: ["Aplicacao", "Internet", "Acesso a Rede", "Enlace"], difficulty: 2, topic: "TCP-IP" },
    { q: "Enderecamento logico de hosts e roteamento sao da camada:", correct: "Internet", wrongs: ["Aplicacao", "Transporte", "Acesso a Rede", "Sessao"], difficulty: 2, topic: "TCP-IP" },
    { q: "Acesso ao meio fisico e transmissao binaria sao da camada:", correct: "Acesso a Rede", wrongs: ["Internet", "Aplicacao", "Transporte", "Apresentacao"], difficulty: 2, topic: "TCP-IP" },
    { q: "A Internet pode ser definida como:", correct: "Conjunto de redes interconectadas", wrongs: ["Somente a Web", "Uma unica rede local", "Apenas redes moveis", "Somente servidores"], difficulty: 1, topic: "Internet" },
    { q: "A WWW (Web) e:", correct: "Sistema de documentos em hipermidia interligados", wrongs: ["Sinomimo de roteador", "A camada de transporte", "Protocolo fisico", "Tipo de placa de rede"], difficulty: 1, topic: "Internet" },
    { q: "Qual item e uma aplicacao comum de Internet?", correct: "Streaming de audio e video", wrongs: ["Compilar kernel local", "Formatar disco offline", "Substituir camada fisica", "Criar BIOS"], difficulty: 1, topic: "Internet" },
    { q: "O protocolo TCP pertence a qual camada do modelo TCP/IP?", correct: "Camada de Transporte", wrongs: ["Camada de Internet", "Camada de Aplicacao", "Camada de Acesso a Rede", "Camada Fisica"], difficulty: 2, topic: "TCP-IP" },
    { q: "Uma funcao tipica do TCP e:", correct: "Segmentar dados e oferecer entrega confiavel", wrongs: ["Definir endereco MAC", "Rotear pacotes entre redes", "Codificar sinal eletrico", "Substituir DNS"], difficulty: 2, topic: "TCP-IP" },
    { q: "Sobre o UDP, assinale a alternativa correta:", correct: "E rapido e simples, sem garantia de entrega fim a fim", wrongs: ["Garante entrega e ordem como o TCP", "So funciona em rede local", "Nao pertence a camada de transporte", "E obrigatorio para HTTP"], difficulty: 2, topic: "TCP-IP" },
    { q: "Qual protocolo de aplicacao e famoso por usar UDP com frequencia?", correct: "DNS", wrongs: ["FTP", "SSH", "SMTP", "TELNET"], difficulty: 1, topic: "TCP-IP" },
    { q: "Em alguns cenarios, o DNS tambem pode usar:", correct: "TCP", wrongs: ["ARP", "ICMP obrigatoriamente", "Somente UDP sem excecao", "Apenas HTTP"], difficulty: 3, topic: "TCP-IP" },
    { q: "No modelo TCP/IP, o IP e protocolo principal de qual camada?", correct: "Camada de Internet", wrongs: ["Camada de Aplicacao", "Camada de Transporte", "Camada de Acesso a Rede", "Camada de Sessao"], difficulty: 2, topic: "TCP-IP" },
    { q: "Conceitualmente, um endereco IP e associado a:", correct: "Uma interface de rede especifica", wrongs: ["Ao equipamento inteiro sem distinguir portas", "Somente ao roteador de borda", "Ao cabo de rede", "Ao switch"], difficulty: 2, topic: "Enderecamento" },
    { q: "Qual o comprimento de um endereco IPv4?", correct: "32 bits", wrongs: ["16 bits", "48 bits", "64 bits", "128 bits"], difficulty: 1, topic: "Enderecamento" },
  ],
  com120: [
    { q: "No Python, variaveis sao melhor descritas como:", correct: "Nomes que referenciam objetos na memoria", wrongs: ["Caixas de memoria fixa", "Tipos fixos imutaveis", "Apenas registradores", "Ponteiros manuais obrigatorios"], difficulty: 1, topic: "Memoria" },
    { q: "Qual conjunto contem apenas tipos imutaveis?", correct: "int, bool, float, str, complex", wrongs: ["list, dict, set", "list, tuple, str", "dict, set, int", "list, int, float"], difficulty: 1, topic: "Mutabilidade" },
    { q: "Qual estrutura e mutavel?", correct: "list", wrongs: ["int", "float", "str", "complex"], difficulty: 1, topic: "Mutabilidade" },
    { q: "Dado d=[2,3,5,8,11], apos d[3]=7, o resultado e:", correct: "[2,3,5,7,11]", wrongs: ["[2,3,5,8,11]", "Erro sempre", "[2,3,7,8,11]", "[7,3,5,8,11]"], difficulty: 1, topic: "Mutabilidade" },
    { q: "Com a=[3,4,5]; b=a; b[1]=8, qual e a?", correct: "[3,8,5]", wrongs: ["[3,4,5]", "[8,4,5]", "[3,5,8]", "Erro de tipo"], difficulty: 2, topic: "Aliasing" },
    { q: "Com a=3; b=a; a=6, qual e b?", correct: "3", wrongs: ["6", "9", "None", "Erro"], difficulty: 2, topic: "Aliasing" },
    { q: "def g(x): x=5; a=3; g(a). Valor final de a:", correct: "3", wrongs: ["5", "0", "None", "Erro"], difficulty: 2, topic: "Funcoes" },
    { q: "def h(lst): lst[0]=5; my=[3,6,9,12]; h(my). my vira:", correct: "[5,6,9,12]", wrongs: ["[3,6,9,12]", "[5]", "Erro", "[3,5,9,12]"], difficulty: 2, topic: "Funcoes" },
    { q: "Tentar alterar elemento interno de tupla dentro de lista tende a gerar:", correct: "TypeError", wrongs: ["IndexError", "ValueError", "NameError", "Nao gera erro"], difficulty: 3, topic: "Mutabilidade" },
    { q: "Para evitar alterar lista original dentro de funcao, faca:", correct: "Uma copia da lista antes de modificar", wrongs: ["Converter para int", "Usar apenas print", "Remover parametros", "Usar global sempre"], difficulty: 2, topic: "Boas praticas" },
    { q: "Em termos de efeito colateral, parametros mutaveis:", correct: "Podem alterar o objeto original", wrongs: ["Nunca alteram nada", "Sao sempre copiados automaticamente", "Viram imutaveis em funcao", "Nao podem ser passados"], difficulty: 2, topic: "Funcoes" },
    { q: "Qual afirmacao esta correta?", correct: "Reatribuicao de imutavel muda a referencia do nome, nao o objeto antigo", wrongs: ["Imutavel sempre muda in-place", "Listas sao imutaveis", "Toda atribuicao duplica memoria", "Python nao usa referencias"], difficulty: 3, topic: "Memoria" },
    { q: "No estudo de memoria em Python, 'alias' significa:", correct: "Dois nomes apontando para o mesmo objeto", wrongs: ["Dois objetos com mesmo valor e IDs diferentes", "Um erro de sintaxe", "Uma funcao sem retorno", "Conversao automatica de tipos"], difficulty: 2, topic: "Aliasing" },
    { q: "Qual tipo de questao costuma exigir mais cuidado em Python II?", correct: "Mutabilidade + passagem de parametros", wrongs: ["Escolha de fonte no terminal", "Configuracao de teclado", "Nome do arquivo README", "Versao do navegador"], difficulty: 1, topic: "Boas praticas" },
    { q: "Em POO, qual e a melhor definicao para objeto?", correct: "Uma instancia de uma classe", wrongs: ["Um metodo estatico", "Um atributo de classe", "Um modulo importado", "Um tipo primitivo"], difficulty: 1, topic: "POO" },
    { q: "Em Python, se p.x = 2 e ja existe Ponto.x = -1, entao:", correct: "p.x sombreia localmente o atributo da classe para aquele objeto", wrongs: ["Ponto.x e alterado para 2 em toda a classe", "Todas as instancias passam a ter x=2", "A classe Ponto deixa de ter atributo x", "O codigo sempre gera TypeError"], difficulty: 2, topic: "POO" },
    { q: "Qual e a sintaxe correta para X herdar de Y em Python?", correct: "class X(Y):", wrongs: ["class X -> Y:", "class X extends Y:", "class X inherits Y:", "class X:Y()"], difficulty: 1, topic: "POO" },
    { q: "Na estruturada, a troca de dados entre procedimentos ocorre principalmente por:", correct: "Passagem de parametros", wrongs: ["Heranca", "Polimorfismo", "Sobrecarga de operadores", "Encapsulamento de objetos"], difficulty: 2, topic: "POO" },
    { q: "Na orientada a objetos, dados e procedimentos ficam:", correct: "Encapsulados nos objetos", wrongs: ["Separados obrigatoriamente em funcoes globais", "Sempre em variaveis globais", "Apenas em modulos sem classe", "Somente em arquivos externos"], difficulty: 2, topic: "POO" },
    { q: "Em Python, o metodo __eq__(self, other) serve para:", correct: "Customizar comparacao de igualdade com ==", wrongs: ["Inicializar atributos no construtor", "Ordenar automaticamente uma lista", "Executar destruicao do objeto", "Criar copia profunda do objeto"], difficulty: 2, topic: "POO" },
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
  const [aiSubject, setAiSubject] = useState("com150");
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
            <button className="b" onClick={()=>setMode(MODES.FORMULAS)} style={{width:"100%",marginBottom:12,background:"linear-gradient(135deg,rgba(245,158,11,.1),rgba(234,179,8,.07))",border:"1px solid rgba(245,158,11,.2)",color:"#fbbf24",padding:"11px 0",fontSize:13,fontWeight:500}}>Folha de Formulas &mdash; apoio de COM150</button>
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
