import { Router } from 'express';
import { ContactController } from '../controllers/contact.controller';

const router = Router();

router.post('/', ContactController.sendContactMessage);

export default router;
