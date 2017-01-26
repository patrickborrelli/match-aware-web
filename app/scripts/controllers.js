'use strict';

angular.module('ma-app')
    .filter('trustUrl', function ($sce) {
        return function(url) {
            return $sce.trustAsResourceUrl(url);
        };
    })
    .controller('HeaderController', ['$scope', 'ngDialog', 'authService', 'coreDataService',  function($scope, ngDialog, authService, coreDataService) {
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
            //authService.loadClubs();
            $scope.clubs = coreDataService.getClubs();
            $scope.roles = coreDataService.getRoles();
            console.log("\n\nLOADING CLUBS FROM SERVICE:");
            console.log($scope.clubs);            
            console.log("\n\nLOADING ROLES FROM SERVICE:");
            console.log($scope.roles);
            
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

    .controller('ClubController', ['$scope', '$rootScope', 'ngDialog', '$state', 'clubService', 'authService', 'userService', 'coreDataService', function($scope, $rootScope, ngDialog, $state, clubService, authService, userService, coreDataService) {        
        
        $scope.createClub = function() {
            console.log('Creating club', $scope.createClubData); 
            
            clubService.createClub($scope.createClubData)
                .then(function(clubResponse) {
                    console.log("Created a club with value: ");
                    console.log(clubResponse);
                    authService.setCurrentUserStale();
                    clubService.setCurrentClub(clubResponse.data);
                    clubService.joinClub(authService.getCurrentUserId(), clubResponse.data._id)
                        .then(function(response) {
                            console.log("Created a clubmember with value: ");
                            console.log(response);
                            var roleId = coreDataService.getRoleIdByName("CLUB_ADMIN");
                            console.log("Received ID:" + roleId);
                            userService.addUserToRole(authService.getCurrentUserId(), roleId)
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
                                            userService.getUserClubs(authService.getCurrentUserId())
                                                .then(function(response) {
                                                    console.log("Retrieved the clubs the user belongs to: ");
                                                    console.log(response);
                                                    userService.populateUsersClubs(response.data);
                                                }, function(errResponse) {
                                                    console.log("Encountered error when trying to retrieve users clubs.")
                                                    console.log(errResponse);
                                            });
                                        }, function(errResponse) {
                                            console.log("Failure when trying to retrieve current user.");
                                            console.log(errResponse);
                                    });

                                }, function(errResponse) {
                                    console.log("Error condition while adding user to role.");
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
            console.log('Logging out user ' + $rootScope.username);
            authService.logout();
            ngDialog.close();
        };
    }])

    .controller('HomeController', ['$scope', 'ngDialog', '$state', 'authService', 'coreDataService', 'userService', '$rootScope', 'clubService', 'schedulingService', function($scope, ngDialog, $state, authService, coreDataService, userService, $rootScope, clubService, schedulingService) {
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
        
        $scope.areFacilities = function() {
            return $rootScope.facilities.length > 0;
        };
        
        $scope.areFields = function() {
            return $rootScope.fields.length > 0;
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
            coreDataService.processAccessRequestAccept(accessRequest);            
        };
        
        $scope.declineAccess = function(accessRequest) {            
            coreDataService.processAccessRequestDecline(accessRequest);  
        };
    }])
;

