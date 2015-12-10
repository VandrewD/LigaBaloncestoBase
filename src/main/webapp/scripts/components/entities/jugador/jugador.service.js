'use strict';

angular.module('ligabaloncestoApp')
    .factory('Jugador', function ($resource, DateUtils) {
        return $resource('api/jugadors/:id', {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    data.fechaNacimiento = DateUtils.convertLocaleDateFromServer(data.fechaNacimiento);
                    return data;
                }
            },
            'update': {
                method: 'PUT',
                transformRequest: function (data) {
                    data.fechaNacimiento = DateUtils.convertLocaleDateToServer(data.fechaNacimiento);
                    return angular.toJson(data);
                }
            },
            'save': {
                method: 'POST',
                transformRequest: function (data) {
                    data.fechaNacimiento = DateUtils.convertLocaleDateToServer(data.fechaNacimiento);
                    return angular.toJson(data);
                }
            }
        });
    });
