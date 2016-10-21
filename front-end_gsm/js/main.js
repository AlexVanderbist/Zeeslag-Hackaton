/**
 * Created by Rowan on 21-10-2016.
 */
(function(){
    var app = angular.module("mainApp",[]);

    app.controller('MainController',['$rootScope','$scope','$http',function($rootScope,$scope,$http){
        $scope.length = 2;
        $scope.direction = "east";


        $scope.gameStatus = 1;

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
                $scope.gridSize = data["gridSize"];


            });
        };

        $scope.set_boat = function(x,y,direction,lengthboat){
            var currentx =x;
            var currenty =y;
            var boatx = [];
            var boaty = [];
            for(var i = 0; i < lengthboat ; i++){
                if(direction == "east"){

                    boatx.push(currentx++);
                    boaty.push(y);

                }else if(direction == "south"){
                    boatx.push(x);
                    boaty.push(currenty++);

                }
            }
           // console.log(y);
           // console.log(y);
           // console.log("x" + x + " y" + y );
        }


    }]);

})();