# Segurança

## Dados e segredos

- Nenhum segredo deve usar prefixo `NEXT_PUBLIC_`.
- Segredos e IDs reais de infraestrutura não são versionados.
- Todo input HTTP é validado e toda query usa parâmetros preparados.

## Modelo atual

O aplicativo pressupõe uma implantação privada para um único usuário. Uma implantação pública exige autenticação, autorização por registro, rate limiting e revisão de privacidade antes do lançamento.

## Reporte

Não abra uma issue pública contendo credenciais ou dados acadêmicos pessoais. Revogue imediatamente qualquer segredo exposto.
