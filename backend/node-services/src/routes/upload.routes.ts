import { Router } from 'express';
import { getImageKitAuth } from '../controllers/upload.controller';

const router = Router();

// Endpoint for client-side ImageKit upload credentials signature
router.get('/imagekit-auth', getImageKitAuth);

export default router;
