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
  },
  assists: {
    type: Number,
    default: 0
  },
  // cleanSheets: {
  //   type: Number,
  //   default: 0
  // },
  // saves: {
  //   type: Number,
  //   default: 0
  // },
  // tackles: {
  //   type: Number,
  //   default: 0
  // },
  // passingAccuracy: {
  //   type: Number,
  //   default: 0
  // },
  // minutesPlayed: {
  //   type: Number,
  //   default: 0
  // },
  // yellowCards: {
  //   type: Number,
  //   default: 0
  // },
  // redCards: {
  //   type: Number,
  //   default: 0
  // },
  // matchesPlayed: {
  //   type: Number,
  //   default: 0
  // },
  // penaltiesSaved: {
  //   type: Number,
  //   default: 0
  // },
  // penaltiesScored: {
  //   type: Number,
  //   default: 0
  // }
}, {
  timestamps: true
});

module.exports = mongoose.model('Player', playerSchema);
