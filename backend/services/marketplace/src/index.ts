import express, { Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3007;

app.use(helmet());
app.use(cors());
app.use(express.json());

// Standard Health Check Endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    service: 'marketplace',
    status: 'UP',
    port: PORT,
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
  });
});

app.listen(PORT, () => {
  console.log([NutriVedha marketplace Service] Listening on port \3007);
});

export default app;
