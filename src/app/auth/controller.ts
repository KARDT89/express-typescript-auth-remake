import type { NextFunction, Request, Response } from 'express';
import ApiResponse from '../utils/api-response.js';
import * as authService from './service.js';

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authService.register(req.body);
    ApiResponse.created(res, 'Registration success', user);
  } catch (error) {
    next(error);
  }
};

export { register };