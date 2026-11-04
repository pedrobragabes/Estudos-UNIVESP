<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Continuidade do Estudos UNIVESP

Antes de atualizar conteúdo, persistência ou publicação, leia `docs/ATUALIZACOES.md` e o registro operacional mais recente em `docs/operacoes/`. Consulte o relatório acadêmico do período para não tratar fontes parciais como completas.

- Preserve IDs, conteúdo anterior e dados pessoais. Estado do AVA não é progresso de aprendizagem.
- Não versione `.sources`, `.study-data`, `.vercel`, ambientes locais ou backups.
- `npm run deploy` é a rota histórica Cloudflare; a produção atual usa Vercel. Confirme projeto e domínio antes de publicar.
- Mudança do estado inicial não atualiza preferências persistidas. Datas novas exigem confirmação do usuário ou fonte oficial.
- Em escrita Blob, preserve revisão e ETag canônico. O registro de 04/11 explica por que o ETag fraco do download não serve para `ifMatch`.
- Valide com `npm run check`; exporte e confira Java se alterar o acervo. Registre a auditoria separadamente: há pendências documentadas.
- Use branch, commit, push e PR conforme CONTRIBUTING.md. Deploy pela CLI não sincroniza Git automaticamente. Não informe que `main` foi atualizado enquanto o PR não estiver integrado.
