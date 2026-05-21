import express from 'express';
import cors from 'cors';
import interviewRouter from './routes/interview.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/interview', interviewRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✓ Server live → http://localhost:${PORT}`));
