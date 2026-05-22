import { Request, Response, NextFunction } from 'express';
import { imagekitService } from '../services/imagekit.service';

export const getImageKitAuth = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('[ImageKit] Generating secure upload authentication parameters...');
    const authParams = imagekitService.getAuthParams();
    return res.status(200).json(authParams);
  } catch (error) {
    return next(error);
  }
};
