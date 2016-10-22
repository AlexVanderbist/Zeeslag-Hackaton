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
        console.log(app.game.players);
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
        app.game.players.forEach(function(player) {
            if(player.ip == ip) return player;
        },this);

        return false;
    }

    // starts game
    var startGame = function () {
        app.actions = [];
        app.game.currentPlayer = 1;
    }

    app.post("/api/reset", function(req,res) {
        // reset everything lol
        app.game.status = 0;
        app.game.players = [];
        app.grid = app.emptyGrid;
        app.game.actions = [];
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

        console.log(ip);

        var player = {
            playerId: getFreePlayerId(),
            boats: req.body.boats,
            photo: 'nope.jpg',
            ip: ip
        }

        app.game.players.push(player);

        if(app.game.players.length == app.game.maxPlayers) {
            //start game
            startGame();
        }

        return res.send(player);
    });

}
 
module.exports = appRouter;