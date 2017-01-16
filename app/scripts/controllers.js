'use strict';

angular.module('ma-app')
    .controller('HeaderController', ['$scope', 'ngDialog', 'authService',  function($scope, ngDialog, authService) {
        $scope.openRegister = function () {
            ngDialog.open({ template: 'views/register.html', scope: $scope, className: 'ngdialog-theme-default custom-width', controller:"RegisterController" });
        };    
        
        $scope.openLogin = function () {
            ngDialog.open({ template: 'views/login.html', scope: $scope, className: 'ngdialog-theme-default', controller:"RegisterController" });
        };
        
        $scope.openLogout = function() {
            ngDialog.open({ template: 'views/logout.html', scope: $scope, className: 'ngdialog-theme-default', controller:"RegisterController" });
        }; 
        
        $scope.openJoinClub = function() {
            authService.loadClubs();
            ngDialog.open({ template: 'views/joinClub.html', scope: $scope, className: 'ngdialog-theme-default', controller:"UserController" });
        }; 
        
        $scope.openCreateClub = function() {
            ngDialog.open({ template: 'views/createClub.html', scope: $scope, className: 'ngdialog-theme-default', controller:"ClubController" });
        }; 
        
        $scope.userHasRoles = function() {
            console.log("Checking if user has any defined roles.");
            var hasRole = authService.userHasRoles();
            return hasRole;
        };
    }])

    .controller('ClubController', ['$scope', '$rootScope', 'ngDialog', '$state', 'clubService', 'authService', 'userService', function($scope, $rootScope, ngDialog, $state, clubService, authService, userService) {
        
        
        $scope.createClub = function() {
            console.log('Creating club', $scope.createClubData); 
            
            //TODO: 
            // 1. make call to create club.
            // 2. add current user as club member with current club.
            // 3. add current user to CLUB_ADMIN role.
                                   
            clubService.createClub($scope.createClubData)
                .then(function(clubResponse) {
                    console.log("Created a club with value: ");
                    console.log(clubResponse);
                    authService.setCurrentUserStale();
                    clubService.currentClub = clubResponse.data;
                    clubService.joinClub(authService.getCurrentUserId(), clubResponse.data._id)
                        .then(function(response) {
                            console.log("Created a clubmember with value: ");
                            console.log(response);
                            authService.getRoleId("CLUB_ADMIN")
                                .then(function(response) {
                                    console.log("Received response:");
                                    console.log(response);
                                    userService.addUserToRole(authService.getCurrentUserId(), response.data[0]._id)
                                        .then(function(response) {
                                            console.log("Added user to role:");
                                            console.log(response);
                                            var currentUser = {};
                                            authService.getCurrentUser()
                                                .then(function(response) {
                                                    console.log("GOT THE CURRENT USER DURING CLUB CREATION");
                                                    console.log(response.data);
                                                    currentUser = response.data;
                                                    authService.setCurrentUser(response.data);
                                                    console.log("Attempting to populate user roles for member: " + currentUser);
                                                    console.log(currentUser);
                                                    authService.populateUserRoles(currentUser.roles);                                                
                                                    console.log("Attempting to add user to club:");
                                                    console.log(clubResponse.data);
                                                    var myClubs = [];
                                                    myClubs.push(clubResponse);
                                                    userService.populateUsersClubs(myClubs);
                                                }, function(errResponse) {
                                                    console.log("Failure when trying to retrieve current user.");
                                                    console.log(errResponse);
                                            });
                                            
                                        }, function(errResponse) {
                                            console.log("Error condition while adding user to role.");
                                            console.log(errResponse);
                                        });
                                    }, function(errResponse) {
                                        console.log("Error condition while adding user to club.");
                                        console.log(errResponse);
                                });
                        });
                            
                }, function(errResponse) {
                        console.log("Error condition while creating club.");
                        console.log(errResponse);
                });
            
            ngDialog.close();
        };        
    }])

    .controller('UserController', ['$scope', '$rootScope', 'ngDialog', '$state', function($scope, $rootScope, ngDialog, $state) {
        
        $scope.joinClub = function() {
            console.log('Joining club', $scope.join); 
            console.log('Selected role ' + $scope.join.selectedRole.name);
            ngDialog.close();
        };
        
    }])

    .controller('RegisterController', ['$scope', '$rootScope', 'ngDialog', '$state', 'authService', function($scope, $rootScope, ngDialog, $state, authService) {
        $scope.registerUser = function() {
            console.log('Doing registration', $scope.registration);        
            ngDialog.close();
            authService.register($scope.registration);
        };
        
        $scope.processLogin = function() {
            console.log('Doing login', $scope.loginData);
            authService.login($scope.loginData);
            ngDialog.close();
        };
        
        $scope.processLogout = function() {
            console.log('Logging out user ' + $rootScope.username);
            authService.logout();
            ngDialog.close();
        };
    }])

    .controller('HomeController', ['$scope', 'ngDialog', '$state', 'authService', 'coreDataService', function($scope, ngDialog, $state, authService, coreDataService) {
        $scope.tab = 1;
        $scope.subTab = 1;
        $scope.currentRoleName = '';
        
        $scope.subSelect = function (setTab) {
            $scope.subTab = setTab;
        };
        
        
        $scope.select = function (setTab) {
            $scope.tab = setTab;
        };
        
        $scope.getCurrentRole = function() {
            return authService.getCurrentRole();
        };

        $scope.isSelected = function (checkTab) {
            return ($scope.tab === checkTab);
        };
        
        $scope.subIsSelected = function (checkTab) {
            return ($scope.subTab === checkTab);
        };
        
        $scope.registerUser = function() {
            console.log('Doing registration', $scope.registration);        
            ngDialog.close();
            $state.go("app.home");
        }
        
        $scope.userHasRole = function(role) {
            console.log("Got role: " + role);
            
        };
        
        $scope.userHasRoles = function() {
            console.log("Checking if user has any defined roles.");
            var hasRole = authService.userHasRoles();
            return hasRole;
        };
        
        $scope.getRolePrettyName = function(roleName) {
            return coreDataService.getRolePrettyName(roleName);            
        };
        
        $scope.acceptRequest = function(accessRequest) {
            console.log("Handling acceptance of access request.");
            console.log(accessRequest);
        };
        
        $scope.declineRequest = function(accessRequest) {
            console.log("Handling decline of access request.");
            console.log(accessRequest);
        };
    }])
;

