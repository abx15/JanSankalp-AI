import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error(`[ERROR] ${req.method} ${req.path} - ${err.message}`, err.stack);
  
  return res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};
