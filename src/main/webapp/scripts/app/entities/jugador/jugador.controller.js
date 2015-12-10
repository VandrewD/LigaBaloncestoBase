'use strict';

angular.module('ligabaloncestoApp')
    .controller('JugadorController', function ($scope, Jugador, ParseLinks) {
        $scope.jugadors = [];
        $scope.page = 1;
        $scope.loadAll = function() {
            Jugador.query({page: $scope.page, per_page: 20}, function(result, headers) {
                $scope.links = ParseLinks.parse(headers('link'));
                $scope.jugadors = result;
            });
        };
        $scope.loadPage = function(page) {
            $scope.page = page;
            $scope.loadAll();
        };
        $scope.loadAll();

        $scope.delete = function (id) {
            Jugador.get({id: id}, function(result) {
                $scope.jugador = result;
                $('#deleteJugadorConfirmation').modal('show');
            });
        };

        $scope.confirmDelete = function (id) {
            Jugador.delete({id: id},
                function () {
                    $scope.loadAll();
                    $('#deleteJugadorConfirmation').modal('hide');
                    $scope.clear();
                });
        };

        $scope.refresh = function () {
            $scope.loadAll();
            $scope.clear();
        };

        $scope.clear = function () {
            $scope.jugador = {nombre: null, fechaNacimiento: null, canastasTotales: null, asistenciasTotales: null, rebotesTotales: null, posicion: null, id: null};
        };
    });
