import { Router } from 'express';
import { createSubmission } from '../controllers/submission.controller.js';
import upload from '../middlewares/multer.middleware.js';

const submissionRouter = Router();

submissionRouter.post('/', upload.array('files', 10), createSubmission);

export default submissionRouter;