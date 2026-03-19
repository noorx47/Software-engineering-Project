const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: String,
    default: '1'
  },
  category: {
    type: String,
    enum: ['Food', 'Toiletries', 'Other'],
    default: 'Other'
  },
  bought: {
    type: Boolean,
    default: false
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  listId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'List',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);