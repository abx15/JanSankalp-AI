import { Request, Response, NextFunction } from 'express';
import { config } from '../config';

export const verifyInternalToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const expectedToken = `Bearer ${config.internalServiceToken}`;

  if (!authHeader || authHeader !== expectedToken) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid or missing internal service token',
    });
  }

  return next();
};
