'use strict';

angular.module('ma-app')
    .constant("baseURL","https://matchaware-rest.herokuapp.com/")
    .constant("googleGeocodeKey", "key=AIzaSyCpClStUy156rFgjGJsYLBdKfBUEBZ1iLU")
    .constant("googleGeolocateBaseURL", "https://maps.googleapis.com/maps/api/geocode/json?")
    .constant("googleMapsBaseURL", "https://www.google.com/maps/embed/v1/place?")

    .service('coreDataService', ['$http', 'baseURL', '$rootScope', 'googleGeolocateBaseURL', 'googleGeocodeKey', 'googleMapsBaseURL',  function($http, baseURL, $rootScope, googleGeolocateBaseURL, googleGeocodeKey, googleMapsBaseURL) {
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
        
        this.cleanupOnLogout = function() {
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

            clubsLoaded = false;
            rolesLoaded = false;
            ageGroupsLoaded = false;
            eventsLoaded = false;
            facilitiesLoaded = false;
            fieldsLoaded = false;
            fieldSizesLoaded = false;
            genderLoaded = false;
            leaguesLoaded = false;
            leagueTypesLoaded = false;
            messagesLoaded = false;
            notificationsLoaded = false;
            organizationsLoaded = false;
            rulesLoaded = false;
            teamsLoaded = false;
            usersLoaded = false;
            userInvitesLoaded = false;  
            accessRequestsLoaded = false; 
        };
        
        this.getGoogleMapURL = function(formattedAddress) {
            var url = googleMapsBaseURL + googleGeocodeKey +
                '&q=' + formattedAddress;            
            return url;
        };
        
        var localGoogleMapURL = this.getGoogleMapURL;
        
        this.processAccessRequestAccept = function(request) {
            var hasTeam = false;
            var userId = request.user._id;
            var clubId = request.club._id;
            var roleId = request.role._id;
            var teamId;
            var inClub = false;
            
            var postString = '{"club": "' + clubId + '", "user": "' + userId + '"}';
            var teamPostString = '{"team": "' + teamId + '", "member": "' + userId + '", "role": "' + roleId + '"}';
            
            if(request.team != null) {
                hasTeam = true;
                teamId = request.team._id;
            }
            
            //if user is not already affiliated with the club, add them:
            $http({
                url: baseURL + 'club_members/findClubMemberships/' + userId,
                method: 'GET',
                headers: {
                    'content-type': 'application/json' 
                }
            }).then(function(response) {
                if(response.data.length > 0) {
                    for(var i = 0; i < response.data.length; i++) {
                        if(response.data[i]._id == clubId) {
                            inClub = true;
                            break;
                        }
                    }
                }
                
                if(!inClub) {
                    $http({
                        url: baseURL + 'club_members/',
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json' 
                        },
                        data: postString
                    }).then(function(response) {
                        console.log("User added to club");
                        console.log(response);
                    }, function(errResponse) {
                        console.log("Failed to add user to club");
                        console.log(errResponse);
                    });
                }
            });
            
            //next, if user is being granted team access, add them to the team:
            if(hasTeam) {
                $http({
                    url: baseURL + 'team_members/',
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json' 
                    },
                    data: teamPostString
                }).then(function(response) {
                    console.log("User added to team");
                    console.log(response);
                }, function(errResponse) {
                    console.log("Failed to add user to team");
                    console.log(errResponse);
                });
            }
            
            //next, if user is not already affiliated with the role, add them:
            var userAlreadyInRole = false;
            for(var i = 0; i < request.user.roles.length; i++) {
                if(request.user.roles[i]._id == roleId) {
                    userAlreadyInRole = true;
                    break;
                }
            }
            
            if(!userAlreadyInRole) {
                $http({
                    url: baseURL + 'users/addUserRole/' + userId + '/'+ roleId,
                    method: 'PUT',
                    headers: {
                        'content-type': 'application/json' 
                    }
                }).then(function(response) {
                    console.log("User added to role");
                    console.log(response);
                }, function(errResponse) {
                    console.log("Failed to add user to role");
                    console.log(errResponse);
                });
            }
            
            //finally, change access request status and reload access requests for this user:
            $http({
                url: baseURL + 'access_requests/' + request._id,
                method: 'PUT',
                headers: {
                    'content-type': 'application/json' 
                },
                data: '{"status": "ACCEPTED"}'
            }).then(function(response) {
                console.log("Successfully marked access request ACCEPTED");
                console.log(response);
                //so, reload the access requests for this user:
                //retrieve access requests:
                $http({
                    url: baseURL + 'access_requests/findByApprover/' + $rootScope.currentUser._id,
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
            }, function(errResponse) {
                console.log("Failed to mark access request ACCEPTED");
                console.log(errResponse);
            });          
            //TODO: send email/notification/text
        };
        
        this.processAccessRequestDecline = function(request) {
            //change access request status and reload access requests for this user:
            $http({
                url: baseURL + 'access_requests/' + request._id,
                method: 'PUT',
                headers: {
                    'content-type': 'application/json' 
                },
                data: '{"status": "REJECTED"}'
            }).then(function(response) {
                console.log("Successfully marked access request REJECTED");
                console.log(response);
                //so, reload the access requests for this user:
                //retrieve access requests:
                $http({
                    url: baseURL + 'access_requests/findByApprover/' + $rootScope.currentUser._id,
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
            }, function(errResponse) {
                console.log("Failed to mark access request REJECTED");
                console.log(errResponse);
            });     
            
            //TODO: send email/notification/text
        };
        
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
        
        this.appDataLoad = function(curUser) {
            
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
            
            if(!facilitiesLoaded) {
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
                    
                    //attempt to build the google map url dynamically here and store it in the facilities objects before putting them in the root scope:
                    var fac = response.data;
                    console.log("Trying to pull out the data...length is " + fac.length);
                    console.log(fac);
                    var mapString;
                    for(var i = 0; i < fac.length; i++) {
                        mapString = localGoogleMapURL(fac[i].google_maps_address);
                        fac[i].google_map_string = mapString;
                        console.log(fac[i]);
                    }         
                    $rootScope.facilities = fac;
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
                    url: baseURL + 'access_requests/findByApprover/' + curUser._id,
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json' 
                    }
                }).then(function(response) {
                    console.log("Retrieved the access requests from the API: ");
                    console.log(response);
                    $rootScope.accessRequests = response.data;
                    accessRequestsLoaded = true;
                    //now update all access requests as seen by this user (change state to PENDING)
                    var putString = '{"status": "PENDING"}';
                    for(var i = 0; i < response.data.length; i++) {
                        console.log("Attempting to send " + baseURL + "access_requests/" + response.data[i]._id);
                        $http({
                            url: baseURL + 'access_requests/' + response.data[i]._id,
                            method: 'PUT',
                            headers: {
                                'content-type': 'application/json' 
                            },
                            data: putString
                        }).then(function(response) {
                            ;
                        },function(errResponse) {
                            console.log(errResponse);
                        });
                    }
                }); 
            }
        };
        
        this.getCurrentClubUsers = function() {
            console.log("Entering getCurrentClubUsers");
            //retrieve users:
            $http({
                url: baseURL + 'club_members/findClubMembers/' + $rootScope.currentClub._id,
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
        };
        
        this.refreshUserInvites = function() {
            //retrieve invites:
            $http({
                url: baseURL + 'user_invites/',
                method: 'GET',
                headers: {
                    'content-type': 'application/json' 
                }
            }).then(function(response) {
                console.log("Retrieved the user invites from the API: ");
                console.log(response);
                $rootScope.user_invites = response.data;
                userInvitesLoaded = true;
            }); 
        };
        
        this.refreshTeams = function() {
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
        };
        
        this.refreshAgeGroups = function() {
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
        };
        
        var localRefreshAgeGroups = this.refreshAgeGroups;
        
        this.refreshLeagues = function() {
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
        };
        
        var localRefreshLeagues = this.refreshLeagues;
        
        this.refreshRules = function() {
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
        };
        
        var localRefreshRules = this.refreshRules;
        
        this.refreshFacilities = function() {
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

                //attempt to build the google map url dynamically here and store it in the facilities objects before putting them in the root scope:
                var fac = response.data;
                console.log("Trying to pull out the data...length is " + fac.length);
                console.log(fac);
                var mapString;
                for(var i = 0; i < fac.length; i++) {
                    mapString = localGoogleMapURL(fac[i].google_maps_address);
                    fac[i].google_map_string = mapString;
                    console.log(fac[i]);
                }         
                $rootScope.facilities = fac;
                facilitiesLoaded = true;
            }); 
        };
        
        var localRefreshFacilities = this.refreshFacilities;
        
        this.getRoleIdByName = function(roleName) {
            for(var i = 0; i < $rootScope.roles.length; i++) {
                if(String($rootScope.roles[i].name) == String(roleName)) {
                    return $rootScope.roles[i]._id;
                }
            }  
        };
        
        this.addAgeGroup = function(formData) {
            //post age group:            
            var postString = '{ "birth_year": "' + formData.birthyear + '", "soccer_year": "U' + formData.socceryear + '", "name": "' + formData.name + '" }';
            console.log("Posting age group with string: " + postString);
            $http({
                url: baseURL + 'age_groups/',
                method: 'POST',
                headers: {
                    'content-type': 'application/json' 
                },
                data: postString
            }).then(function(response) {
                console.log("Successfully added age group: ");
                console.log(response);
                localRefreshAgeGroups();
            }, function(errResponse) {
                console.log("Failed on attempt to add age group:");
                console.log(errResponse);
            });
        };
        
        this.addLeague = function(formData) {
            //post league:            
            var postString = '{ "name": "' + formData.name + '", "short_name": "' + formData.shortname + '", ';
            
            if(formData.minAgeGroup != null) {
                postString += '"min_age_group": "' + formData.minAgeGroup._id + '", ';
            }
            
            if(formData.maxAgeGroup != null) {
                postString += '"max_age_group": "' + formData.maxAgeGroup._id + '", ';
            }
            
            if(formData.rescheduleRuleId != null) {
                postString += '"reschedule_rule": "' + formData.rescheduleRuleId + '", ';
            }
            
            if(formData.logoURL != '') {
                postString += '"logo_url": "' + formData.logoURL + '", ';
            }
            
            postString += '"type": "' + formData.type._id + '" }';   
            console.log("Posting league with string: " + postString);
            
            $http({
                url: baseURL + 'leagues/',
                method: 'POST',
                headers: {
                    'content-type': 'application/json' 
                },
                data: postString
            }).then(function(response) {
                console.log("Successfully added league: ");
                console.log(response);
                localRefreshLeagues();
            }, function(errResponse) {
                console.log("Failed on attempt to add league:");
                console.log(errResponse);
            });
        };
        
        this.addRescheduleRule = function(days, consequence, fine) {
            var postString = '{ ';
            
            if(consequence != '') {
                postString += '"consequence": "' + consequence + '", ';
            }
            
            if(fine != '') {
                postString += '"fine": "' + fine + '", ';
            }
            
            postString += '"timespan_days": "' + days + '" }';
            
            console.log("Creating reschedule rule with string " + postString);
            
            return $http({
                url: baseURL + 'reschedule_rules/',
                method: 'POST',
                headers: {
                    'content-type': 'application/json' 
                },
                data: postString
            });
        };
        
        this.editAgeGroup = function(formData, ageGroupId) {
            //edit age group:   
            var putString = '{ "birth_year": "' + formData.birthyear + '", "soccer_year": "U' + formData.socceryear + '", "name": "' + formData.name + '" }';
            console.log("Updating age group with string: " + putString);
            $http({
                url: baseURL + 'age_groups/' + ageGroupId,
                method: 'PUT',
                headers: {
                    'content-type': 'application/json' 
                },
                data: putString
            }).then(function(response) {
                console.log("Successfully updated age group: ");
                console.log(response);
                localRefreshAgeGroups();
            }, function(errResponse) {
                console.log("Failed on attempt to update age group:");
                console.log(errResponse);
            });
        };
        
        this.deleteAgeGroup = function(ageGroup) {
            //delete age group:            
            $http({
                url: baseURL + 'age_groups/' + ageGroup._id,
                method: 'DELETE',
                headers: {
                    'content-type': 'application/json' 
                }
            }).then(function(response) {
                console.log("Successfully deleted age group: ");
                console.log(response);
                localRefreshAgeGroups();
            }, function(errResponse) {
                console.log("Failed on attempt to delete age group:");
                console.log(errResponse);
            });
        };
        
        this.addRule = function(formData) {
            //post rule:            
            var postString = '{ "league": "' + formData.league._id + '", ';
            
            if(formData.duration != '') {
                postString += '"duration_minutes": ' + formData.duration + ', ';
            }
            
            if(formData.players != '') {
                postString += '"fielded_players": ' + formData.players + ', ';
            }
            
            if(formData.maxFieldLen != '') {
                postString += '"max_field_length": ' + formData.maxFieldLen + ', ';
            }
            
            if(formData.maxFieldWidth != '') {
                postString += '"max_field_width": ' + formData.maxFieldWidth + ', ';
            }
            
            if(formData.goalHeight != '') {
                postString += '"goal_height_ft": ' + formData.goalHeight + ', ';
            }
            if(formData.goalWidth != '') {
                postString += '"goal_width_ft": ' + formData.goalWidth + ', ';
            }
            if(formData.periods != '') {
                postString += '"num_periods": ' + formData.periods + ', ';
            }
            if(formData.periodDuration != '') {
                postString += '"period_duration_minutes": ' + formData.periodDuration + ', ';
            }
            
            postString += '"goalkeeper": "' + formData.goalkeeper + '", ';   
            postString += '"offside": "' + formData.offside + '", ';
            postString += '"heading": "' + formData.header + '", ';
            postString += '"build_out_line": "' + formData.buildout + '", ';
            postString += '"age_group": "' + formData.age._id + '" }';
            
            console.log("Posting rule with string: " + postString);
            
            $http({
                url: baseURL + 'rules/',
                method: 'POST',
                headers: {
                    'content-type': 'application/json' 
                },
                data: postString
            }).then(function(response) {
                console.log("Successfully added rule: ");
                console.log(response);
                localRefreshRules();
            }, function(errResponse) {
                console.log("Failed on attempt to add rule:");
                console.log(errResponse);
            });
        };
        
        function formatAddress(street, city, state, zip) {
            var plainAddress = street + ", " + city + ", " + state;
            console.log("Received address: " + plainAddress);
            var encodedAddress = plainAddress.replace(/\s+/g, "+");
            console.log("Converted address: " + encodedAddress);
            return encodedAddress;           
        };
        
        function buildFacilityPostString(form, google_maps_address) {
            var ps = '{ "name": "' + form.name + '", ';
            
            if(form.club != null) {
                ps += '"club_affiliation": "' + form.club._id + '", ';
            }
            
            if(form.address != '') {
                ps += '"address": "' + form.address + '", ';
            }
            
            if(form.city != '') {
                ps += '"city": "' + form.city + '", ';
            }
            
            if(form.state != '') {
                ps += '"state": "' + form.state + '", ';
            }
            
            if(form.zip != '') {
                ps += '"postal_code": "' + form.zip + '", ';
            }
            
            if(form.lat != '') {
                ps += '"latitude": ' + form.lat + ', ';
            }
            
            if(form.lon != '') {
                ps += '"longitude": ' + form.lon + ', ';
            }
            
            if(form.sunStart != '') {
                ps += '"sun_start_time": "' + form.sunStart + '", ';
            }
            
            if(form.sunStop != '') {
                ps += '"sun_stop_time": "' + form.sunStop + '", ';
            }
            
            if(form.monStart != '') {
                ps += '"mon_start_time": "' + form.monStart + '", ';
            }
            
            if(form.monStop != '') {
                ps += '"mon_stop_time": "' + form.monStop + '", ';
            }
            
            if(form.tueStart != '') {
                ps += '"tue_start_time": "' + form.tueStart + '", ';
            }
            
            if(form.tueStop != '') {
                ps += '"tue_stop_time": "' + form.tueStop + '", ';
            }
            
            if(form.wedStart != '') {
                ps += '"wed_start_time": "' + form.wedStart + '", ';
            }
            
            if(form.wedStop != '') {
                ps += '"wed_stop_time": "' + form.wedStop + '", ';
            }
            
            if(form.thuStart != '') {
                ps += '"thu_start_time": "' + form.thuStart + '", ';
            }
            
            if(form.thuStop != '') {
                ps += '"thu_stop_time": "' + form.thuStop + '", ';
            }
            
            if(form.friStart != '') {
                ps += '"fri_start_time": "' + form.friStart + '", ';
            }
            
            if(form.friStop != '') {
                ps += '"fri_stop_time": "' + form.friStop + '", ';
            }
            
            if(form.satStart != '') {
                ps += '"sat_start_time": "' + form.satStart + '", ';
            }
            
            if(form.satStop != '') {
                ps += '"sat_stop_time": "' + form.satStop + '", ';
            }
            
            ps += '"indoor": ' + form.indoor + ', ';
            ps += '"short_name": "' + form.shortname + '", ';
            ps += '"google_maps_address": "' + google_maps_address + '" }';
            
            return ps;            
        };
        
        this.addFacility = function(formData) {
            var haveAddress = false;
            var lat;
            var lon;
            var address;
            var city;
            var state;
            var zip;
            var formattedAddress;
            var formattedLatLon;
            var postString;
            
            //first, if method is address, get geocode coordinates:
            if(formData.method == 'address') {
                console.log("Address is provided, requesting geocode coordinates.");
                haveAddress = true;
                formattedAddress = 
                formatAddress(formData.address, formData.city, formData.state, formData.zip);
            } else {
                haveAddress = false;
                formattedLatLon = formData.lat + "," + formData.lon;
            }          
            
            if(haveAddress) {
                //first send a geocode request:
                $http({
                    url: googleGeolocateBaseURL + 'address=' + formattedAddress + '&' + googleGeocodeKey,
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json',
                        'x-access-token': undefined
                    }
                }).then(function(response) {
                    console.log("Successfully retrieved geocode: ");
                    console.log(response);
                    
                    //get the lat/lon:
                    lat = response.data.results[0].geometry.location.lat;
                    lon = response.data.results[0].geometry.location.lng;
                    formData.lat = lat;
                    formData.lon = lon;
                    postString = buildFacilityPostString(formData, formattedAddress);
                    console.log("Sending facility post with string: \n" + postString);
                    
                    //post the facility:
                    $http({
                        url: baseURL + 'facilities/',
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json' 
                        },
                        data: postString
                    }).then(function(response) {
                        console.log("Successfully added facility: ");
                        console.log(response);
                        localRefreshFacilities();
                    }, function(errResponse) {
                        console.log("Failed on attempt to add facility:");
                        console.log(errResponse);
                    });  
                }, function(errResponse) {
                    console.log("Failed on attempt to retrieve geocode:");
                    console.log(errResponse);
                });
                
            } else {
                //fist send a reverse geocode request:
                $http({
                    url: googleGeolocateBaseURL + 'latlng=' + formattedLatLon + '&' + googleGeocodeKey,
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json',
                        'x-access-token': undefined
                    }
                }).then(function(response) {
                    console.log("Successfully retrieved address: ");
                    console.log(response);
                    console.log("Retrieved address: " + response.data.results[0].formatted_address);
                    
                    //get the address components and add them back to the form:
                    address = response.data.results[0].address_components[0].long_name + " " + 
                        response.data.results[0].address_components[1].long_name;
                    city = response.data.results[0].address_components[2].long_name;
                    state = response.data.results[0].address_components[4].short_name;
                    zip = response.data.results[0].address_components[6].long_name;
                    
                    formData.address = address;
                    formData.city = city;
                    formData.state = state;
                    formData.zip = zip;
                    
                    formattedAddress = 
                        formatAddress(formData.address, formData.city, formData.state, formData.zip);
                    
                    postString = buildFacilityPostString(formData, formattedAddress);
                    console.log("Sending facility post with string: \n" + postString);
                    
                    //post the facility:
                    $http({
                        url: baseURL + 'facilities/',
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json' 
                        },
                        data: postString
                    }).then(function(response) {
                        console.log("Successfully added facility: ");
                        console.log(response);
                        localRefreshFacilities();
                    }, function(errResponse) {
                        console.log("Failed on attempt to add facility:");
                        console.log(errResponse);
                    });  
                }, function(errResponse) {
                    console.log("Failed on attempt to retrieve geocode:");
                    console.log(errResponse);
                });
            }           
        };        
    }])

    .service('userService', ['$http', 'baseURL', '$rootScope', 'ngDialog', 'coreDataService', function($http,baseURL, $rootScope, ngDialog, coreDataService) {
        $rootScope.usersClubs = [];
        $rootScope.userHasClub = false;
        $rootScope.userHasMultipleClubs = false;
                
        this.sendUserInvite = function(formData) {
            //create invite then update rootscope userinvites
            
            //build postString
            var postString = '{ "invite_key" : "';
            var inviteKey = new Date().getTime();
            var role = coreDataService.getRoleIdByName(formData.role);
            
            postString += inviteKey + '", ';
            if(formData.email != null && formData.email != '') {
                postString += '"email" : "' + formData.email + '", ';
            }
            
            if(formData.mobile != null && formData.mobile != '') {
                postString += '"mobile" : "' + formData.mobile + '", ';
            }
            
            postString += '"role" : "' + role + '", ';
            postString += '"status" : "SENT"}';
            
            console.log("Creating invite with post string: " + postString);
            
            //make http request:
            $http({
                url: baseURL + 'user_invites/',
                method: 'POST',
                headers: {
                    'content-type': 'application/json' 
                },
                data: postString
            }).then(function(response) {
                console.log("Successfully created invite");
                console.log(response.data);
                coreDataService.refreshUserInvites();
            }, function(errResponse) {
                console.log("Failed to create invite");
                console.log(errResponse);
            });
        };
        
        this.sendAccessRequest = function(formData) {
            
            console.log("Received access request with form data:" );
            console.log(formData);
            var clubId = formData.selectedClub._id;
            var roleId = formData.selectedRole._id;
            var teamId = null;
            var postString = '';
            
            if(formData.selectedTeam) {
                teamId = formData.team._id;
            }
            
            determineAccessRequestApprover(formData)
            .then(function(response) {
                console.log("Successfully retrieved club admin.");
                console.log(response);
                postString = '{"user": "' + $rootScope.currentUser._id + '", "club": "' + clubId + '", "role": "' + roleId + '", "status": "SENT", "approver": "' + response.data._id + '"';
                if(teamId != null) {
                    postString += ', "team": "' + teamId + '"';
                }
                postString += '}';
                console.log("Using post string: " + postString);

                //send access request:
                //make http request:
                $http({
                    url: baseURL + 'access_requests/',
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json' 
                    },
                    data: postString
                }).then(function(response) {
                    console.log("Successfully send access request.");
                    console.log(response);
                    var message = '\
                    <div class="ngdialog-message">\
                    <div><h3>Access Request Delivered</h3></div>' +
                    '<div><p>Successfully sent access request for ' + $rootScope.currentUser.first_name + ' ' + $rootScope.currentUser.last_name +
                    ' - as ' + coreDataService.getRolePrettyName(formData.selectedRole.name);

                    if(teamId != null) {
                        message += ' with team ' + formData.selectedClub.name + ' ' + formData.selectedTeam.name +'</p></div>';
                    } else {
                        message += ' with club ' + formData.selectedClub.name + '</p></div>';
                    }
                    message += '<div class="ngdialog-buttons"><button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=confirm("OK")>OK</button></div>';

                    ngDialog.openConfirm({ template: message, plain: 'true'});
                }, function(errResponse) {
                    console.log("Got an error");
                    console.log(errResponse);
                    var message = '\
                    <div class="ngdialog-message">\
                    <div><h3>Access Request Creation Failed</h3></div>' +
                    '<div><p>Failed to send access request for ' + $rootScope.currentUser.first_name + ' ' + $rootScope.currentUser.last_name +
                    ' - as ' + coreDataService.getRolePrettyName(formData.selectedRole.name);

                    if(teamId != null) {
                        message += ' with team ' + formData.selectedClub.name + ' ' + formData.selectedTeam.name +'</p></div>';
                    } else {
                        message += ' with club ' + formData.selectedClub.name + '</p></div>';
                    }
                    message += '<div class="ngdialog-buttons"><button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=confirm("OK")>OK</button></div>';
                    ngDialog.openConfirm({ template: message, plain: 'true'});
                });
            }, function(errReponse) {
                console.log("Failed to retrieve club admin.");
                var message = '\
                    <div class="ngdialog-message">\
                    <div><h3>Access Request Creation Failed</h3></div>' +
                    '<div><p>Failed to send access request for ' + $rootScope.currentUser.first_name + ' ' + $rootScope.currentUser.last_name +
                    ' - as ' + coreDataService.getRolePrettyName(formData.selectedRole.name) + '</p></div><div><p>' +  errResponse.data.err.message + '</p><p>' +
                        errResponse.data.err.name + '</p></div>';

                    if(teamId != null) {
                        message += ' with team ' + formData.selectedClub.name + ' ' + formData.selectedTeam.name +'</p></div>';
                    } else {
                        message += ' with club ' + formData.selectedClub.name + '</p></div>';
                    }
                    message += '<div class="ngdialog-buttons"><button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=confirm("OK")>OK</button></div>';
                ngDialog.openConfirm({ template: message, plain: 'true'});
                console.log(errReponse);
            });
                        
        };
        
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
            
        function determineAccessRequestApprover(formData) {
            //TODO: correct this for more accurate future use:
            //for now, get the club and send to the club administrator:
            
            console.log("Determining Approver for access request:");
            console.log(formData);
            
            //make http request:
            return $http({
                url: baseURL + 'club_members/findClubAdmin/' + formData.selectedClub._id,
                method: 'GET',
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
        
        this.updateUserRoles = function(user, formData) {
            //PUT the user's new ROLES, then update the current object and close the dialog.
            var newRoles = '{"roles":[';
            if(formData.caCheck) {
                newRoles += '"' + coreDataService.getRoleIdByName("CLUB_ADMIN") + '", ';
            }
            
            if(formData.faCheck) {
                newRoles += '"' + coreDataService.getRoleIdByName("FIELD_ADMIN") + '", ';
            }
            
            if(formData.raCheck) {
                newRoles += '"' + coreDataService.getRoleIdByName("REFEREE_ASSIGNOR") + '", ';
            }
            
            if(formData.taCheck) {
                newRoles += '"' + coreDataService.getRoleIdByName("TRAINING_ADMIN") + '", ';
            }
            
            if(formData.coCheck) {
                newRoles += '"' + coreDataService.getRoleIdByName("COACH") + '", ';
            }
            
            if(formData.trCheck) {
                newRoles += '"' + coreDataService.getRoleIdByName("TRAINER") + '", ';
            }
            
            if(formData.reCheck) {
                newRoles += '"' + coreDataService.getRoleIdByName("REFEREE") + '", ';
            }
            
            if(formData.paCheck) {
                newRoles += '"' + coreDataService.getRoleIdByName("PARENT") + '", ';
            }
            
            if(formData.plCheck) {
                newRoles += '"' + coreDataService.getRoleIdByName("PLAYER") + '", ';
            }
            //remove trailing comma
            newRoles = newRoles.slice(0, -2);
            newRoles += ']}';
            
            console.log("New Roles contains");
            console.log(newRoles);
            
            //make http request:
            $http({
                url: baseURL + 'users/' + user._id,
                method: 'PUT',
                headers: {
                    'content-type': 'application/json' 
                }, 
                data: newRoles
            }).then(function(response) {
                console.log("Updated user" );
                console.log(response.data);
                //now, update the user in case that is where the change occured:
                $http({
                    url: baseURL + 'users/' + user._id,
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json' 
                    }
                }).then(function(response) {
                    $rootScope.currentUser = response.data;
                    //finally update all club users:
                    coreDataService.getCurrentClubUsers();
                })
            }, function(errResponse) {
                console.log("Error when trying to update");
                console.log(errResponse);
            });
        };
        
    }])

    .service('clubService', ['$http', 'baseURL', 'ngDialog', '$rootScope', '$state', 'coreDataService', function($http, baseURL, ngDialog, $rootScope, $state, coreDataService) {        
        $rootScope.currentClub;
        
        this.getCurrentClubId = function() {
            return $rootScope.currentClub._id;
        };
        
        this.setCurrentClub = function(club) {
            $rootScope.currentClub = club;
        };
        
        this.clearCurrentClub = function() {
            $rootScope.currentClub = {};
        };
        
        this.addTeam = function(formData) {            
            //add team object, then add team to league if one is specified:
            var leagueAdd = false;
            var postString = '{ "name": "' + formData.name + '", ';
            
            if(formData.gender != null && formData.gender._id != null) {
                postString += '"gender": "' + formData.gender._id + '", ';
            }
            
            if(formData.ageGroup != null && formData.ageGroup._id != null) {
                postString += '"age_group": "' + formData.ageGroup._id + '", ';
            }
            
            if(formData.league != null && formData.league._id != null) {
                leagueAdd = true;
                postString += '"league": "' + formData.league._id + '", ';
            }
            
            postString += '"club": "' + $rootScope.currentClub._id + '" }';
            
            console.log("Creating team with string: " + postString);
            
            $http({
                url: baseURL + 'teams/',
                method: 'POST',
                headers: {
                    'content-type': 'application/json' 
                },
                data: postString
            }).then(function(response) {
                console.log("Created team successfully: ");
                console.log(response);
                //now add team to the league if there is one:
                if(leagueAdd) {
                    $http({
                        url: baseURL + 'league_teams/',
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json' 
                        },
                        data: '{ "league": "' + formData.league._id + '", "team": "' + response.data._id + '" }'
                    }).then(function(leagueResponse) {
                        console.log("Successfully entered team into league: ");
                        console.log(leagueResponse);
                    }, function(leagueErr) {
                        console.log("Failure entering team into league: ");
                        console.log(leagueErr);
                    });
                }
                coreDataService.refreshTeams();
            }, function(errResponse) {
                console.log("Failed creating team: ");
                console.log(errResponse);
            });            
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
        $rootScope.currentUser = {};
        $rootScope.currentUser = {};
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
                    $rootScope.currentUser = response.data;
                    internalPopulateUserRoles(response.data.roles);
                    //do app data load:
                    coreDataService.appDataLoad(user);
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
            $rootScope.currentUser = currentUser;
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
            $rootScope.currentUser = {};
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
            coreDataService.cleanupOnLogout();

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
