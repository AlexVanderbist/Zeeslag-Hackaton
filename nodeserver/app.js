var express = require("express");
var bodyParser = require("body-parser");
var app = express();

var conditionalCSRF = function (req, res, next) {
    next();
}

app.use(conditionalCSRF);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var gridSize = 8;
app.emptyGrid = [];
for(var y=0; y<gridSize;y++) {
    for(var x=0; x<gridSize;x++) {
        var square = { 
            x: x+1,
            y: y+1,
          status: Math.floor(Math.random() * 3), 
          players: [
              {playerId:1, photo: 'nope.jpg'}
          ] 
        };
        app.emptyGrid.push(square);
    }
}
app.grid = app.emptyGrid;

app.game = {
  status: 0, 
  gridSize: 0, 
  players: [ ], 
  maxPlayers: 0,
  currentPlayer: 0
}

app.actions = [];
 
var routes = require("./routes/routes.js")(app);
 
var server = app.listen(3000, function () {
    console.log("Listening on port %s...", server.address().port);
});