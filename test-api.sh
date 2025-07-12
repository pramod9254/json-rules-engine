#!/bin/bash

echo "Testing Football Player Compensation API endpoints"

# Check if json_pp is available, otherwise use cat
JSON_FORMATTER="cat"
if command -v json_pp &> /dev/null; then
    JSON_FORMATTER="json_pp"
elif command -v jq &> /dev/null; then
    JSON_FORMATTER="jq '.'"
fi

echo "Using JSON formatter: $JSON_FORMATTER"

# Check if server is running
if ! curl -s http://localhost:3000 > /dev/null; then
  echo "Error: Server is not running. Please start the server with 'npm start' first."
  exit 1
fi

# Test goalkeeper with clean sheets and saves
echo -e "\n\nTesting goalkeeper compensation:"
curl -s -X POST -H "Content-Type: application/json" -d '{
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
}' http://localhost:3000/api/player/calculateCompensation | $JSON_FORMATTER

# Test defender with goals and clean sheets
echo -e "\n\nTesting defender compensation:"
curl -s -X POST -H "Content-Type: application/json" -d '{
  "name": "Virgil van Dijk",
  "position": "DEFENDER",
  "club": "Liverpool",
  "baseCompensation": 10000,
  "goalsScored": 3,
  "assists": 2,
  "cleanSheets": 8,
  "saves": 0,
  "tackles": 110,
  "passingAccuracy": 88,
  "minutesPlayed": 1750,
  "yellowCards": 3,
  "redCards": 0,
  "matchesPlayed": 20,
  "penaltiesSaved": 0,
  "penaltiesScored": 1
}' http://localhost:3000/api/player/calculateCompensation | $JSON_FORMATTER

# Test midfielder with goals and assists
echo -e "\n\nTesting midfielder compensation:"
curl -s -X POST -H "Content-Type: application/json" -d '{
  "name": "Kevin De Bruyne",
  "position": "MIDFIELDER",
  "club": "Manchester City",
  "baseCompensation": 10000,
  "goalsScored": 8,
  "assists": 15,
  "cleanSheets": 0,
  "saves": 0,
  "tackles": 45,
  "passingAccuracy": 92,
  "minutesPlayed": 1650,
  "yellowCards": 2,
  "redCards": 0,
  "matchesPlayed": 19,
  "penaltiesSaved": 0,
  "penaltiesScored": 3
}' http://localhost:3000/api/player/calculateCompensation | $JSON_FORMATTER

# Test forward with many goals
echo -e "\n\nTesting forward compensation:"
curl -s -X POST -H "Content-Type: application/json" -d '{
  "name": "Erling Haaland",
  "position": "FORWARD",
  "club": "Manchester City",
  "baseCompensation": 10000,
  "goalsScored": 25,
  "assists": 5,
  "cleanSheets": 0,
  "saves": 0,
  "tackles": 10,
  "passingAccuracy": 65,
  "minutesPlayed": 1700,
  "yellowCards": 4,
  "redCards": 1,
  "matchesPlayed": 20,
  "penaltiesSaved": 0,
  "penaltiesScored": 5
}' http://localhost:3000/api/player/calculateCompensation | $JSON_FORMATTER

# Create a custom rule
echo -e "\n\nCreating a custom rule for a hat-trick bonus:"
curl -s -X POST -H "Content-Type: application/json" -d '{
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
  "priority": 5,
  "isActive": true
}' http://localhost:3000/api/rule | $JSON_FORMATTER

# Test dynamic rule
echo -e "\n\nTesting dynamic rule application:"
curl -s -X POST -H "Content-Type: application/json" -d '{
  "name": "Erling Haaland",
  "position": "FORWARD",
  "club": "Manchester City",
  "baseCompensation": 10000,
  "goalsScored": 25,
  "assists": 5,
  "cleanSheets": 0,
  "saves": 0,
  "tackles": 10,
  "passingAccuracy": 65,
  "minutesPlayed": 1700,
  "yellowCards": 4,
  "redCards": 1,
  "matchesPlayed": 20,
  "penaltiesSaved": 0,
  "penaltiesScored": 5
}' http://localhost:3000/api/player/calculateDynamicCompensation | $JSON_FORMATTER

echo -e "\n\nDone testing player compensation rules"
