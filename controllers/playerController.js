const { Engine, Rule: RuleEngine } = require('json-rules-engine');
const staticRules = require('../rules/staticRules');
const Player = require('../models/Player');
const Rule = require('../models/Rule');

// Helper function to calculate total compensation
const calculateTotalCompensation = (player, results) => {
  let bonusAmount = 0;
  let fineAmount = 0;
  
  console.log('Calculating total compensation for player:', player);
  console.log('Results:', JSON.stringify(results, null, 2));
  // Sum up all bonuses from rule results
  results.forEach(result => {
    console.log('Processing result:', JSON.stringify(result, null, 2));
    if (result.event?.params?.bonusAmount) {
      bonusAmount += result.event.params.bonusAmount;
    }
    if (result.event?.params?.fineAmount) {
      fineAmount += result.event.params.fineAmount;
    }
  });
  
  return {
    baseCompensation: player.baseCompensation,
    bonusAmount,
    fineAmount,
    totalCompensation: player.baseCompensation + bonusAmount - fineAmount
  };
};

// Helper function to calculate total compensation for goals only
const calculateGoalsCompensation = (player) => {
  const baseCompensation = player.baseCompensation || 10000;
  const goalsScored = player.goalsScored || 0;
  const bonusAmount = goalsScored * 200;
  return {
    baseCompensation,
    bonusAmount,
    totalCompensation: baseCompensation + bonusAmount
  };
};

// Controller for calculating compensation using static rules
exports.calculateCompensation = async (req, res) => {
  try {
    const playerData = req.body;
    
    // Create a new engine
    const engine = new Engine();
    
    // Add all static rules to the engine
    Object.values(staticRules).forEach(rule => {
      engine.addRule(rule);
    });
    
    // Run the engine with player data
    const { events, results, failureResults } = await engine.run(playerData);
    
    // Calculate final compensation
    const compensationDetails = calculateTotalCompensation(playerData, results);
    
    // Return the result
    res.status(200).json({
      ...playerData,
      ...compensationDetails,
      rules: {
        appliedRules: events.map(event => event.type),
        failedRules: failureResults.map(failure => failure.name)
      }
    });
  } catch (error) {
    console.error('Error calculating compensation:', error);
    res.status(500).json({ error: error.message });
  }
};

// Controller for calculating compensation using both static and dynamic rules
exports.calculateDynamicCompensation = async (req, res) => {
  try {
    const playerData = req.body;
    
    console.log('Calculating dynamic compensation for player:', playerData);
    // Create a new engine
    const engine = new Engine();
    
    // Add all static rules to the engine
    // Object.values(staticRules).forEach(rule => {
    //   engine.addRule(rule);
    // });
    
    // Fetch dynamic rules from database or memory
    let dynamicRules = [];
    
    try {
      if (global.isMongoConnected) {
        // Get rules from MongoDB that match player position or are applicable to ALL positions
        dynamicRules = await Rule.find({
          isActive: true,
          $or: [
            { position: playerData.position },
            { position: 'ALL' }
          ]
        });
      } else {
        // Get rules from in-memory storage
        dynamicRules = (global.inMemoryRules || []).filter(rule => 
          rule.isActive !== false && 
          (rule.position === playerData.position || rule.position === 'ALL')
        );
      }
      
      console.log('dynamicRules:', dynamicRules);
      // Add dynamic rules to the engine
      dynamicRules.forEach(dbRule => {
        // Find the stat name from the first condition (assumes one stat per rule)
        let statName = null;
        if (dbRule.conditions && dbRule.conditions.all && dbRule.conditions.all.length > 0) {
          statName = dbRule.conditions.all[0].fact;
        }
        // Get bonusAmount or fineAmount from event.result
        const bonusAmount = dbRule.event?.result?.bonusAmount;
        const fineAmount = dbRule.event?.result?.fineAmount;
        console.log('Bonus Amount:', bonusAmount, 'Fine Amount:', fineAmount);
        const rule = new RuleEngine({
          name: dbRule.name,
          conditions: dbRule.conditions,
          event: dbRule.event,
          // {
          //   type: dbRule.event.type,
            
          //   // params: {
          //   //   message: dbRule.description || `Applied dynamic rule ${dbRule.name}`
          //   // }
          // },
          priority: dbRule.priority,
          onSuccess: async (event, almanac) => {
            console.log('Dynamic rule triggered:', event);

            // if (statName) {
            //   const statValue = await almanac.factValue(statName);
            //   let params = {};
            //   if (bonusAmount !== undefined) {
            //     params.bonusAmount = statValue * bonusAmount;
            //     console.log('Calculated bonusAmount:', params.bonusAmount);
            //   }
            //   if (fineAmount !== undefined) {
            //     params.fineAmount = statValue * fineAmount;
            //     console.log('Calculated fineAmount:', params.fineAmount);
            //   }
            //   return { params }; // This will be merged into the event.params
            // }
            console.log('No statName found, returning default event result:', dbRule.event.result);
            return dbRule.event.result || {};
          }
        });
        engine.addRule(rule);
      });
    } catch (dbError) {
      console.log('Warning: Could not load dynamic rules, using only static rules', dbError);
    }
    
    // Run the engine with player data
    const { events, results, failureResults } = await engine.run(playerData);
    console.log('Events-----', events);
    console.log('failureResults-----', failureResults);
    console.log('results-----', JSON.stringify(results, null, 2));

    // Calculate final compensation
    const compensationDetails = calculateTotalCompensation(playerData, results);
    
    // Return the result
    res.status(200).json({
      ...playerData,
      ...compensationDetails,
      rules: {
        appliedRules: events.map(event => event.type),
        failedRules: failureResults.map(failure => failure.name),
        dynamicRulesCount: dynamicRules.length
      }
    });
  } catch (error) {
    console.error('Error calculating dynamic compensation:', error);
    res.status(500).json({ error: error.message });
  }
};

// Controller for calculating compensation using only goals
exports.calculateGoalsCompensation = async (req, res) => {
  try {
    const playerData = req.body;
    const compensationDetails = calculateGoalsCompensation(playerData);
    res.status(200).json({
      ...playerData,
      ...compensationDetails
    });
  } catch (error) {
    console.error('Error calculating goals compensation:', error);
    res.status(500).json({ error: error.message });
  }
};

// Controller for getting all players (MongoDB)
exports.getAllPlayers = async (req, res) => {
  try {
    if (global.isMongoConnected) {
      const players = await Player.find();
      res.status(200).json(players);
    } else {
      res.status(200).json([]);
    }
  } catch (error) {
    console.error('Error getting players:', error);
    res.status(500).json({ error: error.message });
  }
};

// Controller for getting a player by ID (MongoDB)
exports.getPlayerById = async (req, res) => {
  try {
    if (!global.isMongoConnected) {
      return res.status(503).json({ 
        message: 'MongoDB is not connected. This feature requires database connectivity.'
      });
    }
    
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }
    res.status(200).json(player);
  } catch (error) {
    console.error('Error getting player:', error);
    res.status(500).json({ error: error.message });
  }
};

// Controller for creating a new player (MongoDB)
exports.createPlayer = async (req, res) => {
  try {
    if (!global.isMongoConnected) {
      return res.status(503).json({ 
        message: 'MongoDB is not connected. This feature requires database connectivity.'
      });
    }
    
    const player = new Player(req.body);
    await player.save();
    res.status(201).json(player);
  } catch (error) {
    console.error('Error creating player:', error);
    res.status(500).json({ error: error.message });
  }
};
