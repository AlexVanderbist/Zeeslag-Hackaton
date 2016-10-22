angular.module("myapp", [])

    .controller("GrideController", function ($scope, $http) {
        var gride = {
            length: 10,
            height: 10,
            players:{
            }
        }
        $scope.gride = gride;
        $scope.users = {
            user_photo: "foto.jpg"
        };


        $scope.range = function (min, max, step) {
            step = step || 1;
            var input = [];
            for (var i = min; i <= max; i += step) {
                input.push(i);
            }
            return input;
        };


        setTimeout(function(){
            setInterval(function () {

                var http=  $http({
                    method: "GET",
                    dataType: 'json',
                    url: "http://192.168.47.204:3000/api/game/grid"
                }).then(function mySucces(response) {

                    for(var i =0; i < response.data.length; i++){
                        if(!($("."+response.data[i].x + +response.data[i].y).hasClass("status_"+response.data[i].status)) ){
                            $("."+response.data[i].x + +response.data[i].y).addClass("status_"+ response.data[i].status );
                            if(response.data[i].status == 2){
                                for(var j =0; j < response.data[i].players.length; j++){
                                    $("."+response.data[i].x + +response.data[i].y).append("<img class='img' src='http://192.168.47.204:3000/"+response.data[i].players[j].photo +"'>");
                                }
                            }
                            if(response.data[i].status == 1) {
                                $("."+response.data[i].x + +response.data[i].y).append("<img class='img greyimg' src='nope.jpg'>");
                            }
                        }
                    }
                    console.log(response.data)
                    //$scope.data_gride = response.data;
                }, function myError(response) {
                    $scope.data_gride = 0;
                });


                var http=  $http({
                    method: "GET",
                    dataType: 'json',
                    url: "http://192.168.47.204:3000/api/game/actions"
                }).then(function mySucces(actions) {
                    $scope.actions = actions.data;
                    console.log("actions",actions);


                    var objDiv = document.getElementById("box");
                    objDiv.scrollTop = objDiv.scrollHeight;

                }, function myError(response) {
                    $scope.data_gride = 0;
                });

            }, 1000);
        }, 10000);


        setInterval(function () {

            var http=  $http({
                method: "GET",
                dataType: 'json',
                url: "http://192.168.47.204:3000/api/game/actions"
            }).then(function mySucces(actions) {
                $scope.actions = actions.data;
                console.log("actions",actions);
            }, function myError(response) {
                $scope.data_gride = 0;
            });

        }, 1000);

        $scope.actions;
        setInterval(function () {

            $http({
                method: "GET",
                dataType: 'json',
                url: "http://192.168.47.204:3000/api/game"
            }).then(function mySucces(response) {
                console.log(response.data);
                if(response.data.status){
                    gride.length =response.data.gridSize;
                    gride.height =response.data.gridSize;
                    gride.players = response.data.players;
                    $scope.action = "Wait for players";




                }
            }, function myError(response) {
                $scope.data_gride = 0;
            });
        }, 5000);


        var concatanait;

        $scope.init_variabel =function (x,y) {
            console.log(x,y);
            concatanait = x.toString()+y.toString();
            $scope[concatanait]=concatanait;
            return $scope[concatanait];
        }

        $scope.chek_for_hit = function (y, x) {
            if ($scope.data_gride) {
                for (var i = 0; i < $scope.data_gride.length; i++) {
                    if(x == $scope.data_gride[i].x && y ==$scope.data_gride[i].y ){
                        return "proses_" + $scope.data_gride[i].status;
                    }
                }
            }
        }






        // the last received msg
        // $scope.msg = {};
        //
        // // handles the callback from the received event
        // var handleCallback = function (msg) {
        //     $scope.$apply(function () {
        //         $scope.msg = JSON.parse(msg.data)
        //     });
        // }
        // var source = new EventSource('/stats');
        // source.addEventListener('message', handleCallback, false);


    });