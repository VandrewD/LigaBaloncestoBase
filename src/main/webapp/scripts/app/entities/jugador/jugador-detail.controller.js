'use strict';

angular.module('ligabaloncestoApp')
    .controller('JugadorDetailController', function ($scope, $rootScope, $stateParams, entity, Jugador, Equipo) {
        $scope.jugador = entity;
        $scope.load = function (id) {
            Jugador.get({id: id}, function(result) {
                $scope.jugador = result;
            });
        };
        $rootScope.$on('ligabaloncestoApp:jugadorUpdate', function(event, result) {
            $scope.jugador = result;
        });
    });
