'use strict';

angular.module('ma-app', ['ui.router', 'ngDialog'])
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            
            .state('app', {
                url:'/',
                views: {
                    'header': {
                        templateUrl : 'views/header.html',
                        controller  : 'HeaderController'
                    },
                    'content@': {
                        templateUrl: 'views/main.html',
                        controller  : 'HomeController'
                    }
                }
            })
            
            .state('app.home', {
                url:'home',
                views: {
                    'content@': {
                        templateUrl: 'views/home.html',
                        controller  : 'HomeController'
                    }
                }
            })
        
            .state('app.blogs', {
                url:'blog',
                views: {
                    'content@': {
                        templateUrl: 'views/blogs.html',
                        controller  : 'BlogController'
                    }
                }
            })
        
            .state('app.forums', {
                url:'forum',
                views: {
                    'content@': {
                        templateUrl: 'views/forums.html',
                        controller  : 'ForumController'
                    }
                }
            });
            $urlRouterProvider.otherwise('/');     
            
})
.config(['$sceDelegateProvider', function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        'https://www.google.com/**'
    ]);
}]);