import express from 'express';
import {
  createSubscription,
  getMySubscriptions,
  getActiveSubscription,
  togglePauseToday,
  cancelSubscription,
  getAllSubscriptions,
  getTodaySummary
} from '../controllers/subscriptionController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Customer routes
router.post('/', protect, restrictTo('customer'), createSubscription);
router.get('/my-subscriptions', protect, restrictTo('customer'), getMySubscriptions);
router.get('/active', protect, restrictTo('customer'), getActiveSubscription);
router.post('/:id/toggle-pause', protect, restrictTo('customer'), togglePauseToday);
router.put('/:id/cancel', protect, restrictTo('customer'), cancelSubscription);

// Seller routes
router.get('/all', protect, restrictTo('seller'), getAllSubscriptions);
router.get('/today-summary', protect, restrictTo('seller'), getTodaySummary);

export default router;