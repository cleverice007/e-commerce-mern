
import express from 'express';
const router = express.Router();

import { getProducts, getProductById,deleteProduct,createProductReview} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').get(getProducts);
router.route('/:id/reviews').post(protect, createProductReview);
router.route('/:id').get(getProductById).delete(protect, admin, deleteProduct);
;

export default router;