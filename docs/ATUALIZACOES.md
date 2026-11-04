# Atualização do acervo e publicação

Este é o roteiro operacional para futuras atualizações do Estudos UNIVESP. Leia também [Arquitetura](../ARCHITECTURE.md), [Segurança](../SECURITY.md) e [Contribuição](../CONTRIBUTING.md). O histórico da entrega de novembro está em [Operação de 04/11/2026](operacoes/2026-11-04.md); a cobertura acadêmica está no [relatório do 4º bimestre](acervo/2026-b4/RELATORIO.md).

## Estado de referência

- Produção: https://estudos-univesp.vercel.app/ na Vercel, projeto `estudos-univesp`.
- GitHub: `pedrobragabes/Estudos-UNIVESP`, remoto `origin`. O remoto `sites` pertence a outra rota histórica e não publica essa aplicação na Vercel.
- Pasta da aplicação: `univesp-app/`, dentro do diretório Estudos-UNIVESP. Execute os comandos neste diretório, onde está `package.json`.
- Next.js 16, React 19, TypeScript, Zod, KaTeX e highlight.js. Node.js 24 foi usado na validação.
- Acervo corrente: PES300, ADM200 e COM230, sete semanas por disciplina. Acervo anterior: COM160, COM200 e COM210.
- Prova confirmada pelo usuário: **12/11/2026**. Novas datas devem vir do usuário ou de calendário oficial, sem inferir a partir da data antiga.

## 1. Preparar a atualização

1. Leia as instruções do repositório, inclusive `AGENTS.md`, e os guias da versão de Next instalada antes de alterar sua arquitetura.
2. Confira `git status --short`, branch, remotos e histórico. Identifique alterações locais anteriores; não descarte nem atribua automaticamente todo o conteúdo ao trabalho atual.
3. Crie uma branch `codex/<assunto>` ou siga a convenção vigente. Preserve o trabalho local ao mudar de branch.
4. Confirme qual projeto Vercel e domínio estão associados. `.vercel/project.json` é um vínculo local ignorado pelo Git; não invente identificadores nem crie outro projeto por engano.
5. Faça backup dos dados pessoais antes de migrações ou alterações de preferências. Use a exportação da interface. Para uma manutenção administrativa já autorizada, guarde uma cópia privada do estado antes da alteração.

## 2. Coletar as fontes acadêmicas

Use a sessão autenticada do usuário no AVA. Não armazene senha, cookies, códigos OAuth ou URLs com tokens no catálogo público.

Para cada disciplina, percorra Geral, todas as semanas e Revisão. Registre introdução, videoaulas, slides, leituras, capítulos, aprofundamento, sínteses, orientações de atividades, fóruns relevantes e lives. Leia o conteúdo efetivamente acessível. Uma visita a um lançador LTI não comprova leitura do livro.

Mantenha um inventário separado da interpretação acadêmica: URL de origem, disciplina, seção/semana, título, tipo, conteúdo capturado e resultado de acesso. Na coleta de novembro, o arquivo privado foi `.sources/ava-2026-b4/capture.json`, com arrays `inventory` e `collected`. Os scripts de processamento dependem desse formato e das chaves de leituras já registradas; não são um coletor autônomo para outro curso.

### Livros, vídeos e recursos externos

- Confirme edição e correspondência entre página impressa e posição do leitor. Aguarde a navegação terminar antes de capturar a página; texto antigo pode permanecer na tela durante o carregamento.
- Registre páginas em branco, retorno vazio, falha de reconhecimento e intervalos inexistentes. Não classifique essas posições como leitura completa.
- Preserve a referência ao capítulo quando uma edição tiver paginação diferente. Documente a diferença; não diga que leu páginas inexistentes.
- Exporte transcrições quando disponíveis e registre idioma e qualidade. Uma legenda automática pode trocar termos, fórmulas e nomes de classes. Confirme com slides, livros e execução de código.
- Se não houver transcrição, procure material associado e identifique explicitamente o limite da análise. Uma transcrição exportada não equivale a assistir integralmente ao vídeo.
- Abra o destino dos links de REAs. A página de catálogo pode conter apenas uma descrição; jogos e animações podem ter conteúdo não exposto no texto.
- Consulte orientações de atividades sem responder ou enviar tentativas automaticamente. Não publique dados de participantes dos fóruns. Não entre em uma reunião ao vivo para procurar gravações.
- Respeite negativas de acesso. Registre a pendência e continue com os outros materiais.

### Arquivos privados e catálogo versionado

`.sources/` guarda capturas, PDFs originais, transcrições, textos de leitores, resultados de execução e provas visuais. Essa pasta fica fora do Git, do lint e do deploy. Obras completas e dados pessoais não devem ser copiados para `public/`, `docs/` ou `src/data/`.

`src/data/ava-sources.json` contém somente metadados de referência e notas de cobertura. Os estados são:

