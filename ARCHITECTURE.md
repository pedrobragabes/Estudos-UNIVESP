# Arquitetura

## Área de estudo pessoal

- app/page.tsx: shell estático que carrega a aplicação de estudos.
- src/data/curriculum.ts: agregação das 21 semanas correntes e 21 anteriores; src/data/b4/ contém o conteúdo do 4º bimestre e legacy-curriculum.ts preserva o anterior. IDs estáveis preservam revisões e resultados.
- src/domain/study.ts: schemas Zod, calendário, plano, revisão espaçada, seleção e correção. Respostas persistidas usam índices canônicos, independentemente da ordem exibida.
- src/components/study/: painel, plano, leitura, cartões, simulados, materiais e preferências.
- app/api/study/: leitura, gravação, arquivos e backup no runtime Node.
- src/lib/study-store.ts: estado em .study-data/state.json e anexos separados por UUID. Arquivos ficam em envelopes JSON com base64; limite de 8 MB por arquivo e 100 MB no total.

Gravações são serializadas no processo, validadas e feitas por arquivo temporário seguido de rename. A revisão otimista impede sobrescritas por abas antigas. A arquitetura admite um único processo de escrita. O navegador só confirma revisões e avança cartões após sucesso do servidor.

Restaurar um backup valida conteúdo e referências, usa IDs novos para arquivos importados e só altera o estado quando os anexos foram gravados. Uma falha pode deixar arquivos sem referência, mas preserva o estado anterior. Arquivos removidos da lista são conservados no disco nesta versão e não entram no backup se não forem referenciados. Não há coleta automática de arquivos órfãos.

A tentativa de simulado em andamento fica na memória da página e alerta ao sair. O resultado completo é persistido ao finalizar; falhas oferecem uma nova tentativa de gravação. O cronômetro usa o relógio real, não uma contagem de intervalos de renderização.

## Organizador anterior

A página /organizador, os endpoints acadêmicos e o D1 original foram preservados. ENABLE_CLOUDFLARE=1 ativa o adaptador de desenvolvimento. Sua indisponibilidade não impede a área de estudos. O ADR 0001 registra a arquitetura anterior.

## Produção na Vercel

A área de estudos está em https://estudos-univesp.vercel.app/. `proxy.ts` aplica login por senha compartilhada e sessão assinada para um único usuário. Sem senha configurada, a hospedagem falha de forma fechada. Não existe autorização individual por conta.

Com `VERCEL` ativo, `study-store.ts` usa Blob privado. O estado é `study/state.json`; anexos são objetos separados. Revisão otimista e `put` condicional protegem escritas entre instâncias. Para escrever, consulte metadados com `head()` antes da leitura do snapshot e use o ETag canônico em `ifMatch`; o endpoint de download pode fornecer ETag fraco incompatível com a escrita. Criação inicial não permite sobrescrever um objeto criado por outra instância.

Backups e anexos maiores usam upload privado direto e referências de transferência; o cliente só avança após confirmação do servidor. O adaptador local permanece disponível no desenvolvimento. Dados locais não são automaticamente migrados para o Blob.

O comando de publicação suportado para esse domínio é a CLI Vercel. `npm run deploy` permanece ligado ao caminho Cloudflare histórico, que não publica essa área pessoal na Vercel. Deploy por CLI não faz commit/push. Consulte [o procedimento operacional](docs/ATUALIZACOES.md).

## Fontes e material didático

`src/data/ava-sources.json` e `ava-audit.json` contêm metadados sem credenciais. `Lesson` organiza objetivos, seções, fórmulas, prática, revisão e notas críticas. KaTeX renderiza fórmulas com MathML; highlight.js destaca Java. A tela de fontes e os detalhes semanais distinguem consulta, análise parcial e pendência.

Capturas, livros, transcrições e evidências completas ficam em `.sources/`, ignorada pelo Git, lint e deploy. `scripts/export-study.cjs` exporta apenas conteúdo autoral e metadados para `docs/acervo/`; as fontes Java de verificação ficam na pasta privada. Os registros de aprendizagem são independentes do status das fontes e dos percentuais do AVA.
