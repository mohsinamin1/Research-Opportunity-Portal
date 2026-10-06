import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import opportunitiesRouter from './routes/opportunities.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 5000);

app.use(cors());
app.use(express.json());
app.get('/api/health', (_req, res) => res.json({ message: 'Research Opportunity API is running' }));
app.use('/api/opportunities', opportunitiesRouter);

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
});
