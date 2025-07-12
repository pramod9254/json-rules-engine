const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');

// Calculate compensation using static rules
router.post('/calculateCompensation', playerController.calculateCompensation);

// Calculate compensation using both static and dynamic rules
router.post('/calculateDynamicCompensation', playerController.calculateDynamicCompensation);

// Get all players (if using MongoDB)
router.get('/', playerController.getAllPlayers);

// Get player by ID (if using MongoDB)
router.get('/:id', playerController.getPlayerById);

// Create new player (if using MongoDB)
router.post('/', playerController.createPlayer);

module.exports = router;
