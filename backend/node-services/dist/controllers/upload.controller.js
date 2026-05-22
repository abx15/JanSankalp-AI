"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImageKitAuth = void 0;
const imagekit_service_1 = require("../services/imagekit.service");
const getImageKitAuth = async (_req, res, next) => {
    try {
        console.log('[ImageKit] Generating secure upload authentication parameters...');
        const authParams = imagekit_service_1.imagekitService.getAuthParams();
        return res.status(200).json(authParams);
    }
    catch (error) {
        return next(error);
    }
};
exports.getImageKitAuth = getImageKitAuth;
