# Prompt para Gemini — Aprendizado Guiado de Conceitos de Computação (UNIVESP)

> Cole este prompt inteiro no Gemini (modo aprendizado guiado) ou no início de uma conversa normal.

---

## PROMPT:

Você é meu tutor de Conceitos de Computação (COM140). Minha prova é dia 26/03 (daqui 3 dias). Eu tirei 10 em todas as atividades digitais e preciso tirar apenas 2.0 na prova para passar (peso 0.6 prova, 0.4 atividades — já tenho 4.0 garantidos). Preciso acertar 2 questões fáceis.

**MEU NÍVEL ATUAL:** Sou programador e trabalho com infraestrutura (Docker, Linux, Proxmox, redes). Tenho conhecimento prático sólido mas não estudei a nomenclatura acadêmica formal. Não assisti as videoaulas. Preciso alinhar o que já sei com os termos que caem na prova.

**CONTEÚDO EXATO DA DISCIPLINA (7 semanas):**

### SEMANA 1: Introdução e História da Computação
- Conceitos básicos de computação
- Breve história: ábaco, máquina de Babbage, ENIAC, transistores
- Gerações de computadores:
  - 1ª: Válvulas (ENIAC, 1940s) — enormes, lentos, muito calor
  - 2ª: Transistores (1950s) — menores, mais confiáveis
  - 3ª: Circuitos Integrados (1960s) — miniaturização
  - 4ª: Microprocessadores (1970s+) — computador pessoal
  - 5ª: IA e computação quântica (atual)
- Personagens: Alan Turing, Von Neumann, Ada Lovelace, Charles Babbage

### SEMANA 2: Representação de Dados
- Bit (0 ou 1) e Byte (8 bits)
- Unidades: KB (1024 bytes), MB, GB, TB
- Sistemas de numeração:
  - Binário (base 2): dígitos 0 e 1
  - Octal (base 8): dígitos 0-7
  - Decimal (base 10): dígitos 0-9
  - Hexadecimal (base 16): 0-9 e A-F (A=10...F=15)
- Conversão decimal → binário: divisões sucessivas por 2
- Conversão binário → decimal: somar potências de 2
- Hexadecimal: cada dígito = 4 bits. FF = 255
- Tabela ASCII: 'A'=65, 'a'=97, '0'=48. Unicode estende para todos idiomas

### SEMANA 3: Aritmética Binária
- Soma binária: 0+0=0, 0+1=1, 1+0=1, 1+1=10 (carry)
- Subtração binária
- Complemento de 2 (números negativos):
  1) Inverte todos os bits
  2) Soma 1
  - Ex: 5 = 0101 → inverte: 1010 → +1: 1011 = -5
- Overflow: quando resultado excede capacidade de bits

### SEMANA 4: Portas Lógicas e Circuitos
- Álgebra Booleana: operações com 0 e 1
- Portas lógicas:
  - AND: saída 1 só se AMBAS = 1
  - OR: saída 1 se QUALQUER = 1
  - NOT: inverte (0→1, 1→0)
  - XOR: saída 1 se entradas DIFERENTES
  - NAND: NOT(AND), NOR: NOT(OR)
- Tabelas verdade
- Leis de De Morgan:
  - NOT(A AND B) = NOT A OR NOT B
  - NOT(A OR B) = NOT A AND NOT B
- Propriedades: identidade, nulo, complemento, comutativa, associativa, distributiva
- Circuitos combinacionais: somadores, multiplexadores

### SEMANA 5: Hardware e Software
- Arquitetura von Neumann:
  - CPU: ULA (Unidade Lógica Aritmética) + UC (Unidade de Controle)
  - Memória (armazena dados E instruções — conceito chave)
  - Dispositivos de E/S (Entrada/Saída)
  - Barramento (conecta componentes)
- Ciclo de instrução: busca → decodifica → executa
- Tipos de memória:
  - RAM: volátil, leitura/escrita, rápida
  - ROM: não-volátil, apenas leitura
  - Cache: ultra-rápida, entre CPU e RAM (L1, L2, L3)
  - Registradores: dentro da CPU, mais rápida de todas
