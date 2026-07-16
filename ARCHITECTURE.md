# Arquitetura

## Objetivo

Manter uma aplicação pequena, legível e preparada para os fluxos acadêmicos essenciais.

## Componentes

- `app/`: páginas e endpoints HTTP do Next.js.
- `src/domain/`: schemas, tipos e regras acadêmicas puras.
- `src/lib/`: acesso ao D1 e tratamento HTTP.
- `src/components/`: views e formulários da interface.
- `db/`: schema e migrações.
- `tests/`: testes das regras de negócio.

## Fluxo de dados

O navegador chama Route Handlers do mesmo domínio. Os handlers validam o JSON com Zod, acessam o D1 usando prepared statements e devolvem DTOs em camelCase. Progresso e médias são derivados no domínio; não existem colunas duplicadas para essas métricas.

## Limites intencionais

- sem autenticação enquanto o produto for pessoal e implantado de forma privada;
- sem Redux ou abstrações de repositório genéricas;
- sem armazenamento de documentos;
- sem integrações externas ou IA.

Antes de tornar a aplicação pública ou multiusuário, será obrigatório adicionar identidade, ownership nas tabelas e autorização em todas as queries.
