# Estudos UNIVESP

Espaço pessoal de estudo para Engenharia da Computação, com o **4º bimestre de 2026** como entrada principal e o acervo do 3º bimestre preservado. Data de prova, tempo diário e registros anteriores não são sobrescritos. A data padrão da prova é 12/11/2026, confirmada pelo calendário enviado pelo usuário em 04/11/2026. Dados já salvos mantêm suas preferências até serem atualizados na interface.

## Funcionalidades

- PES300 — Estatística e Probabilidade; ADM200 — Gestão da Inovação e Desenvolvimento de Produtos; COM230 — Programação Orientada a Objetos. As três disciplinas anteriores continuam no acervo.
- 21 semanas novas com objetivos, explicações progressivas, fórmulas KaTeX, código Java destacado, exemplos e revisão; 21 semanas anteriores preservadas.
- 128 cartões novos, 85 questões autorais novas e 69 exercícios com resolução comentada. O banco anterior de 63 cartões e 42 questões mantém seus IDs e resultados.
- Flashcards com revisão espaçada: esqueci em 10 minutos, difícil em 1 dia e lembrei em 2 dias inicialmente, dobrando até 60 dias. O modo Todos permite revisão antecipada. O filtro misto padrão usa o 4º bimestre; disciplinas antigas podem ser selecionadas.
- Simulados por matéria ou mistos, embaralhamento, cronômetro, correção comentada, histórico e caderno de erros. Uma questão sai dos erros após um acerto posterior.
- Busca no conteúdo aprofundado, revisão geral por disciplina e fontes com link, tipo e status de análise.
- Plano que intercala matérias, preserva a ordem das semanas e reserva até dois dias finais para revisão. Indica quando o conteúdo estimado excede o tempo diário.
- Materiais por semana: texto, PNG, JPEG, WebP, PDF e TXT. Até 8 MB por arquivo e 100 MB de anexos no armazenamento local.
- Backup JSON com progresso, cartões, materiais e bytes dos anexos, com restauração validada e confirmação na interface.
- Organizador anterior de disciplinas, atividades, notas e prazos preservado em /organizador, usando o D1 original quando habilitado.

O acervo novo foi orientado por consulta autenticada ao AVA em 02/11/2026, ampliada em 03/11/2026: **217 recursos visitados, 60 PDFs com texto extraído (979 páginas) e 97 transcrições de 100 vídeos principais e complementares**. Também foram coletados trechos dos livros indicados: 718 observações de páginas ou posições de leitor e quatro capítulos completos em leitores EPUB. Essas contagens incluem posições vazias e páginas em branco, identificadas no relatório; não representam 718 páginas integralmente analisadas. Textos e trechos temáticos fundamentam as explicações autorais. Permanecem limites concretos: acesso negado a um livro, divergências de edição, texto vazio ou reconhecimento ruim em alguns leitores, três vídeos sem legendas, áudio das lives e revisão visual integral das figuras. Nenhuma atividade avaliativa foi iniciada, respondida ou enviada pelo agente. Percentuais do AVA não foram importados como aprendizagem.

O [relatório da atualização](docs/acervo/2026-b4/RELATORIO.md) detalha a cobertura. O [acervo em Markdown](docs/acervo/2026-b4/README.md) permite estudar sem depender da interface. `npm run export:study` regenera esses arquivos a partir do currículo. Os textos completos capturados e PDFs originais ficam em `.sources/`, excluído do Git e da publicação; o aplicativo inclui apenas conteúdo autoral e metadados das fontes.

Os anexos são guardados como referência: esta versão **não faz OCR nem gera conteúdo automaticamente com IA**. É possível colar texto e criar cartões manualmente. Novos materiais enviados à conversa podem servir para ampliar a base autoral.

## Abrir no computador

Requer Node.js 20.9 ou superior (validado com Node 24).

    npm ci
    npm run dev -- --hostname 127.0.0.1

