const mongoose = require('mongoose');

const ruleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  position: {
    type: String,
    enum: ['GOALKEEPER', 'DEFENDER', 'MIDFIELDER', 'FORWARD', 'ALL'],
    default: 'ALL'
  },
  conditions: {
    type: Object,
    required: true
  },
  event: {
    type: Object,
    required: true
  },
  priority: {
    type: Number,
    default: 1
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Rule', ruleSchema);
