'use strict';

angular.module('ligabaloncestoApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('entrenador', {
                parent: 'entity',
                url: '/entrenadors',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: 'ligabaloncestoApp.entrenador.home.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/entrenador/entrenadors.html',
                        controller: 'EntrenadorController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('entrenador');
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }]
                }
            })
            .state('entrenador.detail', {
                parent: 'entity',
                url: '/entrenador/{id}',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: 'ligabaloncestoApp.entrenador.detail.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/entrenador/entrenador-detail.html',
                        controller: 'EntrenadorDetailController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('entrenador');
                        return $translate.refresh();
                    }],
                    entity: ['$stateParams', 'Entrenador', function($stateParams, Entrenador) {
                        return Entrenador.get({id : $stateParams.id});
                    }]
                }
            })
            .state('entrenador.new', {
                parent: 'entrenador',
                url: '/new',
                data: {
                    roles: ['ROLE_USER'],
                },
                onEnter: ['$stateParams', '$state', '$modal', function($stateParams, $state, $modal) {
                    $modal.open({
                        templateUrl: 'scripts/app/entities/entrenador/entrenador-dialog.html',
                        controller: 'EntrenadorDialogController',
                        size: 'lg',
                        resolve: {
                            entity: function () {
                                return {nombre: null, fechaNacimiento: null, id: null};
                            }
                        }
                    }).result.then(function(result) {
                        $state.go('entrenador', null, { reload: true });
                    }, function() {
                        $state.go('entrenador');
                    })
                }]
            })
            .state('entrenador.edit', {
                parent: 'entrenador',
                url: '/{id}/edit',
                data: {
                    roles: ['ROLE_USER'],
                },
                onEnter: ['$stateParams', '$state', '$modal', function($stateParams, $state, $modal) {
                    $modal.open({
                        templateUrl: 'scripts/app/entities/entrenador/entrenador-dialog.html',
                        controller: 'EntrenadorDialogController',
                        size: 'lg',
                        resolve: {
                            entity: ['Entrenador', function(Entrenador) {
                                return Entrenador.get({id : $stateParams.id});
                            }]
                        }
                    }).result.then(function(result) {
                        $state.go('entrenador', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    })
                }]
            });
    });
