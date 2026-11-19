# AVA Reserva — escolas e capela

Portal público: `/`. Painel demonstrativo: `/painel`.

O formulário de reservas aceita **WhatsApp com DDI**, exige consentimento, salva as solicitações no Supabase e verifica conflitos de sala, capela e equipamento. A API gera protocolo, mantém consulta pelo protocolo e telefone e registra notificações no banco para futura entrega. A versão administrativa em `/painel` é uma **simulação isolada** com dados fictícios no localStorage — não lê nem altera dados pessoais reais.

## WhatsApp — entrega real opcional
A integração server-side está preparada para a **WhatsApp Business Platform Cloud API oficial da Meta**. Variáveis Vercel: `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_TEMPLATE_NAME`, opcionalmente `WHATSAPP_TEMPLATE_LANGUAGE` e `WHATSAPP_GRAPH_API_VERSION`. O template aprovado deve ter dois parâmetros no corpo: protocolo e status. **Ainda não há credenciais configuradas e nenhuma mensagem está sendo enviada de verdade**. A fila no banco permanece pendente até integrar confirmação de entrega por webhook e processamento de reenvio.

Bibliotecas abertas que usam WhatsApp Web (Evolution API/Baileys) não são oficiais, podem causar bloqueio e exigem serviço persistente separado; não são apropriadas para assegurar envio gratuito no Vercel.

## Banco
Projeto Supabase Edumind OS, esquema privado `agendamento`. Acesso por RPC com chave publicável. Não expor `service_role` ao navegador.

## Pendências antes de divulgar para uso real
Integração WhatsApp, webhooks para status de entrega, proteção antispam, contas administrativas autenticadas, cadastro de escolas reais e revisão de limites de uso e regras de privacidade. O painel demonstrativo não é controle real.

## Links
- GET `/` formulário
- GET `/painel` demonstração
- GET `/api/health`
- GET `/api/catalog`
- POST `/api/book`
- GET `/api/track?protocol=...&phone=...`
