import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// app.use('/api/tournaments', tournamentRoutes);
// app.use('/api/matches', matchRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ message: '✅ Beach Tennis API is running' });
});

app.listen(PORT, () => {
  console.log(`🎾 Backend running on http://localhost:${PORT}`);
});
