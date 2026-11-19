# AVA Reserva — escolas e capela

Portal público: `/`. Painel administrativo real: `/painel`.

O formulário de reservas aceita **WhatsApp com DDI**, exige consentimento, salva as solicitações no Supabase e verifica conflitos de sala, capela e equipamento. A API gera protocolo, mantém consulta pelo protocolo e telefone e registra notificações no banco para futura entrega. A versão administrativa em `/painel` é uma **simulação isolada** com dados fictícios no localStorage — não lê nem altera dados pessoais reais.

## WhatsApp — entrega real opcional
Integração de WhatsApp: **Evolution API (código aberto)**. Consulte [WHATSAPP_EVOLUTION.md](WHATSAPP_EVOLUTION.md). É necessário hospedar um gateway persistente à parte para enviar de verdade.\n\n## Banco
Projeto Supabase Éden / agendamento (qdnfdfyfpgszfkjdzwwq), esquema privado `agendamento`. Acesso por RPC com chave publicável. Não expor `service_role` ao navegador.

## Pendências antes de divulgar para uso real
Integração WhatsApp, webhooks para status de entrega, proteção antispam, contas administrativas autenticadas, cadastro de escolas reais e revisão de limites de uso e regras de privacidade. O painel demonstrativo não é controle real.

## Links
- GET `/` formulário
- GET `/painel` demonstração
- GET `/api/health`
- GET `/api/catalog`
- POST `/api/book`
- GET `/api/track?protocol=...&phone=...`


## Painel real e AVA
Veja [ADMIN_E_IA.md](ADMIN_E_IA.md).
