import mongoose from 'mongoose';
import slugify from 'slugify';

const variantSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "Color", "Size"
  options: [
    {
      value: { type: String, required: true },
      sku: String,
      priceAdjustment: { type: Number, default: 0 },
      stock: { type: Number, default: 0 },
      image: String,
    },
  ],
});

const imageSchema = new mongoose.Schema({
  public_id: { type: String, required: true },
  url: { type: String, required: true },
  alt: { type: String, default: '' },
  isPrimary: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Name cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    shortDescription: {
      type: String,
      maxlength: [300, 'Short description cannot exceed 300 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    compareAtPrice: {
      type: Number,
      min: [0, 'Compare price cannot be negative'],
    },
    costPrice: {
      type: Number,
      min: [0, 'Cost price cannot be negative'],
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
      uppercase: true,
      trim: true,
    },
    barcode: String,
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    collections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Collection',
      },
    ],
    tags: [{ type: String, lowercase: true, trim: true }],
    images: [imageSchema],
    variants: [variantSchema],
    stock: {
      type: Number,
      required: true,
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
    },
    weight: { type: Number, default: 0 }, // in grams
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isDigital: {
      type: Boolean,
      default: false,
    },
    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },
    salesCount: {
      type: Number,
      default: 0,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    seo: {
      title: String,
      description: String,
      keywords: [String],
    },
    specifications: [
      {
        key: String,
        value: String,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
productSchema.index({ slug: 1 });
productSchema.index({ sku: 1 });
productSchema.index({ category: 1 });
productSchema.index({ collections: 1 });
productSchema.index({ tags: 1 });
productSchema.index({ isActive: 1, isFeatured: 1 });
productSchema.index({ price: 1 });
productSchema.index({ 'rating.average': -1 });
productSchema.index({ salesCount: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function () {
  if (this.compareAtPrice && this.compareAtPrice > this.price) {
    return Math.round(
      ((this.compareAtPrice - this.price) / this.compareAtPrice) * 100
    );
  }
  return 0;
});

// Virtual for in stock
productSchema.virtual('inStock').get(function () {
  return this.stock > 0;
});

// Virtual for low stock
productSchema.virtual('isLowStock').get(function () {
  return this.stock > 0 && this.stock <= this.lowStockThreshold;
});

// Generate slug before save
productSchema.pre('save', function (next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

// Ensure unique slug
productSchema.pre('save', async function (next) {
  if (!this.isModified('slug')) return next();
  const existing = await this.constructor.findOne({
    slug: this.slug,
    _id: { $ne: this._id },
  });
  if (existing) {
    this.slug = `${this.slug}-${Date.now().toString(36)}`;
  }
  next();
});

const Product = mongoose.model('Product', productSchema);
export default Product;
