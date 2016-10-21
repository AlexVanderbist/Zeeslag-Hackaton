# Zeeslag-Hackaton

## API Endpoints

- GET /game
  returned HTTP 200 `{status: (int, 0 none, 1 created, 2 started), gridSize: (int), players: [ {id: (int), photo: (file)} ], maxPlayers: (int) }`

### GSM front-end

- GET /game/player/ based on IP 

  returned: HTTP 200 `{boats: [ {x: (int), y: (int), length: (int), direction: (int, 1 east, 2 south)}, {}, {} ]}`
  
  returned: HTTP 400 dan is het geen speler in dit spel `{error:(string, not_a_player), message: (string)}`

#### Nieuw spel starten

- POST /game `{ maxPlayers: (int) }`

  returned: HTTP 200 `{ gridSize: (int) }` 
  
  returned: HTTP 400 `{ error: (string, bv game_already_started), message: (string error msg)}`
  
#### Speler toevoegen

- POST /game/player `{ boats: [ {x: (int), y: (int), length: (int), direction: (int, 1 east, 2 south)}, {}, {} ], photo: (file) }`

  returned: HTTP 200 als speler toegevoegd is `{ playerId: (int) }`
  
  returned: HTTP 400 `{ error: (string, bv max_players_reached), message: (string error msg)}`
  
### Beamer front-end
  
- GET /game/grid

  returned: HTTP 200 
  
  ```
  { rows: [ 
    { columns: [ 
      { status: (int, 0=none, 1=hit), players: [] },
      { ... }] 
    }, 
    { ... }
  ] }
  ```
