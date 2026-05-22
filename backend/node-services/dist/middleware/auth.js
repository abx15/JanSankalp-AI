"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyInternalToken = void 0;
const config_1 = require("../config");
const verifyInternalToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const expectedToken = `Bearer ${config_1.config.internalServiceToken}`;
    if (!authHeader || authHeader !== expectedToken) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized: Invalid or missing internal service token',
        });
    }
    return next();
};
exports.verifyInternalToken = verifyInternalToken;
