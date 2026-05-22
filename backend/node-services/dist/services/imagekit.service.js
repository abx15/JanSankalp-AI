"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imagekitService = void 0;
const imagekit_1 = __importDefault(require("imagekit"));
const config_1 = require("../config");
class ImageKitService {
    imagekit = null;
    constructor() {
        if (config_1.config.imagekit.privateKey && config_1.config.imagekit.publicKey) {
            this.imagekit = new imagekit_1.default({
                publicKey: config_1.config.imagekit.publicKey,
                privateKey: config_1.config.imagekit.privateKey,
                urlEndpoint: config_1.config.imagekit.urlEndpoint,
            });
            console.log('[ImageKit] Service initialized successfully.');
        }
        else {
            console.warn('[ImageKit] Warning: ImageKit credentials missing. Upload signatures will fail.');
        }
    }
    getAuthParams() {
        if (!this.imagekit) {
            throw new Error('ImageKit client is not initialized due to missing credentials');
        }
        return this.imagekit.getAuthenticationParameters();
    }
}
exports.imagekitService = new ImageKitService();
