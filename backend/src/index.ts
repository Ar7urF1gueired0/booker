import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.ts';
import tournamentRoutes from './routes/tournaments.ts';
import matchRoutes from './routes/matches.ts';
import userRoutes from './routes/users.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ message: '✅ Beach Tennis API is running' });
});

app.listen(PORT, () => {
  console.log(`🎾 Backend running on http://localhost:${PORT}`);
});
