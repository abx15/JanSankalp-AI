"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const helmet_1 = require("helmet");
const compression = require("compression");
const cookieParser = require("cookie-parser");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((0, helmet_1.default)());
    app.use(compression());
    app.use(cookieParser());
    app.enableCors({
        origin: '*',
        credentials: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: 'Content-Type,Accept,Authorization',
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('JanSankalp AI Core API')
        .setDescription('Enterprise business logic and workflow management backend service')
        .setVersion('1.0.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    app.use((req, res, next) => {
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
//# sourceMappingURL=main.js.map