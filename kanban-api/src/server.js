require('dotenv').config();
const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/tasks');
const { pool, initializeDatabase } = require('./config/db');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.get('/health', (_req, res) => res.status(200).json({ status: 'ok', service: 'kanban-api' }));
app.get('/ready', async (_req, res) => {
  try { await pool.query('SELECT 1'); return res.status(200).json({ status: 'ready', database: 'connected' }); }
  catch (_error) { return res.status(503).json({ status: 'not_ready', database: 'unavailable' }); }
});
app.use('/tasks', taskRoutes);
app.use((error, _req, res, _next) => {
  console.error('Erro na API:', error.message);
  return res.status(500).json({ error: 'Erro interno do servidor.' });
});

async function startServer() {
  try {
    if (!process.env.DATABASE_URL) throw new Error('A variável DATABASE_URL não foi configurada.');
    await initializeDatabase();
    await pool.query('SELECT 1');
    app.listen(PORT, () => console.log(`Kanban API rodando na porta ${PORT}`));
  } catch (error) {
    console.error('Não foi possível iniciar a API:', error.message);
    process.exit(1);
  }
}
startServer();
