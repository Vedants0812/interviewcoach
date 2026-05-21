import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import interviewRouter from './routes/interview.js';

dotenv.config();

const app = express();

// Allows your React app on port 5173 to talk to this server
app.use(cors());
app.use(express.json());

app.use('/api/interview', interviewRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✓ Server live → http://localhost:${PORT}`));