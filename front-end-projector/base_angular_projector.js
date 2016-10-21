angular.module("myapp", [])

    .controller("GrideController", function ($scope) {
        var gride = {
            length: 10,
            height: 10
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