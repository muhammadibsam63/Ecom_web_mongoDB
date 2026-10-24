import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  attachments: [
    {
      public_id: String,
      url: String,
      name: String,
    },
  ],
  isStaff: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const supportTicketSchema = new mongoose.Schema(
  {
    ticketNumber: {
      type: String,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      maxlength: [200, 'Subject cannot exceed 200 characters'],
    },
    category: {
      type: String,
      enum: ['order', 'product', 'payment', 'shipping', 'return', 'account', 'other'],
      default: 'other',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'waiting_customer', 'resolved', 'closed'],
      default: 'open',
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
    messages: [messageSchema],
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    resolvedAt: Date,
    closedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes
supportTicketSchema.index({ ticketNumber: 1 });
supportTicketSchema.index({ user: 1, createdAt: -1 });
supportTicketSchema.index({ status: 1 });
supportTicketSchema.index({ assignedTo: 1 });

// Generate ticket number
supportTicketSchema.pre('validate', async function (next) {
  if (!this.ticketNumber) {
    const count = await this.constructor.countDocuments();
    this.ticketNumber = `TKT-${(count + 1).toString().padStart(6, '0')}`;
  }
  next();
});

const SupportTicket = mongoose.model('SupportTicket', supportTicketSchema);
export default SupportTicket;
