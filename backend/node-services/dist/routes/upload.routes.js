"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upload_controller_1 = require("../controllers/upload.controller");
const router = (0, express_1.Router)();
// Endpoint for client-side ImageKit upload credentials signature
router.get('/imagekit-auth', upload_controller_1.getImageKitAuth);
exports.default = router;
