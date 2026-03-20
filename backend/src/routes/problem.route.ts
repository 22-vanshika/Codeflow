import express from 'express';
import { ProblemController } from '../controllers/problem.controller';

const router = express.Router();

router.post('/import', ProblemController.importProblem);

export default router;
