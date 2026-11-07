# Kanban API

API REST para gerenciamento de tarefas em um quadro Kanban, construída com Node.js, Express e PostgreSQL.

## Tecnologias
- Node.js 20+
- Express
- PostgreSQL com `pg` (node-postgres)
- dotenv

## Funcionalidades
- Listar tarefas e filtrar por status.
- Criar tarefas.
- Mover tarefas entre colunas.
- Excluir tarefas.
- Verificar a saúde da aplicação e a conexão com o banco.

## Status aceitos
- `backlog`
- `in-progress`
- `done`

## Executar localmente
Entre na pasta `kanban-api`, instale as dependências com `npm install` e crie um arquivo `.env`:

```env
DATABASE_URL=postgresql://USUARIO:SENHA@HOST/SEU_BANCO?sslmode=require
NODE_ENV=development
PORT=3000
```

Inicie com `npm run dev`. A tabela `tasks` e a coluna `created_at` são criadas/garantidas automaticamente na inicialização.

## Endpoints
| Método | Rota | Descrição |
|---|---|---|
| GET | `/health` | Saúde da aplicação |
| GET | `/ready` | Verifica conexão com PostgreSQL |
| GET | `/tasks` | Lista todas as tarefas |
| GET | `/tasks?status=backlog` | Filtra por status |
| POST | `/tasks` | Cria uma tarefa |
| PUT | `/tasks/:id` | Atualiza o status |
| DELETE | `/tasks/:id` | Exclui uma tarefa |

### Exemplo de criação
```json
{
  "title": "Implementar autenticação",
  "status": "backlog"
}
```

## Deploy no Render
Crie um Web Service conectado a este repositório e configure:
- Root Directory: `kanban-api`
- Runtime: Node
- Build Command: `npm install`
- Start Command: `npm start`

Variáveis de ambiente:
- `DATABASE_URL`: connection string PostgreSQL do Neon com SSL.
- `NODE_ENV`: `production`

O Render fornece `PORT` automaticamente. Depois do deploy, valide `/health` e `/ready` no domínio do serviço.

## Segurança
Não versione arquivos `.env`, senhas ou strings de conexão. Configure credenciais exclusivamente nas variáveis de ambiente do Render.
