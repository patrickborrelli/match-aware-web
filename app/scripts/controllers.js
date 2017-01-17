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

    .controller('UserController', ['$scope', '$rootScope', 'ngDialog', '$state', 'userService', function($scope, $rootScope, ngDialog, $state, userService) {
        
        $scope.joinClub = function() {
            console.log('Joining club', $scope.join); 
            console.log('Selected role ' + $scope.join.selectedRole.name);
            userService.sendAccessRequest($scope.join);
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

    .controller('HomeController', ['$scope', 'ngDialog', '$state', 'authService', 'coreDataService', 'userService', '$rootScope', function($scope, ngDialog, $state, authService, coreDataService, userService, $rootScope) {
        $scope.tab = 1;
        $scope.subTab = 1;
        $scope.currentRoleName = '';
        $scope.emailHidden = false;
        $scope.mobileHidden = true;
        
        $scope.myUser = {
            caCheck: false,
            faCheck: false,
            raCheck: false,
            taCheck: false,
            coCheck: false,
            trCheck: false,
            reCheck: false,
            plCheck: false,
            paCheck: false
        };
        
        $scope.invite = {
            email: '',
            mobile: '',
            method: 'email',
            role: ''
        };
        
        $scope.$watch('invite.method', function(method) {
            console.log("Selected " + method);
            if(method === 'email') {
                $scope.emailHidden = false;
                $scope.mobileHidden = true;
            } else {
                $scope.emailHidden = true;
                $scope.mobileHidden = false;
            }
        });
        
        $scope.arePendingAccessRequests = function() {
            return $rootScope.accessRequests.length > 0;
        };
        
        $scope.arePendingUserInvites = function() {
            return $rootScope.userInvites.length > 0;
        };
        
        $scope.sendInvite = function() {
            console.log("Received invite for: " + $scope.invite.email + " " + $scope.invite.mobile);            
            console.log("data is ");
            console.log($scope.invite); 
            userService.sendUserInvite($scope.invite);
        };
        
        $scope.openUpdate = function(user) {
            console.log("\n\nOpening dialog to update user: ");
            console.log(user);
            $scope.currentAssignmentUser = user;
            ngDialog.open({ template: 'views/assignmentUpdate.html', scope: $scope, className: 'ngdialog-theme-default custom-width-800', controller:"HomeController" });
        }; 
        
        $scope.subSelect = function (setTab) {
            $scope.subTab = setTab;
        };
        
        $scope.loadClubUsers = function() {
            console.log("Attemtping to load all users for this club");
            coreDataService.getCurrentClubUsers();
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
                
        $scope.userHasRoleActive = function(roleName, user) {
            //console.log("User " + user.first_name + " " + user.last_name + " has " + user.roles.length + " roles.");
            //console.log(user.roles);
            var result = false;
            for(var i = 0; i < user.roles.length; i++)  {
                if(user.roles[i].name === roleName) {
                    result = true;
                }                   
            }
            return result;
        };
        
        $scope.updateUserRoles = function(user) {
            console.log("Received update for user: " + user._id);            
            console.log("data is ");
            console.log($scope.myUser); 
            userService.updateUserRoles(user, $scope.myUser);
            ngDialog.close();
        };
        
        $scope.userHasRoles = function() {
            console.log("Checking if user has any defined roles.");
            var hasRole = authService.userHasRoles();
            return hasRole;
        };
        
        $scope.getRolePrettyName = function(roleName) {
            return coreDataService.getRolePrettyName(roleName);            
        };
        
        $scope.acceptAccess = function(accessRequest) {
            coreDataService.processAccessRequestAccept(accessRequest);            
        };
        
        $scope.declineAccess = function(accessRequest) {            
            coreDataService.processAccessRequestDecline(accessRequest);  
        };
    }])
;

