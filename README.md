# Football Player Compensation Calculator - Node.js

A Node.js Express application that calculates compensation for football players based on their performance metrics using the json-rules-engine.

## Features

- Calculate player compensation based on static rules
- Support for dynamic rules stored in MongoDB
- Position-specific rules (Goalkeeper, Defender, Midfielder, Forward)
- Performance bonuses (goals, assists, clean sheets, etc.)
- Disciplinary deductions (yellow/red cards)
- RESTful API for rule management

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
   
## MongoDB Setup (Optional)

To enable dynamic rule storage and retrieval, set up a MongoDB database and uncomment the connection code in `server.js`.

## API Endpoints

### Player Endpoints

- `POST /api/player/calculateCompensation` - Calculate compensation using static rules
- `POST /api/player/calculateDynamicCompensation` - Calculate compensation using both static and dynamic rules
- `GET /api/player` - Get all players (requires MongoDB)
- `GET /api/player/:id` - Get player by ID (requires MongoDB)
- `POST /api/player` - Create new player (requires MongoDB)

### Rule Endpoints

- `GET /api/rule` - Get all rules
- `GET /api/rule/:id` - Get rule by ID
- `POST /api/rule` - Create new rule
- `PUT /api/rule/:id` - Update rule
- `DELETE /api/rule/:id` - Delete rule

## Rule Examples

### Static Rules

The application includes the following static rules:

1. **Universal Rules**:
   - Goal Bonus: +100 EUR per goal
   - Assist Bonus: +50 EUR per assist
   - Playing Time Bonus: +0.5 EUR per minute played

2. **Goalkeeper Rules**:
   - Clean Sheet Bonus: +150 EUR per clean sheet
   - Save Bonus: +10 EUR per save
   - Penalty Save Bonus: +200 EUR per penalty saved

3. **Defender Rules**:
   - Clean Sheet Bonus: +100 EUR per clean sheet
   - Tackle Bonus: +20 EUR per tackle

4. **Midfielder Rules**:
   - Tackle Bonus: +15 EUR per tackle
   - Passing Accuracy Bonus: +2 EUR per percentage point of passing accuracy

5. **Forward Rules**:
   - Penalty Scored Bonus: +75 EUR per penalty scored

6. **Disciplinary Rules**:
   - Yellow Card Penalty: -50 EUR per yellow card
   - Red Card Penalty: -200 EUR per red card

### Dynamic Rule Example

```json
{
  "name": "Hat-trick Bonus",
  "description": "Bonus for forwards scoring hat-tricks",
  "position": "FORWARD",
  "conditions": {
    "all": [
      {
        "fact": "goalsScored",
        "operator": "greaterThanInclusive",
        "value": 3
      },
      {
        "fact": "matchesPlayed",
        "operator": "greaterThan",
        "value": 0
      }
    ]
  },
  "event": {
    "type": "hatTrickBonus",
    "result": {
      "bonusAmount": 300
    }
  },
  "priority": 5
}
```

## Sample Request

```json
{
  "name": "Manuel Neuer",
  "position": "GOALKEEPER",
  "club": "Bayern Munich",
  "baseCompensation": 10000,
  "goalsScored": 0,
  "assists": 1,
  "cleanSheets": 10,
  "saves": 50,
  "tackles": 0,
  "passingAccuracy": 75,
  "minutesPlayed": 1800,
  "yellowCards": 1,
  "redCards": 0,
  "matchesPlayed": 20,
  "penaltiesSaved": 2,
  "penaltiesScored": 0
}
```

## Sample Response

```json
{
  "name": "Manuel Neuer",
  "position": "GOALKEEPER",
  "club": "Bayern Munich",
  "baseCompensation": 10000,
  "goalsScored": 0,
  "assists": 1,
  "cleanSheets": 10,
  "saves": 50,
  "tackles": 0,
  "passingAccuracy": 75,
  "minutesPlayed": 1800,
  "yellowCards": 1,
  "redCards": 0,
  "matchesPlayed": 20,
  "penaltiesSaved": 2,
  "penaltiesScored": 0,
  "bonusAmount": 3400,
  "fineAmount": 50,
  "totalCompensation": 13350,
  "rules": {
    "appliedRules": [
      "assistBonus",
      "playingTimeBonus",
      "goalkeeperCleanSheetBonus",
      "goalkeeperSaveBonus",
      "goalkeeperPenaltySaveBonus",
      "yellowCardPenalty"
    ],
    "failedRules": []
  }
}
```

## License

This project is licensed under the MIT License.
