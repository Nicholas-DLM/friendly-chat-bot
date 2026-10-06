# v1.1.0 — Área administrativa

## Configuração

1. Crie um projeto no Supabase.
2. No SQL Editor, execute \`supabase/schema.sql\`.
3. Em Authentication, crie o usuário administrador.
4. Crie um registro em \`establishments\`.
5. Vincule o usuário ao estabelecimento em \`admins\`.
6. Copie \`.env.example\` para \`.env.local\` e preencha as credenciais do projeto.
7. Rode \`npm install\` e depois \`npm run dev\`.

A área \`/admin\` usa Supabase Auth. O acesso aos dados é protegido por Row Level Security (RLS); esconder a interface não é considerado proteção.

## WhatsApp

O número é salvo no estabelecimento e pode ser alterado em **Admin > Configurações**. O catálogo público deve usar esse valor ao montar o pedido do WhatsApp.

Nenhuma chave secreta deve ser commitada no GitHub.
