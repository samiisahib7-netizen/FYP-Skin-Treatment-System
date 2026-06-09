/**
 * Product routes — /api/v1/products
 */
const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const optionalAuth = require('../middlewares/optionalAuth');
const roleGuard = require('../middlewares/roleGuard');
const validate = require('../middlewares/validate');
const { uploadProductImage, handleUploadError } = require('../middlewares/upload');

const ctrl = require('../controllers/product.controller');
const { createProductSchema, updateProductSchema } = require('../validators/product.validators');

router.get('/', optionalAuth, ctrl.listProducts);
router.get('/:id', optionalAuth, ctrl.getProduct);

router.post(
  '/',
  auth,
  roleGuard('admin'),
  uploadProductImage,
  handleUploadError,
  validate(createProductSchema),
  ctrl.createProduct
);
router.put(
  '/:id',
  auth,
  roleGuard('admin'),
  uploadProductImage,
  handleUploadError,
  validate(updateProductSchema),
  ctrl.updateProduct
);
router.delete('/:id', auth, roleGuard('admin'), ctrl.deleteProduct);

module.exports = router;
