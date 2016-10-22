/**
 * Created by Rowan on 21-10-2016.
 */


(function(){
    var app = angular.module("mainApp",[]);

    app.controller('MainController',['$rootScope','$scope','$http',function($rootScope,$scope,$http){
        $scope.length = 2;
        $scope.direction = "east";
        $scope.waitTilStart = false;
        var server = "http://192.168.47.192:3000/api";


        function testcam(){

        }

       // $scope.gameStatus = 0;

        $scope.initWebsite = function(){
            $http({
                method: 'GET',
                url: server + '/game'
            }).then(function successCallback(response) {

                $scope.gameStatus = response.data.status;


               // $scope.gridSize = response.data["gridSize"];

                if(response['status'] == 2){

                    window.location = "./gridGame.html"
                }else{
                    refreshStatus();
                }
                $scope.gridSize = response.data["gridSize"];
                var array = [];
                for( var i = 1; i <= $scope.gridSize; i++){
                    array.push(i);
                }
                $scope.gridArray = array ;
                console.log(response);
/*                for( var i = 1; i <= $scope.gridSize; i++){
                    array.push(i);
                }
                $scope.gridArray = array ;*/

            }, function errorCallback(response) {

            });
        };
        $scope.initWebsite();
        //word /game
      //  $scope.maxPlayers = 8;
        $scope.startNewGame = function(maxPlayers){

       // console.log(maxPlayers);
            $http.post(server + '/game',{
                maxPlayers: maxPlayers
            }).success(function(data){

                var array = [];
                console.log(data['gridSize']);
                $scope.gridSize = data["gridSize"];

                for( var i = 1; i <= $scope.gridSize; i++){
                    array.push(i);
                }
                $scope.gridArray = array ;
                //console.log( $scope.gridArray);
                $scope.gameStatus = data.status;
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
                    //this part is added *******************************************
                    console.log("lengte is : " + newBoatArray.length);
                    if(newBoatArray[i].length == 2) {
                        var xPos = newBoatArray[i].substring(0,1);
                        var yPos = newBoatArray[i].substring(1);
                    }
                    else if(newBoatArray[i].length > 2) {
                        var xPos = newBoatArray[i].substring(0,2);
                        var yPos = newBoatArray[i].substring(2);
                        console.log(xPos + " en " + yPos);
                    }
                    
                    if(xPos > 8 || yPos > 8) {
                        newBoatOk = false;
                        break;
                    }
                    //this part above this is added ********************************
                    
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
               // some code
            }




           // console.log(boatx + boaty);
           // console.log(y);
           // console.log(y);
           // console.log("x" + x + " y" + y );
        };

        $scope.post_boats = function(){
            //console.log('check chekc');
            if(boat2IsSet && boat3isSet && boat5isSet){
                console.log('alle boten zijn gezet');
               // console.log(allBoats);
                completeList = [{boats: allBoats}];
                $http.post(server + '/game/player',{
                  boats: allBoats
                }).success(function(data){
                        $scope.waitTilStart = true;
                        $scope.playerId = data['playerId'];


                });
            }
        };

        $scope.reset_boats = function(){
             boat2IsSet = false;
             boat3isSet = false;
             boat5isSet = false;
             boatsFullArray = [];
            $("*").removeClass('boat');

        };
        function refreshStatus(){

            $http({
                method: 'GET',
                url: server + '/game/player'
            }).then(function successCallback(response) {
                var status = $scope.gameStatus;
                if(status != 2 && response.data.playerId){

                $scope.waitTilStart = true;
                }else{

                }
                console.log(response);
            }, function errorCallback(response) {

            });
        }


       function statusInterval(){

           setInterval(function(){

           }, 3000);
       }





    }]);

})();