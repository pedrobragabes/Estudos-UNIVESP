import type { Lesson, Topic } from "@/src/domain/study";

// Original explanations added after consulting the external readers and captions.
// Raw book pages and transcripts remain in the private source archive.
const additions: Record<string, Partial<Lesson>> = {
  "PES300-S2": {
    sections: [{ title: "Outras médias: qual pergunta cada uma responde?", body: ["O REA também compara médias ponderada, geométrica e harmônica. Na ponderada, some valor vezes peso e divida pela soma dos pesos. A geométrica de valores positivos representa um fator multiplicativo médio: crescer 10% e depois cair 10% produz fator total 1,1×0,9=0,99, não crescimento líquido zero.", "A harmônica de valores positivos é o inverso da média aritmética dos inversos. Para percorrer distâncias iguais a 60 e 40 km/h, a velocidade média é 2/(1/60+1/40)=48 km/h. Se os tempos, e não as distâncias, forem iguais, a média apropriada é 50 km/h. Antes de calcular, defina o que permanece igual e a grandeza que está sendo agregada."] }],
  },
  "PES300-S5": {
    readingNotes: ["Na página textual do REA Variação da curva normal, a expressão exibida omite o quadrado do termo padronizado no expoente. A densidade normal correta usa −(x−μ)²/(2σ²), com σ>0; a fórmula não deve ser copiada com essa omissão."],
  },
  "PES300-S7": {
    sections: [
      { title: "Proporção amostral e população finita", body: [
        "Morettin também estuda a proporção amostral. Codifique cada observação como 1 para presença da característica e 0 para ausência. A proporção de sucessos é a média desses indicadores. Em n ensaios Bernoulli independentes com probabilidade p constante, sua esperança é p e sua variância é p(1−p)/n. Essa expressão é exata no modelo; a aproximação normal é uma etapa adicional.",
        "A aproximação normal exige quantidade suficiente de sucessos e fracassos esperados; critérios numéricos são regras práticas e podem funcionar mal perto de 0 ou 1. Não confunda a variabilidade dos indivíduos binários com o erro padrão da proporção. Na coleta sem reposição de uma população finita, as observações são dependentes: o erro padrão da média recebe o fator √((N−n)/(N−1)), quando σ² é definido com denominador N. Essa correção importa quando a fração amostral não é pequena."
      ] },
      { title: "Comparar estimadores exige mais que ausência de viés", body: [
        "Entre estimadores não enviesados do mesmo parâmetro, menor variância significa maior precisão, em uma comparação de eficiência com condições definidas. Um estimador suficiente retém, no sentido estatístico do modelo, toda a informação amostral sobre o parâmetro. Suficiência, consistência, eficiência e ausência de viés são propriedades distintas; não decorrem automaticamente umas das outras.",
        "O erro quadrático médio reúne variância e quadrado do viés. Por isso, um pequeno viés pode acompanhar menor erro global. Como comparação autoral, dois estimadores têm variâncias 4 e 1; o primeiro é não enviesado e o segundo tem viés 1. Seus erros quadráticos médios são 4 e 2. O segundo é melhor por esse critério, embora seja enviesado."
      ] }
    ],
    formulas: [
      { tex: "\\hat p=\\frac Xn,\\quad E(\\hat p)=p,\\quad \\operatorname{Var}(\\hat p)=\\frac{p(1-p)}n", meaning: "X binomial com n ensaios independentes e mesma probabilidade de sucesso. O erro padrão é a raiz dessa variância." },
      { tex: "\\operatorname{EQM}(\\hat\\theta)=\\operatorname{Var}(\\hat\\theta)+[E(\\hat\\theta)-\\theta]^2", meaning: "Decomposição do erro quadrático médio, quando os momentos existem." }
    ],
    practice: [{ prompt: "Sob o modelo binomial, p=0,40 e n=400. Qual a média e o erro padrão da proporção?", steps: ["E(p̂)=0,40; isso é uma propriedade de repetições, não uma promessa para cada amostra.", "Var(p̂)=0,4×0,6/400=0,0006. Erro padrão=√0,0006≈0,0245, ou 2,45 pontos percentuais.", "Há 160 sucessos e 240 fracassos esperados. Uma aproximação normal é plausível no centro, mas não transforma uma proporção específica em certeza."] }],
    review: ["Reconheça a proporção como média de indicadores e diferencie variância, erro padrão e viés."],
  },
  "ADM200-S1": {
    sections: [{ title: "Inovação aberta e fechada", body: [
      "A leitura distingue processos concentrados dentro da organização de processos que combinam conhecimentos internos e externos. Na inovação aberta, universidades, fornecedores, clientes e parceiros podem contribuir, e uma tecnologia pode encontrar caminhos de exploração fora da empresa que a originou. A escolha envolve capacidade de absorver conhecimento e coordenar relações.",
      "Aberta não significa ausência de propriedade intelectual nem divulgação irrestrita. Como caso autoral, uma fabricante pode testar um sensor com uma universidade, licenciar uma patente e manter partes do processo em sigilo. O problema gerencial é definir contribuição, responsabilidades, direitos de uso e apropriação de valor; chamar uma reunião externa de 'inovação aberta' não resolve essas decisões."
    ] }],
    readingNotes: ["Em Criatividade e inovação, a sequência solicitada 124–142 excede o limite numerado 136 do leitor disponível. As páginas 137–142 não foram presumidas a partir do restante do capítulo."],
  },
  "ADM200-S2": {
    sections: [{ title: "Papéis e comunicação no processo inovador", body: [
      "Trott diferencia contribuições como desenvolver uma solução técnica, defender a ideia internamente, articular oportunidades de negócio e conectar a equipe a conhecimentos externos. Esses papéis podem ser distribuídos entre várias pessoas. Ter bons especialistas não garante que uma proposta atravesse decisões de orçamento, produção e comercialização.",
      "Em um caso autoral de embalagem reutilizável, a engenharia avalia o material, alguém mobiliza apoio ao projeto, compras envolve fornecedores e a área comercial verifica aceitação. Uma estrutura excessivamente rígida pode interromper a troca de informação; uma estrutura sem critérios pode dispersar recursos. Combine espaço de exploração, responsabilidades e decisões baseadas em evidências.",
      "Métricas também moldam comportamento. Contar ideias mede uma entrada; acompanhar experimentos e tempo de aprendizagem mede processo; observar adoção e resultado mede saídas. Recompensar apenas quantidade de ideias pode incentivar propostas sem relação com a estratégia. Analise o conjunto e o horizonte de tempo."
    ] }],
  },
  "ADM200-S3": {
    sections: [{ title: "Distinguir os objetos de teste", body: [
      "Teste de conceito investiga se o público compreende e valoriza a proposta antes de construir a solução completa. Teste de produto avalia características e desempenho do artefato. Teste de mercado observa a oferta em condições comerciais delimitadas. Um resultado positivo em uma dessas etapas não comprova automaticamente as demais.",
      "Uma bebida pode ter conceito atraente e sabor rejeitado; um protótipo pode ser apreciado em teste gratuito e não vender ao preço necessário. Defina previamente a decisão que o teste deve apoiar, o público, a métrica e os limites de generalização. O desenvolvimento simultâneo aproxima funções para considerar fabricação, uso e manutenção durante o projeto, sem eliminar a necessidade de critérios de avanço."
    ] }],
  },
  "ADM200-S6": {
    sections: [{ title: "Viabilidade: retorno, tempo e custo de oportunidade", body: [
      "Além de margem e equilíbrio operacional, as fontes discutem indicadores de investimento. Payback simples é o tempo até recuperar o desembolso inicial por entradas líquidas acumuladas. Ele é fácil de interpretar, mas ignora o valor do dinheiro no tempo e o que ocorre após a recuperação. Rentabilidade relaciona resultado ao investimento; lucratividade relaciona lucro à receita. Declare período e definição utilizada.",
      "O valor presente líquido desconta fluxos futuros por uma taxa compatível com o custo de oportunidade adotado na análise. Um VPL positivo indica que os fluxos estimados superam esse referencial no modelo. A TIR é uma taxa que zera o VPL; fluxos com mudanças de sinal podem gerar múltiplas taxas ou nenhuma solução útil. Compare cenários e premissas, em vez de tratar um indicador isolado como garantia.",
      "Para apresentar o plano, ajuste profundidade ao leitor e coloque a lógica do negócio no sumário executivo, redigido após as análises. Defina marcos e indicadores para acompanhar previsto e realizado. Um plano que apenas impressiona investidores e não ajuda a gerir perde uma de suas funções centrais."
    ] }],
    formulas: [{ tex: "VPL=-I_0+\\sum_{t=1}^{T}\\frac{FC_t}{(1+i)^t}", meaning: "Exemplo didático: I₀ é investimento inicial, FCₜ fluxo líquido do período t e i taxa por período. Fluxos e taxa precisam usar a mesma unidade temporal." }],
    practice: [{ prompt: "Um projeto didático investe 100 hoje e gera 60 ao final de cada um dos próximos dois anos. Compare payback simples e VPL a 10% ao ano.", steps: ["Após um ano, recuperou 60; faltam 40. Com entradas uniformes durante o segundo ano, payback simples=1+40/60≈1,67 ano. Se os recebimentos ocorrerem estritamente só no fim dos anos, a recuperação acontece no fim do segundo ano.", "VPL=−100+60/1,10+60/1,10²≈4,13, nas mesmas unidades monetárias.", "O VPL é positivo sob essas premissas. Mudanças nos fluxos, riscos e taxa podem alterar a conclusão; o payback simples não mede o excedente descontado."] }],
    review: ["Diferencie lucratividade, rentabilidade, payback, VPL e TIR; explicite as limitações de cada medida."],
  },
  "ADM200-S7": {
    readingNotes: ["Plano de negócios com o modelo Canvas: a edição disponível tem 122 páginas, enquanto o AVA pede também 168–180. Foram consultados o capítulo 3 e o exemplo completo do capítulo 5 disponível. A diferença de edição não foi apresentada como leitura das páginas inexistentes."],
  },
  "COM230-S4": {
    sections: [{ title: "Conversões, listas de tamanho fixo e sobrecarga", body: [
      "Coleções genéricas usam tipos de referência: List<Integer>, não List<int>. Autoboxing converte int em Integer em contextos adequados; unboxing faz o inverso e pode lançar NullPointerException se a referência for null. Isso não torna os dois tipos idênticos nem permite comparar qualquer objeto com == para igualdade de valor.",
      "Arrays.asList cria uma lista de tamanho fixo apoiada no array recebido: set pode alterar elementos, mas add e remove estruturais não são suportados. Para uma lista expansível independente, passe o resultado ao construtor de ArrayList. Atenção também a List<Integer>.remove: remove(1) escolhe o índice inteiro; remove(Integer.valueOf(1)) escolhe a primeira ocorrência do valor 1."
    ] }, { title: "Filas, pilhas e algoritmos de Collections", body: [
      "Queue descreve operações como offer, poll e peek; as duas últimas retornam null quando a fila está vazia nas implementações usuais que não admitem null. PriorityQueue remove segundo prioridade definida pela ordem natural ou comparador. Sua iteração não promete uma sequência globalmente ordenada: para obter os valores por prioridade, remova repetidamente com poll.",
      "Stack é a classe histórica de pilha estudada no capítulo. Como complemento de uso, Deque também permite push, pop e peek para a disciplina LIFO. Algoritmos de Collections operam sobre coleções: sort ordena, reverse inverte e shuffle embaralha. A busca binária exige ordenação compatível com o comparador usado na busca. Alterar a ordem de uma lista pode afetar outras referências para o mesmo objeto."
    ] }],
    practice: [{ prompt: "Uma List<Integer> contém [8,1,5]. Compare remove(1), remove(Integer.valueOf(1)) e uma remoção em Arrays.asList.", steps: ["Em cópias independentes da lista expansível, remove(1) remove o elemento no índice 1, que vale 1; remove(Integer.valueOf(1)) procura o valor 1. Neste exemplo os resultados coincidem, embora os critérios sejam diferentes.", "Para evidenciar a diferença, use [1,8,5]: remove(1) deixa [1,5], enquanto remove(Integer.valueOf(1)) deixa [8,5].", "Uma remoção estrutural na lista de Arrays.asList lança UnsupportedOperationException; crie uma ArrayList se precisar alterar o tamanho."] }],
  },
  "COM230-S7": {
    sections: [{ title: "Estados de threads e tarefas gerenciadas", body: [
      "Os estados de Thread em Java incluem NEW, RUNNABLE, BLOCKED, WAITING, TIMED_WAITING e TERMINATED. RUNNABLE abrange execução e aptidão para executar conforme o escalonamento; não garante um núcleo exclusivo. BLOCKED indica espera por monitor. sleep não libera monitores já adquiridos; wait, chamado sob o monitor adequado, libera esse monitor durante a espera.",
      "Runnable descreve uma tarefa; uma Thread fornece um caminho de execução. ExecutorService separa a submissão da tarefa da gestão dos trabalhadores. Após submeter, encerre o serviço de forma adequada e aguarde término quando o resultado exigir conclusão. shutdown não aguarda sozinho todas as tarefas; join aguarda uma Thread específica. Nenhuma dessas operações torna automaticamente atômico um incremento compartilhado."
      ,"volatile estabelece garantias de visibilidade e ordenação para leituras e escritas da variável; não torna contador++ atômico, pois essa expressão combina leitura, cálculo e escrita. Para uma atualização indivisível, use sincronização coerente ou uma classe atômica apropriada. Ao usar wait, teste a condição em um laço: pode haver despertar sem que a condição necessária esteja satisfeita."
    ] }, { title: "Padrões de projeto: a leitura de Sommerville", body: [
      "A seção 7.2 descreve padrões por nome, problema, estrutura da solução e consequências. Um padrão é uma organização recorrente de responsabilidades, adaptada ao contexto; não é um bloco de código a copiar sem examinar forças e custos. Essa leitura conecta o estudo de classes, interfaces e baixo acoplamento à organização do projeto.",
      "No Observer, um objeto que mantém estado permite registrar observadores e os notifica quando o estado muda. Assim, diferentes apresentações podem reagir sem que o sujeito conheça cada classe concreta. Como exemplo autoral, um placar notifica um painel e um histórico. É preciso definir registro, remoção, conteúdo da notificação e tratamento de falhas. Observer não cria threads nem garante segurança de concorrência por si só."
    ] }],
    practice: [{ prompt: "Um placar precisa atualizar painel e histórico a cada alteração. Como aplicar Observer e o que ainda precisa ser decidido?", steps: ["Defina um contrato de observador e permita cadastrar e remover interessados no placar. Ao alterar o estado, o placar chama a operação de atualização de cada observador.", "Faça painel e histórico implementarem o contrato; o placar depende da interface, evitando chamadas específicas a cada apresentação concreta.", "Defina se a entrega será síncrona, como lidar com exceções e como sincronizar alterações concorrentes se houver. O padrão, isoladamente, não oferece essas garantias."] }],
    readingNotes: ["Na 8ª edição, nove posições virtuais do trecho de redes retornaram texto vazio. O tópico usa as páginas recuperadas, as transcrições principais, slides e o exemplo executável local; não declara leitura completa dessas posições.", "Alguns vídeos complementares têm legenda automática em outro idioma e reconhecimento inadequado. A terminologia e o comportamento do código foram conferidos com fontes textuais e execução, sem copiar erros da legenda.", "O slide complementar de threads resume volatile como operações atômicas, formulação que não deve ser estendida a operações compostas. A explicação acima foi conferida com a especificação da linguagem, capítulo 17. Os estados simplificados do slide também foram diferenciados dos estados formais de Thread."],
  },
};

export function withReadingAdditions(topic: Topic): Topic {
  const extra = additions[topic.id];
  if (!extra || !topic.lesson) return topic;
  const original = topic.lesson;
  return { ...topic, lesson: {
    ...original,
    sections: [...original.sections, ...(extra.sections ?? [])],
    formulas: [...original.formulas, ...(extra.formulas ?? [])],
    practice: [...original.practice, ...(extra.practice ?? [])],
    review: [...original.review, ...(extra.review ?? [])],
    readingNotes: [...(original.readingNotes ?? []), ...(extra.readingNotes ?? [])],
  } };
}
