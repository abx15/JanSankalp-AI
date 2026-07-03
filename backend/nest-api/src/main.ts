import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import { RedisIoAdapter } from './socket/redis-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set up Redis Adapter for Socket.io scaling
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);

  // Security headers & compression
  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());

  // CORS config
  app.enableCors({
    origin: '*', // Customize for production: process.env.ALLOWED_ORIGINS
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Accept,Authorization',
  });

  // Global pipes & validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Setup Swagger API documentation
  const config = new DocumentBuilder()
    .setTitle('JanSankalp AI Core API')
    .setDescription('Enterprise business logic and workflow management backend service')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Add Request correlation logging middleware
  app.use((req: any, res: any, next: () => void) => {
    const correlationId = req.headers['x-correlation-id'] || `corr-${Math.floor(100000 + Math.random() * 900000)}`;
    req.correlationId = correlationId;
    res.setHeader('x-correlation-id', correlationId);

    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`[HTTP] ${correlationId} | ${req.method} ${req.originalUrl} | Status: ${res.statusCode} | Duration: ${duration}ms`);
    });
    next();
  });

  const port = process.env.PORT || 4000;
  console.log(`[BOOTSTRAP] Launching JanSankalp Nest-API on port ${port}...`);
  console.log(`[BOOTSTRAP] Swagger documentation available at http://localhost:${port}/api/docs`);
  
  await app.listen(port);
}
bootstrap();
