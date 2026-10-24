import express from 'express';
import {
  getProducts,
  getProduct,
  getRelatedProducts,
  searchProducts,
} from '../controllers/productController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/search', searchProducts);
router.get('/', optionalAuth, getProducts);
router.get('/:slug', optionalAuth, getProduct);
router.get('/:id/related', getRelatedProducts);

export default router;
