'use strict';

angular.module('ligabaloncestoApp').controller('EquipoDialogController',
    ['$scope', '$stateParams', '$modalInstance', 'entity', 'Equipo', 'Jugador',
        function($scope, $stateParams, $modalInstance, entity, Equipo, Jugador) {

        $scope.equipo = entity;
        $scope.jugadors = Jugador.query();
        $scope.load = function(id) {
            Equipo.get({id : id}, function(result) {
                $scope.equipo = result;
            });
        };

        var onSaveFinished = function (result) {
            $scope.$emit('ligabaloncestoApp:equipoUpdate', result);
            $modalInstance.close(result);
        };

        $scope.save = function () {
            if ($scope.equipo.id != null) {
                Equipo.update($scope.equipo, onSaveFinished);
            } else {
                Equipo.save($scope.equipo, onSaveFinished);
            }
        };

        $scope.clear = function() {
            $modalInstance.dismiss('cancel');
        };
}]);