| Estado | Significado |
|---|---|
| `verified` | Conteúdo descrito na nota foi consultado |
| `partial` | Houve consulta ou processamento, com limites explícitos |
| `pending` | Conteúdo ainda não analisado ou indisponível |
| `excluded` | Recurso administrativo fora do acervo acadêmico |

O estado vale para o escopo informado na nota. Não promova uma semana inteira a análise integral por ter aberto seus links. O progresso pessoal dentro do aplicativo é outro registro e não deve ser importado dos percentuais do AVA.

## 3. Produzir e integrar o conteúdo

1. Organize disciplina → semana → tema → explicações → prática → revisão.
2. Produza texto autoral com objetivos, conceitos, relações, aplicações, exemplos resolvidos, erros comuns, cartões e questões comentadas. Não reproduza livros integralmente nem invente aulas ou referências.
3. Em Estatística, declare hipóteses, parametrizações e condições das fórmulas; confira quantis, unidades, limites e interpretação. Texto extraído de PDF pode perder barras, quadrados e raízes.
4. Em Java, forneça programas completos quando a execução for parte do estudo, com comportamento esperado e versão compatível. Diferencie a terminologia do material de correções técnicas verificadas.
5. Em Gestão da Inovação, conecte modelos a decisões e casos autorais. Exemplos históricos não comprovam a situação atual de uma empresa ou edital.
6. Registre correções ou divergências em `readingNotes`, vinculadas à semana. Distinga explicação complementar de afirmação diretamente obtida da fonte.

### Organização dos arquivos

| Arquivo | Responsabilidade |
|---|---|
| `src/data/legacy-curriculum.ts` | Conteúdo anterior preservado |
| `src/data/b4/statistics.ts` | Sete semanas de PES300 |
| `src/data/b4/innovation.ts` | Sete semanas de ADM200 |
| `src/data/b4/java.ts` e `java-advanced.ts` | Sete semanas de COM230 |
| `src/data/b4/reading-additions.ts` | Complementos autorais após leitura externa |
| `src/data/b4/helpers.ts` | IDs e construção dos tópicos, cartões e questões |
| `src/data/curriculum.ts` | Agregação do acervo corrente e anterior |
| `src/domain/study.ts` | Schemas, estado inicial, plano, quizzes e revisão espaçada |
| `src/components/study/lesson.tsx` | Estudo aprofundado, fontes, fórmulas, código e revisão geral |
| `docs/acervo/2026-b4/` | Exportação Markdown autoral independente da interface |

IDs de tópicos, cartões e questões referenciam progresso persistido. Não renumere conteúdo existente para abrir espaço. Não altere o significado de uma questão já respondida mantendo o mesmo ID: o histórico usa índices das alternativas canônicas. A interface pode embaralhar alternativas sem modificar a correspondência persistida.

Acrescentar um bimestre também exige revisar os filtros de painel, plano, flashcards, simulados, erros, materiais e busca. O acervo anterior deve continuar acessível. Não altere schemas persistidos sem definir compatibilidade e migração.

## 4. Processamento e exportação

Os scripts abaixo foram criados para a coleta de 2026. Antes de usá-los em outro período, confira caminhos, formato e cobertura. Os dados privados não são obtidos por `git clone`.

| Comando/arquivo | Uso e pré-requisito |
|---|---|
| `node scripts/capture-ava.cjs` | Ponte local opcional em `127.0.0.1:4319`; recebe observações já coletadas e substitui `capture.json`. Faça cópia antes de reutilizar e encerre ao terminar |
| `python scripts/read-public-pdfs.py` | Baixa URLs públicas de PDFs previamente observadas; exige Python e pypdf |
| `python scripts/analyze-private-sources.py` | Indexa transcrições já exportadas, inventário de vídeos e leituras preservadas; depende dos caminhos locais indicados no script |
| `python scripts/build-source-catalog.py` | Gera catálogo e auditoria públicos a partir da captura e análises privadas; notas de livros/REAs são específicas desta coleta e exigem revisão humana |
| `npm run export:study` | Regenera os 21 Markdown, índice e fontes Java privadas a partir do currículo. Não depende de login no AVA |
| `npm run verify:java` | Compila e executa os dez exemplos exportados; exige Python e JDK/javac no PATH |

`scripts/integrate-b4.py` foi uma transformação única por substituição textual. **Não o execute novamente como rotina de atualização**. A aplicação já incorpora suas mudanças; novas alterações devem ser feitas nos arquivos finais.

O catálogo contém referências repetidas entre semanas. Conte separadamente recursos AVA, arquivos únicos, páginas extraídas, posições de leitores, capítulos e vídeos. Não some essas unidades como se fossem materiais integralmente analisados.

## 5. Validar antes de publicar

```powershell
npm ci
npm run export:study
npm run check
npm run verify:java
npm audit --omit=dev --audit-level=high
```

