# Segurança

## Dados e segredos

- Nenhum segredo deve usar prefixo `NEXT_PUBLIC_`.
- Segredos e IDs reais de infraestrutura não são versionados.
- Todo input HTTP é validado e toda query usa parâmetros preparados.

## Modelo atual

A produção Vercel usa senha compartilhada para um único usuário, sessão assinada e cookies HttpOnly, Secure e SameSite. A senha é configurada no servidor; não fica no bundle do navegador. Sem senha na Vercel, o acesso é bloqueado. Este modelo não implementa contas individuais nem autorização por registro para múltiplos usuários.

Os endpoints verificam origem nas gravações e validam estado e anexos. O Blob é privado; revisões e escrita condicional com ETag canônico impedem que uma aba antiga sobrescreva outra. Não retire essa proteção para resolver falhas de salvamento. O desenvolvimento local sem senha continua limitado a 127.0.0.1 e usa arquivos locais; esse adaptador não é apropriado a funções efêmeras.

`.study-data/`, `.sources/`, `.vercel/`, ambientes locais e backups podem conter dados pessoais, conteúdo licenciado e credenciais. Devem ficar fora do Git, de `public/` e dos pacotes publicados. O catálogo versionado deve conter somente metadados e links sem tokens. O organizador D1 é separado e não integra o backup de estudos.

Variáveis secretas da Vercel podem ser retornadas como `[SENSITIVE]` em exportações; esse marcador não é o valor e não deve ser reenviado. Nunca registre senha, cookie, token Blob ou código OAuth em documentação, PR, captura pública ou saída de comando.

## Dependências e verificação

A CI inclui `npm audit --omit=dev --audit-level=high`, separadamente de `npm run check`. Em 04/11/2026, a auditoria retornou nove alertas, incluindo um crítico, ainda sem resolução nesta consolidação. O registro está em [Operação de 04/11](docs/operacoes/2026-11-04.md). Testes e build aprovados não eliminam esses alertas. Revisar atualizações e compatibilidade em mudança própria, sem aplicar correções forçadas ou ocultar a etapa de CI.

## Reporte

Não abra uma issue pública contendo credenciais ou dados acadêmicos pessoais. Revogue imediatamente qualquer segredo exposto.
