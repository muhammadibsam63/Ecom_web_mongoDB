import mongoose from 'mongoose';
import slugify from 'slugify';

const collectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Collection name is required'],
      unique: true,
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    image: {
      public_id: String,
      url: String,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
    startDate: Date,
    endDate: Date,
    seo: {
      title: String,
      description: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
collectionSchema.index({ slug: 1 });
collectionSchema.index({ isActive: 1, isFeatured: 1 });
collectionSchema.index({ order: 1 });

// Generate slug
collectionSchema.pre('save', function (next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

const Collection = mongoose.model('Collection', collectionSchema);
export default Collection;
