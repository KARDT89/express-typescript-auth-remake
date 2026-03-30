import {Router} from 'express';
import validate from '../middlewares/validate.middleware.js';
import { RegisterDto } from './dto/register.dto.js';
import * as controller from './controller.js';


const router: Router = Router();


router.post('/register', validate(RegisterDto), controller.register);


export default router;