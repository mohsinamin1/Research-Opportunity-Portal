import { Router } from 'express';
import pool from '../db.js';
import { validateOpportunity } from '../validation.js';

const router = Router();
const fields = [
  'title',
  'description',
  'research_area',
  'faculty_name',
  'department',
  'required_skills',
  'available_positions',
  'application_deadline',
  'status'
];

router.get('/', async (_req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM opportunities ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM opportunities WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Opportunity not found' });
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  const validationError = validateOpportunity(req.body);
  if (validationError) return res.status(400).json({ message: validationError });

  try {
    const values = fields.map((field) => req.body[field]);
    const [result] = await pool.query(
      `INSERT INTO opportunities (${fields.join(', ')}) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      values
    );
    const [rows] = await pool.query('SELECT * FROM opportunities WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  const validationError = validateOpportunity(req.body);
  if (validationError) return res.status(400).json({ message: validationError });

  try {
    const values = fields.map((field) => req.body[field]);
    const [result] = await pool.query(
      `UPDATE opportunities SET ${fields.map((field) => `${field} = ?`).join(', ')} WHERE id = ?`,
      [...values, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Opportunity not found' });
    const [rows] = await pool.query('SELECT * FROM opportunities WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const [result] = await pool.query('DELETE FROM opportunities WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Opportunity not found' });
    res.json({ message: 'Opportunity deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
