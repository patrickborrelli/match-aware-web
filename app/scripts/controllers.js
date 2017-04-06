'use strict';

angular.module('ma-app')
    .filter('trustUrl', function ($sce) {
        return function(url) {
            return $sce.trustAsResourceUrl(url);
        };
    })
    .controller('HeaderController', ['$scope', '$rootScope', 'ngDialog', 'userService', 'coreDataService', 'authService', 'clubService',  function($scope, $rootScope, ngDialog, userService, coreDataService, authService, clubService) {
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
        
        $scope.clubsExist = function() {
            var hasClubs = false;
            if($rootScope.clubs.length > 0) {
                hasClubs = true;
            }
            return hasClubs;
        };
        
        $scope.isAuthenticated = function() {
            return authService.isUserAuthenticated();
        };
        
        $scope.getUserFullname = function() {
            return userService.getUserFullname();
        };
        
        $scope.isUserClubSelected = function() {
            return (clubService.getCurrentClub() != null);
        };
        
        $scope.getCurrentClubName = function() {
            var name = '';
            if(clubService.getCurrentClub() != null) {
                name = clubService.getCurrentClub().name;
            }
            return name;
        };
        
        $scope.getCurrentRole = function() {
            var roleName = '';
            if(authService.isUserAuthenticated() && userService.getCurrentRole != null) {
                roleName = coreDataService.getRolePrettyName(userService.getCurrentRole());
            }
            return roleName;
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

    .controller('InviteController', ['$scope', 'ngDialog', '$state', '$stateParams', 'userService', 'coreDataService', 'authService', 'clubService', function($scope, ngDialog, $state, $stateParams, userService, coreDataService, authService, clubService) {
        $scope.inviteId = $stateParams.inviteId;
        $scope.inviteError = false;
        $scope.registration = {};
        var registerData = {};
        
        $scope.registerInviteUser = function() {
            console.log('Doing registration', $scope.registration); 
            //build registration data object:
            registerData.username = $scope.registration.username;
            registerData.password = $scope.registration.password;
            registerData.first_name = $scope.registration.first_name;
            registerData.last_name = $scope.registration.last_name;
            registerData.email_address = $scope.registration.email_address;
            registerData.mobile = $scope.registration.mobile;
            registerData.address = $scope.registration.address;
            registerData.city = $scope.registration.city;
            registerData.state = $scope.registration.state;
            registerData.postal_code = $scope.registration.postal_code;
            registerData.country = $scope.registration.country;
                    
            //TODO: register and login user, then call userService.processUserInviteAcceptance, and finally redirect to home 
            
            
            //register user account:
            authService.registerOnly(registerData)
                .then(function(response) {
                    console.log("successfully registered a user.");
                
                    //now log in the registered user:
                    console.log("will attempt to log user in with username: " + registerData.username + " and password: " + registerData.password);
                    authService.loginOnly({username:registerData.username, password:registerData.password})
                        .then(function(response) {
                            console.log(response);
                            authService.setUserCredentials({username:registerData.username, token: response.data.token, fullname: response.data.fullname, userId: response.data.userId});                 
                            console.log("User " + response.data.fullname + " has been authenticated successfully.");
                            //set invite to accepted status:
                            userService.processInviteAcceptance($scope.inviteId);
                        
                            userService.retrieveUser(response.data.userId) 
                                .then(function(response) {
                                    console.log("Retrieved the user from the API with value: ");
                                    console.log(response);
                                    console.log("\n\nSETTING CURRENT USER TO: " );
                                    console.log(response.data);
                                    userService.setCurrentUser(response.data);
                                    //now add club/user/role relationship:
                                    userService.addUserToClubRole(response.data._id, $scope.registration.clubId, $scope.registration.roleId)
                                        .then(function(response) {
                                            console.log("Successfully added user role");
                                            console.log(response); 
                                            userService.setCurrentRolesStale();
                                            //retrieve user's club_roles:
                                            userService.retrieveUserRoles(true, response.data.member)
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

                                                    //retrieve user and store in scope:
                                                    userService.getUserById(response.data[0].member._id)
                                                        .then(function(response) {
                                                            console.log("\n\nSETTING CURRENT USER TO: " );
                                                            console.log(response.data);
                                                            userService.setCurrentUser(response.data); 
                                                        
                                                            //do app data load:
                                                            coreDataService.setAllDataStale();
                                                            coreDataService.appDataLoad(userService.getCurrentUser(false), clubService.getCurrentClubId());
                                                            var message = '\
                                                            <div class="ngdialog-message">\
                                                            <div><h3>Registration Successful</h3></div>' +
                                                            '<div class="ngdialog-buttons">\
                                                                <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=confirm(1)>OK</button>\
                                                            </div>';
                                                            ngDialog.openConfirm({ template: message, plain: 'true'});
                                                            $state.go("app.home");
                                                        }); 

                                                }, function(errResponse) {
                                                    console.log("Failed in attempt to retrieve users club_roles.");
                                                    console.log(errResponse);
                                                }); 
                                        }); 
                            });                        
                          
                        }, function(errResponse) {
                            isAuthenticated = false;            
                            var message = '\
                            <div class="ngdialog-message">\
                            <div><h3>Login Unsuccessful</h3></div>' +
                              '<div><p>' +  errResponse.data.err.message + '</p><p>' +
                                errResponse.data.err.name + '</p></div>' +
                            '<div class="ngdialog-buttons">\
                                <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=confirm("OK")>OK</button>\
                            </div>'

                            ngDialog.openConfirm({ template: message, plain: 'true'});
                        });
                }, function(response) {
                    console.log("failed to registered a user.");
                    var message = '\
                    <div class="ngdialog-message">\
                    <div><h3>Login Unsuccessful</h3></div>' +
                      '<div><p>' +  response.data.err.message + '</p><p>' +
                        response.data.err.name + '</p></div>' +
                    '<div class="ngdialog-buttons">\
                        <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=confirm(1)>OK</button>\
                    </div>'

                    ngDialog.openConfirm({ template: message, plain: 'true'});
                });
        };
                
        $scope.initInvite = function() {
            var invite = userService.getInviteByKey($stateParams.inviteId)
                .then(function(response) {
                    console.log("Successfully retrieved invite");
                    console.log(response.data);
                    
                    if(response.data.length > 0) {
                        //found one, so:
                        $scope.invite = response.data[0];
                        console.log("Found email address " + response.data[0].sendToEmail);
                        $scope.registration.email_address = response.data[0].sendToEmail;
                        $scope.registration.invite_key = $stateParams.inviteId;
                        $scope.registration.role = coreDataService.getRolePrettyName(response.data[0].role.name);
                        $scope.registration.club = response.data[0].club.name;
                        $scope.registration.roleId = response.data[0].role._id;
                        $scope.registration.clubId = response.data[0].club._id;
                        $scope.inviteId = response.data[0]._id;
                    } else {
                        $scope.inviteError = true;
                    }
                }, function(errResponse) {
                    console.log("Failed to retrieved invite");
                    console.log(errResponse);
                });
            
            
                         
        };
    }])

    .controller('HomeController', ['$scope', 'ngDialog', 'authService', 'coreDataService', 'userService', '$rootScope', 'clubService', 'schedulingService', 'datetimeService', function($scope, ngDialog, authService, coreDataService, userService, $rootScope, clubService, schedulingService, datetimeService) {
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
            role: ''
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
        
        $scope.$watch('ruleForm.periods', function(periods) {
            if($scope.ruleForm != null) {
                if(periods != 0 && periods != '' &&
                   $scope.ruleForm.periodDuration != 0 && $scope.ruleForm.periodDuration != '' &&
                   $scope.ruleForm.break != 0 && $scope.ruleForm.break != '') {
                    var per = parseInt(periods);
                    var pDur = parseInt($scope.ruleForm.periodDuration);
                    var br = parseInt($scope.ruleForm.break);

                    var totalDuration = (per * pDur) + ((per - 1) * br);
                    $scope.ruleForm.duration = totalDuration.toString();
                }
            }
            
        });
        
        $scope.$watch('ruleForm.periodDuration', function(periodDuration) {
            if($scope.ruleForm != null) {
                if($scope.ruleForm.periods != 0 && $scope.ruleForm.periods != '' &&
                   periodDuration != 0 && periodDuration != '' &&
                   $scope.ruleForm.break != 0 && $scope.ruleForm.break != '') {
                    var per = parseInt($scope.ruleForm.periods);
                    var pDur = parseInt($scope.ruleForm.periodDuration);
                    var br = parseInt($scope.ruleForm.break);

                    var totalDuration = (per * pDur) + ((per - 1) * br);
                    $scope.ruleForm.duration = totalDuration.toString();
                }
            }
        });
        
        $scope.$watch('ruleForm.break', function(breaks) {
            if($scope.ruleForm != null) {
                if($scope.ruleForm.periods != 0 && $scope.ruleForm.periods != '' &&
                   $scope.ruleForm.periodDuration != 0 && $scope.ruleForm.periodDuration != '' &&
                   breaks != 0 && breaks != '') {
                    var per = parseInt($scope.ruleForm.periods);
                    var pDur = parseInt($scope.ruleForm.periodDuration);
                    var br = parseInt($scope.ruleForm.break);

                    var totalDuration = (per * pDur) + ((per - 1) * br);
                    $scope.ruleForm.duration = totalDuration.toString();
                }
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
        
        $scope.areFieldSizes = function() {
            return $rootScope.fieldSizes.length > 0;
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
            $scope.invite = {
                email: '',
                role: ''
            };
        };
        
        $scope.getInviteSentDate = function(inviteKey) {
            return datetimeService.getIsoDate(inviteKey);
        };
        
        $scope.revokeInvite = function(invite) {
            console.log("Revoking invite with key: " + invite.invite_key);
            userService.revokeUserInvite(invite.invite_key);
        };
        
        $scope.openAddLeague = function() {
            console.log("\n\nOpening dialog to add league");
            
            $scope.leagueForm = {
                name: '',
                shortname: '',
                minAgeGroup: '',
                maxAgeGroup: '',
                type: '',
                rescheduleDays: 0,
                consequence: '',
                fine: 0,
                logoURL: '',
                leagueId: ''
            };
            ngDialog.open({ template: 'views/addLeague.html', scope: $scope, className: 'ngdialog-theme-default custom-width-600', controller:"HomeController" });
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
        
        $scope.openEditLeague = function(league) {
            console.log("\n\nOpening dialog to edit league");
            console.log(league);
            $scope.league = league;
            
            $scope.leagueForm = {
                name: league.name,
                shortname: league.short_name,
                minAgeGroup: league.min_age_group._id,
                maxAgeGroup: league.max_age_group._id,
                type: league.type._id,
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
            $scope.teamForm = {
                name: '',
                ageGroup: '',
                gender: '',
                league: '',
                teamId: ''
            };
            
            console.log("\n\nOpening dialog to add team");
            ngDialog.open({ template: 'views/addTeam.html', scope: $scope, className: 'ngdialog-theme-default custom-width-600', controller:"HomeController" });
        }; 
        
        $scope.openAddField = function(facility) {
            console.log("\nOpening dialog to add field");
            $scope.short_name = facility.short_name;
            $scope.facilityName = facility.name;
            $scope.tempFacility = facility;
            $scope.fieldForm = {
                name: '',
                size: {},
                lights: false,
                game: false,
                practice: false,
                tournament: false,
                training: false,
                surface: ''
            };
            
            ngDialog.open({ template: 'views/addField.html', scope: $scope, className: 'ngdialog-theme-default custom-width-600', controller:'HomeController'});
        };
        
        $scope.addField = function() {
            console.log("\n\nAdding field");
            $scope.fieldForm.facility = $scope.tempFacility;
            console.log($scope.fieldForm);
            coreDataService.addField($scope.fieldForm);
            ngDialog.close();
        };
        
        $scope.openEditField = function(field, myFacility) {
            console.log("\n\nOpening dialog to edit field");
            console.log(field);
            $scope.short_name = myFacility.short_name;
            $scope.facilityName = myFacility.name;
            $scope.fieldForm = {
                name: field.name,
                facility: myFacility,
                size: field.size,
                lights: field.lights,
                game: field.game,
                practice: field.practice,
                tournament: field.tournament,
                training: field.training,
                condition: field.condition,
                surface: field.surface,
                id: field._id
            };
                
            console.log("Current entries include: ");
            console.log($scope.fieldForm);
            ngDialog.open({ template: 'views/editField.html', scope: $scope, className: 'ngdialog-theme-default custom-width-600', controller:"HomeController" });
        };
        
        $scope.editField = function() {
            console.log("\n\nEditing field");
            console.log($scope.fieldForm);
            coreDataService.editField($scope.fieldForm);
            ngDialog.close();
        };
        
        $scope.addFieldSize = function() {
            console.log("\n\nAdding field size");
            console.log($scope.fieldSizeForm);
            coreDataService.addFieldSize($scope.fieldSizeForm);
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
        
        $scope.getTeamLeague = function(team) {
            console.log("RETRIEVING LEAGUE NAME FOR TEAM " + team.name);
            coreDataService.getTeamLeague(team._id) 
                .then(function(response) {
                    console.log("Retrieved league ");
                    console.log(response.data[0]);
                    $scope.openEditTeam(team, response.data[0])
                }, function(err) {
                    console.log("Error while retrieveing league" );
                    console.log(err);
            });
            
        };
        
        $scope.getTeamLeagueName = function(team) {
            var leagues = team.leagues;
            
            var leagueString = '';
            for(var i = 0; i < leagues.length; i++) {
                leagueString += leagues[i].name + '\n';
            }
            return leagueString;
        };
        
        $scope.openEditTeam = function(team, league) {
            console.log("\n\nOpening dialog to edit team");
            console.log(team);
            
            $scope.teamForm = {
                name: team.name,
                ageGroup: team.age_group._id,
                gender: team.gender._id,
                league: league._id,
                teamId: team._id
            };  
            
            console.log("teamForm contains: ");
            console.log($scope.teamForm);
                
            ngDialog.open({ template: 'views/editTeam.html', scope: $scope, className: 'ngdialog-theme-default custom-width-600', controller:"HomeController" });
        };
        
        $scope.editTeam = function() {
            console.log("\n\nEditing team");
            console.log($scope.teamForm);
            clubService.editTeam($scope.teamForm);
            ngDialog.close();
        };
        
        $scope.openAddAgeGroup = function() {
            $scope.ageGroupForm = {
                name: '',
                birthyear: '',
                socceryear: '' 
            };
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
            var mySocceryear = ageGroup.soccer_year.slice(1);
            
            $scope.ageGroupForm = {
                name: ageGroup.name,
                birthyear: ageGroup.birth_year,
                socceryear: mySocceryear 
            };
                
            console.log("Current entries include: ");
            console.log($scope.ageGroupForm);
            ngDialog.open({ template: 'views/editAgeGroup.html', scope: $scope, className: 'ngdialog-theme-default', controller:"HomeController" });
        };
        
        $scope.editAgeGroup = function() {
            console.log("\n\nEditing age group");
            console.log($scope.ageGroupForm);
            coreDataService.editAgeGroup($scope.ageGroupForm, $scope.editingAgeGroupId);
            ngDialog.close();
        };
        
        $scope.deleteAgeGroup = function(ageGroup) {
            console.log("\n\nDeleting age group");
            console.log(ageGroup);
            coreDataService.deleteAgeGroup(ageGroup);
            ngDialog.close();
        };
        
        $scope.openAddFieldSize = function() {
            console.log("\n\nOpening dialog to add field size");
            ngDialog.open({ template: 'views/addFieldSize.html', scope: $scope, className: 'ngdialog-theme-default custom-width-500', controller:"HomeController" });
        };
        
        $scope.openEditFieldSize = function(fieldsize) {
            console.log("\n\nOpening dialog to edit field size");
            console.log(fieldsize);
            $scope.fieldSizeForm = {
                name: fieldsize.name,
                unit: fieldsize.unit,
                maxlength: fieldsize.max_length,
                maxwidth: fieldsize.max_width,
                minlength: fieldsize.min_length,
                minwidth: fieldsize.min_width,
                id: fieldsize._id                
            };
                
            console.log("Current entries include: ");
            console.log($scope.fieldSizeForm);
            ngDialog.open({ template: 'views/editFieldSize.html', scope: $scope, className: 'ngdialog-theme-default custom-width-500', controller:"HomeController" });
        };
        
        $scope.editFieldSize = function() {
            console.log("\n\nEditing field size");
            console.log($scope.fieldSizeForm);
            coreDataService.editFieldSize($scope.fieldSizeForm);
            ngDialog.close();
        };
        
        $scope.clearFieldSizeForm = function() {
            $scope.fieldSizeForm = {};
        };
        
        $scope.deleteLeague = function(league) {
            console.log("\n\nDeleting league");
            console.log(league);
            coreDataService.deleteLeague(league);
        };
        
        $scope.openAddRule = function() {
            console.log("\n\nOpening dialog to add rule");
            
            $scope.ruleForm = {
                league: '',
                age: '',
                duration: '',
                players: '',
                break: '',
                ballsize: '',
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
            ngDialog.open({ template: 'views/addRule.html', scope: $scope, className: 'ngdialog-theme-default custom-width-600', controller:"HomeController" });
        }; 
        
        $scope.addRule = function() {
            console.log("\n\nAdding rule");
            console.log($scope.ruleForm);
            coreDataService.addRule($scope.ruleForm);
            ngDialog.close();
        };
        
        $scope.openEditRule = function(rule) {
            console.log("\n\nOpening dialog to add rule");
            console.log(rule);
            
            $scope.ruleForm = {
                league: rule.league._id,
                age: rule.age_group._id,
                duration: rule.duration_minutes,
                players: rule.fielded_players.toString(),
                break: rule.intermission_duration_minutes,
                ballsize: rule.ball_size,
                maxFieldLen: rule.max_field_length,
                maxFieldWidth: rule.max_field_width,
                goalHeight: rule.goal_height_ft,
                goalWidth: rule.goal_width_ft,
                periods: rule.num_periods,
                periodDuration: rule.period_duration_minutes,
                goalkeeper: rule.goalkeeper,
                buildout: rule.build_out_line,
                offside: rule.offside,
                header: rule.heading,
                ruleId: rule._id
            };            
            console.log("\n\nForm now contains:");
            console.log($scope.ruleForm);
            ngDialog.open({ template: 'views/editRule.html', scope: $scope, className: 'ngdialog-theme-default custom-width-600', controller:"HomeController" });
        }; 
        
        $scope.editRule = function() {
            console.log("\n\nUpdating rule");
            console.log($scope.ruleForm);
            coreDataService.editRule($scope.ruleForm);
            ngDialog.close();
        };
        
        $scope.deleteRule = function(rule) {
            console.log("\n\nDeleting rule" );
            console.log(rule);
            
            coreDataService.deleteRule(rule)
                .then(function(response) {
                    console.log("Successfully deleted rule: ");
                    console.log(response);
                    coreDataService.refreshRules();
                }, function(errResponse) {
                    console.log("Failed on attempt to delete rule:");
                    console.log(errResponse);
                });
        };
        
        $scope.openAddFacility = function() {
            console.log("\n\nOpening dialog to add facility");
            ngDialog.open({ template: 'views/addFacility.html', scope: $scope, className: 'ngdialog-theme-default custom-width-800', controller:"HomeController" });
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
            ngDialog.open({ template: 'views/updateFacility.html', scope: $scope, className: 'ngdialog-theme-default custom-width-600', controller:"HomeController" });
        };
        
        $scope.openFieldStatus = function(field) {
            console.log("\n\nOpening dialog to change field status");
            $rootScope.fieldStatusName = field.name;
            $rootScope.fieldStatusEntity = field;         
            $scope.fuForm.entity = field;
            ngDialog.open({ template: 'views/updateField.html', scope: $scope, className: 'ngdialog-theme-default custom-width-600', controller:"HomeController" });
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
        
        $scope.getUnitPrettyName = function(unit) {
            return coreDataService.getUnitPrettyName(unit);            
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

