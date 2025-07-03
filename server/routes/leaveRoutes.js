import express from 'express';
import {
  applyLeave,
  viewLeaveHistory,
  cancelLeave,
} from '../controllers/leaveController.js';
import { updateLeaveStatus } from '../controllers/adminController.js';
import protect from '../middleware/authMiddleware.js';
import { isEmployee } from '../middleware/roleMiddleware.js';
import { isAdminOrManager } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/apply', protect, isEmployee, applyLeave);
router.get('/history', protect, isEmployee, viewLeaveHistory);
router.delete('/cancel/:id', protect, isEmployee, cancelLeave);

router.put('/:id/status', protect, isAdminOrManager, updateLeaveStatus);

export default router;
