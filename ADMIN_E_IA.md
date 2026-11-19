# AVA Reserva · Administração e operação manual

Projeto Supabase: `qdnfdfyfpgszfkjdzwwq` (Éden). O acesso `/painel` requer autenticação por senha, validada no servidor, com sessão HttpOnly e validade limitada.

## Variáveis necessárias na Vercel

- `SUPABASE_URL`: endereço do projeto Supabase Éden
- `SUPABASE_PUBLISHABLE_KEY`: chave publicável
- `ADMIN_PASSWORD`: senha administrativa (trocar o valor temporário fraco)
- `ADMIN_SESSION_SECRET`: chave aleatória de assinatura da sessão
- `ADMIN_DB_TOKEN`: segredo forte cujo SHA-256 está salvo em `agendamento.gateway_auth.token_hash`, id=1

**OpenAI, Rasa e LLM não fazem parte do fluxo de produção.** Nenhuma chave OpenAI é necessária. Não inserir segredos no GitHub.

## Fluxo manual

Formulário público → verificação determinística de horários e quantidades no Supabase → registro de solicitação e protocolo → responsável verifica no painel → aprova ou recusa (motivo obrigatório na recusa; checagem final de conflitos) → botão para abrir WhatsApp com mensagem pronta → envio confirmado manualmente pelo responsável.

O painel mantém escolas, ambientes, equipamentos, calendário e cadastro de até três contatos responsáveis. O envio por WhatsApp não é automático.

## Limites e segurança

A senha administrativa compartilhada não equivale a contas individuais com permissões por escola. Antes de implantar com usuários reais, reforçar acesso, revisar LGPD, cadastro real de escolas e proteção antispam.
