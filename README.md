# AVA Reserva — Agendamento escolar

Portal público para solicitação de ambientes (inclusive capela) e equipamentos por escola. Código de frontend publicado e API inicial de catálogo. **Reservas reais ficam bloqueadas até que o backend de reserva atômica e notificações estejam implementados e validados.**

## Vercel
Configurar no projeto `agendamento` as variáveis de ambiente do servidor `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`. Não colocar a chave `service_role` no frontend, código ou Git. Expor o schema `agendamento` na Data API apenas com acesso autorizado; todas as tabelas têm RLS habilitado e privilégios públicos revogados. Idealmente, migrar a comunicação para Postgres direto ou RPC restrita.

## Faltante
API de reserva com prevenção de concorrência, notificação Resend, Turnstile, cadastro administrativo autenticado e testes em produção. Não prometer agendamentos reais até concluir.
