# AVA Reserva — agendamento escolar

## Produção (Vercel + Supabase)
Site público no projeto Vercel **agendamento**. Formulário público sem login. Banco no Supabase Edumind OS, schema privado **agendamento**.

O código inclui cadastro por escola, seleção de capela/sala/equipamentos, reserva automática (procedimento SQL atômico com advisory lock por escola), bloqueio de conflitos de horário e estoque, consulta via protocolo e e-mail, persistência das solicitações e fila de notificações.

**Pendências:** o envio de e-mails Resend ainda NÃO está ativo. Mensagens são registradas na tabela agendamento.notificacoes como pendentes. Falta configurar um provedor de e-mail verificando um domínio; também é recomendado ativar proteção antispam (Turnstile). Não há tela administrativa para cadastrar escolas e equipamentos no frontend; por enquanto os cadastros são realizados no Supabase com acesso privilegiado.

As unidades **Escola Demonstrativa A/B** e seus recursos são dados ilustrativos para teste e devem ser substituídos pelos cadastros reais antes da divulgação. Nunca coloque credenciais privadas no HTML ou no GitHub.

## Variáveis Vercel
SUPABASE_URL = URL do projeto
SUPABASE_PUBLISHABLE_KEY = chave publicável do projeto

A API utiliza apenas funções RPC com privilégios limitados. O schema privado e os dados pessoais não são expostos por leitura pública direta.

## Rotas
- GET /  — interface
- GET /api/health
- GET /api/catalog
- POST /api/book
- GET /api/track?protocol=...&email=...
