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
            $http.post('./test.json',{
                maxPlayers: maxPlayers
            }).success(function(data){

                var array = [];

                $scope.gridSize = data["gridSize"];

                for( var i = 1; i <= $scope.gridSize; i++){
                    array.push(i);
                }
                $scope.gridArray = array ;
                console.log( $scope.gridArray);
                $scope.gameStatus = 1;
            });
        };
        var boat2IsSet = false;
        var boat3isSet = false;
        var boat5isSet = false;
        var boatsFullArray = [];
        var newBoatArray = [];


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
            };

            console.log(boatsFullArray);

            var loop = function(){

                for(var i = 0; i < lengthboat ; i++){

                    if(direction == "east"){
                        var stylex = currentx.toString();
                        var styley = y;
                        var styletot = stylex.concat(styley.toString());

                            if(boatsFullArray.indexOf(styletot) != null){
                                console.log('index of boat =' + boatsFullArray.indexOf(styletot));
                                boatsFullArray.push(styletot);
                            $('.' + styletot).addClass("boat");
                            boatx.push(currentx++);
                            boaty.push(y);
                            }




                        console.log(styletot);

                    }else if(direction == "south"){
                        var styley = currenty.toString();
                        var stylex = x.toString();
                        var styletot = stylex.concat(styley.toString());

                            if(boatsFullArray.indexOf(styletot) != null) {
                                $('.' + styletot).addClass("boat");
                                boatx.push(x);
                                boaty.push(currenty++);
                            }

                        boatsFullArray.push(styletot);
                    }
                }
            };
            if(!boat2IsSet){
                if(lengthboat == 2){
                    preloop();
                loop();
                boat2IsSet = true
                }
            }
            if(!boat3isSet){
                if(lengthboat == 3) {
                    preloop();
                    loop();
                    boat3isSet = true;
                }
            }
            if(!boat5isSet){
                if(lengthboat == 5) {
                    preloop();
                    loop();
                    boat5isSet = true;
                }
            }



           // console.log(boatx + boaty);
           // console.log(y);
           // console.log(y);
           // console.log("x" + x + " y" + y );
        }


    }]);

})();