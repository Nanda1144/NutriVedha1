import express, { Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ALLOWED_ORIGINS ? process.env.CORS_ALLOWED_ORIGINS.split(',') : ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));

// Gateway Health
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    service: 'gateway',
    status: 'UP',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// Proxy routes mapping
const services = [
  { prefix: '/api/v1/auth', target: 'http://localhost:3001' },
  { prefix: '/api/v1/users', target: 'http://localhost:3002' },
  { prefix: '/api/v1/ai', target: 'http://localhost:3003' },
  { prefix: '/api/v1/medical', target: 'http://localhost:3005' },
  { prefix: '/api/v1/telemedicine', target: 'http://localhost:3006' },
  { prefix: '/api/v1/marketplace', target: 'http://localhost:3007' },
  { prefix: '/api/v1/orders', target: 'http://localhost:3008' },
  { prefix: '/api/v1/fitness', target: 'http://localhost:3009' },
  { prefix: '/api/v1/notifications', target: 'http://localhost:3010' },
  { prefix: '/api/v1/analytics', target: 'http://localhost:3011' }
];

services.forEach(({ prefix, target }) => {
  app.use(
    prefix,
    createProxyMiddleware({
      target,
      changeOrigin: true,
      pathRewrite: (path) => path.replace(new RegExp('^' + prefix), ''),
      on: {
        error: (err, req, res: any) => {
          console.error([Gateway Proxy Error] \ -> \:, err);
          if (res && !res.headersSent) {
            res.status(502).json({
              success: false,
              error: {
                code: 'UPSTREAM_SERVICE_UNAVAILABLE',
                message: Target service at \ is unreachable.,
                path: req.url
              }
            });
          }
        }
      }
    })
  );
});

app.listen(PORT, () => {
  console.log([NutriVedha API Gateway] Running on port \3011);
});

export default app;
