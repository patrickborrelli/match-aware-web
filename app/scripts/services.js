'use strict';

angular.module('ma-app')
    .constant("baseURL","https://matchaware-rest.herokuapp.com/")
    .constant("googleGeocodeKey", "&key=AIzaSyCpClStUy156rFgjGJsYLBdKfBUEBZ1iLU")
    .constant("googleGeolocateBaseURL", "https://maps.googleapis.com/maps/api/geocode/json?address=")

    .service('coreDataService', ['$http', 'baseURL', '$rootScope', function($http, baseURL, $rootScope) {
        $rootScope.clubs = {};
        $rootScope.roles = {};   
        $rootScope.ageGroups = {};
        $rootScope.events = {};
        $rootScope.facilities = {}; 
        $rootScope.fields = {}; 
        $rootScope.fieldSizes = {};
        $rootScope.genders = {};
        $rootScope.leagues = {}; 
        $rootScope.leagueTypes = {};
        $rootScope.messages = {};
        $rootScope.notifications = {};
        $rootScope.organizations = {};
        $rootScope.rules = {}; 
        $rootScope.teams = {};
        $rootScope.users = {}; 
        $rootScope.userInvites = {};
        $rootScope.accessRequests = {};
        
        var clubsLoaded = false;
        var rolesLoaded = false;
        var ageGroupsLoaded = false;
        var eventsLoaded = false;
        var facilitiesLoaded = false;
        var fieldsLoaded = false;
        var fieldSizesLoaded = false;
        var genderLoaded = false;
        var leaguesLoaded = false;
        var leagueTypesLoaded = false;
        var messagesLoaded = false;
        var notificationsLoaded = false;
        var organizationsLoaded = false;
        var rulesLoaded = false;
        var teamsLoaded = false;
        var usersLoaded = false;
        var userInvitesLoaded = false;  
        var accessRequestsLoaded = false;        
        
        this.getRolePrettyName = function(roleName) {
            var prettyName = roleName;
            
            switch(roleName) {
                case "CLUB_ADMIN":
                    prettyName = "Club Administrator";
                    break;
                    
                case "FIELD_ADMIN":
                    prettyName = "Field Administrator";
                    break;
                    
                case "REFEREE_ASSIGNOR":
                    prettyName = "Referee Assignor";
                    break;
                    
                case "TRAINING_ADMIN":
                    prettyName = "Training Administrator";
                    break;
                    
                case "COACH":
                    prettyName = "Coach";
                    break;
                    
                case "TRAINER":
                    prettyName = "Trainer";
                    break;
                    
                case "REFEREE":
                    prettyName = "Referee";
                    break;
                    
                case "PARENT":
                    prettyName = "Parent";
                    break;
                    
                case "PLAYER":
                    prettyName = "Player";
                    break;
                    
                default :
                    prettyName = roleName;
                    break;   
            }
            
            return prettyName;
        };
        
        this.appDataLoad = function() {
            if(!rolesLoaded) {
                //retrieve roles:
                $http({
                    url: baseURL + 'roles/',
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json' 
                    }
                }).then(function(response) {
                    console.log("Retrieved the roles from the API: ");
                    console.log(response);
                    $rootScope.roles = response.data;
                    rolesLoaded = true;
                });
            }
            
            if(!clubsLoaded) {
                //retrieve clubs:
                $http({
                    url: baseURL + 'clubs/',
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json' 
                    }
                }).then(function(response) {
                    console.log("Retrieved the clubs from the API: ");
                    console.log(response);
                    $rootScope.clubs = response.data;
                    clubsLoaded = true;
                }); 
            }
            
            if(!ageGroupsLoaded) {
                //retrieve age groups:
                $http({
                    url: baseURL + 'age_groups/',
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json' 
                    }
                }).then(function(response) {
                    console.log("Retrieved the age groups from the API: ");
                    console.log(response);
                    $rootScope.ageGroups = response.data;
                    ageGroupsLoaded = true;
                }); 
            }
            
            if(!eventsLoaded) {
                //retrieve events:
                $http({
                    url: baseURL + 'events/',
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json' 
                    }
                }).then(function(response) {
                    console.log("Retrieved the events from the API: ");
                    console.log(response);
                    $rootScope.events = response.data;
                    eventsLoaded = true;
                }); 
            }
            
            if(facilitiesLoaded) {
                //retrieve facilities:
                $http({
                    url: baseURL + 'facilities/',
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json' 
                    }
                }).then(function(response) {
                    console.log("Retrieved the facilities from the API: ");
                    console.log(response);
                    $rootScope.facilities = response.data;
                    facilitiesLoaded = true;
                }); 
            }
            
            if(!fieldsLoaded) {
                //retrieve fields:
                $http({
                    url: baseURL + 'fields/',
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json' 
                    }
                }).then(function(response) {
                    console.log("Retrieved the fields from the API: ");
                    console.log(response);
                    $rootScope.fields = response.data;
                    fieldsLoaded = true;
                }); 
            }
            
            if(!fieldSizesLoaded) {
                //retrieve field sizes:
                $http({
                    url: baseURL + 'field_sizes/',
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json' 
                    }
                }).then(function(response) {
                    console.log("Retrieved the field sizes from the API: ");
                    console.log(response);
                    $rootScope.fieldSizes = response.data;
                    fieldSizesLoaded = true;
                }); 
            }
            
            if(!genderLoaded) {
                //retrieve gender:
                $http({
                    url: baseURL + 'genders/',
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json' 
                    }
                }).then(function(response) {
                    console.log("Retrieved the genders from the API: ");
                    console.log(response);
                    $rootScope.genders = response.data;
                    genderLoaded = true;
                }); 
            }
            
            if(!leaguesLoaded) {
                //retrieve leagues:
                $http({
                    url: baseURL + 'leagues/',
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json' 
                    }
                }).then(function(response) {
                    console.log("Retrieved the leagues from the API: ");
                    console.log(response);
                    $rootScope.leagues = response.data;
                    leaguesLoaded = true;
                }); 
            }
            
            if(!leagueTypesLoaded) {
                //retrieve league types:
                $http({
                    url: baseURL + 'league_types/',
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json' 
                    }
                }).then(function(response) {
                    console.log("Retrieved the leagueTypes from the API: ");
                    console.log(response);
                    $rootScope.leagueTypes = response.data;
                    leagueTypesLoaded = true;
                }); 
            }
            
            if(!messagesLoaded) {
                //retrieve messages:
                $http({
                    url: baseURL + 'messages/',
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json' 
                    }
                }).then(function(response) {
                    console.log("Retrieved the messages from the API: ");
                    console.log(response);
                    $rootScope.messages = response.data;
                    messagesLoaded = true;
                }); 
            }
            
            if(!notificationsLoaded) {
                //retrieve notifications:
                $http({
                    url: baseURL + 'notifications/',
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json' 
                    }
                }).then(function(response) {
                    console.log("Retrieved the notifications from the API: ");
                    console.log(response);
                    $rootScope.notifications = response.data;
                    notificationsLoaded = true;
                }); 
            }
            
            if(!organizationsLoaded) {
                //retrieve organizations:
                $http({
                    url: baseURL + 'organizations/',
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json' 
                    }
                }).then(function(response) {
                    console.log("Retrieved the organizations from the API: ");
                    console.log(response);
                    $rootScope.organizations = response.data;
                    organizationsLoaded = true;
                }); 
            }
            
            if(!rulesLoaded) {
                //retrieve rules:
                $http({
                    url: baseURL + 'rules/',
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json' 
                    }
                }).then(function(response) {
                    console.log("Retrieved the rules from the API: ");
                    console.log(response);
                    $rootScope.rules = response.data;
                    rulesLoaded = true;
                }); 
            }
            
            if(!teamsLoaded) {
                //retrieve teams:
                $http({
                    url: baseURL + 'teams/',
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json' 
                    }
                }).then(function(response) {
                    console.log("Retrieved the teams from the API: ");
                    console.log(response);
                    $rootScope.teams = response.data;
                    teamsLoaded = true;
                }); 
            }
            
            if(!usersLoaded) {
                //retrieve users:
                $http({
                    url: baseURL + 'users/',
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json' 
                    }
                }).then(function(response) {
                    console.log("Retrieved the users from the API: ");
                    console.log(response);
                    $rootScope.users = response.data;
                    usersLoaded = true;
                }); 
            }
            
            if(!userInvitesLoaded) {
                //retrieve user invites:
                $http({
                    url: baseURL + 'user_invites/',
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json' 
                    }
                }).then(function(response) {
                    console.log("Retrieved the user invites from the API: ");
                    console.log(response);
                    $rootScope.userInvites = response.data;
                    userInvitesLoaded = true;
                }); 
            }
            
            if(!accessRequestsLoaded) {
                //retrieve access requests:
                $http({
                    url: baseURL + 'access_requests/',
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json' 
                    }
                }).then(function(response) {
                    console.log("Retrieved the access requests from the API: ");
                    console.log(response);
                    $rootScope.accessRequests = response.data;
                    accessRequestsLoaded = true;
                }); 
            }
        };        
        
    }])

    .service('userService', ['$http', 'baseURL', '$rootScope', function($http,baseURL, $rootScope) {
        $rootScope.usersClubs = [];
        $rootScope.userHasClub = false;
        $rootScope.userHasMultipleClubs = false;
        $rootScope.currentClub;
        
        this.getUsers = function(){
            return $http.get(baseURL+"users");
        };   
        
        this.addUserToRole = function(userId, roleId) {
            //make http request:
            return $http({
                url: baseURL + 'users/addUserRole/' + userId + '/' + roleId,
                method: 'PUT',
                headers: {
                    'content-type': 'application/json' 
                }
            });
        };
        
        this.getUserClubs = function(userId) {
            return $http({
                url: baseURL + 'club_members/findClubMemberships/' + userId,
                method: 'GET',
                headers: {
                    'content-type': 'application/json' 
                }
            });
        };
        
        this.cleanupLoggedOutUser = function() {
            $rootScope.usersClubs = [];
            $rootScope.userHasClub = false;
            $rootScope.userHasMultipleClubs = false;
            $rootScope.currentClub = {};
        };
        
        this.populateUsersClubs = function(userClubs) {
            console.log("Entering populate users clubs");
            console.log(userClubs);
            if(userClubs.length == 1) {
                $rootScope.userHasClub = true;
                $rootScope.currentClub = userClubs[0];
                $rootScope.usersClubs.push(userClubs[0]);
            } else if(userClubs.length > 1) {
                $rootScope.userHasMultipleClubs = true;
                $rootScope.userHasClub = true;
                for(var i = 0; i < userClubs.length; i++) {
                    $rootScope.usersClubs.push(userClubs[i]);
                }
            }
            if($rootScope.userHasClub && !$rootScope.userHasMultipleClubs) {
                console.log("User belongs to " + $rootScope.currentClub.name);
            } else if($rootScope.userHasMultipleClubs) {
                console.log("User belongs to multiple clubs:");
                console.log($rootScope.usersClubs);
            }
            
            console.log("userHasClub = " + $rootScope.userHasClub + " and userHasMultipleClubs = " + $rootScope.userHasMultipleClubs);
        };
        
    }])

    .service('clubService', ['$http', 'baseURL', 'ngDialog', '$rootScope', '$state', function($http, baseURL, ngDialog, $rootScope, $state) {        
        var currentClub = {};
        
        this.getCurrentClubId = function() {
            return currentClub._id;
        };
        
        this.clearCurrentClub = function() {
            currentClub = {};
        };
        
        this.createClub = function(createClubData) {
            //make http request:
            return $http({
                url: baseURL + 'clubs/',
                method: 'POST',
                headers: {
                    'content-type': 'application/json' 
                },
                data: createClubData
            });
        };
        
        this.joinClub = function(userId, clubId) { 
            //make http request:
            console.log("Attempting to add user: " + userId + " to club: " + clubId);
            return $http({
                url: baseURL + 'club_members/',
                method: 'POST',
                headers: {
                    'content-type': 'application/json' 
                },
                data: {"club": clubId, "user": userId}
            });
        };        
        
    }])
                             
    .service('authService', ['$http', 'baseURL', 'ngDialog', '$rootScope', '$state', 'userService', 'coreDataService', 'clubService', function($http, baseURL, ngDialog, $rootScope, $state, userService, coreDataService, clubService) {
        var authToken = undefined;
        var isAuthenticated = false;
        var username = '';  
        var loggedIn = false;
        var userId = '';
        var user = {};
        var clubAdmin = false;
        var fieldAdmin = false;
        var refereeAssignor = false;
        var trainingAdmin = false;
        var coach = false;
        var trainer = false;
        var referee = false;
        var parent = false;
        var player = false;
        var hasRole = false;
        var hasMultipleRoles = false;
        var currentRole = {};
        var adminRoleId = '';   
        var currentUserStale = false;
        
        //WHY DOESNT THIS WORK?
        this.getRoleId = function(rolename) {
            /*console.log("Received role name: " + rolename);
            $rootScope.roles.forEach(function(role) {
                var role_name = role.name;
                console.log("Comparing " + rolename + " to " + role_name + " or " + role.name);
                if(rolename.equalsIgnoreCase(role_name)) {
                    console.log("Comparing " + rolename + " to " + role_name + " is successful");
                    return role.id;
                }
            });*/
            //make http request:
            return $http({
                url: baseURL + 'roles?name=' + rolename,
                method: 'GET',
                headers: {
                    'content-type': 'application/json' 
                }
            });
        };
        
        this.getCurrentRole = function() {
            return currentRole.name;  
        };

        this.login = function(loginData) {
            //make http request:
            $http({
                url: baseURL + 'users/login',
                method: 'POST',
                headers: {
                    'content-type': 'application/json' 
                },
                data: loginData
            }).then(function(response) {
                console.log(response);
                setUserCredentials({username:loginData.username, token: response.data.token, fullname: response.data.fullname, userId: response.data.userId});                 
                $rootScope.loggedIn = true;
                console.log("")
                
                //retrieve user and store in scope:
                $http({
                    url: baseURL + 'users/'+userId,
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json' 
                    }
                }).then(function(response) {
                    console.log("Retrieved the user from the API with value: ");
                    console.log(response);
                    user = response.data;
                    internalPopulateUserRoles(response.data.roles);
                    //determine if user has any club affiliations:
                    //retrieve clubs:
                    userService.getUserClubs(userId)
                        .then(function(response) {
                            console.log("Retrieved the clubs the user belongs to: ");
                            console.log(response);
                            userService.populateUsersClubs(response.data);
                        }, function(errResponse) {
                            console.log("Encountered error when trying to retrieve users clubs.")
                            console.log(errResponse);
                    });
                    //do app data load:
                    coreDataService.appDataLoad();
                });   
                
                $state.go("app.home");
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
        };        
        
        var internalLogin = this.login;
        
        this.logout = function() {
            //make http request:
            $http({
                url: baseURL + 'users/logout',
                method: 'POST',
                headers: {
                    'content-type': 'application/json' 
                }               
            }).then(function(response) {
                console.log(response);                 
                $rootScope.loggedIn = false;
                destroyUserCredentials();
                $state.go("app");
            }, function(errResponse) {           
                var message = '\
                <div class="ngdialog-message">\
                <div><h3>Logout Unsuccessful</h3></div>' +
                  '<div><p>' +  response.data.err.message + '</p><p>' +
                    response.data.err.name + '</p></div>' +
                '<div class="ngdialog-buttons">\
                    <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=confirm("OK")>OK</button>\
                </div>'

                ngDialog.openConfirm({ template: message, plain: 'true'});
            });
            
        };
        
        this.getCurrentUser = function() {
            if(currentUserStale) {
                currentUserStale = false;
                return $http({
                   url: baseURL + 'users/'+ user._id,
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json' 
                    }
                });
                
            } else {
                return user;
            }            
        };
        
        this.setCurrentUser = function(currentUser) {
            user = currentUser;
        };
        
        this.setCurrentUserStale = function() {
            currentUserStale = true;
        };
        
        this.register = function(registerData) {
            //make http request
            console.log(registerData);
            $http({
                url: baseURL + 'users/register',
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                data: registerData
            }).then(function(response) {
                console.log("successfully registered a user.");
                
                console.log("will attempt to log user in with username: " + registerData.username + " and password: " + registerData.password);
                internalLogin({username:registerData.username, password:registerData.password});
                var message = '\
                <div class="ngdialog-message">\
                <div><h3>Registration Successful</h3></div>' +
                '<div class="ngdialog-buttons">\
                    <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=confirm("OK")>OK</button>\
                </div>'
            
                ngDialog.openConfirm({ template: message, plain: 'true'});
                
            }, function(response) {
                console.log("failed to registered a user.");
                var message = '\
                <div class="ngdialog-message">\
                <div><h3>Login Unsuccessful</h3></div>' +
                  '<div><p>' +  response.data.err.message + '</p><p>' +
                    response.data.err.name + '</p></div>' +
                '<div class="ngdialog-buttons">\
                    <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=confirm("OK")>OK</button>\
                </div>'
            
                ngDialog.openConfirm({ template: message, plain: 'true'});
            });
        };
        
        function setUserCredentials(credentials) {
            isAuthenticated = true;
            username = credentials.username;
            authToken = credentials.token;
            loggedIn = true;
            $rootScope.fullname = credentials.fullname;
            $rootScope.username = credentials.username;
            userId = credentials.userId;

            // Set the token as header for your requests!
            $http.defaults.headers.common['x-access-token'] = authToken;
            console.log("user credentials have been set \nisAuthenticated: " + 
                        isAuthenticated + "\nusername: " + username + "\nauthToken: " + 
                        authToken + "\nloggedIn: " + loggedIn + "\nfullname: " +
                        $rootScope.fullname + "\nuserId: " + userId);
        };
        
        function destroyUserCredentials() {
            isAuthenticated = false;
            username = '';
            authToken = '';
            loggedIn = false;
            $rootScope.fullname = '';
            $rootScope.username = '';
            userId = '';
            
            user = {};
            clubAdmin = false;
            fieldAdmin = false;
            refereeAssignor = false;
            trainingAdmin = false;
            coach = false;
            trainer = false;
            referee = false;
            parent = false;
            player = false;
            hasRole = false;
            hasMultipleRoles = false;
            currentRole = {};
            
            clubService.clearCurrentClub();
            userService.cleanupLoggedOutUser();

            // Set the token as header for your requests!
            $http.defaults.headers.common['x-access-token'] = authToken;
            console.log("user credentials have been destroyed \nisAuthenticated: " + 
                        isAuthenticated + "\nusername: " + username + "\nauthToken: " + 
                        authToken + "\nloggedIn: " + loggedIn + "\nfullname: " +
                        $rootScope.fullname + "\nuserId: " + userId);
        };
        
        this.populateUserRoles = function(roles) {
            console.log("Entering populate user roles");
            console.log("attempting to parse roles: " + roles.length); 
            var role;
            
            if(roles.length < 1) {
                hasRole = false;
                hasMultipleRoles = false;
                return;
            } else if(roles.length > 1) {
                hasRole = true;
                hasMultipleRoles = true;
            } else {
                hasRole = true;
                hasMultipleRoles = false;
            }
            
            for(var i = 0; i < roles.length; i++) {
                role = roles[i].name;
                switch(role) {
                    case 'CLUB_ADMIN':
                        clubAdmin = true;
                        if(!hasMultipleRoles) currentRole = roles[i];
                        break;
                        
                    case 'FIELD_ADMIN':
                        fieldAdmin = true;
                        if(!hasMultipleRoles) currentRole = roles[i];
                        break;
                        
                    case 'REFEREE_ASSIGNOR':
                        refereeAssignor = true;
                        if(!hasMultipleRoles) currentRole = roles[i];
                        break;
                        
                    case 'TRAINING_ADMIN':
                        trainingAdmin = true;
                        if(!hasMultipleRoles) currentRole = roles[i];
                        break;
                        
                    case 'COACH':
                        coach = true;
                        if(!hasMultipleRoles) currentRole = roles[i];
                        break;
                        
                    case 'TRAINER':
                        trainer = true;
                        if(!hasMultipleRoles) currentRole = roles[i];
                        break;
                        
                    case 'REFEREE':
                        referee = true;
                        if(!hasMultipleRoles) currentRole = roles[i];
                        break;
                        
                    case 'PARENT':
                        parent = true;
                        if(!hasMultipleRoles) currentRole = roles[i];
                        break;
                        
                    case 'PLAYER':
                        player = true;
                        if(!hasMultipleRoles) currentRole = roles[i];
                        break;
                        
                    default:
                        break;
                }
            }
        };
        
        var internalPopulateUserRoles = this.populateUserRoles;

        this.getCurrentUserId = function() {
            console.log("Current user ID: " + user._id);
            return user._id;
        };
        
        this.userHasRoles = function() {
            console.log("returning " + hasRole);
            return hasRole;
        };
        
        this.isLoggedIn = function() {
            return loggedIn;
        };
        
        this.loadClubs = function() {
            //make http request:
            $http({
                url: baseURL + 'clubs/',
                method: 'GET',
                headers: {
                    'content-type': 'application/json' 
                }
            }).then(function(response) {
                console.log(response);
                
            }, function(errResponse) {           
                var message = '\
                <div class="ngdialog-message">\
                <div><h3>Server Error</h3></div>' +
                  '<div><p>' +  response.data.err.message + '</p><p>' +
                    response.data.err.name + '</p></div>' +
                '<div class="ngdialog-buttons">\
                    <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=confirm("OK")>OK</button>\
                </div>'
                ngDialog.openConfirm({ template: message, plain: 'true'});
            });
        };
    }]);
