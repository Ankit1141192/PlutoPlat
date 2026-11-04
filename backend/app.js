const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { enforceAllowedDomain, parseAllowedOrigins } = require('./middlewares/domainSecurity');
const { apiLimiter } = require('./middlewares/rateLimiter');
const errorHandler = require('./middlewares/errorHandler');
const v1Router = require('./routes/v1');

const app = express();

// Trust reverse proxy if deployed behind Nginx / Cloudflare / Render / AWS
app.set('trust proxy', 1);

// 1. Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// 2. Strict CORS Configuration
const allowedOrigins = parseAllowedOrigins();
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl during local dev if not strict)
      if (!origin) return callback(null, true);
      const originLower = origin.toLowerCase().replace(/\/$/, '');
      const isAllowed = allowedOrigins.some((allowed) => {
        if (allowed === originLower) return true;
        if (allowed.startsWith('*.')) {
          const rootDomain = allowed.slice(2);
          try {
            const parsed = new URL(originLower);
            return parsed.hostname.endsWith(rootDomain) || parsed.hostname === rootDomain;
          } catch {
            return false;
          }
        }
        return false;
      });

      if (isAllowed) {
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

// 5. Body Parsers with payload size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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

// 7. Mount V1 APIs
app.use('/api/v1', v1Router);

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
