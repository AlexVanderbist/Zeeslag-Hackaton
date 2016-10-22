var appRouter = function(app) {

    
    var isValidBoat = function(boat, app) {
        if(boat.x < 1 || boat.y < 1) return false;

        if(boat.direction == 'east') {
            if(parseInt(boat.x) + parseInt(boat.length) -1 > app.game.gridSize) {
                return false;
            }
            if(parseInt(boat.y) > app.game.gridSize) {
                return false;
            }
        }

        if(boat.direction == 'south') {
            if(parseInt(boat.y) + parseInt(boat.length) -1 > app.game.gridSize) {
                return false;
            }
            if(parseInt(boat.x) > app.game.gridSize) {
                return false
            };
        }

        return true;
    }

    // returns an available player id
    var getFreePlayerId = function () {
        for(var i=0; i<app.game.maxPlayers; i++) {
            var playerId = i+1;
            var playerExists = false;
            app.game.players.forEach(function(player) {
                if(player.playerId == playerId) {
                    playerExists = true;
                }
            }, this);
            if(playerExists == false) return playerId;
        }

    }

    var findUserWithIp = function(ip) {
        var playerWithIp = false;
        app.game.players.forEach(function(player) {
            if(String(player.ip) == String(ip)) {
                playerWithIp = player;
            }
        },this);

        return playerWithIp;
    }

    // starts game
    var startGame = function () {
        console.log('game started');
        app.game.currentPlayer = 1;
        app.game.status = 2;
        addAction('game_started', 1);
    }

    app.post("/api/reset", function(req,res) {
        // reset everything lol
        app.game.status = 0;
        app.game.players = [];
        app.grid = app.emptyGrid;
        app.actions = [];
        res.send('Reset!');
    });

    app.get("/api/game/grid", function(req, res) {
        return res.send(app.grid);
    });

    app.get("/api/game",function(req,res) {
        return res.send(app.game);
    });

    app.post("/api/game", function (req, res) {

        if(isNaN(req.body.maxPlayers)) return res.status(400).json({error:'invalid_parameter', message:'Max players should be a number'});

        if(app.game.status > 0) return res.status(400).json({error:'game_already_running', message: 'A game is already running'});

        app.game.maxPlayers = req.body.maxPlayers;
        app.game.gridSize = 8;
        app.game.status = 1;

        return res.send(app.game);
    });

    app.get("/api/game/player", function (req, res) {
        var ip = req.headers['x-forwarded-for'] || 
            req.connection.remoteAddress || 
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        var player = findUserWithIp(ip);

        if(player) return res.send(player);

        return res.json({});

    });

    var validCoordinates = function (coords) {
        if(coords.x <= 0 || coords.y <= 0) return false;

        if(coords.x > app.game.gridSize || coords.y > app.game.gridSize) return false;

        return true;
    }

    var getCoordsForBoats = function(boats) {
        var coords = [];
        boats.forEach(function(boat){
            for(var i=0; i<boat.length; i++) {
                if(boat.direction == 'east') coords.push({x: (boat.x + i), y: boat.y});
                if(boat.direction == 'south') coords.push({x: boat.x, y: (boat.y + i)});
            }
        },this);

        return coords;
    }

    function containsCoords(coords, list) {
        for (var i = 0; i < list.length; i++) {
            if (parseInt(list[i].x) == parseInt(coords.x) && parseInt(list[i].y) == parseInt(coords.y)) {
                return true;
            }
        }

        return false;
    }

    function findPlayer(id) {
        
        var target = false;
        app.game.players.forEach(function(player) {
            if(String(player.playerId) == String(id)) {
                target = player;
            }
        },this);

        return target;
    }


    function addAction(name, fromId, toId) {
        var action = {
            name: name,
            from: findPlayer(fromId),
            to: findPlayer(toId)
        };
        app.actions.push(action);
        console.log(name);
    }

    app.get("/api/game/actions", function(req,res) {
        return res.send(app.actions);
    });



    app.post("/api/game/fire", function(req, res){
        if( ! req.body) return res.status(400).json({error:'invalid_parameter', message:'Body should be JSON'});

        if(app.game.status != 2) return res.status(400).json({error:'game_not_started', message:'The game is not yet started.'}); 

        var coords = {x: req.body.x, y: req.body.y};

        if( ! validCoordinates(coords)) return res.status(400).json({error:'invalid_coords', message:'Coordinates are invalid'});

        var status = 1;
        var hitUsers = [];
    
        // get grid square index
        var index = app.grid.findIndex(square => square.x==coords.x && square.y==coords.y);


        // go over all users 
        app.game.players.forEach(function(player, playerIndex){

            // loop over boats
            app.game.players[playerIndex].boats.forEach(function(boat, boatIndex){
                var boatCoords = getCoordsForBoats([boat]);

                // check for a hit
                if(containsCoords(coords, boatCoords)) {
                    console.log('we have a hit on ', coords, boat.x, boat.y);
                    // HIT! :D
                    status = 2;
                    app.game.players[playerIndex].boats[boatIndex].hits++;
                    
                    //checkBoatHits(boat);
                    if(boat.hits == boat.length) {
                        // ship down!
                        addAction('ship_sunk', app.game.players[playerIndex].playerId, app.game.currentPlayer);

                        // check other boats
                        // TODO
                    }
                }

            }, this);

            if(status == 2) {
                hitUsers.push(player);
                addAction('ship_hit', player.playerId, app.game.currentPlayer);
            }

            
        },this);


        app.grid[index].status = status; // hit
        app.grid[index].players = hitUsers;


        nextPlayer();


        return res.send();

    });
    
    function nextPlayer() {
        if(app.game.currentPlayer == app.game.maxPlayers) {
            app.game.currentPlayer = 1;
        } else {
            app.game.currentPlayer++;
        }

        addAction('next_player', app.game.currentPlayer);
    }

    app.post("/api/game/player", function(req, res) {
        //  boats: [ {x: (int), y: (int), length: (int), direction: (int, 1 east, 2 south)}, {}, {} ], photo: (file) }

        if(! req.body) return res.status(400).json({error:'invalid_parameter', message:'Body should be JSON'});
        if(! req.body.boats || req.body.boats.length != 3) return res.status(400).json({error:'invalid_boats', message:'Body should contain 3 boats'});

        req.body.boats.forEach(function(boat) {
            if(! isValidBoat(boat, app)) return res.status(400).json({error:'invalid_boat', message:'Boat falls of grid'});
        }, this);

        if(app.game.players.length >= app.game.maxPlayers)return res.status(400).json({error:'max_players', message:'Max players reached'});

        var ip = req.headers['x-forwarded-for'] || 
            req.connection.remoteAddress || 
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;


        if(findUserWithIp(ip)) return res.status(400).json({error:'player_exists', message:'A player with this IP exists.'});

        var player = {
            playerId: getFreePlayerId(),
            boats: req.body.boats,
            photo: 'nope.jpg',
            ip: ip
        }

        // add hits = 0 to all boats
        player.boats.forEach(function(boat){
            boat.hits = 0;
        },this);

        app.game.players.push(player);

        addAction('player_joined', player.playerId, null);

        
            console.log('test', app.game.players.length, app.game.maxPlayers);
        if(app.game.players.length == app.game.maxPlayers) {
            //start game
            console.log('test');
            startGame();
        }

        return res.send(player);
    });

}
 
module.exports = appRouter;