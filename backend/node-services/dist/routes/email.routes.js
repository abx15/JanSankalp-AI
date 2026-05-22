"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const email_controller_1 = require("../controllers/email.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Protected endpoint for internal email notifications dispatch
router.post('/send', auth_1.verifyInternalToken, email_controller_1.sendNotificationEmail);
exports.default = router;
