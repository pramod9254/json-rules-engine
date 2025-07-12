const Rule = require('../models/Rule');
const { Rule: RuleEngine } = require('json-rules-engine');

// Helper to get rules from appropriate source
const getRules = async () => {
  if (global.isMongoConnected) {
    return await Rule.find();
  } else {
    return global.inMemoryRules || [];
  }
};

// Helper to get a rule by ID
const getRuleById = async (id) => {
  if (global.isMongoConnected) {
    return await Rule.findById(id);
  } else {
    return global.inMemoryRules.find(rule => rule._id === id);
  }
};

// Controller for getting all rules
exports.getAllRules = async (req, res) => {
  try {
    const rules = await getRules();
    res.status(200).json(rules);
  } catch (error) {
    console.error('Error getting rules:', error);
    res.status(500).json({ error: error.message });
  }
};

// Controller for getting a rule by ID
exports.getRuleById = async (req, res) => {
  try {
    const rule = await getRuleById(req.params.id);
    if (!rule) {
      return res.status(404).json({ message: 'Rule not found' });
    }
    res.status(200).json(rule);
  } catch (error) {
    console.error('Error getting rule:', error);
    res.status(500).json({ error: error.message });
  }
};

// Controller for creating a new rule
exports.createRule = async (req, res) => {
  try {
    // Validate that the rule is properly formatted
    const { name, description, position, conditions, event, priority } = req.body;
    
    if (!name || !conditions || !event) {
      return res.status(400).json({ 
        message: 'Rule must have a name, conditions, and event'
      });
    }
    
    // Attempt to validate the rule structure by creating a temporary rule
    try {
      new RuleEngine({
        name,
        conditions,
        event: {
          type: 'validation',
          params: {}
        }
      });
    } catch (validationError) {
      return res.status(400).json({
        message: 'Invalid rule format',
        error: validationError.message
      });
    }
    
    // Create and save the rule
    if (global.isMongoConnected) {
      const rule = new Rule(req.body);
      await rule.save();
      res.status(201).json(rule);
    } else {
      // In-memory storage fallback
      const rule = { 
        ...req.body, 
        _id: Date.now().toString(), 
        createdAt: new Date(), 
        updatedAt: new Date() 
      };
      
      if (!global.inMemoryRules) {
        global.inMemoryRules = [];
      }
      
      global.inMemoryRules.push(rule);
      res.status(201).json(rule);
    }
  } catch (error) {
    console.error('Error creating rule:', error);
    res.status(500).json({ error: error.message });
  }
};

// Controller for updating a rule
exports.updateRule = async (req, res) => {
  try {
    // Find the rule
    let rule;
    
    if (global.isMongoConnected) {
      rule = await Rule.findById(req.params.id);
    } else {
      rule = global.inMemoryRules.find(r => r._id === req.params.id);
    }
    
    if (!rule) {
      return res.status(404).json({ message: 'Rule not found' });
    }
    
    // Validate the updated rule structure if conditions or event is being updated
    if (req.body.conditions || req.body.event) {
      try {
        new RuleEngine({
          name: req.body.name || rule.name,
          conditions: req.body.conditions || rule.conditions,
          event: {
            type: 'validation',
            params: {}
          }
        });
      } catch (validationError) {
        return res.status(400).json({
          message: 'Invalid rule format',
          error: validationError.message
        });
      }
    }
    
    if (global.isMongoConnected) {
      // Update the rule in MongoDB
      Object.keys(req.body).forEach(key => {
        rule[key] = req.body[key];
      });
      
      await rule.save();
    } else {
      // Update the rule in memory
      const index = global.inMemoryRules.findIndex(r => r._id === req.params.id);
      if (index !== -1) {
        global.inMemoryRules[index] = {
          ...rule,
          ...req.body,
          updatedAt: new Date()
        };
        rule = global.inMemoryRules[index];
      }
    }
    
    res.status(200).json(rule);
  } catch (error) {
    console.error('Error updating rule:', error);
    res.status(500).json({ error: error.message });
  }
};

// Controller for deleting a rule
exports.deleteRule = async (req, res) => {
  try {
    let rule;
    
    if (global.isMongoConnected) {
      rule = await Rule.findByIdAndDelete(req.params.id);
      if (!rule) {
        return res.status(404).json({ message: 'Rule not found' });
      }
    } else {
      const index = global.inMemoryRules.findIndex(r => r._id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ message: 'Rule not found' });
      }
      
      rule = global.inMemoryRules[index];
      global.inMemoryRules.splice(index, 1);
    }
    
    res.status(200).json({ message: 'Rule deleted successfully', rule });
  } catch (error) {
    console.error('Error deleting rule:', error);
    res.status(500).json({ error: error.message });
  }
};
