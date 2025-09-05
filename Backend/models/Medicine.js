const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Pain Relief', 'Antibiotic', 'Respiratory', 'Cardiovascular', 'Diabetes', 'General', 'Vitamins']
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  expiryDate: {
    type: Date,
    required: true
  },
  supplier: {
    type: String,
    required: true
  },
  batchNumber: {
    type: String,
    required: true
  },
  pharmacy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pharmacy',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
medicineSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for faster searches
medicineSchema.index({ name: 'text', category: 'text' });
medicineSchema.index({ pharmacy: 1 });

module.exports = mongoose.model('Medicine', medicineSchema);