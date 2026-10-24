import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  variant: {
    name: String,
    value: String,
  },
  priceAtAdd: {
    type: Number,
    required: true,
  },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
      sparse: true,
    },
    guestId: {
      type: String,
      unique: true,
      sparse: true,
    },
    items: [cartItemSchema],
    coupon: {
      code: String,
      discountType: String,
      discountValue: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
cartSchema.index({ user: 1 });
cartSchema.index({ guestId: 1 });

// Virtual for item count
cartSchema.virtual('itemCount').get(function () {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
