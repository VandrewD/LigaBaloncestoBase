'use strict';

angular.module('ligabaloncestoApp').controller('EquipoDialogController',
    ['$scope', '$stateParams', '$modalInstance', '$q', 'entity', 'Equipo', 'Jugador', 'Entrenador',
        function($scope, $stateParams, $modalInstance, $q, entity, Equipo, Jugador, Entrenador) {

        $scope.equipo = entity;
        $scope.jugadors = Jugador.query();
        $scope.entrenadors = Entrenador.query({filter: 'equipo-is-null'});
        $q.all([$scope.equipo.$promise, $scope.entrenadors.$promise]).then(function() {
            if (!$scope.equipo.entrenador.id) {
                return $q.reject();
            }
            return Entrenador.get({id : $scope.equipo.entrenador.id}).$promise;
        }).then(function(entrenador) {
            $scope.entrenadors.push(entrenador);
        });
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
