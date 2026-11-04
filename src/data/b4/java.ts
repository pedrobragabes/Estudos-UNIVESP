import { week } from "./helpers";

export const javaTopics = [
  week("COM230",1,{
    title:"Paradigmas, classes, objetos e ambiente Java",
    objectives:["Comparar programação não estruturada, estruturada e orientada a objetos.","Relacionar estado e comportamento em classes e instâncias.","Distinguir JDK, JVM, IDE, biblioteca e framework e executar um programa."],
    summary:["Paradigmas oferecem modos de organizar soluções; POO agrupa estado e comportamento em objetos.","Classe define estrutura e operações; objeto é uma instância com identidade e estado.","Java compila fonte em bytecode executado pela JVM; ferramentas ajudam, mas não substituem o modelo conceitual."],
    sections:[{title:"Organização dos programas",body:["Programação não estruturada depende de saltos e controle pouco delimitado. A estruturada organiza sequência, seleção e repetição em blocos e subprogramas. POO modela entidades e responsabilidades, combinando dados e operações.","Os paradigmas coexistem: métodos Java usam decisões e laços. POO não elimina algoritmos nem garante qualidade por si só. A escolha de objetos deve refletir responsabilidades do problema."]},{title:"Classes, objetos e referências",body:["Uma classe define atributos e métodos. Cada instância pode ter estado diferente. Identidade distingue objetos que podem ter valores iguais. Uma variável de referência aponta para um objeto; atribuí-la a outra variável não cria uma cópia da instância.","No exemplo, ana e bia são objetos independentes. A variável mesma referencia o mesmo objeto que ana. Alterar esse objeto por uma referência torna a mudança observável pela outra. Atribuir um int, em comparação, copia seu valor."]},{title:"Do fonte à execução",body:["O JDK fornece javac e java; a JVM executa bytecode. Uma IDE integra edição, compilação e depuração. Bibliotecas oferecem recursos chamados pelo programa; frameworks definem parte da estrutura e do fluxo da aplicação.","Salve em Main.java, compile com javac -encoding UTF-8 Main.java e execute java Main. A classe pública corresponde ao nome do arquivo. Os exemplos usam recursos compatíveis com Java 8, coerentes com as referências do curso."]},{title:"Programa completo e saída",body:["A saída é Ana: 1, Bia: 0 e true. O contador de ana muda pelo acesso via mesma. O operador == compara identidade de referências nesse caso; conteúdo de objetos, quando pertinente, é comparado por equals.","main é static e oferece entrada ao programa. Os campos comuns pertencem às instâncias. Desenhe os objetos criados por new e as setas das referências antes de prever a saída."],code:`public class Main {
    static class Aluno {
        String nome;
        int revisoes;
        Aluno(String nome) { this.nome = nome; }
        void revisar() { revisoes++; }
    }
    public static void main(String[] args) {
        Aluno ana = new Aluno("Ana");
        Aluno bia = new Aluno("Bia");
        Aluno mesma = ana;
        mesma.revisar();
        System.out.println(ana.nome + ": " + ana.revisoes);
        System.out.println(bia.nome + ": " + bia.revisoes);
        System.out.println(ana == mesma);
    }
}`}],
    formulas:[],practice:[{prompt:"Após Aluno outra=ana; outra.revisar(); o que muda?",steps:["A atribuição copia a referência, sem executar new.","As variáveis observam o mesmo objeto; ana passa a 2 revisões.","Bia continua independente."]},{prompt:"Modele um livro sem reunir todo o sistema em uma classe.",steps:["Estado relevante: título e disponibilidade.","Operações: emprestar e devolver, com responsabilidades claras.","Leitores, catálogo e empréstimos podem ter outras responsabilidades."]},{prompt:"Diferencie falha de compilação de falha em execução.",steps:["Variável não declarada impede compilar.","Acesso a índice inválido pode falhar durante a execução.","Compilar não comprova comportamento correto; leia a mensagem e localize a origem."]}],
    pitfall:"Classe e objeto não são sinônimos. Atribuir uma referência não clona o objeto.",
    cards:[["Classe e objeto?","Classe define estrutura e comportamento; objeto é uma instância."],["O que new faz?","Cria uma instância e produz sua referência após inicialização."],["Copiar referência clona o objeto?","Não; duas variáveis podem observar a mesma instância."],["JDK?","Conjunto de ferramentas de desenvolvimento, incluindo compilador."],["JVM?","Ambiente que executa bytecode Java."],["Biblioteca e framework?","Biblioteca oferece recursos chamados pelo programa; framework organiza parte do fluxo e chama código da aplicação."]],
    quiz:[["Duas variáveis com a mesma referência:","Podem observar mudanças no mesmo objeto.","Sempre apontam para cópias.","Transformam a classe em static.","Impedem chamadas de método.","A referência é copiada, mas a instância continua compartilhada."],["Qual comando compila Main.java?","javac Main.java","java Main em Java 8.","jvm compile Main","javac Main.class","javac transforma fonte em bytecode; java Main executa o resultado no modelo usado aqui."],["Um método Java com for mostra que:","POO pode usar estruturas da programação estruturada.","Laços não existem em POO.","Toda classe é framework.","Objetos são proibidos nesse método.","Paradigmas podem se combinar; métodos contêm seleção, sequência e repetição."],["Qual possui estado particular de uma instância?","Objeto.","Nome do pacote apenas.","Compilador apenas.","Arquivo de configuração da IDE apenas.","A classe define campos; as instâncias têm valores próprios para campos de instância."]],
    review:["Desenhe referências e objetos.","Compile e execute sem depender da IDE.","Explique classe, instância e paradigma.","Distinga as ferramentas do ambiente Java."],
  }),
  week("COM230",2,{
    title:"Classes, objetos, encapsulamento e ocultação de informação",
    objectives:["Usar atributos, métodos, construtores e static.","Controlar visibilidade e preservar invariantes.","Distinguir encapsulamento de geração automática de acessadores."],
    summary:["Encapsulamento reúne estado e operações e define um contrato de uso; ocultação limita a exposição de detalhes.","Construtores e métodos devem manter o objeto em estado válido.","Estado de instância e estado static têm associações diferentes; memória e recursos externos também exigem distinção."],
    sections:[{title:"Contrato e invariantes",body:["Uma classe oferece operações que mantêm suas regras. Se um saldo não pode ser negativo no modelo, expor o campo permite violar a regra. A operação deve validar antes de alterar estado.","private não basta: um setter sem critérios ou uma coleção interna mutável exposta pode romper a proteção. Pergunte o que o objeto permite fazer, em vez de gerar um setter para cada campo."]},{title:"Visibilidade e construção",body:["public expõe o membro aos clientes com acesso ao tipo; private restringe acesso segundo as regras da classe envolvente. Sem modificador há acesso de pacote. protected permite acesso no pacote e por subclasses, com regras adicionais entre pacotes.","Construtor tem nome da classe e nenhum retorno declarado. this identifica o objeto atual. Ao declarar um construtor, não se recebe automaticamente outro sem argumentos. Use a menor visibilidade que atenda ao contrato."]},{title:"static, memória e recursos",body:["Cada objeto possui seus campos de instância. Um membro static pertence à classe em seu contexto de carregamento. Usar static para um saldo que deveria variar por conta compartilha estado indevidamente.","Java não possui destrutor determinístico como C++. Coleta de lixo trata memória, sem garantir fechamento imediato de arquivos ou sockets. Recursos externos devem ser fechados explicitamente, preferencialmente por try-with-resources quando aplicável."]},{title:"Programa completo com regra protegida",body:["Saldo em centavos simplifica a representação do exemplo. O construtor rejeita saldo inicial negativo e depositar exige valor positivo. A saída é 1500 e 1; não é uma implementação financeira completa.","Uma chamada depositar(-100) lança IllegalArgumentException antes de mudar o saldo. A regra fica no objeto, independente de menu ou interface gráfica."],code:`public class Main {
    static class Conta {
        private int saldo;
        private static int criadas;
        Conta(int inicial) {
            if (inicial < 0) throw new IllegalArgumentException("Saldo inicial");
            saldo = inicial; criadas++;
        }
        void depositar(int valor) {
            if (valor <= 0) throw new IllegalArgumentException("Valor positivo exigido");
            saldo += valor;
        }
        int getSaldo() { return saldo; }
        static int getCriadas() { return criadas; }
    }
    public static void main(String[] args) {
        Conta c = new Conta(1000);
        c.depositar(500);
        System.out.println(c.getSaldo());
        System.out.println(Conta.getCriadas());
    }
}`}],
    formulas:[],practice:[{prompt:"setIdade sem validação preserva uma idade válida só porque o campo é private?",steps:["Não. O método ainda pode aceitar valores inválidos.","Defina o contrato e valide antes de alterar estado.","Considere se o dado e sua mutação fazem sentido no domínio."]},{prompt:"Duas contas têm 100 e 200 centavos. Deposite 50 na primeira.",steps:["Os saldos passam a 150 e 200.","O contador static de criadas vale 2.","Saldo static teria compartilhamento inadequado nesse modelo."]},{prompt:"Como uma lista interna retornada pode expor implementação?",steps:["O cliente pode alterar a lista fora das operações da classe.","Isso pode violar invariantes.","Considere cópia defensiva ou visão não modificável, esclarecendo a profundidade da proteção."]}],
    pitfall:"Getters e setters indiscriminados não garantem encapsulamento. Coleta de lixo não substitui fechamento de recursos.",
    cards:[["Construtor tem retorno?","Não; inicializa a instância e tem o nome da classe."],["this?","Referência ao objeto atual em contexto de instância."],["Campo static?","Membro da classe, compartilhado no contexto correspondente."],["private garante sozinho invariantes?","Não; operações também precisam validar e respeitar regras."],["Acesso sem modificador?","De pacote."],["Java tem destrutor determinístico como C++?","Não; recursos externos devem ser fechados explicitamente."]],
    quiz:[["static representa:","Um membro da classe, compartilhado no contexto correspondente.","Um campo independente obrigatório por objeto.","Uma constante obrigatoriamente.","Imutabilidade automática.","static não equivale a final; determina associação à classe."],["Um construtor válido é:","Conta(int valor) { ... }","void Conta(int valor) { ... }","int Conta(int valor) { ... }","new Conta(int valor) { ... }","Construtores não têm tipo de retorno; void Conta seria método."],["Qual protege melhor uma regra?","Validar antes de alterar estado privado.","Tornar o campo público.","Setter que aceita tudo.","Confiar só no menu.","O objeto deve manter seu contrato independentemente do cliente."],["Sem modificador de acesso, um campo é:","De pacote.","Sempre public.","Sempre private.","Sempre protected.","A visibilidade padrão permite acesso no mesmo pacote."]],
    review:["Implemente uma invariante.","Compare quatro níveis de acesso.","Diferencie static e instância.","Separe memória de recursos externos."],
    readingNotes:["A menção genérica a destruidores no roteiro não foi transferida para Java como se houvesse destruição determinística."],
  }),
  week("COM230",3,{
    title:"Herança, polimorfismo, interfaces e classes abstratas",
    objectives:["Modelar especialização e contratos.","Distinguir sobrescrita de sobrecarga.","Prever despacho dinâmico e reconhecer limites de conversão."],
    summary:["Herança deve representar especialização e preservar o contrato do tipo base.","Polimorfismo permite referência comum para objetos de implementações diferentes.","Interfaces definem contratos; classes abstratas podem compartilhar estado e implementação."],
    sections:[{title:"Especialização e composição",body:["Uma classe Java pode ter uma superclasse direta e implementar várias interfaces. Use herança quando o objeto puder cumprir as expectativas do tipo base. A mera vontade de reutilizar código não justifica qualquer hierarquia.","Se uma impressora usa um documento, ela não é um documento. Associação ou composição representa melhor essa relação. Campos private da superclasse não se tornam diretamente acessíveis pela subclasse; use operações do contrato."]},{title:"Sobrescrita e sobrecarga",body:["Sobrescrita especializa método de instância herdado com assinatura compatível. A implementação executada depende do objeto em execução. @Override permite que o compilador confira a intenção.","Sobrecarga oferece mesmo nome com parâmetros diferentes; a seleção da assinatura ocorre em compilação. Métodos static e campos não participam do despacho dinâmico da mesma forma que métodos de instância sobrescritos."]},{title:"Interface e classe abstrata",body:["Interfaces permitem uma capacidade comum em classes de hierarquias distintas. Classes abstratas podem compartilhar estado e comportamento, deixando partes para tipos concretos. Não se instanciam diretamente tipos abstratos.","Uma referência de interface limita as operações visíveis ao contrato declarado. Java 8 permite métodos default e static em interfaces; isso não equivale a oferecer estado de instância de uma superclasse."]},{title:"Programa completo: comportamento selecionado pelo objeto",body:["A saída é PDF: notas e CSV: notas. O laço usa Exportavel, mas cada instância fornece produzir. super inicializa o título da classe base.","Um cast não transforma o objeto em outra classe: apenas muda a forma de tratar a referência. Conversões incompatíveis podem causar ClassCastException."],code:`public class Main {
    interface Exportavel { String produzir(); }
    static abstract class Relatorio implements Exportavel {
        private final String titulo;
        Relatorio(String titulo) { this.titulo = titulo; }
        String getTitulo() { return titulo; }
    }
    static class Pdf extends Relatorio {
        Pdf(String t) { super(t); }
        @Override public String produzir() { return "PDF: " + getTitulo(); }
    }
    static class Csv extends Relatorio {
        Csv(String t) { super(t); }
        @Override public String produzir() { return "CSV: " + getTitulo(); }
    }
    public static void main(String[] args) {
        Exportavel[] xs = {new Pdf("notas"), new Csv("notas")};
        for (Exportavel x : xs) System.out.println(x.produzir());
    }
}`}],
    formulas:[],practice:[{prompt:"Animal a=new Cachorro(); a.emitirSom(); Qual implementação sobrescrita executa?",steps:["O tipo declarado é Animal e o objeto real é Cachorro.","O despacho escolhe a implementação de Cachorro.","O tipo declarado ainda define a validade da operação em compilação."]},{prompt:"receber(Pdf) e receber(Exportavel) na mesma classe são sobrescrita?",steps:["São sobrecarga: os parâmetros diferem.","A assinatura é selecionada em compilação.","Sobrescrita exige método herdado e assinatura compatível."]},{prompt:"Impressora deve estender Documento porque usa um documento?",steps:["Não: usar não significa ser uma especialização.","Modele uma relação de uso ou composição.","Defina uma interface se diferentes documentos oferecerem um contrato comum."]}],
    pitfall:"Sobrecarga e sobrescrita são mecanismos diferentes. Cast não altera a classe real do objeto.",
    cards:[["extends?","Declara superclasse; classes Java têm herança simples direta."],["implements?","Declara atendimento a uma ou mais interfaces."],["Sobrescrita?","Especializa método de instância herdado com assinatura compatível."],["Sobrecarga?","Mesmo nome, listas de parâmetros diferentes."],["Instanciar abstrata diretamente?","Não; exige implementação concreta."],["O que escolhe o método sobrescrito executado?","O objeto real em tempo de execução."]],
    quiz:[["Exportavel e=new Csv(\"notas\"); e.produzir() retorna:","CSV: notas","PDF: notas","Exportavel: notas","Referência de interface é proibida.","O objeto Csv fornece a implementação do método."],["Mesmo nome com parâmetros diferentes é:","Sobrecarga.","Sobrescrita sempre.","Serialização.","Ocultação de pacote.","A sobrecarga muda a lista de parâmetros; a sobrescrita especializa método herdado."],["Uma classe pode:","Estender uma classe e implementar várias interfaces.","Estender diretamente várias classes.","Instanciar abstrata sem implementação.","Trocar sua classe real usando super.","Java combina herança simples de classes e múltiplas interfaces."],["@Override ajuda a:","Conferir a sobrescrita ou implementação pretendida.","Criar instância automaticamente.","Tornar método static.","Impedir toda herança.","O compilador verifica a correspondência do método com um contrato herdado."]],
    review:["Separe tipo declarado e objeto real.","Explique substituição pelo contrato.","Compare interface, abstrata e composição.","Preveja saídas antes de executar."],
  }),
  week("COM230",4,{
    title:"Generics e coleções em Java",
    objectives:["Declarar classes e métodos genéricos.","Distinguir Collection, List, Iterator, ListIterator e Collections.","Escolher operações e implementações tipadas."],
    summary:["Generics reutiliza código com relações de tipos verificáveis em compilação.","List representa sequência com posições e repetições; implementações têm custos distintos.","Iteradores e algoritmos utilitários fornecem operações padronizadas."],
    sections:[{title:"Parâmetros e limites",body:["Caixa<T> parametriza uma classe; um método genérico declara <T> antes do retorno. A relação de tipos reduz casts e revela incompatibilidades cedo. Uma raw List enfraquece a verificação e pode adiar ClassCastException para execução.","Generics usa tipos de referência: List<Integer>, não List<int>. Não é possível criar new T() diretamente. Boa parte das informações genéricas é tratada por apagamento de tipos; não se deve supor geração de uma classe distinta por argumento."]},{title:"Invariância",body:["Integer estende Number, mas List<Integer> não é List<Number>. Se fosse, alguém poderia adicionar Double na lista de inteiros. Esse raciocínio explica a restrição apresentada nos slides.","Como complemento autoral, List<? extends Number> permite ler números de listas com tipos mais específicos, sem inserir Number arbitrário. List<? super Integer> permite inserir Integer, mas sua leitura geral é Object. Escolha o curinga conforme as operações exigidas."]},{title:"Contratos e desempenho",body:["Collection é interface geral; List acrescenta sequência posicional. ArrayList usa vetor redimensionável e favorece acesso por índice. LinkedList é encadeada: acesso por índice percorre nós, e inserir não é sempre O(1) quando localizar a posição faz parte da operação.","Collections é classe utilitária, diferente de Collection. Iterator percorre e pode remover pelo seu contrato. ListIterator acrescenta percurso em ambas as direções e operações de lista. Modificação estrutural externa durante for-each pode invalidar a travessia."]},{title:"Programa completo",body:["O método primeiro preserva o tipo do elemento. A lista é ordenada e remove pares pelo próprio iterador. A saída é 1 e [1, 3]. Adicionar uma String nessa List<Integer> falharia em compilação.","iterator.remove é chamado depois de next. Não o substitua por remoção externa da lista dentro do mesmo for-each."],code:`import java.util.*;
public class Main {
    static <T> T primeiro(List<T> itens) {
        if (itens.isEmpty()) throw new IllegalArgumentException("Lista vazia");
        return itens.get(0);
    }
    public static void main(String[] args) {
        List<Integer> xs = new ArrayList<>(Arrays.asList(3, 2, 1));
        Collections.sort(xs);
        System.out.println(primeiro(xs));
        Iterator<Integer> it = xs.iterator();
        while (it.hasNext()) { if (it.next() % 2 == 0) it.remove(); }
        System.out.println(xs);
    }
}`}],
    formulas:[],practice:[{prompt:"Por que List<Integer> não pode ser List<Number>?",steps:["List<Number> permite adicionar Double.","Isso violaria o tipo de uma lista de Integer compartilhada.","Use curingas de forma coerente com as operações necessárias."]},{prompt:"Declare uma caixa genérica sem cast não verificado.",steps:["class Caixa<T> { private T valor; void set(T v){valor=v;} T get(){return valor;} }", "Instancie Caixa<String> e armazene String.","Não use new T(): o parâmetro não oferece um construtor automaticamente."]},{prompt:"Diferencie Collection e Collections.",steps:["Collection é interface de coleção.","Collections é classe com métodos utilitários.","List e Set estendem Collection; Map tem hierarquia própria."]}],
    pitfall:"ArrayList<Integer> pode ser List<Integer>; isso não torna List<Integer> uma List<Number>.",
    cards:[["Método genérico?","Declara <T> antes do retorno: static <T> T identidade(T x)."],["Pode usar int como argumento de tipo?","Não; use Integer ou outro tipo de referência."],["List<Integer> é List<Number>?","Não; tipos genéricos são invariantes."],["Collection versus Collections?","Interface versus classe utilitária de algoritmos."],["Contrato de List?","Sequência posicional, geralmente com repetições."],["Remoção durante Iterator?","Use iterator.remove após next quando a implementação suportar."]],
    quiz:[["Qual declaração é válida?","List<Integer> xs = new ArrayList<>();","List<int> xs = new ArrayList<>();","List<Integer> xs = new List<>();","ArrayList<int> xs = new ArrayList<>();","Parâmetros de tipo são referências; List é interface e precisa de implementação."],["Collections.sort usa:","Classe utilitária de algoritmos.","Construtor de Collection.","Serialização.","Socket.","Collections fornece métodos estáticos sobre coleções."],["ArrayList:","Tem acesso eficiente por índice e pode deslocar elementos ao inserir.","Tem toda inserção O(1) no pior caso.","Proíbe repetições.","É um mapa de chaves.","Vetor redimensionável favorece índice; inserções intermediárias deslocam valores."],["Uma raw List com tipos misturados pode:","Adiar erro de cast para execução.","Garantir segurança genérica superior.","Converter Integer em String automaticamente.","Impedir toda compilação.","Parâmetros de tipo tornam muitas incompatibilidades detectáveis em compilação."]],
    review:["Escreva classe e método genéricos.","Compare contrato e implementação.","Experimente um erro de tipo.","Ordene, percorra e remova corretamente."],
    readingNotes:["MinhaLista nos slides contém posição além do último índice ao inserir após expansão. Os exemplos autorais usam índices válidos e não reproduzem esse defeito."],
  }),
];
