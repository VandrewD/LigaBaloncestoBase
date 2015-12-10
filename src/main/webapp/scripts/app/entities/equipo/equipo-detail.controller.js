'use strict';

angular.module('ligabaloncestoApp')
    .controller('EquipoDetailController', function ($scope, $rootScope, $stateParams, entity, Equipo, Jugador) {
        $scope.equipo = entity;
        $scope.load = function (id) {
            Equipo.get({id: id}, function(result) {
                $scope.equipo = result;
            });
        };
        $rootScope.$on('ligabaloncestoApp:equipoUpdate', function(event, result) {
            $scope.equipo = result;
        });
    });
