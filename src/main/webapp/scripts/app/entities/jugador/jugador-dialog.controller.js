'use strict';

angular.module('ligabaloncestoApp').controller('JugadorDialogController',
    ['$scope', '$stateParams', '$modalInstance', '$q', 'entity', 'Jugador', 'Equipo',
        function($scope, $stateParams, $modalInstance, $q, entity, Jugador, Equipo) {

        $scope.jugador = entity;
        $scope.equipos = Equipo.query();
        $scope.capitans = Equipo.query({filter: 'jugador-is-null'});
        $q.all([$scope.jugador.$promise, $scope.capitans.$promise]).then(function() {
            if (!$scope.jugador.capitan.id) {
                return $q.reject();
            }
            return Equipo.get({id : $scope.jugador.capitan.id}).$promise;
        }).then(function(capitan) {
            $scope.capitans.push(capitan);
        });
        $scope.load = function(id) {
            Jugador.get({id : id}, function(result) {
                $scope.jugador = result;
            });
        };

        var onSaveFinished = function (result) {
            $scope.$emit('ligabaloncestoApp:jugadorUpdate', result);
            $modalInstance.close(result);
        };

        $scope.save = function () {
            if ($scope.jugador.id != null) {
                Jugador.update($scope.jugador, onSaveFinished);
            } else {
                Jugador.save($scope.jugador, onSaveFinished);
            }
        };

        $scope.clear = function() {
            $modalInstance.dismiss('cancel');
        };
}]);
