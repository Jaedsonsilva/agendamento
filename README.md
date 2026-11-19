# AVA Reserva — agendamentos escolares

Site público: `/`. Painel administrativo: `/painel`.

## Funcionamento sem inteligência artificial

O solicitante escolhe escola, local ou equipamentos, data, horários e informa contato e consentimento. O servidor verifica conflitos de ambiente e estoque por regras determinísticas do Supabase. A solicitação é registrada com um protocolo; a aprovação ou recusa é feita manualmente pelo responsável no painel autenticado. O sistema revalida os conflitos na aprovação.

O solicitante pode acompanhar o status usando protocolo e telefone. O painel permite cadastrar até três contatos responsáveis. Ao aprovar ou recusar, um link do WhatsApp abre com a mensagem pronta; o responsável precisa confirmar o envio. **Não há disparo automático de WhatsApp.**

## Infraestrutura

- Supabase do **Projeto Éden**, ID `qdnfdfyfpgszfkjdzwwq`, esquema privado `agendamento`.
- Vercel `agendamento` com `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` e `ADMIN_DB_TOKEN`.
- O aplicativo não utiliza OpenAI, Rasa, LLM, agente inteligente ou treinamento de modelos. Nenhuma chamada de IA é executada.

## Segurança e operação

A senha administrativa atual deve ser substituída por uma forte antes de usar dados reais. Existe uma conta administrativa compartilhada, sem RBAC por escola; revisar LGPD, antispam e limitação persistente de tentativas. As escolas existentes ainda são demonstrativas.

## Endpoints

- `GET /api/health`
- `GET /api/catalog`
- `GET /api/availability?school_id=...&date=...&start=...&end=...`
- `POST /api/book`
- `GET /api/track?protocol=...&phone=...`
- `GET /api/admin-session` e `POST /api/admin-login`
- `GET /api/admin-data`, `POST /api/admin-decision`, `POST /api/admin-contacts` (sessão obrigatória)

A rota `/api/ava` foi desativada. As variáveis `OPENAI_API_KEY`/`OPENAI_MODEL`, se ainda presentes na Vercel, não são utilizadas pelo código.
