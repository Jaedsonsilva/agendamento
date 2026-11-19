# WhatsApp grátis em código aberto — Evolution API v2

Repositório: https://github.com/evolution-foundation/evolution-api
Referência de envio: https://github.com/evolution-foundation/evolution-docs/blob/main/docs/05-Endpoints/00-send-plain-text.md

O AVA Reserva agora possui adaptador server-side para enviar mensagens de protocolo e situação da reserva ao solicitante e avisos a **até três responsáveis**. Não usa a Cloud API oficial, não exige modelo aprovado, mas precisa de **Evolution API rodando separadamente e conectada pelo QR Code**. A Vercel não hospeda a sessão WhatsApp Web persistentemente.

Variáveis necessárias (Server-only no projeto Vercel agendamento):
- `EVOLUTION_API_URL` — HTTPS do servidor próprio da Evolution API, sem barra final
- `EVOLUTION_API_KEY` — segredo no servidor
- `EVOLUTION_INSTANCE` — instância WhatsApp conectada
- `WHATSAPP_ADMIN_1`, `WHATSAPP_ADMIN_2`, `WHATSAPP_ADMIN_3` — números de responsáveis opcionais, com +DDI/DDD

O adaptador chama POST /message/sendText/{instance}, usando apikey e body {number,text}. Se o gateway não estiver configurado ou estiver offline, a reserva permanece salva no Supabase e o retorno indica que o envio não foi confirmado. Resposta HTTP bem-sucedida do gateway **não confirma entrega ao destinatário**.

O código é aberto e pode ser auto-hospedado sem tarifa da API oficial. Porém, máquina ou host 24/7 pode ter custos; não há garantia de nuvem gratuita. Uso de WhatsApp Web não oficial envolve risco de desconexões, mudança de protocolo e restrições/bloqueio da conta. Não envie spam.

O painel /painel é demonstrativo, com até três campos de números apenas em localStorage. Os números que realmente recebem avisos vêm das variáveis da Vercel. O painel ainda não pode aprovar ou recusar reservas reais; o Supabase realiza verificação e decisão automática.

Próximas etapas: provisionar servidor Evolution API persistente, parear WhatsApp por QR Code, configurar as variáveis acima, implementar webhook para status e reenvios e proteger a área administrativa. Nunca publique chaves no GitHub.