Acesse http://127.0.0.1:3000. Depois da instalação, também é possível executar **Iniciar Estudos.cmd**. Mantenha a janela em execução enquanto usa o app.

Para uma compilação de produção local:

    npm run build
    npm run start -- --hostname 127.0.0.1

## Dados pessoais

O servidor grava em **.study-data/**, ignorado pelo Git. Os dados sobrevivem a reinícios e à limpeza do navegador. Não apague essa pasta. A variável STUDY_DATA_DIR permite escolher outro diretório persistente.

A versão atual é de um único usuário e uma única instância local. Atualizações usam gravação atômica e revisão otimista: uma aba desatualizada recebe um erro em vez de sobrescrever outra. Faça backup em Preferências e backup. Backups contêm dados pessoais: mantenha-os fora de repositórios públicos.

O backup da área de estudo não inclui registros do organizador antigo, que continuam no D1 separado. Para ativá-lo em desenvolvimento, defina ENABLE_CLOUDFLARE=1 antes de iniciar o servidor. Em PowerShell:

    $env:ENABLE_CLOUDFLARE = '1'
    npm run dev -- --hostname 127.0.0.1

Os arquivos antigos do protótipo Vite foram preservados, mas não fazem parte do aplicativo Next.js nem de suas verificações.

## Validação

    npm run check
    npm audit --omit=dev --audit-level=high

Os 35 testes cobrem currículo anterior e atual, fórmulas, datas, plano, repetição espaçada, embaralhamento, correção, arquivos, autenticação e concorrência. Dez programas Java foram compilados e executados com saídas conferidas (`npm run export:study` e `npm run verify:java`, com JDK disponível). A sessão de verificação no navegador percorreu as 21 semanas e testou busca, persistência de revisão, flashcards, simulado e filtros de fontes usando armazenamento isolado.

## Publicação na Vercel

A área de estudos suporta Vercel com um store privado do Vercel Blob conectado ao projeto. Configure STUDY_PASSWORD e BLOB_READ_WRITE_TOKEN nos ambientes publicados. Sem senha configurada, o acesso na Vercel é bloqueado. A senha não fica no código nem nos arquivos enviados ao navegador. A sessão dura sete dias; alterar a senha invalida as sessões existentes.

Progresso usa leitura sem cache e gravação condicional por ETag, evitando sobrescrita entre instâncias. Anexos ficam privados e só são entregues após autenticação. Transferências maiores que 3 MB usam upload direto privado para preservar anexos de até 8 MB e backups de até 150 MB. Backups e anexos são baixados por streaming. O limite total de anexos é aproximadamente 100 MB; uploads simultâneos podem ultrapassá-lo. Transferências interrompidas podem deixar arquivos temporários no prefixo transfers/.

Em desenvolvimento local, os dados continuam em .study-data, mesmo com credenciais Blob presentes. Não há migração automática: para transferir estudos existentes, exporte e importe o backup pela interface. O organizador antigo permanece no D1 original e mostra uma mensagem de indisponibilidade na Vercel.

A proteção temporária usa uma senha compartilhada de usuário único. Não há contas individuais. Os testes cobrem autenticação, expiração, acesso aos dados e concorrência no armazenamento local e na nuvem.

## Manutenção e histórico

O [procedimento de futuras atualizações](docs/ATUALIZACOES.md) explica coleta do AVA, produção autoral, IDs persistidos, scripts, validação, backup, data da prova, Vercel e Git. O [registro de 02–04/11/2026](docs/operacoes/2026-11-04.md) documenta a entrega, os limites de cobertura e a correção de gravação em nuvem.

Deploy pela CLI Vercel não cria commit nem push. O GitHub e a Vercel devem ser verificados separadamente. A consolidação segue branch e PR conforme CONTRIBUTING.md.

A auditoria de dependências de 04/11/2026 retornou nove alertas, incluindo um crítico, ainda pendentes. `npm run check` passou, mas não executa essa auditoria; a CI possui uma etapa própria. Consulte SECURITY.md antes de interpretar build aprovado como validação completa de segurança.
