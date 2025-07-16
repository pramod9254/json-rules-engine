const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  position: {
    type: String,
    enum: ['GOALKEEPER', 'DEFENDER', 'MIDFIELDER', 'FORWARD'],
    required: true
  },
  club: {
    type: String,
    required: true
  },
  baseCompensation: {
    type: Number,
    required: true,
    default: 10000
  },
  goalsScored: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Player', playerSchema);