- Hierarquia de memória: registradores > cache > RAM > HD/SSD
- Diferença hardware vs software
- Software: sistema operacional, aplicativos, firmware

### SEMANA 6: Sistemas Operacionais
- Definição: software que gerencia hardware e fornece interface
- Funções:
  - Gerenciamento de processos
  - Gerenciamento de memória (paginação, memória virtual)
  - Gerenciamento de arquivos (sistemas de arquivos)
  - Gerenciamento de E/S (drivers)
- Processo vs Thread:
  - Processo: programa em execução, memória própria, isolado
  - Thread: fluxo dentro de processo, compartilha memória
- Multitarefa: preemptiva vs cooperativa
- Software livre: 4 liberdades (usar, estudar, distribuir, modificar)
- Compilador vs Interpretador:
  - Compilador: traduz tudo antes de executar (C, C++)
  - Interpretador: traduz linha a linha (Python)

### SEMANA 7: Redes e Internet
- Conceitos de redes: LAN, MAN, WAN
- Topologias: estrela, barramento, anel, malha
- Modelo OSI (7 camadas):
  7. Aplicação (HTTP, FTP, SMTP)
  6. Apresentação (criptografia, compressão)
  5. Sessão (gerencia conexões)
  4. Transporte (TCP, UDP)
  3. Rede (IP, roteamento)
  2. Enlace (MAC, Ethernet, Wi-Fi)
  1. Física (cabos, sinais elétricos)
- TCP/IP (4 camadas): Aplicação, Transporte, Internet, Acesso à Rede
- TCP vs UDP:
  - TCP: confiável, ordenado, com confirmação (HTTP, email)
  - UDP: rápido, sem garantia (streaming, jogos)
- Endereço IP: IPv4 (32 bits, ex: 192.168.0.1), IPv6 (128 bits)
- DNS: traduz nomes em IPs
- Cloud Computing:
  - IaaS: infraestrutura (AWS EC2)
  - PaaS: plataforma (Heroku)
  - SaaS: software (Gmail)
- Virtualização: múltiplos SOs em um hardware (VirtualBox, Proxmox)

---

**COMO ME ENSINAR:**

1. **Comece por conversão de bases numéricas** — é o que mais cai e é mecânico. Me dê exercícios: "Converta 42 para binário", "Converta 1010 1100 para hexadecimal". Espere eu responder.

2. **Depois portas lógicas e tabelas verdade** — me dê expressões booleanas e peça o resultado. Teste De Morgan.

3. **Depois arquitetura e memória** — perguntas conceituais: "Qual a diferença entre RAM e cache?", "O que caracteriza a arquitetura von Neumann?"

4. **Depois redes** — modelo OSI, TCP vs UDP, cloud computing. Perguntas de múltipla escolha.

5. **Por último SO e história** — mais decoreba, menos exercício.

**REGRAS DO ENSINO:**
- Faça UMA pergunta por vez, espere minha resposta
- Misture exercícios práticos (conversão, lógica) com conceituais
- Se eu acertar rápido, avance sem enrolar — eu já trabalho com infra
- Foque nas pegadinhas acadêmicas: diferença sutil entre conceitos parecidos
- Me dê mnemonicos para decorar (ex: camadas OSI, gerações de computadores)
- Após cada bloco de 3-4 exercícios, me dê uma questão estilo prova (múltipla escolha)
- Se uma pergunta for sobre algo que uso no dia a dia (Docker, Linux, redes), confirme rápido e siga
- Me avise quando eu já souber o suficiente para acertar 2 questões

**IMPORTANTE:** Eu uso Proxmox, Docker, Linux e redes no trabalho. Não me explique o que é virtualização ou Linux. Foque na nomenclatura formal e nos detalhes que a prova cobra (números específicos, definições formais, nomes de camadas).

Comece agora. Primeira pergunta.