`check` executa lint, testes e build; ele **não inclui** a auditoria de dependências. A CI também executa `npm audit`, e pode falhar mesmo com `check` aprovado. Registre cada resultado sem chamar a auditoria de aprovada quando não estiver.

Para testar gravações pela interface, inicie uma instância com `STUDY_DATA_DIR` apontando para um diretório privado de verificação e uma porta separada. Não use o diretório real do usuário para criar revisões ou simulados de teste.

Confira navegação de semanas, busca, fórmulas sem erro KaTeX, destaque Java, respostas expansíveis, flashcards, correção e histórico de simulados, persistência após recarregar, revisão geral e fontes. Registre o que foi realmente testado. Acesso visual interrompido não invalida um deploy confirmado por CLI, mas deve ser informado como limite de verificação.

## 6. Persistência, data da prova e manutenção

- Local: `.study-data/state.json` e anexos por UUID; fila no processo e gravação atômica por arquivo temporário e rename.
- Vercel: Blob privado, `study/state.json` e anexos; atualização por revisão e ETag. Dados pessoais não ficam no Git nem no pacote de publicação.
- Organizador anterior: D1 separado, acessível em `/organizador` quando configurado. O backup da área de estudos não inclui esse banco.

Mudar `initialStudyState.examDate` altera o padrão para estados novos; **não modifica preferências já persistidas**. Atualize a data existente pela interface, preservando todo o restante. A manutenção de 04/11 alterou somente a data e a revisão do estado online, de 8 para 9, e confirmou que o simulado existente permaneceu idêntico.

### Gravação condicional no Blob

O download privado pode fornecer um ETag fraco, com prefixo `W/`, devido à representação comprimida. Esse valor causou recusa de gravações condicionais na produção. A implementação passou a obter o ETag canônico por `head()` **antes** de ler o estado usado na escrita, e usa esse valor em `put({ ifMatch })`. Se outro escritor alterar o objeto entre as chamadas, a comparação continua impedindo sobrescrita.

Não resolva conflitos retirando `ifMatch`, usando sobrescrita incondicional ou zerando os dados. Ausência de objeto é tratada com criação sem sobrescrita. Testes cobrem o ETag fraco de leitura, o ETag canônico de escrita e conflito entre revisões. A correção também foi exercitada contra o Blob real ao salvar a data autorizada.

## 7. Publicar na Vercel

Use a CLI oficial ou a integração apropriada. A autorização para um deploy deve existir na solicitação vigente; documentação não concede autorização por si só.

```powershell
npx vercel login
npx vercel project inspect estudos-univesp
npx vercel deploy --prod --yes
```

Confirme o projeto vinculado antes do comando de publicação. Mantenha `STUDY_PASSWORD` e `BLOB_READ_WRITE_TOKEN` na Vercel; não substitua segredos existentes por valores locais vazios. Variáveis secretas podem não ser exportáveis: um marcador `[SENSITIVE]` não é uma senha real e não deve ser reenviado como configuração.

`.vercelignore` exclui dados pessoais, `.sources`, ambientes locais, dependências, saídas de build e o protótipo Vite. Confira exclusões antes do upload. Nunca publique capturas brutas ou livros para facilitar uma verificação.

Espere `READY` e confirme o alias **https://estudos-univesp.vercel.app/**. Uma URL temporária de deployment não comprova que o domínio final foi atualizado. Confira login, conteúdo e salvamento quando houver sessão disponível; não remova autenticação para testar. Guarde resultados e capturas em arquivo privado.

`npm run deploy` ainda aponta para a rota histórica Cloudflare/OpenNext; **não é o comando da publicação Vercel**. Não o use para atualizar esse domínio.

## 8. Git, revisão e rastreabilidade

Deploy por CLI e sincronização do Git são operações independentes. Publicar arquivos locais não cria commit, push, PR ou vínculo automático com GitHub.

1. Revise `git diff`, arquivos novos e exclusões. Use `git check-ignore` para confirmar que `.sources`, `.study-data`, `.env*` e `.vercel` não entrarão no commit.
2. Adicione explicitamente código, conteúdo autoral, metadados, testes e documentação necessários. Evite `git add .` em uma pasta que já continha trabalho não revisado.
3. Confira o diff do índice e procure credenciais ou dados pessoais antes de fazer commit.
4. Faça commit semântico, push para `origin` e abra PR conforme `CONTRIBUTING.md`. Um PR aberto ainda não significa merge em `main`.
5. Registre a versão publicada, validações e limitações. Não afirme que existe deploy automático por Git sem confirmar a conexão do repositório na Vercel.

Em novembro, o site foi publicado antes de sincronizar o Git. Esta documentação e a branch de consolidação registram essa diferença explicitamente; o histórico de Git passa a conter a aplicação funcional e seu procedimento de atualização.
