import express from 'express';
import {
  viewAllLeaves,
  updateLeaveStatus,
} from '../controllers/adminController.js';
import protect from '../middleware/authMiddleware.js';
import { isManager } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/leaves', protect, isManager, viewAllLeaves);

router.put('/leaves/:id/status', protect, isManager, updateLeaveStatus);

export default router;
