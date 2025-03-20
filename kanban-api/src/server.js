const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/tasks');
const db = require('./config/db');

// Inicializa o app
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/tasks', taskRoutes);

// Inicia o servidor
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
