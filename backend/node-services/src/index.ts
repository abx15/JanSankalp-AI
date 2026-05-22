import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config';
import uploadRouter from './routes/upload.routes';
import emailRouter from './routes/email.routes';
import paymentRouter from './routes/payment.routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Secure headers
app.use(helmet());

// Enable CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'stripe-signature'],
}));

// Setup request logger
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

// Health check endpoint (public)
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'online',
    message: 'API is live',
    service: '@jansankalp/node-services',
    timestamp: new Date().toISOString(),
  });
});

app.get('/utils/health', (_req, res) => {
  res.status(200).json({
    status: 'online',
    message: 'API is live',
    service: '@jansankalp/node-services (via /utils/health)',
    timestamp: new Date().toISOString(),
  });
});

// Mount payment router FIRST so express.raw parses signatures correctly
app.use('/utils/payment', paymentRouter);

// Global json & urlencoded body parsers (applied strictly after Stripe raw routing)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mount utility endpoints
app.use('/utils/upload', uploadRouter);
app.use('/utils/email', emailRouter);

// Global exception filter middleware
app.use(errorHandler);

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`[node-services] Microservice running on port ${PORT}`);
});
export default app;
