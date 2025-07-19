const { Rule } = require('json-rules-engine');

// Universal rules for all positions
const goalBonusRule = new Rule({
  name: 'Goal Bonus',
  conditions: {
    all: [{
      fact: 'goalsScored',
      operator: 'greaterThan',
      value: 0
    }]
  },
  event: { type: 'goalBonus' },
  onSuccess: async (event, almanac) => {
    const goalsScored = await almanac.factValue('goalsScored');
    event.params = { bonusAmount: goalsScored * 100 };
    return event;
  }
});

const assistBonusRule = new Rule({
  name: 'Assist Bonus',
  conditions: {
    all: [{
      fact: 'assists',
      operator: 'greaterThan',
      value: 0
    }]
  },
  event: { type: 'assistBonus' },
  onSuccess: async (event, almanac) => {
    const assists = await almanac.factValue('assists');
    event.params = { bonusAmount: assists * 50 };
    return event;
  }
});

const playingTimeRule = new Rule({
  name: 'Playing Time Bonus',
  conditions: {
    all: [{
      fact: 'minutesPlayed',
      operator: 'greaterThan',
      value: 0
    }]
  },
  event: { type: 'playingTimeBonus' },
  onSuccess: async (event, almanac) => {
    const minutesPlayed = await almanac.factValue('minutesPlayed');
    event.params = { bonusAmount: Math.floor(minutesPlayed * 0.5) };
    return event;
  }
});

// Goalkeeper specific rules
const goalkeeperCleanSheetRule = new Rule({
  name: 'Goalkeeper Clean Sheet Bonus',
  conditions: {
    all: [
      { fact: 'position', operator: 'equal', value: 'GOALKEEPER' },
      { fact: 'cleanSheets', operator: 'greaterThan', value: 0 }
    ]
  },
  event: { type: 'goalkeeperCleanSheetBonus' },
  onSuccess: async (event, almanac) => {
    const cleanSheets = await almanac.factValue('cleanSheets');
    event.params = { bonusAmount: cleanSheets * 150 };
    return event;
  }
});

const goalkeeperSaveRule = new Rule({
  name: 'Goalkeeper Save Bonus',
  conditions: {
    all: [
      { fact: 'position', operator: 'equal', value: 'GOALKEEPER' },
      { fact: 'saves', operator: 'greaterThan', value: 0 }
    ]
  },
  event: { type: 'goalkeeperSaveBonus' },
  onSuccess: async (event, almanac) => {
    const saves = await almanac.factValue('saves');
    event.params = { bonusAmount: saves * 10 };
    return event;
  }
});

const goalkeeperPenaltySaveRule = new Rule({
  name: 'Goalkeeper Penalty Save Bonus',
  conditions: {
    all: [
      { fact: 'position', operator: 'equal', value: 'GOALKEEPER' },
      { fact: 'penaltiesSaved', operator: 'greaterThan', value: 0 }
    ]
  },
  event: { type: 'goalkeeperPenaltySaveBonus' },
  onSuccess: async (event, almanac) => {
    const penaltiesSaved = await almanac.factValue('penaltiesSaved');
    event.params = { bonusAmount: penaltiesSaved * 200 };
    return event;
  }
});

// Defender specific rules
const defenderCleanSheetRule = new Rule({
  name: 'Defender Clean Sheet Bonus',
  conditions: {
    all: [
      { fact: 'position', operator: 'equal', value: 'DEFENDER' },
      { fact: 'cleanSheets', operator: 'greaterThan', value: 0 }
    ]
  },
  event: { type: 'defenderCleanSheetBonus' },
  onSuccess: async (event, almanac) => {
    const cleanSheets = await almanac.factValue('cleanSheets');
    event.params = { bonusAmount: cleanSheets * 100 };
    return event;
  }
});

const defenderTackleRule = new Rule({
  name: 'Defender Tackle Bonus',
  conditions: {
    all: [
      { fact: 'position', operator: 'equal', value: 'DEFENDER' },
      { fact: 'tackles', operator: 'greaterThan', value: 0 }
    ]
  },
  event: { type: 'defenderTackleBonus' },
  onSuccess: async (event, almanac) => {
    const tackles = await almanac.factValue('tackles');
    event.params = { bonusAmount: tackles * 20 };
    return event;
  }
});

// Midfielder specific rules
const midfielderTackleRule = new Rule({
  name: 'Midfielder Tackle Bonus',
  conditions: {
    all: [
      { fact: 'position', operator: 'equal', value: 'MIDFIELDER' },
      { fact: 'tackles', operator: 'greaterThan', value: 0 }
    ]
  },
  event: { type: 'midfielderTackleBonus' },
  onSuccess: async (event, almanac) => {
    const tackles = await almanac.factValue('tackles');
    event.params = { bonusAmount: tackles * 15 };
    return event;
  }
});

const midfielderPassingAccuracyRule = new Rule({
  name: 'Midfielder Passing Accuracy Bonus',
  conditions: {
    all: [
      { fact: 'position', operator: 'equal', value: 'MIDFIELDER' },
      { fact: 'passingAccuracy', operator: 'greaterThan', value: 0 }
    ]
  },
  event: { type: 'midfielderPassingAccuracyBonus' },
  onSuccess: async (event, almanac) => {
    const passingAccuracy = await almanac.factValue('passingAccuracy');
    event.params = { bonusAmount: passingAccuracy * 2 };
    return event;
  }
});

// Forward specific rules
const forwardPenaltyScoredRule = new Rule({
  name: 'Forward Penalty Scored Bonus',
  conditions: {
    all: [
      { fact: 'position', operator: 'equal', value: 'FORWARD' },
      { fact: 'penaltiesScored', operator: 'greaterThan', value: 0 }
    ]
  },
  event: { type: 'forwardPenaltyScoredBonus' },
  onSuccess: async (event, almanac) => {
    const penaltiesScored = await almanac.factValue('penaltiesScored');
    event.params = { bonusAmount: penaltiesScored * 75 };
    return event;
  }
});

// Disciplinary rules
const yellowCardRule = new Rule({
  name: 'Yellow Card Penalty',
  conditions: {
    all: [{
      fact: 'yellowCards',
      operator: 'greaterThan',
      value: 0
    }]
  },
  event: { type: 'yellowCardPenalty' },
  onSuccess: async (event, almanac) => {
    const yellowCards = await almanac.factValue('yellowCards');
    event.params = { fineAmount: yellowCards * 50 };
    return event;
  }
});

const redCardRule = new Rule({
  name: 'Red Card Penalty',
  conditions: {
    all: [{
      fact: 'redCards',
      operator: 'greaterThan',
      value: 0
    }]
  },
  event: { type: 'redCardPenalty' },
  onSuccess: async (event, almanac) => {
    const redCards = await almanac.factValue('redCards');
    event.params = { fineAmount: redCards * 200 };
    return event;
  }
});

// Export all rules
module.exports = {
  goalBonusRule,
  assistBonusRule,
  playingTimeRule,
  goalkeeperCleanSheetRule,
  goalkeeperSaveRule,
  goalkeeperPenaltySaveRule,
  defenderCleanSheetRule,
  defenderTackleRule,
  midfielderTackleRule,
  midfielderPassingAccuracyRule,
  forwardPenaltyScoredRule,
  yellowCardRule,
  redCardRule
};
