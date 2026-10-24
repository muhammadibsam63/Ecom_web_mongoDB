import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: { type: String, required: true },
  slug: String,
  image: String,
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  variant: {
    name: String,
    value: String,
  },
  sku: String,
});

const shippingAddressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: String,
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [orderItemSchema],
    shippingAddress: shippingAddressSchema,
    billingAddress: shippingAddressSchema,
    paymentMethod: {
      type: String,
      enum: ['cod', 'card', 'bank_transfer', 'wallet'],
      default: 'cod',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded', 'partially_refunded'],
      default: 'pending',
    },
    paymentDetails: {
      transactionId: String,
      paidAt: Date,
      amount: Number,
      currency: { type: String, default: 'PKR' },
      provider: String,
    },
    status: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'processing',
        'shipped',
        'delivered',
        'cancelled',
        'returned',
        'refunded',
      ],
      default: 'pending',
    },
    statusHistory: [
      {
        status: String,
        note: String,
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
    subtotal: { type: Number, required: true },
    shippingCost: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    coupon: {
      code: String,
      discountType: String,
      discountValue: Number,
    },
    total: { type: Number, required: true },
    currency: { type: String, default: 'PKR' },
    notes: String,
    trackingNumber: String,
    trackingUrl: String,
    estimatedDelivery: Date,
    deliveredAt: Date,
    cancelledAt: Date,
    cancellationReason: String,
    returnRequest: {
      requested: { type: Boolean, default: false },
      reason: String,
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'completed'],
      },
      requestedAt: Date,
      resolvedAt: Date,
    },
    invoiceNumber: String,
  },
  {
    timestamps: true,
  }
);

// Indexes
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'items.product': 1 });

// Generate order number
orderSchema.pre('validate', async function (next) {
  if (!this.orderNumber) {
    const date = new Date();
    const prefix = `ORD-${date.getFullYear()}${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}`;
    const count = await this.constructor.countDocuments({
      createdAt: {
        $gte: new Date(date.getFullYear(), date.getMonth(), 1),
        $lt: new Date(date.getFullYear(), date.getMonth() + 1, 1),
      },
    });
    this.orderNumber = `${prefix}-${(count + 1).toString().padStart(5, '0')}`;
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
