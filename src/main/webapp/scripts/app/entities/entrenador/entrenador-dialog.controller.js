'use strict';

angular.module('ligabaloncestoApp').controller('EntrenadorDialogController',
    ['$scope', '$stateParams', '$modalInstance', 'entity', 'Entrenador', 'Equipo',
        function($scope, $stateParams, $modalInstance, entity, Entrenador, Equipo) {

        $scope.entrenador = entity;
        $scope.equipos = Equipo.query();
        $scope.load = function(id) {
            Entrenador.get({id : id}, function(result) {
                $scope.entrenador = result;
            });
        };

        var onSaveFinished = function (result) {
            $scope.$emit('ligabaloncestoApp:entrenadorUpdate', result);
            $modalInstance.close(result);
        };

        $scope.save = function () {
            if ($scope.entrenador.id != null) {
                Entrenador.update($scope.entrenador, onSaveFinished);
            } else {
                Entrenador.save($scope.entrenador, onSaveFinished);
            }
        };

        $scope.clear = function() {
            $modalInstance.dismiss('cancel');
        };
}]);
