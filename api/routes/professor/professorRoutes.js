import express from 'express';
import professorController from '../../controllers/professor/professorController.js';

const router = express.Router();

router.post('/apply', professorController.applyToBeTeacher);

export default router;
