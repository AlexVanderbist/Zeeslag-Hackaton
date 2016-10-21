/**
 * Created by Rowan on 21-10-2016.
 */
(function(){
    var app = angular.module("mainApp",[]);

    app.controller('MainController',['$rootScope','$scope','$http',function($rootScope,$scope,$http){

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
        }


        $scope.get


    }]);

})();