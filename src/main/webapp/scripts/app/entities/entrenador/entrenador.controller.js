'use strict';

angular.module('ligabaloncestoApp')
    .controller('EntrenadorController', function ($scope, Entrenador, ParseLinks) {
        $scope.entrenadors = [];
        $scope.page = 1;
        $scope.loadAll = function() {
            Entrenador.query({page: $scope.page, per_page: 20}, function(result, headers) {
                $scope.links = ParseLinks.parse(headers('link'));
                $scope.entrenadors = result;
            });
        };
        $scope.loadPage = function(page) {
            $scope.page = page;
            $scope.loadAll();
        };
        $scope.loadAll();

        $scope.delete = function (id) {
            Entrenador.get({id: id}, function(result) {
                $scope.entrenador = result;
                $('#deleteEntrenadorConfirmation').modal('show');
            });
        };

        $scope.confirmDelete = function (id) {
            Entrenador.delete({id: id},
                function () {
                    $scope.loadAll();
                    $('#deleteEntrenadorConfirmation').modal('hide');
                    $scope.clear();
                });
        };

        $scope.refresh = function () {
            $scope.loadAll();
            $scope.clear();
        };

        $scope.clear = function () {
            $scope.entrenador = {nombre: null, fechaNacimiento: null, id: null};
        };
    });
