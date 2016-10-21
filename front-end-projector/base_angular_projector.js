angular.module("myapp", [])

    .controller("GrideController", function($scope) {
        var gride ={
            length:10,
            height:10
        }
        $scope.gride = gride;

        $scope.range = function(min, max, step) {
            step = step || 1;
            var input = [];
            for (var i = min; i <= max; i += step) {
                input.push(i);
            }
            return input;
        };
    });