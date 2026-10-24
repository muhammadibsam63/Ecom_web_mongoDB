import express from 'express';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  getProducts,
  getProduct,
} from '../controllers/productController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin', 'moderator'));

router.route('/')
  .get(getProducts)
  .post(createProduct);

router.route('/:id')
  .get(getProduct)
  .put(updateProduct)
  .delete(deleteProduct);

router.post('/:id/images', uploadProductImages);

export default router;
