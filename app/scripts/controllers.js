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

    .controller('HomeController', ['$scope', 'ngDialog', '$state', 'authService', 'coreDataService', 'userService', '$rootScope', 'clubService', function($scope, ngDialog, $state, authService, coreDataService, userService, $rootScope, clubService) {
        $scope.tab = 1;
        $scope.subTab = 1;       
        $scope.faTab = 1;
        $scope.faSubTab = 1;
        
        $scope.select = function (setTab) {
            $scope.tab = setTab;
        };
        
        $scope.subSelect = function (setTab) {
            $scope.subTab = setTab;
        };
        
        $scope.faSelect = function (setTab) {
            $scope.faTab = setTab;
        };
        
        $scope.faSubSelect = function (setTab) {
            $scope.faSubTab = setTab;
        };        

        $scope.isSelected = function (checkTab) {
            return ($scope.tab === checkTab);
        };
        
        $scope.subIsSelected = function (checkTab) {
            return ($scope.subTab === checkTab);
        };
        
        $scope.faIsSelected = function (checkTab) {
            return ($scope.faTab === checkTab);
        };
        
        $scope.faSubIsSelected = function (checkTab) {
            return ($scope.faSubTab === checkTab);
        };
        
        
        //initialize all form data:
        $scope.emailHidden = false;
        $scope.mobileHidden = true;
        $scope.fineHidden = true;
        $scope.editingAgeGroupId;        
        $scope.currentRoleName = ''; 
        
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
        
        $scope.teamForm = {
            name: '',
            ageGroup: null,
            gender: null,
            league: null
        };
        
        $scope.ageGroupForm = {
            name: '',
            birthyear: '',
            socceryear: ''
        };
        
        $scope.editAgeGroupForm = {
            name: '',
            birthyear: '',
            socceryear: ''
        };
        
        $scope.ruleForm = {
            league: null,
            age: null,
            duration: '',
            players: '',
            maxFieldLen: '',
            maxFieldWidth: '',
            goalHeight: '',
            goalWidth: '',
            periods: '',
            periodDuration: '',
            goalkeeper: false,
            buildout: false,
            offside: false,
            header: false
        };
        
        $scope.leagueForm = {
            name: '',
            shortname: '',
            minAgeGroup: null,
            maxAgeGroup: null,
            type: null,
            rescheduleDays: '',
            consequence: '',
            fine: '',
            rescheduleRuleId: null,
            logoURL: ''
        };
        
        $scope.$watch('invite.method', function(method) {
            if(method === 'email') {
                $scope.emailHidden = false;
                $scope.mobileHidden = true;
            } else {
                $scope.emailHidden = true;
                $scope.mobileHidden = false;
            }
        });
        
        $scope.$watch('leagueForm.consequence', function(consequence) {
            if(consequence === 'FINE') {
                $scope.fineHidden = false;
            } else {                
                $scope.fineHidden = true;
            }
        });
        
        $scope.arePendingAccessRequests = function() {
            return $rootScope.accessRequests.length > 0;
        };
        
        $scope.areTeams = function() {
            return $rootScope.teams.length > 0;
        };
        
        $scope.areAgeGroups = function() {
            return $rootScope.ageGroups.length > 0;
        };
        
        $scope.areLeagues = function() {
            return $rootScope.leagues.length > 0;
        };
        
        $scope.areRules = function() {
            return $rootScope.rules.length > 0;
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
        
        $scope.openAddLeague = function() {
            console.log("\n\nOpening dialog to add league");
            ngDialog.open({ template: 'views/addLeague.html', scope: $scope, className: 'ngdialog-theme-default custom-width-600', controller:"HomeController" });
        }; 
        
        $scope.addLeague = function() {
            console.log("\n\nAdding league");
            console.log($scope.leagueForm);
            
            //first pull data and add the reschedule rule:
            var days = $scope.leagueForm.rescheduleDays;
            var consequence = $scope.leagueForm.consequence;
            var fine = $scope.leagueForm.fine;
            
            if(days == '') {
                //no reschedule rule created, so just add the league:
                coreDataService.addLeague($scope.leagueForm);
            } else {
                coreDataService.addRescheduleRule(days, consequence, fine)
                .then(function(response) {
                    $scope.leagueForm.rescheduleDays = response.data.timespan_days;
                    $scope.leagueForm.consequence = response.data.consequence;
                    $scope.leagueForm.fine = response.data.fine;
                
                    coreDataService.addLeague($scope.leagueForm);
                }, function(errResponse) {
                    console.log("Failed to add reschedule rule, so league could not be added:");
                    console.log(errResponse);                
                });
            }           
            
            ngDialog.close();
        };
        
        $scope.openAddTeam = function() {
            console.log("\n\nOpening dialog to add team");
            ngDialog.open({ template: 'views/addTeam.html', scope: $scope, className: 'ngdialog-theme-default  custom-width-600', controller:"HomeController" });
        }; 
        
        $scope.addTeam = function() {
            console.log("\n\nAdding team");
            console.log($scope.teamForm);
            clubService.addTeam($scope.teamForm);
            ngDialog.close();
        };
        
        $scope.openAddAgeGroup = function() {
            console.log("\n\nOpening dialog to add age group");
            ngDialog.open({ template: 'views/addAgeGroup.html', scope: $scope, className: 'ngdialog-theme-default', controller:"HomeController" });
        };
        
        $scope.addAgeGroup = function() {
            console.log("\n\nAdding age group");
            console.log($scope.ageGroupForm);
            coreDataService.addAgeGroup($scope.ageGroupForm);
            ngDialog.close();
        };
        
        $scope.openEditAgeGroup = function(ageGroup) {
            console.log("\n\nOpening dialog to edit age group");
            console.log(ageGroup);
            $scope.editingAgeGroupId = ageGroup._id;
            $scope.editAgeGroupForm.name = ageGroup.name;
            $scope.editAgeGroupForm.birthyear = ageGroup.birth_year;
            $scope.editAgeGroupForm.socceryear = ageGroup.soccer_year;
                
            console.log("Current entries include: ");
            console.log($scope.editAgeGroupForm);
            ngDialog.open({ template: 'views/editAgeGroup.html', scope: $scope, className: 'ngdialog-theme-default', controller:"HomeController" });
        };
        
        $scope.editAgeGroup = function() {
            console.log("\n\nEditing age group");
            console.log($scope.ageGroupForm);
            coreDataService.editAgeGroup($scope.editAgeGroupForm, $scope.editingAgeGroupId);
            ngDialog.close();
        };
        
        $scope.deleteAgeGroup = function(ageGroup) {
            console.log("\n\nDeleting age group");
            console.log(ageGroup);
            coreDataService.deleteAgeGroup(ageGroup);
            ngDialog.close();
        };
        
        $scope.openAddRule = function() {
            console.log("\n\nOpening dialog to add rule");
            ngDialog.open({ template: 'views/addRule.html', scope: $scope, className: 'ngdialog-theme-default  custom-width-600', controller:"HomeController" });
        }; 
        
        $scope.addRule = function() {
            console.log("\n\nAdding rule");
            console.log($scope.ruleForm);
            coreDataService.addRule($scope.ruleForm);
            ngDialog.close();
        };
        
        $scope.openUpdate = function(user) {
            console.log("\n\nOpening dialog to update user: ");
            console.log(user);
            $scope.currentAssignmentUser = user;
            ngDialog.open({ template: 'views/assignmentUpdate.html', scope: $scope, className: 'ngdialog-theme-default custom-width-800', controller:"HomeController" });
        };
        
        $scope.loadClubUsers = function() {
            console.log("Attemtping to load all users for this club");
            coreDataService.getCurrentClubUsers();
        };      
        
        $scope.getCurrentRole = function() {
            return authService.getCurrentRole();
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

