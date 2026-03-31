import type { Request, Response } from 'express';
import ApiResponse from '../utils/api-response.js';
import * as authService from './service.js';

const register = async (req: Request, res: Response) => {
  const user = await authService.register(req.body);
  ApiResponse.created(res, 'Registration success', user);
};

const login = async (req: Request, res: Response) => {
  const { user, accessToken, refreshToken } = await authService.login(req.body);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  ApiResponse.ok(res, 'Login success', { user, accessToken });
};

export { register, login };
