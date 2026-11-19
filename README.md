# AVA Reserva — implantação

Sistema de agendamento multi-escolas, com salas, equipamentos e capela, confirmação por e-mail e painel dos responsáveis.

## Estado

- Destino Vercel: projeto `agendamento` (equipe `projeto-eden1`).
- Backend alvo: Vercel Functions + banco SQLite remoto (Turso/libSQL).
- E-mails: Resend; proteção contra spam: Cloudflare Turnstile.
- Fluxos testados no pacote local: 13 testes passaram.
- **Ainda não pronto para produção**: código completo deve ser importado e revisado; banco, migrations e variáveis precisam ser configurados; faltam testes remotos.

## Importação

Utilizar o arquivo `AVA_Reserva_Vercel_Preparado.zip` disponibilizado na conversa como fonte do projeto. Preservar diretórios `public/`, `api/`, `src/`, `migrations/`, `tests/` e os arquivos `package.json`, `vercel.json`. Não commitar segredos.

## Publicação segura

1. Importar os arquivos do pacote nesta branch de trabalho.
2. Rodar `npm install`, `npm test` e `npm run check`.
3. Configurar banco Turso e aplicar `0001_initial.sql` e `0002_chapel.sql`.
4. Configurar `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `APP_SECRET`, `SETUP_TOKEN`, `RESEND_API_KEY`, `FROM_EMAIL`, `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET`, `CRON_SECRET` no painel Vercel.
5. Verificar execução da API, reservas concorrentes, envio de e-mails e permissões entre escolas no preview.
6. Só mesclar na `main` e promover produção depois do checklist completo.

**Atenção:** conferir política de utilização da Vercel Hobby antes de usar institucionalmente/comercialmente.
