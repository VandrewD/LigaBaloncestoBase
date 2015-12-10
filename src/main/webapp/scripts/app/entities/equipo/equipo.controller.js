'use strict';

angular.module('ligabaloncestoApp')
    .controller('EquipoController', function ($scope, Equipo, ParseLinks) {
        $scope.equipos = [];
        $scope.page = 1;
        $scope.loadAll = function() {
            Equipo.query({page: $scope.page, per_page: 20}, function(result, headers) {
                $scope.links = ParseLinks.parse(headers('link'));
                $scope.equipos = result;
            });
        };
        $scope.loadPage = function(page) {
            $scope.page = page;
            $scope.loadAll();
        };
        $scope.loadAll();

        $scope.delete = function (id) {
            Equipo.get({id: id}, function(result) {
                $scope.equipo = result;
                $('#deleteEquipoConfirmation').modal('show');
            });
        };

        $scope.confirmDelete = function (id) {
            Equipo.delete({id: id},
                function () {
                    $scope.loadAll();
                    $('#deleteEquipoConfirmation').modal('hide');
                    $scope.clear();
                });
        };

        $scope.refresh = function () {
            $scope.loadAll();
            $scope.clear();
        };

        $scope.clear = function () {
            $scope.equipo = {nombre: null, fechaCreacion: null, localidad: null, id: null};
        };
    });
