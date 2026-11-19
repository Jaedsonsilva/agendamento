# AVA Reserva · aprovação manual e inteligência artificial
Projeto Supabase: qdnfdfyfpgszfkjdzwwq. O painel /painel requer autenticação no servidor com cookie HttpOnly; /demo é painel fictício independente.
## Configuração indispensável no Vercel
As variáveis precisam ser adicionadas no projeto Vercel **agendamento**, Production e Preview:
- ADMIN_PASSWORD = 2025 (senha temporária solicitada pelo Owner; recomendável substituí-la por senha forte antes de uso real)
- ADMIN_SESSION_SECRET = cadeia aleatória forte com pelo menos 32 bytes de entropia
- ADMIN_DB_TOKEN = cadeia aleatória forte **idêntica à usada para gravar o hash no banco**.
O banco tem tabela privada agendamento.gateway_auth; grave o SHA-256 hex do segredo em token_hash para id=1. Esse procedimento deve ser feito em ambiente seguro. Sem as variáveis, novas solicitações são bloqueadas, para não deixar pedidos impossíveis de aprovar.
- OPENAI_API_KEY = chave secreta da OpenAI (configuração opcional para AVA).
- OPENAI_MODEL = gpt-4.1-mini (opcional)
Em https://platform.openai.com/api-keys gere a chave, mas nunca coloque no GitHub.
## Fluxo
Formulário público -> RPC ava_reserva_solicitar_aprovacao -> pedido pendente se houver disponibilidade, ou recusado por conflito; protocolo imediato -> opcional análise OpenAI Responses API -> painel autenticado -> aprovar ou recusar com justificativa -> banco revalida conflitos -> link WhatsApp com resposta preenchida ao número cadastrado. O envio só ocorre quando o operador toca em Enviar no WhatsApp.
Até 3 números de responsáveis podem ser guardados no banco pelo painel; o compartilhamento de pedidos para cada contato é manual.
## Observações
- O painel não é autenticado pelo Supabase Auth; trata-se de PIN único de operador, não sistema de contas ou permissões por escola.
- O PIN 2025 é fraco para acesso a dados reais; a proteção adicional deve incluir senha forte, 2FA, limite persistente por IP e revisão da LGPD.
- IA não decide nem confirma reservas; apenas organiza observações e recomendações, com consumo cobrado pela OpenAI. A regra determinística de conflito sempre prevalece.
- O armazenamento do PIN ou dos segredos em HTML, repositório ou mensagem é proibido.
