"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const config_1 = require("./config");
const upload_routes_1 = __importDefault(require("./routes/upload.routes"));
const email_routes_1 = __importDefault(require("./routes/email.routes"));
const payment_routes_1 = __importDefault(require("./routes/payment.routes"));
const errorHandler_1 = require("./middleware/errorHandler");
const app = (0, express_1.default)();
// Secure headers
app.use((0, helmet_1.default)());
// Enable CORS
app.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'stripe-signature'],
}));
// Setup request logger
app.use((0, morgan_1.default)(':method :url :status :res[content-length] - :response-time ms'));
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
app.use('/utils/payment', payment_routes_1.default);
// Global json & urlencoded body parsers (applied strictly after Stripe raw routing)
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Mount utility endpoints
app.use('/utils/upload', upload_routes_1.default);
app.use('/utils/email', email_routes_1.default);
// Global exception filter middleware
app.use(errorHandler_1.errorHandler);
const PORT = config_1.config.port;
app.listen(PORT, () => {
    console.log(`[node-services] Microservice running on port ${PORT}`);
});
exports.default = app;
