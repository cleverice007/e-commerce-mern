import express from 'express';
const router = express.Router();
import {
  addOrderItems,
  getOrderById,
  getMyOrders,
}
 from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').post(protect, addOrderItems);
router.route('/mine').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);


export default router;