# ADR 0001 — Next.js e Cloudflare D1

Status: aceito em 2026-07-16.

## Contexto

O produto precisa persistir registros acadêmicos e não deve expor segredos no navegador. A versão anterior usava Vite e `localStorage`.

## Decisão

Usar Next.js App Router como aplicação full-stack, Route Handlers como BFF, D1 como banco relacional e OpenNext como adaptador para Cloudflare Workers.

## Consequências

- dados acadêmicos deixam de depender de um navegador específico;
- validação e acesso ao banco ficam no servidor;
- o ambiente de produção precisa fornecer o binding `DB`;
- uma futura versão multiusuário exigirá autenticação e ownership.
