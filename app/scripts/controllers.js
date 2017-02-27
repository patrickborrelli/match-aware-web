'use strict';

angular.module('ma-app')
    .filter('trustUrl', function ($sce) {
        return function(url) {
            return $sce.trustAsResourceUrl(url);
        };
    })
    .controller('HeaderController', ['$scope', 'ngDialog', 'userService', 'coreDataService', 'authService',  function($scope, ngDialog, userService, coreDataService, authService) {
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
            
            ngDialog.open({ template: 'views/joinClub.html', scope: $scope, className: 'ngdialog-theme-default', controller:"UserController" });
        }; 
        
        $scope.openCreateClub = function() {
            ngDialog.open({ template: 'views/createClub.html', scope: $scope, className: 'ngdialog-theme-default', controller:"ClubController" });
        }; 
        
        $scope.userHasRoles = function() {
            console.log("Checking if user has any defined roles.");
            var hasRole = userService.userHasRoles();
            return hasRole;
        };
        
        $scope.isAuthenticated = function() {
            return authService.isUserAuthenticated();
        };
        
        $scope.getUserFullname = function() {
            return userService.getUserFullname();
        };
    }])

    .controller('ClubController', ['$scope', 'ngDialog', '$state', 'clubService', 'authService', 'userService', 'coreDataService', function($scope, ngDialog, $state, clubService, authService, userService, coreDataService) {        
        
        $scope.createClub = function() {
            console.log('Creating club', $scope.createClubData); 
            
            clubService.createClub($scope.createClubData)
                .then(function(clubResponse) {
                    console.log("Created a club with value: ");
                    console.log(clubResponse);
                    userService.setCurrentUserStale();
                    clubService.setCurrentClub(clubResponse.data);                
                    var roleId = coreDataService.getRoleIdByName("CLUB_ADMIN");
                    console.log("Received ID:" + roleId);
                    clubService.joinClub(userService.getCurrentUserId(), clubResponse.data._id, roleId)
                        .then(function(response) {
                            console.log("Created a club role with value: ");
                            console.log(response);
                            userService.getCurrentUser(true)
                                .then(function(response) {
                                    console.log("GOT THE CURRENT USER DURING CLUB CREATION");
                                    console.log(response.data);
                                    userService.setCurrentUser(response.data);
                                    userService.setCurrentRolesStale();
                                    //retrieve user's club_roles:
                                    userService.retrieveUserRoles(true)
                                        .then(function(response) {
                                        console.log("Retrieved the user's club_roles: " );
                                        console.log(response);

                                        userService.setUserClubRoles(response.data);

                                        //create an array of Role objects:
                                        var userRoles = [];
                                        for(var i = 0; i < response.data.length; i++) {
                                            userRoles.push(response.data[i].role);
                                        }

                                        //create an array of Club objects:
                                        var userClubs = [];
                                        for(var i = 0; i < response.data.length; i++) {
                                            userClubs.push(response.data[i].club);
                                        }

                                        userService.populateUserRoles(userRoles);  
                                        userService.populateUsersClubs(userClubs);
                                        
                                        coreDataService.setDataStale("clubs");
                                        //do app data load:
                                        coreDataService.appDataLoad(userService.getCurrentUser(false));

                                    }, function(errResponse) {
                                        console.log("Failed in attempt to retrieve users club_roles.");
                                        console.log(errResponse);
                                    }); 
                                }, function(errResponse) {
                                    console.log("Failure when trying to retrieve current user.");
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

    .controller('UserController', ['$scope', 'ngDialog', '$state', 'userService', function($scope, ngDialog, $state, userService) {
        
        $scope.joinClub = function() {
            console.log('Joining club', $scope.join); 
            console.log('Selected role ' + $scope.join.selectedRole.name);
            userService.sendAccessRequest($scope.join);
            ngDialog.close();
        };
        
    }])

    .controller('RegisterController', ['$scope', 'userService', 'ngDialog', '$state', 'authService', function($scope, userService, ngDialog, $state, authService) {
        $scope.showLoader = false;
        $scope.showRegLoader = false;
        
        $scope.showLoading = function() {
            $scope.showLoader = true;
        };
        
        $scope.showRegLoading = function() {
            $scope.showRegLoader = true;
        };
        
        $scope.registerUser = function() {
            console.log('Doing registration', $scope.registration); 
            authService.register($scope.registration);
        };
        
        $scope.processLogin = function() {
            console.log('Doing login', $scope.loginData);
            authService.login($scope.loginData);            
        };
        
        $scope.processLogout = function() {
            console.log('Logging out user ' + userService.getUserFullname());
            authService.logout();
            ngDialog.close();
        };
    }])

    .controller('HomeController', ['$scope', 'ngDialog', 'authService', 'coreDataService', 'userService', '$rootScope', 'clubService', 'schedulingService', function($scope, ngDialog, authService, coreDataService, userService, $rootScope, clubService, schedulingService) {
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
        $scope.addressHidden = false;
        
        $rootScope.rangeShown = true;        
        $rootScope.futureShown = false;        
        $rootScope.currentShown = true;
        
        $scope.gpsHidden = true;
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
            logoURL: '',
            leagueId: ''
        };
        
        $scope.teamForm = {
            name: '',
            ageGroup: null,
            gender: null,
            league: null,
            teamId: ''
        };
        
        $scope.facilityForm = {
            name: '',
            shortname: '',
            club: null,
            address: '',
            city: '',
            state: '',
            zip: '',
            lat: '',
            lon: '',
            sunStart: '',
            sunStop: '',
            monStart: '',
            monStop: '',
            tueStart: '',
            tueStop: '',
            wedStart: '',
            wedStop: '',
            thuStart: '',
            thuStop: '',
            friStart: '',
            friStop: '',
            satStart: '',
            satStop: '',
            indoor: false,
            method: 'address'
        };
        
        $scope.fieldForm = {
            name: '',
            facility: {},
            size: {},
            lights: false,
            game: false,
            practice: false,
            tournament: false,
            training: false,
            condition: '',
            surface: ''
        };
        
        $rootScope.fuForm = {
            duration: '8',
            enddate: '',
            endtime: '',
            timespan: 'current',
            futureStartDate: '',
            futureStartTime: '',
            futureEndDate: '',
            futureEndTime: '',
            entity: null
        };
        
        $scope.$watch('fuForm.timespan', function(duration) {
            if(duration === 'current') {
                $scope.currentShowm = true;
                $scope.futureShown = false;
            } else if(duration === 'future') {
                $scope.currentShowm = false;
                $scope.futureShown = true;  
            }
        });
        
        $scope.$watch('fuForm.duration', function(duration) {
            if(duration === 'other') {
                $scope.rangeShown = true;
            } else {
                $scope.rangeShown = false;  
            }
        });
        
        $scope.$watch('invite.method', function(method) {
            if(method === 'email') {
                $scope.emailHidden = false;
                $scope.mobileHidden = true;
            } else {
                $scope.emailHidden = true;
                $scope.mobileHidden = false;
            }
        });
        
        $scope.$watch('facilityForm.method', function(method) {
            console.log("Value of method switched to : " + method);
            if(method == 'address') {
                $scope.addressHidden = false;
                $scope.gpsHidden = true;
            } else {
                $scope.addressHidden = true;
                $scope.gpsHidden = false;
            }
        });
        
        $scope.$watch('leagueForm.consequence', function(consequence) {
            if(consequence === 'FINE') {
                $scope.fineHidden = false;
            } else {                
                $scope.fineHidden = true;
            }
        });
        
        $scope.userHasSingleClub = function() {
            return userService.getUserHasClub();
        };
        
        $scope.userHasMultipleClubs = function() {
            return userService.getUserHasMultipleClubs();
        };
        
        $scope.getGoogleEmbedURL = function(formattedAddress) {
            var url =  coreDataService.getGoogleMapURL(formattedAddress);
            console.log("Returing map URL: " + url);
        };
        
        $scope.arePendingAccessRequests = function() {
            return coreDataService.getAccessRequests().length > 0;
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
            return coreDataService.getRules().length > 0;
        };
        
        $scope.arePendingUserInvites = function() {
            return coreDataService.getUserInvites().length > 0;
        };
        
        $scope.areFacilities = function() {
            return coreDataService.getFacilities().length > 0;
        };
        
        $scope.areFields = function() {
            return coreDataService.getFields().length > 0;
        };
        
        $scope.hasFields = function(facility) {
            if(!(null == facility.fields)) {
                return facility.fields.length > 0;
            } else { 
                return false;
            }
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
        
        $scope.openAddFacility = function() {
            console.log("\n\nOpening dialog to add facility");
            ngDialog.open({ template: 'views/addFacility.html', scope: $scope, className: 'ngdialog-theme-default custom-width-800', controller:"HomeController" });
        }; 
        
        $scope.addLeague = function() {
            console.log("\n\nAdding league");
            console.log($scope.leagueForm);
            
            coreDataService.addLeague($scope.leagueForm)
                .then(function(response) {
                    console.log("Successfully added league: ");
                    console.log(response);
                    coreDataService.refreshLeagues();
                }, function(errResponse) {
                    console.log("Failed on attempt to add league:");
                    console.log(errResponse);
                });
            
            ngDialog.close();
        };
        
        $scope.editLeague = function(league) {
            console.log("\n\nEditing league");
            $scope.leagueForm.leagueId = league._id;
            console.log($scope.leagueForm);
            
            coreDataService.editLeague($scope.leagueForm)
                .then(function(response) {
                    console.log("Successfully edited league: ");
                    console.log(response);
                    coreDataService.refreshLeagues();
                }, function(errResponse) {
                    console.log("Failed on attempt to edit league:");
                    console.log(errResponse);
                });
            
            ngDialog.close();
        };
        
        $scope.openAddTeam = function() {
            
            console.log("\n\nOpening dialog to add team");
            ngDialog.open({ template: 'views/addTeam.html', scope: $scope, className: 'ngdialog-theme-default  custom-width-600', controller:"HomeController" });
        }; 
        
        $scope.openAddField = function(facility) {
            console.log("\nOpening dialog to add field");
            $rootScope.short_name = facility.short_name;
            $rootScope.facilityName = facility.name;
            $rootScope.tempFacility = facility;
            console.log($scope.fieldForm);
            
            ngDialog.open({ template: 'views/addField.html', scope: $scope, className: 'ngdialog-theme-default  custom-width-600', controller:'HomeController'});
        };
        
        $scope.addField = function() {
            console.log("\n\nAdding field");
            $scope.fieldForm.facility = $rootScope.tempFacility;
            console.log($scope.fieldForm);
            coreDataService.addField($scope.fieldForm);
            ngDialog.close();
        };
        
        $scope.addTeam = function() {
            console.log("\n\nAdding team");
            console.log($scope.teamForm);
            clubService.addTeam($scope.teamForm);
            ngDialog.close();
        };
        
        $scope.deleteTeam = function(team) {
            console.log("\n\nDeleting team" );
            console.log(team);
            
            coreDataService.deleteTeam(team)
                .then(function(response) {
                    console.log("Successfully deleted team: ");
                    console.log(response);
                    coreDataService.refreshTeams(clubService.getCurrentClubId());
                }, function(errResponse) {
                    console.log("Failed on attempt to delete league:");
                    console.log(errResponse);
                });
        };
        
        $scope.openEditTeam = function(team, league) {
            console.log("\n\nOpening dialog to edit team");
            console.log(team);
            $scope.teamForm.name = team.name;
            $scope.teamForm.ageGroup = team.age_group;
            $scope.teamForm.gender = team.gender;
            $scope.teamForm.league = league;
            $scope.teamForm.teamId = team._id;
            
            console.log("teamForm contains: ");
            console.log($scope.teamForm);
                
            ngDialog.open({ template: 'views/editTeam.html', scope: $scope, className: 'ngdialog-theme-default  custom-width-600', controller:"HomeController" });
        };
        
        $scope.openAddAgeGroup = function() {
            console.log("\n\nOpening dialog to add age group");
            ngDialog.open({ template: 'views/addAgeGroup.html', scope: $scope, className: 'ngdialog-theme-default', controller:"HomeController" });
        };
        
        $scope.addAgeGroup = function() {
            console.log("\n\nAdding age group");
            console.log($scope.ageGroupForm);
            coreDataService.addAgeGroup($scope.ageGroupForm);  
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
        
        $scope.deleteLeague = function(league) {
            console.log("\n\nDeleting league");
            console.log(league);
            coreDataService.deleteLeague(league);
        };
        
        $scope.openEditLeague = function(league) {
            console.log("\n\nOpening dialog to edit league");
            console.log(league);
            $scope.league = league;
            
            $scope.leagueForm = {
                name: league.name,
                shortname: league.short_name,
                minAgeGroup: league.min_age_group,
                maxAgeGroup: league.max_age_group,
                type: league.type,
                rescheduleDays: league.reschedule_time,
                consequence: league.reschedule_consequence,
                fine: league.reschedule_fine,
                logoURL: league.logo_url,
                leagueId: league._id
            };
                
            console.log("Current entries include: ");
            console.log($scope.leagueForm);
            ngDialog.open({ template: 'views/editLeague.html', scope: $scope, className: 'ngdialog-theme-default custom-width-600', controller:"HomeController" });
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
        
        $scope.addFacility = function() {
            console.log("\n\nAdding facility");
            console.log($scope.facilityForm);
            coreDataService.addFacility($scope.facilityForm);
            ngDialog.close();
        };
        
        $scope.openFacilityStatus = function(facility) {
            console.log("\n\nOpening dialog to change facility status");
            $rootScope.facilityStatusName = facility.name;
            $rootScope.facilityStatusEntity = facility;
            $scope.fuForm.entity = facility;
            ngDialog.open({ template: 'views/updateFacility.html', scope: $scope, className: 'ngdialog-theme-default  custom-width-600', controller:"HomeController" });
        };
        
        $scope.openFieldStatus = function(field) {
            console.log("\n\nOpening dialog to change field status");
            $rootScope.fieldStatusName = field.name;
            $rootScope.fieldStatusEntity = field;         
            $scope.fuForm.entity = field;
            ngDialog.open({ template: 'views/updateField.html', scope: $scope, className: 'ngdialog-theme-default  custom-width-600', controller:"HomeController" });
        };
        
        $scope.closeFacility = function(facility) {
            console.log("\n\Closing facility");            
            console.log($rootScope.facilityStatusEntity);
            $scope.fuForm.entity = $rootScope.facilityStatusEntity;
            console.log($scope.fuForm);
            schedulingService.closeFacility($scope.fuForm);
            ngDialog.close();
        };
        
        $scope.closeField = function(field) {
            console.log("\n\Closing field");
            console.log($rootScope.fieldStatusEntity);
            $scope.fuForm.entity = $rootScope.fieldStatusEntity;
            console.log($scope.fuForm);
            schedulingService.closeField($scope.fuForm);
            ngDialog.close();
        };
        
        $scope.openFacility = function(facility) {
            console.log("\n\Opening facility");
            console.log($rootScope.facilityStatusEntity);
            $scope.fuForm.entity = $rootScope.facilityStatusEntity;
            console.log($scope.fuForm);
            schedulingService.openFacility($scope.fuForm);
            ngDialog.close();
        };
        
        $scope.openField = function(field) {
            console.log("\n\Opening field");
            console.log($rootScope.fieldStatusEntity);
            $scope.fuForm.entity = $rootScope.fieldStatusEntity;
            console.log($scope.fuForm);
            schedulingService.openField($scope.fuForm);
            ngDialog.close();
        };
        
        $scope.getFieldStatusString = function(entity) {
            var result = "OPEN";
            
            if(entity.closure && entity.closure_type == "CURRENT") {
                result = "CLOSED";
            }
            return result;                
        };
        
        $scope.getFacilityStatusString = function(entity) {
            var result = "OPEN";
            var fields = entity.fields;
            
            if(!entity.closure || (entity.closure && entity.closure_type != "CURRENT")) {
                //iterate through all fields:
                for(var i = 0; i < fields.length; i++) {
                    if(fields[i].closure && fields[i].closure_type == "CURRENT") {
                        result = "PARTIAL";
                        break;
                    }
                }
            }
            
            if(entity.closure && entity.closure_type == "CURRENT") {
                result = "CLOSED";
            }
            return result;                
        };
        
        $scope.openUpdate = function(user) {
            console.log("\n\nOpening dialog to update user: ");
            console.log(user);
            $scope.currentAssignmentUser = user;
            
            //set values for myUser form:
            $scope.myUser.caCheck = $scope.userHasRoleActive('CLUB_ADMIN', user);
            $scope.myUser.faCheck = $scope.userHasRoleActive('FIELD_ADMIN', user);
            $scope.myUser.raCheck = $scope.userHasRoleActive('REFEREE_ASSIGNOR', user);
            $scope.myUser.taCheck = $scope.userHasRoleActive('TRAINING_ADMIN', user);
            $scope.myUser.coCheck = $scope.userHasRoleActive('COACH', user);
            $scope.myUser.trCheck = $scope.userHasRoleActive('TRAINER', user);
            $scope.myUser.reCheck = $scope.userHasRoleActive('REFEREE', user);
            $scope.myUser.plCheck = $scope.userHasRoleActive('PLAYER', user);
            $scope.myUser.paCheck = $scope.userHasRoleActive('PARENT', user);
            console.log("HAVE SET MYUSER FORM IN SCOPE WITH VALUES: ");
            console.log($scope.myUser);
            
            ngDialog.open({ template: 'views/assignmentUpdate.html', scope: $scope, className: 'ngdialog-theme-default custom-width-800', controller:"HomeController" });
        };
        
        $scope.loadClubUsers = function() {
            coreDataService.refreshClubUsers(clubService.getCurrentClubId());
        };     
        
        $scope.loadAgeGroups = function() {
            $scope.ageGroups = coreDataService.getAgeGroups();
        };
        
        $scope.loadRequests = function() {           
            $scope.accessRequests = coreDataService.getAccessRequests();
            return true;
        };   
        
        $scope.getCurrentRole = function() {
            return userService.getCurrentRole();
        };
                
        $scope.userHasRoleActive = function(roleName, user) {            
            var result = false;            
            result = userService.userHasRole(user._id, roleName); 
            return result;
        };
                
        $scope.updateUserRoles = function(user) {
            console.log("Received update for user: " + user._id);            
            console.log("data is ");
            console.log($scope.myUser); 
            userService.updateUserRoles(user, $scope.myUser)
                .then(function(response) {
                    console.log("added new user roles");
                    console.log(response); 
                    userService.setCurrentRolesStale();
                    //retrieve user's club_roles:
                    userService.retrieveUserRoles(true)
                        .then(function(response) {
                            console.log("Retrieved the user's club_roles: " );
                            console.log(response);

                            userService.setUserClubRoles(response.data);

                            //create an array of Role objects:
                            var userRoles = [];
                            for(var i = 0; i < response.data.length; i++) {
                                userRoles.push(response.data[i].role);
                            }

                            //create an array of Club objects:
                            var userClubs = [];
                            for(var i = 0; i < response.data.length; i++) {
                                userClubs.push(response.data[i].club);
                            }

                            userService.populateUserRoles(userRoles);  
                            userService.populateUsersClubs(userClubs);

                            //do app data load:
                            coreDataService.refreshClubUsersAndWait(clubService.getCurrentClubId())
                                .then(function(response) {
                                    console.log("Retrieved the users from the API: ");
                                    console.log(response);
                                    $rootScope.users = response.data;
                                    coreDataService.setUsersLoaded(true);
                                });
                    }, function(errResponse) {
                        console.log("Failed in attempt to retrieve users club_roles.");
                        console.log(errResponse);
                    });
                }, function(errResponse) {
                    console.log("failed to add new user roles");
                    console.log(errResponse);
                });  
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
        
        $scope.getFieldUsage = function(field) {
            var use = '';
            if(field.game) use += "Game - ";
            if(field.practice) use += "Practice - ";
            if(field.training) use += "Training - ";
            if(field.tournament) use += "Tournament - ";
            use = use.slice(0, -3);
            return use;            
        };
        
        $scope.hasLights = function(field) {
            var lights = "No";
            if(field.lights) 
                lights = "Yes";
            
            return lights;          
        };
        
        $scope.currentClosure = function(facility) {
            var closed = false;
            if(facility.closure && facility.closure_type == "CURRENT") {
                closed = true;
            }
            return closed;
        };
        
        $scope.partialClosure = function(facility) {
            var partial = false;
            var fields = facility.fields;
            
            //if the facility is open, but any of its fields are closed, the status is partial:
            if(!facility.closure || (facility.closure && facility.closure_type != "CURRENT")) {
                //iterate through all fields:
                for(var i = 0; i < fields.length; i++) {
                    if(fields[i].closure && fields[i].closure_type == "CURRENT") {
                        partial = true;
                        break;
                    }
                }
            }
            return partial;
        };
        
        $scope.currentFieldClosure = function(field) {
            var closed = false;
            if(field.closure && field.closure_type == "CURRENT") {
                closed = true;
            }
            return closed;
        };
        
        $scope.acceptAccess = function(accessRequest) {
            userService.processAccessRequestAccept(accessRequest);            
        };
        
        $scope.declineAccess = function(accessRequest) {            
            userService.processAccessRequestDecline(accessRequest);  
        };
    }])
;

