import { week } from "./helpers";

export const advancedJavaTopics = [
  week("COM230",5,{
    title:"Conjuntos, mapas e organização em pacotes",
    objectives:["Escolher HashSet, TreeSet, HashMap e TreeMap.","Usar igualdade, hashing e ordenação coerentes.","Organizar pacotes e aplicar operações chave–valor."],
    summary:["Set representa unicidade; Map associa cada chave a um valor, permitindo valores repetidos.","Implementações hash e em árvore diferem em ordem, requisitos e desempenho.","Pacotes organizam nomes e acesso e devem ser coerentes com compilação e arquivos."],
    sections:[{title:"Unicidade e associações",body:["HashSet usa igualdade e hash para identificar elementos e não garante ordem de iteração. TreeSet mantém ordem natural ou fornecida por Comparator; comparação zero determina equivalência para a estrutura ordenada.","HashMap associa chaves únicas a valores. Repetir put na mesma chave substitui o valor anterior. TreeMap ordena pelas chaves. Map não estende Collection; keySet, values e entrySet oferecem visões para trabalhar com suas partes."]},{title:"equals e hashCode",body:["Objetos iguais por equals devem ter o mesmo hashCode. O inverso é falso: hashes iguais podem corresponder a objetos diferentes. Estruturas hash tratam colisões, que não são prova de igualdade.","Evite modificar campos usados na igualdade, hash ou comparação enquanto o objeto está na estrutura. A posição calculada ao inserir pode deixar de corresponder ao estado novo. Prefira chaves imutáveis ou controle cuidadosamente remoção e reinserção."]},{title:"Implementações e pacotes",body:["HashMap e HashSet favorecem operações esperadas rápidas quando o hashing é adequado. TreeMap e TreeSet atendem quando ordenação e consultas por faixa importam. Map como interface não impõe uma tabela hash.","HashMap permite chave e valores null; Hashtable não aceita null. TreeMap com ordem natural não aceita chave null; um Comparator específico pode alterar isso. Métodos sincronizados isolados não tornam automaticamente uma sequência composta atômica.","package define um espaço de nomes e ajuda a controlar acesso. import disponibiliza nomes de tipos de outros pacotes no arquivo. Classes públicas, nomes de arquivos e diretórios devem corresponder à organização de compilação."]},{title:"Programa completo: unicidade e contagem",body:["O Set elimina repetição e o Map conta ocorrências. TreeSet e TreeMap deixam a saída ordenada: [Ana, Bia] e {Ana=2, Bia=1}. A segunda entrada Ana incrementa o valor da chave existente.","entrySet permite percorrer pares tipados sem casts de raw types. Use esse padrão para ligar chave e valor durante a travessia."],code:`import java.util.*;
public class Main {
    public static void main(String[] args) {
        List<String> nomes = Arrays.asList("Bia", "Ana", "Ana");
        Set<String> unicos = new TreeSet<>(nomes);
        Map<String, Integer> frequencias = new TreeMap<>();
        for (String nome : nomes) {
            frequencias.put(nome, frequencias.getOrDefault(nome, 0) + 1);
        }
        System.out.println(unicos);
        System.out.println(frequencias);
        for (Map.Entry<String, Integer> e : frequencias.entrySet()) {
            System.out.println(e.getKey() + " -> " + e.getValue());
        }
    }
}`}],
    formulas:[],practice:[{prompt:"Após put(7,\"A\") e put(7,\"B\") em mapa vazio, qual tamanho e valor?",steps:["Há uma única chave, 7.","O segundo put substitui o valor; get(7) retorna B.","Tamanho=1. Valores iguais em chaves diferentes são permitidos."]},{prompt:"Escolha estrutura para nomes únicos em ordem alfabética.",steps:["TreeSet<String> oferece unicidade e ordem natural de Strings.","HashSet não garante ordem.","Se precisar ignorar caixa ou acentos, defina Comparator e sua noção de equivalência com cuidado."]},{prompt:"Uma chave mutável parece desaparecer do HashMap após alteração. Explique.",steps:["Se hashCode muda, a busca pode procurar em outra posição.","O objeto pode continuar armazenado com localização incompatível com seu novo estado.","Use chave imutável ou remova antes de modificar e reinsira controladamente."]}],
    pitfall:"Colisão de hash não significa igualdade. Map proíbe chaves duplicadas, não valores repetidos.",
    cards:[["Set versus List?","Unicidade versus sequência posicional com repetições."],["Map permite valores repetidos?","Sim; as chaves são únicas, mas os valores podem se repetir."],["put em chave existente?","Substitui valor e não aumenta a quantidade de chaves."],["HashMap garante ordem?","Não. TreeMap ordena as chaves."],["Contrato de hashCode?","Objetos iguais por equals devem ter mesmo hash; colisão não implica igualdade."],["Pacote Java?","Espaço de nomes que organiza tipos e participa do controle de acesso."]],
    quiz:[["put(1,\"A\"), put(1,\"B\"), put(2,\"B\") em mapa vazio deixam tamanho:","2","3","1","0","Há duas chaves; a segunda inserção substitui o valor da chave 1."],["Qual mantém elementos únicos ordenados?","TreeSet.","ArrayList sempre.","HashMap de qualquer tipo.","InputStream.","TreeSet combina semântica de conjunto e ordenação."],["Mesmo hashCode significa:","Possível colisão; equals ainda importa.","Objetos sempre iguais.","Mesma identidade obrigatória.","Objetos proibidos na tabela.","A função hash pode mapear objetos diferentes ao mesmo código."],["Map é subinterface de Collection?","Não.","Sim, estende List.","Sim, estende Set.","Sim, somente TreeMap.","Map possui hierarquia própria, embora suas visões sejam coleções."]],
    review:["Preveja valores e tamanho após put.","Compare unicidade, posição e ordem.","Explique colisão e igualdade.","Organize duas classes em pacotes."],
    readingNotes:["Nos exemplos corrigidos, Map usa <K,V> e a classe histórica se escreve Hashtable. Não se atribui implementação hash a todo Map."],
  }),
  week("COM230",6,{
    title:"Tratamento de exceções",
    objectives:["Identificar propagação na pilha e capturas compatíveis.","Distinguir checked, unchecked, throw e throws.","Criar exceções e gerenciar recursos sem esconder falhas."],
    summary:["Uma exceção abandona o fluxo normal e procura um tratador compatível na pilha.","Exceções verificadas exigem captura ou declaração; o ramo RuntimeException é não verificado.","Tratar uma falha requer decisão coerente; capturas vazias escondem problemas."],
    sections:[{title:"Hierarquia e propagação",body:["Throwable é a base de objetos lançáveis. Exception e Error são ramos diferentes; RuntimeException deriva de Exception. Exceções verificadas fora dos ramos não verificados precisam ser capturadas ou declaradas conforme as regras da linguagem.","Ao lançar uma exceção, o restante do trecho normal é abandonado. O runtime procura catch compatível no método ou nos chamadores. A pilha de chamadas ajuda a identificar a origem; declarar throws não executa recuperação."]},{title:"Capturar, declarar e lançar",body:["try delimita operações e catch trata tipos compatíveis. Capturas específicas devem vir antes das gerais para evitar um tratador inalcançável. throw lança uma instância; throws declara possíveis tipos propagados na assinatura.","Uma exceção de domínio pode estender Exception para exigir decisão explícita de tratar ou propagar, ou RuntimeException conforme o contrato escolhido. Use mensagem útil e preserve a causa ao traduzir uma falha de outra camada, quando pertinente."]},{title:"finally e recursos",body:["finally costuma executar na saída do try, com ou sem falha, mas não é garantia frente a encerramento abrupto da JVM. Retornar em finally pode ocultar retorno ou exceção anterior e deve ser evitado.","try-with-resources fecha recursos AutoCloseable e mantém informação sobre falhas suprimidas durante fechamento. Nem todo try precisa de catch: há try-finally e construções válidas de recursos. Capturar sem ação ou registro não resolve o problema."]},{title:"Programa completo: exceção de domínio",body:["emprestar mantém a regra do objeto e lança uma exceção verificada quando não há disponibilidade. A primeira chamada imprime Emprestado; a segunda lança, e main imprime Sem unidades. Não ocorre um segundo empréstimo silencioso.","A mesma regra precisa funcionar independentemente do menu que usa o objeto. Se só a interface validasse, outro cliente poderia violar o contrato."],code:`public class Main {
    static class IndisponivelException extends Exception {
        private static final long serialVersionUID = 1L;
        IndisponivelException(String mensagem) { super(mensagem); }
    }
    static class Livro {
        private boolean disponivel = true;
        void emprestar() throws IndisponivelException {
            if (!disponivel) throw new IndisponivelException("Sem unidades");
            disponivel = false;
            System.out.println("Emprestado");
        }
    }
    public static void main(String[] args) {
        Livro livro = new Livro();
        try {
            livro.emprestar();
            livro.emprestar();
        } catch (IndisponivelException e) {
            System.out.println(e.getMessage());
        }
    }
}`}],
    formulas:[],practice:[{prompt:"Trace try { int x=10/0; println(x); } catch(ArithmeticException e) { println(\"erro\"); }.",steps:["A divisão inteira por zero lança ArithmeticException.","println(x) não é executado; o fluxo vai ao catch.","O tratador imprime erro e a execução pode continuar após a estrutura."]},{prompt:"Uma operação lança IOException verificada. O chamador precisa decidir o quê?",steps:["Capturar e tratar, ou declarar throws IOException.","Escolher a camada com informação para recuperar ou comunicar a falha.","Propagar não é tratar: alguém ainda precisa decidir a resposta apropriada."]},{prompt:"Por que catch(Exception e) {} é problemático?",steps:["Esconde a falha e pode sugerir sucesso ao cliente.","O estado pode ter sido parcialmente alterado.","Trate o caso específico e preserve informação de diagnóstico."]}],
    pitfall:"throws não lança nem trata. finally não deve esconder a falha original.",
    cards:[["throw e throws?","throw lança instância; throws declara tipos propagáveis."],["Obrigação checked?","Capturar ou declarar propagação conforme as regras do compilador."],["RuntimeException é checked?","Não; seu ramo é não verificado."],["Ordem de catch?","Mais específico antes do mais geral."],["try exige catch sempre?","Não; há try-finally e try-with-resources válidos."],["Por que preservar causa?","Para conservar o diagnóstico original ao traduzir a falha entre camadas."]],
    quiz:[["throws informa:","Possíveis tipos propagados pelo método.","Que a falha foi tratada.","Que uma exceção foi obrigatoriamente lançada.","Que o método nunca falha.","A declaração é parte do contrato; throw lança uma instância."],["Após falha no meio do try:","O restante do fluxo normal daquele try é abandonado.","A instrução seguinte sempre executa.","Todos os catches executam.","A exceção desaparece sem tratador.","Busca-se um tratador compatível no método ou na pilha."],["Qual catch deve vir antes?","O mais específico.","Exception sempre antes das subclasses.","Throwable sempre antes de tudo.","A ordem nunca importa.","Um tratador geral anterior pode tornar o específico inalcançável."],["try-with-resources:","Gerencia fechamento de AutoCloseable.","Elimina qualquer erro.","Substitui validação de domínio.","Cria objetos sem construtor.","A construção fecha recursos e lida com informação de falhas suprimidas."]],
    review:["Trace pilha e tratamento.","Escreva checked e unchecked.","Crie exceção de domínio.","Compare propagação, recuperação e fechamento."],
    readingNotes:["S6 cita Conjuntos e Mapas em um trecho reaproveitado do roteiro. O tema, os objetivos e os slides da semana efetivamente tratam de exceções."],
  }),
  week("COM230",7,{
    title:"Streams, serialização, threads e redes",
    objectives:["Distinguir I/O e API Stream.","Serializar objetos de origem controlada.","Criar threads e reconhecer corridas e sincronização.","Explicar sockets TCP, cliente–servidor e delimitação de mensagens."],
    summary:["I/O transporta bytes ou caracteres; java.util.stream processa sequências de elementos.","Serialização representa estado em bytes, exigindo compatibilidade e cuidado com origem dos dados.","Threads compartilham recursos; sockets conectam processos, mas não definem o protocolo da aplicação."],
    sections:[{title:"Bytes, caracteres e buffer",body:["InputStream e OutputStream tratam bytes; Reader e Writer tratam caracteres. Converter texto exige charset, preferencialmente explícito. read retorna −1 no fim do fluxo; available não é teste geral de fim de arquivo nem de mensagem de rede.","Buffer agrupa operações pequenas sobre o recurso subjacente. flush envia dados pendentes do buffer sem necessariamente fechar o recurso. Delimite o tempo de uso com try-with-resources e diferencie fechar, descarregar buffer e detectar fim."]},{title:"API Stream e lambdas",body:["filter seleciona elementos; map transforma valores; operações terminais como collect ou forEach consomem o pipeline. Operações intermediárias são em geral preguiçosas. Uma Stream não é a coleção fonte e não deve ser reutilizada após consumida.","Evite efeitos colaterais dependentes de ordem ou estado compartilhado. Processamento paralelo não garante aceleração nem resolve concorrência automaticamente. No exemplo, o resultado é [ANA, ALANA] e a coleção original permanece igual."],code:`import java.util.*;
import java.util.stream.Collectors;
public class Main {
    public static void main(String[] args) {
        List<String> nomes = Arrays.asList("Ana", "Bia", "Alana");
        List<String> resultado = nomes.stream()
            .filter(n -> n.startsWith("A"))
            .map(String::toUpperCase)
            .collect(Collectors.toList());
        System.out.println(resultado);
        System.out.println(nomes);
    }
}`},{title:"Serialização e desserialização",body:["Serializable marca classes cujo estado pode ser serializado pelo mecanismo nativo. ObjectOutputStream escreve e ObjectInputStream lê; o grafo alcançável deve ser compatível. static não representa estado da instância; transient exclui um campo da serialização padrão.","serialVersionUID participa da identificação de versão. Serialização não criptografa segredos. Desserializar conteúdo não confiável pode ser perigoso: o exemplo só lê bytes que ele mesmo produziu, sem servir de protocolo para entrada arbitrária de rede. A saída é Revisar e null."],code:`import java.io.*;
public class Main {
    static class Nota implements Serializable {
        private static final long serialVersionUID = 1L;
        String texto;
        transient String temporario;
        Nota(String t) { texto = t; temporario = "rascunho"; }
    }
    public static void main(String[] args) throws IOException, ClassNotFoundException {
        ByteArrayOutputStream bytes = new ByteArrayOutputStream();
        try (ObjectOutputStream out = new ObjectOutputStream(bytes)) {
            out.writeObject(new Nota("Revisar"));
        }
        try (ObjectInputStream in = new ObjectInputStream(
                new ByteArrayInputStream(bytes.toByteArray()))) {
            Nota lida = (Nota) in.readObject();
            System.out.println(lida.texto);
            System.out.println(lida.temporario);
        }
    }
}`},{title:"Threads e estado compartilhado",body:["Runnable representa a tarefa. Thread.start solicita execução em outra thread; chamar run diretamente é uma chamada normal na thread atual. join espera término; sleep não é estratégia confiável de coordenação.","contador++ envolve leitura, cálculo e escrita, sem atomicidade automática. synchronized protege a seção crítica quando todas as operações usam o mesmo monitor, com garantias relacionadas de visibilidade. volatile não torna incremento composto atômico. O programa espera as duas threads e imprime 2000."],code:`public class Main {
    static class Contador {
        private int valor;
        synchronized void incrementar() { valor++; }
        synchronized int get() { return valor; }
    }
    public static void main(String[] args) throws InterruptedException {
        Contador c = new Contador();
        Runnable tarefa = () -> { for (int i = 0; i < 1000; i++) c.incrementar(); };
        Thread a = new Thread(tarefa), b = new Thread(tarefa);
        a.start(); b.start();
        a.join(); b.join();
        System.out.println(c.get());
    }
}`},{title:"Sockets e protocolo",body:["O servidor associa uma porta e aguarda conexão com accept. O cliente conecta a endereço e porta. Ambos recebem fluxos de entrada e saída. TCP oferece bytes ordenados, sem preservar fronteiras das escritas da aplicação.","Defina enquadramento por linhas, tamanho prefixado ou outra regra. Trate encerramento, timeout, dados inválidos e liberação de recursos. Atender vários clientes pode exigir threads ou outra estratégia concorrente; o estado compartilhado ainda precisa de coordenação.","A demonstração usa apenas loopback, porta temporária e uma troca por linha. Imprime Recebido: Ola. Ela ilustra o mecanismo, sem pretender ser servidor de produção."],code:`import java.io.*;
import java.net.*;
import java.nio.charset.StandardCharsets;
public class Main {
    public static void main(String[] args) throws Exception {
        try (ServerSocket servidor = new ServerSocket(0, 1, InetAddress.getLoopbackAddress())) {
            Thread atendimento = new Thread(() -> {
                try (Socket s = servidor.accept()) {
                    s.setSoTimeout(3000);
                    BufferedReader in = new BufferedReader(new InputStreamReader(
                        s.getInputStream(), StandardCharsets.UTF_8));
                    PrintWriter out = new PrintWriter(new OutputStreamWriter(
                        s.getOutputStream(), StandardCharsets.UTF_8), true);
                    String pedido = in.readLine();
                    out.println("Recebido: " + pedido);
                } catch (IOException e) { throw new UncheckedIOException(e); }
            });
            atendimento.start();
            try (Socket cliente = new Socket(InetAddress.getLoopbackAddress(), servidor.getLocalPort())) {
                cliente.setSoTimeout(3000);
                BufferedReader in = new BufferedReader(new InputStreamReader(
                    cliente.getInputStream(), StandardCharsets.UTF_8));
                PrintWriter out = new PrintWriter(new OutputStreamWriter(
                    cliente.getOutputStream(), StandardCharsets.UTF_8), true);
                out.println("Ola");
                System.out.println(in.readLine());
            }
            atendimento.join();
        }
    }
}`}],
    formulas:[],practice:[{prompt:"Uma leitura TCP recebeu parte da mensagem. O transporte necessariamente falhou?",steps:["Não. TCP não preserva as fronteiras das escritas.","Leia até completar o tamanho esperado ou encontrar o delimitador definido.","Trate fim e timeout sem supor uma mensagem inteira por read."]},{prompt:"Duas threads incrementam contador mil vezes cada sem proteção. O resultado é necessariamente 2000?",steps:["Não. Intercalações podem perder incrementos.","Use monitor compartilhado ou abstração atômica.","Espere término com join antes de observar o total."]},{prompt:"Um transient String preenchido retorna com qual valor na desserialização padrão?",steps:["Não é gravado como parte do estado padrão.","Sem restauração personalizada, retorna ao padrão da referência: null.","Isso não significa criptografia nem segurança para entrada não confiável."]},{prompt:"Compare filter, map e operação terminal.",steps:["filter seleciona e map transforma.","A terminal consome o pipeline.","Essas operações não alteram automaticamente a coleção fonte."]}],
    pitfall:"I/O Stream e API Stream têm contratos diferentes. TCP não fornece mensagens prontas; volatile não torna contador++ atômico.",
    cards:[["Fim de InputStream.read()?","Retorno −1; available não é teste geral de fim."],["Reader e InputStream?","Caracteres e bytes, respectivamente; a conversão requer charset."],["filter e map?","Selecionar elementos versus transformar valores."],["transient e static na serialização?","transient é excluído; static pertence à classe e não ao estado serializado da instância."],["start e run?","start solicita outra thread; run direto é chamada normal."],["TCP preserva mensagens?","Não. A aplicação define enquadramento por tamanho, linhas ou outra regra."],["volatile torna incremento atômico?","Não; o incremento é uma operação composta."],["join?","Espera o término de outra thread."]],
    quiz:[["Qual transforma elementos da API Stream?","map.","filter exclusivamente.","flush.","accept.","map transforma; filter seleciona. flush e accept pertencem a outros contratos."],["−1 de InputStream.read indica:","Fim do fluxo.","Um byte válido necessariamente.","Mensagem vazia de um caractere.","Que available deve ser usado para continuar indefinidamente.","read retorna byte como inteiro não negativo ou −1 no fim."],["thread.run diretamente:","Executa como chamada normal na thread atual.","Equivale a start obrigatoriamente.","Cria outra JVM.","Equivale a join.","start solicita a execução concorrente; run sozinho é método comum."],["Um protocolo TCP por linhas deve:","Definir delimitadores e tratar encerramento e timeout.","Supor um read por write.","Ignorar charset sempre.","Desserializar qualquer objeto remoto.","O fluxo de bytes precisa ser interpretado e delimitado pela aplicação."],["Na serialização padrão:","transient não recupera automaticamente o valor original.","Todos os campos são criptografados.","static vira estado de cada instância.","Qualquer origem remota torna-se confiável.","O campo é excluído da representação padrão; compatibilidade e segurança exigem decisões adicionais."]],
    review:["Execute os quatro programas separadamente como Main.java.","Trace bytes, caracteres e fechamento.","Explique corrida e monitor compartilhado.","Defina protocolo antes de cliente e servidor.","Diferencie as duas famílias de stream."],
    readingNotes:["Os exemplos de leitura usam read contra −1 em vez de available ou ready como condição geral de fim. A API Stream foi separada de I/O para evitar confusão de terminologia."],
  }),
];
