const express = require('express');
const { pool } = require('../config/db');
const router = express.Router();
const VALID_STATUSES = new Set(['backlog', 'in-progress', 'done']);

router.get('/', async (req, res, next) => {
  try {
    const { status } = req.query;
    if (status && !VALID_STATUSES.has(status)) return res.status(400).json({ error: 'Status inválido. Use backlog, in-progress ou done.' });
    const result = status
      ? await pool.query('SELECT * FROM tasks WHERE status = $1 ORDER BY created_at DESC, id DESC', [status])
      : await pool.query('SELECT * FROM tasks ORDER BY created_at DESC, id DESC');
    return res.json(result.rows);
  } catch (error) { return next(error); }
});

router.post('/', async (req, res, next) => {
  try {
    const title = typeof req.body.title === 'string' ? req.body.title.trim() : '';
    const status = req.body.status || 'backlog';
    if (!title) return res.status(400).json({ error: 'O campo title é obrigatório.' });
    if (title.length > 255) return res.status(400).json({ error: 'O título deve ter no máximo 255 caracteres.' });
    if (!VALID_STATUSES.has(status)) return res.status(400).json({ error: 'Status inválido. Use backlog, in-progress ou done.' });
    const result = await pool.query('INSERT INTO tasks (title, status) VALUES ($1, $2) RETURNING *', [title, status]);
    return res.status(201).json(result.rows[0]);
  } catch (error) { return next(error); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const id = Number.parseInt(req.params.id, 10);
    const { status } = req.body;
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'ID inválido.' });
    if (!VALID_STATUSES.has(status)) return res.status(400).json({ error: 'Status inválido. Use backlog, in-progress ou done.' });
    const result = await pool.query('UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *', [status, id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Tarefa não encontrada.' });
    return res.json(result.rows[0]);
  } catch (error) { return next(error); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const id = Number.parseInt(req.params.id, 10);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'ID inválido.' });
    const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING id', [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Tarefa não encontrada.' });
    return res.status(204).send();
  } catch (error) { return next(error); }
});

module.exports = router;
