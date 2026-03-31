import { Router } from 'express';
import validate from '../middlewares/validate.middleware.js';
import { RegisterDto } from './dto/register.dto.js';
import * as controller from './controller.js';
import { LoginDto } from './dto/login.dto.js';
import { authenticate, authorize } from './middleware.js';

const router: Router = Router();

router.post('/register', validate(RegisterDto), controller.register);
router.post('/login', validate(LoginDto), controller.login);
router.post('/refresh', controller.refresh);
router.get('/getMe', authenticate, authorize('seller', 'customer'), controller.me);
router.post('/logout', authenticate, controller.logout);

export default router;
