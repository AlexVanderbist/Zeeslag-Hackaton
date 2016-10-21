# Zeeslag-Hackaton

## API Endpoints

### GSM front-end

#### Nieuw spel starten

- GET /game
  returned HTTP 200 `{status: (int, 0 none, 1 started)}`

- POST /game `{ players: (int) }`

  returned: HTTP 200 `{ grid: (int) }` 
  
  returned: HTTP 400 `{ error: (string, bv game_already_started), message: (string error msg)}`
  
#### Speler toevoegen

- POST /game/player `{ x: (int), y: (int), direction: (int, 1 oost of 2 zuid), photo: (file) }`

  returned: HTTP 200 als speler toegevoegd is
  
  returned: HTTP 400 `{ error: (string, bv invalid_position), message: (string error msg)}`
  
