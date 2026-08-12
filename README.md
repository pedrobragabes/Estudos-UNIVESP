# Estudos UNIVESP

Organizador acadêmico enxuto para acompanhar disciplinas, atividades, notas, prazos e progresso da UNIVESP.

## Escopo

O MVP mantém somente:

- disciplinas do período atual;
- atividades, provas, projetos e leituras;
- prazos e status;
- notas e pesos;
- progresso derivado dos registros reais.

Tutor com IA, flashcards, quizzes, simulados e conteúdo didático estão explicitamente fora do escopo.

## Stack

- Next.js 16 com App Router;
- React 19 e TypeScript;
- Route Handlers como backend-for-frontend;
- Cloudflare D1 para persistência;
- OpenNext para execução em Cloudflare Workers;
- Zod, ESLint e Vitest.

## Desenvolvimento

Requer Node.js 20.9 ou superior.

```bash
npm ci
npm run dev
```

O ambiente de desenvolvimento usa uma instância local do D1 gerenciada pelo Wrangler.

## Validação

```bash
npm run check
```

Para validar no mesmo runtime da produção:

```bash
npm run preview
```

## Decisões

Consulte [ARCHITECTURE.md](./ARCHITECTURE.md) e os registros em [`docs/adr`](./docs/adr).
