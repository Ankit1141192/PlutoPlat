const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { enforceAllowedDomain, parseAllowedOrigins, isOriginAllowed } = require('./middlewares/domainSecurity');
const { apiLimiter } = require('./middlewares/rateLimiter');
const errorHandler = require('./middlewares/errorHandler');
const v1Router = require('./routes/v1');
const v2Router = require('./routes/v2');
const v3Router = require('./routes/v3');

const app = express();

// Trust reverse proxy if deployed behind Nginx / Cloudflare / Render / AWS
app.set('trust proxy', 1);

// 1. Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// 2. Strict CORS Configuration (Only plutoplot.in and its subdomains)
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. server-to-server or curl tools when not in strict browser CORS)
      if (!origin) return callback(null, true);

      if (isOriginAllowed(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(`Blocked by CORS: Origin '${origin}' is not authorized.`)
      );
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Origin',
      'Accept',
    ],
  })
);

// 3. Domain Security Middleware (Enforces requests from authorized domain only)
app.use('/api', enforceAllowedDomain);

// 4. Global API Rate Limiter
app.use('/api', apiLimiter);

// 5. Body Parsers with generous payload size limits (supporting base64 photos)
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// 6. Base & Health Endpoints
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to PlutoPlat Enterprise API',
    version: '1.0.0',
    documentation: '/api/v1',
  });
});

app.get('/health', (req, res) => {
  const mongoose = require('mongoose');
  const dbState = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting',
  };

  res.status(200).json({
    success: true,
    status: 'Healthy',
    uptime: `${process.uptime().toFixed(1)} seconds`,
    timestamp: new Date().toISOString(),
    database: dbState[mongoose.connection.readyState] || 'Unknown',
  });
});

// 7. Mount Versioned APIs
// V1: User Panel (Buyer / Client Workflow)
app.use('/api/v1', v1Router);

// V2: Admin Panel (Agent / Broker Workstation)
app.use('/api/v2', v2Router);

// V3: SuperAdmin Panel (Platform Master HQ)
app.use('/api/v3', v3Router);

// 8. 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API route not found: [${req.method}] ${req.originalUrl}`,
  });
});

// 9. Centralized Error Handler
app.use(errorHandler);

module.exports = app;
