import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Collection from '../models/Collection.js';
import cloudinary from '../config/cloudinary.js';
// @desc    Get all products with filtering, sorting, pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      sort = '-createdAt',
      category,
      collection,
      minPrice,
      maxPrice,
      rating,
      search,
      featured,
      inStock,
      tags,
    } = req.query;

    const query = { isActive: true };

    if (category) query.category = category;
    if (collection) query.collections = collection;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (rating) query['rating.average'] = { $gte: Number(rating) };
    if (featured === 'true') query.isFeatured = true;
    if (inStock === 'true') query.stock = { $gt: 0 };
    if (tags) query.tags = { $in: tags.split(',') };
    if (search) {
      query.$text = { $search: search };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name slug')
        .populate('collections', 'name slug')
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Product.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by slug or id
// @route   GET /api/products/:slug
// @access  Public
export const getProduct = async (req, res, next) => {
  try {
    const { slug } = req.params;
    let product;

    if (slug.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(slug)
        .populate('category', 'name slug')
        .populate('collections', 'name slug');
    } else {
      product = await Product.findOne({ slug, isActive: true })
        .populate('category', 'name slug')
        .populate('collections', 'name slug');
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Increment view count
    await Product.findByIdAndUpdate(product._id, { $inc: { viewCount: 1 } });

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get related products
// @route   GET /api/products/:id/related
// @access  Public
export const getRelatedProducts = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const related = await Product.find({
      _id: { $ne: product._id },
      isActive: true,
      $or: [
        { category: product.category },
        { tags: { $in: product.tags } },
        { collections: { $in: product.collections } },
      ],
    })
      .limit(8)
      .select('name slug price compareAtPrice images rating stock')
      .lean();

    res.status(200).json({
      success: true,
      products: related,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product (Admin)
// @route   POST /api/admin/products
// @access  Private/Admin
export const createProduct = async (req, res, next) => {
  try {
    req.body.createdBy = req.user.id;
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product (Admin)
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
  try {
    req.body.updatedBy = req.user.id;
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product (Admin)
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Soft delete preferred, but hard delete if requested
    if (req.query.hard === 'true') {
      // Delete images from Cloudinary
      for (const img of product.images) {
        if (img.public_id) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      }
      await product.deleteOne();
    } else {
      product.isActive = false;
      await product.save();
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload product images
// @route   POST /api/admin/products/:id/images
// @access  Private/Admin
export const uploadProductImages = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No images uploaded' });
    }

    const uploadedImages = [];
    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'ai-commerce/products',
        transformation: [{ width: 1200, height: 1200, crop: 'limit' }],
      });
      uploadedImages.push({
        public_id: result.public_id,
        url: result.secure_url,
        isPrimary: product.images.length === 0 && uploadedImages.length === 0,
        order: product.images.length + uploadedImages.length,
      });
    }

    product.images.push(...uploadedImages);
    await product.save();

    res.status(200).json({
      success: true,
      images: product.images,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search products (autocomplete)
// @route   GET /api/products/search
// @access  Public
export const searchProducts = async (req, res, next) => {
  try {
    const { q, limit = 8 } = req.query;
    if (!q || q.length < 2) {
      return res.status(200).json({ success: true, products: [] });
    }

    const products = await Product.find({
      isActive: true,
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } },
        { sku: { $regex: q, $options: 'i' } },
      ],
    })
      .select('name slug price images rating')
      .limit(Number(limit))
      .lean();

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    next(error);
  }
};
