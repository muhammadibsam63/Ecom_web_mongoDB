import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    description: String,
    group: {
      type: String,
      enum: ['general', 'store', 'shipping', 'tax', 'email', 'seo', 'ai', 'payment'],
      default: 'general',
    },
  },
  {
    timestamps: true,
  }
);

settingsSchema.index({ key: 1 });
settingsSchema.index({ group: 1 });

const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;
