# Plano de Seguranca

## Escopo

Este projeto e educacional, com frontend em React + Vite e integracao com a API Gemini.
Como nao existe backend proprio, o foco de seguranca e:

- Protecao de credenciais (API key)
- Higiene de versionamento no Git/GitHub
- Atualizacao de dependencias

## Principios

- Nunca versionar segredos
- Minimizar superficie de exposicao
- Revisar alteracoes antes de cada push
- Corrigir vazamentos com rapidez (revogacao e rotacao)

## Segredos e variaveis de ambiente

Regras obrigatorias:

- `.env.local` deve permanecer local e fora do git
- Apenas arquivos de exemplo podem ser versionados (`.env.local.example`)
- Nao colocar chave em `README`, `issues`, `commits` ou codigo

Variavel usada no app:

```env
VITE_GEMINI_API_KEY=sua_chave_aqui
```

## Processo de release seguro

Antes de publicar:

1. Rode `git status` e valide os arquivos adicionados.
2. Confirme que nenhum `.env` foi incluido.
3. Busque por termos sensiveis no projeto (api key, token, secret).
4. Rode `npm audit` em `univesp-app`.
5. Publique somente apos revisao final.

## Resposta a incidente

Se houver vazamento de chave:

1. Revogue e gere uma nova chave no Google AI Studio imediatamente.
2. Remova qualquer segredo do codigo e dos arquivos rastreados.
3. Se a chave entrou em commit, reescreva o historico antes de tornar publico.
4. Registre o incidente no changelog interno do projeto.

## Reporte de vulnerabilidades

Para reportar falhas de seguranca:

1. Nao abra issue publica com detalhes sensiveis.
2. Entre em contato via perfil do GitHub (@pedrobragabes).
3. Envie contexto: arquivo, commit e impacto observado.

Prazo inicial de resposta: ate 72 horas.

## Observacoes de arquitetura

- Aplicacao client-side sem backend dedicado
- Sem banco de dados proprio
- Dados do usuario armazenados localmente no navegador (`localStorage`)

Risco principal atual: exposicao acidental da chave Gemini.
