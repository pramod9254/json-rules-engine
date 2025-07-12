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
  event: {
    type: 'goalBonus',
    params: {
      message: 'Applied goal bonus'
    }
  },
  onSuccess: (event, almanac) => {
    return almanac.factValue('goalsScored')
      .then(goalsScored => {
        return {
          bonusAmount: goalsScored * 100
        };
      });
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
  event: {
    type: 'assistBonus',
    params: {
      message: 'Applied assist bonus'
    }
  },
  onSuccess: (event, almanac) => {
    return almanac.factValue('assists')
      .then(assists => {
        return {
          bonusAmount: assists * 50
        };
      });
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
  event: {
    type: 'playingTimeBonus',
    params: {
      message: 'Applied playing time bonus'
    }
  },
  onSuccess: (event, almanac) => {
    return almanac.factValue('minutesPlayed')
      .then(minutesPlayed => {
        return {
          bonusAmount: Math.floor(minutesPlayed * 0.5)
        };
      });
  }
});

// Goalkeeper specific rules
const goalkeeperCleanSheetRule = new Rule({
  name: 'Goalkeeper Clean Sheet Bonus',
  conditions: {
    all: [{
      fact: 'position',
      operator: 'equal',
      value: 'GOALKEEPER'
    }, {
      fact: 'cleanSheets',
      operator: 'greaterThan',
      value: 0
    }]
  },
  event: {
    type: 'goalkeeperCleanSheetBonus',
    params: {
      message: 'Applied goalkeeper clean sheet bonus'
    }
  },
  onSuccess: (event, almanac) => {
    return almanac.factValue('cleanSheets')
      .then(cleanSheets => {
        return {
          bonusAmount: cleanSheets * 150
        };
      });
  }
});

const goalkeeperSaveRule = new Rule({
  name: 'Goalkeeper Save Bonus',
  conditions: {
    all: [{
      fact: 'position',
      operator: 'equal',
      value: 'GOALKEEPER'
    }, {
      fact: 'saves',
      operator: 'greaterThan',
      value: 0
    }]
  },
  event: {
    type: 'goalkeeperSaveBonus',
    params: {
      message: 'Applied goalkeeper save bonus'
    }
  },
  onSuccess: (event, almanac) => {
    return almanac.factValue('saves')
      .then(saves => {
        return {
          bonusAmount: saves * 10
        };
      });
  }
});

const goalkeeperPenaltySaveRule = new Rule({
  name: 'Goalkeeper Penalty Save Bonus',
  conditions: {
    all: [{
      fact: 'position',
      operator: 'equal',
      value: 'GOALKEEPER'
    }, {
      fact: 'penaltiesSaved',
      operator: 'greaterThan',
      value: 0
    }]
  },
  event: {
    type: 'goalkeeperPenaltySaveBonus',
    params: {
      message: 'Applied goalkeeper penalty save bonus'
    }
  },
  onSuccess: (event, almanac) => {
    return almanac.factValue('penaltiesSaved')
      .then(penaltiesSaved => {
        return {
          bonusAmount: penaltiesSaved * 200
        };
      });
  }
});

// Defender specific rules
const defenderCleanSheetRule = new Rule({
  name: 'Defender Clean Sheet Bonus',
  conditions: {
    all: [{
      fact: 'position',
      operator: 'equal',
      value: 'DEFENDER'
    }, {
      fact: 'cleanSheets',
      operator: 'greaterThan',
      value: 0
    }]
  },
  event: {
    type: 'defenderCleanSheetBonus',
    params: {
      message: 'Applied defender clean sheet bonus'
    }
  },
  onSuccess: (event, almanac) => {
    return almanac.factValue('cleanSheets')
      .then(cleanSheets => {
        return {
          bonusAmount: cleanSheets * 100
        };
      });
  }
});

const defenderTackleRule = new Rule({
  name: 'Defender Tackle Bonus',
  conditions: {
    all: [{
      fact: 'position',
      operator: 'equal',
      value: 'DEFENDER'
    }, {
      fact: 'tackles',
      operator: 'greaterThan',
      value: 0
    }]
  },
  event: {
    type: 'defenderTackleBonus',
    params: {
      message: 'Applied defender tackle bonus'
    }
  },
  onSuccess: (event, almanac) => {
    return almanac.factValue('tackles')
      .then(tackles => {
        return {
          bonusAmount: tackles * 20
        };
      });
  }
});

// Midfielder specific rules
const midfielderTackleRule = new Rule({
  name: 'Midfielder Tackle Bonus',
  conditions: {
    all: [{
      fact: 'position',
      operator: 'equal',
      value: 'MIDFIELDER'
    }, {
      fact: 'tackles',
      operator: 'greaterThan',
      value: 0
    }]
  },
  event: {
    type: 'midfielderTackleBonus',
    params: {
      message: 'Applied midfielder tackle bonus'
    }
  },
  onSuccess: (event, almanac) => {
    return almanac.factValue('tackles')
      .then(tackles => {
        return {
          bonusAmount: tackles * 15
        };
      });
  }
});

const midfielderPassingAccuracyRule = new Rule({
  name: 'Midfielder Passing Accuracy Bonus',
  conditions: {
    all: [{
      fact: 'position',
      operator: 'equal',
      value: 'MIDFIELDER'
    }, {
      fact: 'passingAccuracy',
      operator: 'greaterThan',
      value: 0
    }]
  },
  event: {
    type: 'midfielderPassingAccuracyBonus',
    params: {
      message: 'Applied midfielder passing accuracy bonus'
    }
  },
  onSuccess: (event, almanac) => {
    return almanac.factValue('passingAccuracy')
      .then(passingAccuracy => {
        return {
          bonusAmount: passingAccuracy * 2
        };
      });
  }
});

// Forward specific rules
const forwardPenaltyScoredRule = new Rule({
  name: 'Forward Penalty Scored Bonus',
  conditions: {
    all: [{
      fact: 'position',
      operator: 'equal',
      value: 'FORWARD'
    }, {
      fact: 'penaltiesScored',
      operator: 'greaterThan',
      value: 0
    }]
  },
  event: {
    type: 'forwardPenaltyScoredBonus',
    params: {
      message: 'Applied forward penalty scored bonus'
    }
  },
  onSuccess: (event, almanac) => {
    return almanac.factValue('penaltiesScored')
      .then(penaltiesScored => {
        return {
          bonusAmount: penaltiesScored * 75
        };
      });
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
  event: {
    type: 'yellowCardPenalty',
    params: {
      message: 'Applied yellow card penalty'
    }
  },
  onSuccess: (event, almanac) => {
    return almanac.factValue('yellowCards')
      .then(yellowCards => {
        return {
          fineAmount: yellowCards * 50
        };
      });
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
  event: {
    type: 'redCardPenalty',
    params: {
      message: 'Applied red card penalty'
    }
  },
  onSuccess: (event, almanac) => {
    return almanac.factValue('redCards')
      .then(redCards => {
        return {
          fineAmount: redCards * 200
        };
      });
  }
});

// Export all rules
module.exports = {
  // Universal rules
  goalBonusRule,
  assistBonusRule,
  playingTimeRule,
  
  // Goalkeeper rules
  goalkeeperCleanSheetRule,
  goalkeeperSaveRule,
  goalkeeperPenaltySaveRule,
  
  // Defender rules
  defenderCleanSheetRule,
  defenderTackleRule,
  
  // Midfielder rules
  midfielderTackleRule,
  midfielderPassingAccuracyRule,
  
  // Forward rules
  forwardPenaltyScoredRule,
  
  // Disciplinary rules
  yellowCardRule,
  redCardRule
};
