/**
 * Created by Rowan on 21-10-2016.
 */
(function(){
    var app = angular.module("mainApp",[]);

    app.controller('MainController',['$rootScope','$scope','$http',function($rootScope,$scope,$http){
        $scope.length = 2;
        $scope.direction = "east";


        $scope.gameStatus = 0;

        $scope.initWebsite = function(){
            $http({
                method: 'GET',
                url: '/game'
            }).then(function successCallback(response) {
                $scope.gameStatus = response['status'];
                if(response['status'] == 2){
                    window.location = "./gridGame.html"
                }

            }, function errorCallback(response) {

            });
        };

        //word /game
      //  $scope.maxPlayers = 8;
        $scope.startNewGame = function(maxPlayers){

       // console.log(maxPlayers);
            $http.post('/game',{
                maxPlayers: maxPlayers
            }).success(function(data){

                var array = [];

                $scope.gridSize = data["gridSize"];

                for( var i = 1; i <= $scope.gridSize; i++){
                    array.push(i);
                }
                $scope.gridArray = array ;
                //console.log( $scope.gridArray);
                $scope.gameStatus = 1;
            });
        };

        var boat2IsSet = false;
        var boat3isSet = false;
        var boat5isSet = false;
        var boatsFullArray = [];
        var newBoatArray = [];
        var newBoatOk = true;

        var currentBoat = {};
        var allBoats = [];




        $scope.set_boat = function(x,y,direction,lengthboat){
            var currentx =x;
            var currenty =y;
            var boatx = [];
            var boaty = [];




            var preloop  = function(){
                for(var i = 0; i < lengthboat ; i++){

                    if(direction == "east"){
                        var stylex = currentx.toString();
                        var styley = y;
                        var styletot = stylex.concat(styley.toString());
                        currentx++;

                        newBoatArray.push(styletot);
                    }else if(direction == "south"){
                        var styley = currenty.toString();
                        var stylex = x.toString();
                        var styletot = stylex.concat(styley.toString());
                        currenty++;
                        newBoatArray.push(styletot);
                    }
                }
                currentx =x;
                currenty =y;
                console.log("newboatarray= " + newBoatArray);
            };

            //console.log(boatsFullArray);

            var loop = function(){

                console.log(newBoatArray.length);
                for(var i = 0; i < newBoatArray.length; i++) {
                    //
                    if(boatsFullArray.indexOf(newBoatArray[i]) != -1){
                        //
                       // console.log(newBoatArray[i] + " bestaat al!!");
                        newBoatOk = false;
                        break;
                    }
                    else {
                        //console.log(newBoatArray[i] + " bestaat nog niet...");
                        //boatsFullArray.push(newBoatArray[i]);
                        //$('.' + newBoatArray[i]).addClass("boat");
                    }
                }
                console.log("newbOK " + newBoatOk);
                if(newBoatOk) {
                   // console.log("boot mag toegvoegd worden");
                    for(var i = 0; i < newBoatArray.length; i++) {
                        boatsFullArray.push(newBoatArray[i]);
                        $('.' + newBoatArray[i]).addClass("boat");
                    }

                         currentBoat = {
                            x: x,
                             y: y,
                             direction: direction,
                             length: lengthboat
                        };

                    allBoats.push(currentBoat);


                }

                newBoatArray = [];
                
            };
            
            if(!boat2IsSet){
                if(lengthboat == 2){
                    preloop();
                    loop();
                    if(newBoatOk) {
                        boat2IsSet = true;
                    }
                    newBoatOk = true;
                }
            }
            if(!boat3isSet){
                if(lengthboat == 3) {
                    preloop();
                    loop();
                    if(newBoatOk) {
                        boat3isSet = true;
                    }
                    newBoatOk = true;
                }
            }
            if(!boat5isSet){
                console.log("lukt dit???");
                if(lengthboat == 5) {
                    preloop();
                    loop();
                    if(newBoatOk) {
                        boat5isSet = true;
                    }
                    newBoatOk = true;
                }
            }
            if(boat2IsSet && boat3isSet && boat5isSet){
                console.log(allBoatsSec[0]);
            }




           // console.log(boatx + boaty);
           // console.log(y);
           // console.log(y);
           // console.log("x" + x + " y" + y );
        };

        $scope.post_boats = function(){
            if(boat2IsSet && boat3isSet && boat5isSet){
               // console.log(allBoats);
            completeList = [{boats: allBoats}];
            $http.post('/game/player',{
              boats: allBoats
            }).success(function(data){

                 $scope.playerId = data['playerId'];

            });
            }
        }


    }]);

})();