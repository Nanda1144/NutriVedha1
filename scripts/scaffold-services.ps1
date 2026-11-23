$services = @(
  @{ name = 'auth'; port = 3001; desc = 'NutriVedha Authentication & Authorization Service' },
  @{ name = 'user'; port = 3002; desc = 'NutriVedha User Profile & Identity Service' },
  @{ name = 'ai'; port = 3003; desc = 'NutriVedha AI Clinical & Ayurvedic Intelligence Service' },
  @{ name = 'medical'; port = 3005; desc = 'NutriVedha Encrypted Medical Vault Service' },
  @{ name = 'telemedicine'; port = 3006; desc = 'NutriVedha Telemedicine & Doctor Discovery Service' },
  @{ name = 'marketplace'; port = 3007; desc = 'NutriVedha Organic Herb & Crop Marketplace Service' },
  @{ name = 'orders'; port = 3008; desc = 'NutriVedha Orders, Checkout & Tracking Service' },
  @{ name = 'fitness'; port = 3009; desc = 'NutriVedha Yoga & Fitness Regimens Service' },
  @{ name = 'notification'; port = 3010; desc = 'NutriVedha Notification & Dispatch Service' },
  @{ name = 'analytics'; port = 3011; desc = 'NutriVedha Analytics, Audit & Health Service' }
)

foreach ($s in $services) {
  $name = $s.name
  $port = $s.port
  $desc = $s.desc
  $svcDir = "backend/services/$name"

  # package.json
  $pkgJson = @"
{
  "name": "@nutrivedha/service-$name",
  "version": "1.0.0",
  "description": "$desc",
  "private": true,
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "tsx watch src/index.ts",
    "test": "jest"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "express": "^4.21.2",
    "helmet": "^8.0.0",
    "zod": "^3.24.1"
  },
  "devDependencies": {
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/node": "^22.0.0",
    "tsx": "^4.19.2",
    "typescript": "^5.6.0"
  }
}
"@
  Set-Content -Path "$svcDir/package.json" -Value $pkgJson

  # tsconfig.json
  $tsJson = @"
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
"@
  Set-Content -Path "$svcDir/tsconfig.json" -Value $tsJson

  # Dockerfile
  $dockerfile = @"
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist
USER node
EXPOSE $port
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:$port/health || exit 1
CMD ["node", "dist/index.js"]
"@
  Set-Content -Path "$svcDir/Dockerfile" -Value $dockerfile

  # src/index.ts
  $indexTs = @"
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || $port;

app.use(helmet());
app.use(cors());
app.use(express.json());

// Standard Health Check Endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    service: '$name',
    status: 'UP',
    port: PORT,
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
  });
});

app.listen(PORT, () => {
  console.log(`[NutriVedha $name Service] Listening on port \${PORT}`);
});

export default app;
"@
  Set-Content -Path "$svcDir/src/index.ts" -Value $indexTs
}

# Scaffold Gateway
$gwPkg = @"
{
  "name": "@nutrivedha/gateway",
  "version": "1.0.0",
  "description": "NutriVedha API Gateway",
  "private": true,
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "tsx watch src/index.ts"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "express": "^4.21.2",
    "express-rate-limit": "^7.5.0",
    "helmet": "^8.0.0",
    "http-proxy-middleware": "^3.0.3"
  },
  "devDependencies": {
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/node": "^22.0.0",
    "tsx": "^4.19.2",
    "typescript": "^5.6.0"
  }
}
"@
Set-Content -Path "backend/gateway/package.json" -Value $gwPkg

$gwTs = @"
{
  "extends": "../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
"@
Set-Content -Path "backend/gateway/tsconfig.json" -Value $gwTs

$gwDockerfile = @"
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist
USER node
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1
CMD ["node", "dist/index.js"]
"@
Set-Content -Path "backend/gateway/Dockerfile" -Value $gwDockerfile

$gwIndex = @"
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
          console.error(`[Gateway Proxy Error] \${req.url} -> \${target}:`, err);
          if (res && !res.headersSent) {
            res.status(502).json({
              success: false,
              error: {
                code: 'UPSTREAM_SERVICE_UNAVAILABLE',
                message: `Target service at \${target} is unreachable.`,
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
  console.log(`[NutriVedha API Gateway] Running on port \${PORT}`);
});

export default app;
"@
Set-Content -Path "backend/gateway/src/index.ts" -Value $gwIndex

Write-Output "Scaffolded all 10 microservices and API Gateway."
