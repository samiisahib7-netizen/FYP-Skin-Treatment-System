/**
 * Product controller.
 *   GET    /products       public (active) | admin (all)
 *   GET    /products/:id   public
 *   POST   /products       admin (optional image)
 *   PUT    /products/:id    admin
 *   DELETE /products/:id    admin
 */
const Product = require('../models/Product');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

exports.listProducts = asyncHandler(async (req, res) => {
  const { search, category } = req.query;
  const q = {};

  if (req.user?.role !== 'admin') {
    q.isActive = true;
  } else if (req.query.isActive !== undefined) {
    q.isActive = req.query.isActive === 'true';
  }

  if (category) q.category = category;
  if (search) q.name = { $regex: search, $options: 'i' };

  const items = await Product.find(q).sort('-createdAt');
  res.json({ success: true, data: items });
});

exports.getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');
  if (!product.isActive && req.user?.role !== 'admin') {
    throw new ApiError(404, 'Product not found');
  }
  res.json({ success: true, data: product });
});

exports.createProduct = asyncHandler(async (req, res) => {
  const { name, description, category, price, stock, brand, isActive } = req.body;
  const images = [];
  if (req.file) images.push(`/uploads/products/${req.file.filename}`);

  const product = await Product.create({
    name,
    description,
    category,
    price,
    stock,
    brand,
    isActive,
    images,
  });

  res.status(201).json({ success: true, message: 'Product created.', data: product });
});

exports.updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');

  const fields = ['name', 'description', 'category', 'price', 'stock', 'brand', 'isActive'];
  for (const f of fields) {
    if (req.body[f] !== undefined) product[f] = req.body[f];
  }
  if (req.file) {
    product.images = [...(product.images || []), `/uploads/products/${req.file.filename}`];
  }
  await product.save();

  res.json({ success: true, message: 'Product updated.', data: product });
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');
  await product.deleteOne();
  res.json({ success: true, message: 'Product deleted.' });
});
