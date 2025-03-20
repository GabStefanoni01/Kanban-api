const express = require('express');
const db = require('../config/db');
const router = express.Router();

// Buscar todas as tarefas
router.get('/', (req, res) => {
  const query = 'SELECT * FROM tasks';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Criar uma nova tarefa
router.post('/', (req, res) => {
  const { title, status } = req.body;
  const query = 'INSERT INTO tasks (title, status) VALUES (?, ?)';
  db.query(query, [title, status || 'backlog'], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, title, status });
  });
});

// Atualizar status da tarefa
router.put('/:id', (req, res) => {
  const { status } = req.body;
  const query = 'UPDATE tasks SET status = ? WHERE id = ?';
  db.query(query, [status, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Deletar uma tarefa
router.delete('/:id', (req, res) => {
  const query = 'DELETE FROM tasks WHERE id = ?';
  db.query(query, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

module.exports = router;
