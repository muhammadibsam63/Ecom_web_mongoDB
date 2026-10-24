import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      maxlength: [2000, 'Comment cannot exceed 2000 characters'],
    },
    images: [
      {
        public_id: String,
        url: String,
      },
    ],
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    helpfulVotes: {
      type: Number,
      default: 0,
    },
    reportedCount: {
      type: Number,
      default: 0,
    },
    adminReply: {
      comment: String,
      repliedAt: Date,
      repliedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
reviewSchema.index({ product: 1, user: 1 }, { unique: true });
reviewSchema.index({ product: 1, isApproved: 1 });
reviewSchema.index({ user: 1 });
reviewSchema.index({ rating: 1 });

// Update product rating after save
reviewSchema.statics.calculateAverageRating = async function (productId) {
  const stats = await this.aggregate([
    { $match: { product: productId, isApproved: true } },
    {
      $group: {
        _id: '$product',
        averageRating: { $avg: '$rating' },
        numReviews: { $sum: 1 },
      },
    },
  ]);

  try {
    const Product = mongoose.model('Product');
    if (stats.length > 0) {
      await Product.findByIdAndUpdate(productId, {
        'rating.average': Math.round(stats[0].averageRating * 10) / 10,
        'rating.count': stats[0].numReviews,
      });
    } else {
      await Product.findByIdAndUpdate(productId, {
        'rating.average': 0,
        'rating.count': 0,
      });
    }
  } catch (err) {
    console.error('Error updating product rating:', err);
  }
};

reviewSchema.post('save', function () {
  this.constructor.calculateAverageRating(this.product);
});

reviewSchema.post('remove', function () {
  this.constructor.calculateAverageRating(this.product);
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
