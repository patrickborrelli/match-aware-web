'use strict';

angular.module('ma-app')
    .constant("baseURL","https://matchaware-rest.herokuapp.com/")
    .constant("googleGeocodeKey", "key=AIzaSyCpClStUy156rFgjGJsYLBdKfBUEBZ1iLU")
    .constant("googleGeolocateBaseURL", "https://maps.googleapis.com/maps/api/geocode/json?")
    .constant("googleMapsBaseURL", "https://www.google.com/maps/embed/v1/place?")

    .service('coreDataService', ['$http', '$rootScope', 'baseURL', 'googleGeolocateBaseURL', 'googleGeocodeKey', 'googleMapsBaseURL', 'ngDialog', 'datetimeService', function($http, $rootScope, baseURL, googleGeolocateBaseURL, googleGeocodeKey, googleMapsBaseURL, ngDialog, datetimeService) {
        $rootScope.clubs = {};
        $rootScope.roles = {};   
        $rootScope.ageGroups = {};
        var events = {};
        $rootScope.eventTypes = {};
        $rootScope.facilities = {}; 
        $rootScope.fields = {}; 
        $rootScope.fieldSizes = {};
        $rootScope.genders = {};
        $rootScope.leagues = {}; 
        $rootScope.leagueTypes = {};
        var messages = {};
        var notifications = {};
        var organizations = {};
        $rootScope.rules = {}; 
        $rootScope.teams = {};
        $rootScope.users = {}; 
        $rootScope.userInvites = {};
        var accessRequests = {};
        
        var clubsLoaded = false;
        var rolesLoaded = false;
        var ageGroupsLoaded = false;
        var eventsLoaded = false;
        var eventTypesLoaded = false;
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
        
        this.setDataStale = function(staleItems) {
            var items = staleItems.split(",");
            
            for(var i = 0; i < items.length; i++) {
                switch(items[i]) {
                    case "clubs" :
                        console.log("Setting club data to stale");
                        clubsLoaded = false;
                        break;
                        
                    case "roles" :
                        console.log("Setting role data to stale");
                        rolesLoaded = false;
                        break;
                    
                    case "age groups" :
                        console.log("Setting age group data to stale");
                        ageGroupsLoaded = false;
                        break;
                    
                    case "events" :
                        console.log("Setting events data to stale");
                        eventsLoaded = false;
                        break;
                    
                    case "eventTypes" :
                        console.log("Setting event type data to stale");
                        eventTypesLoaded = false;
                        break;
                    
                    case "facilities" :
                        console.log("Setting facility data to stale");
                        facilitiesLoaded = false;
                        break;
                    
                    case "fields" :
                        console.log("Setting field data to stale");
                        fieldsLoaded = false;
                        break;
                    
                    case "field sizes" :
                        console.log("Setting field size data to stale");
                        fieldSizesLoaded = false;
                        break;
                    
                    case "gender" :
                        console.log("Setting gender data to stale");
                        genderLoaded = false;
                        break;
                    
                    case "leagues" :
                        console.log("Setting league data to stale");
                        leaguesLoaded = false;
                        break;
                    
                    case "league types" :
                        console.log("Setting league type data to stale");
                        leagueTypesLoaded = false;
                        break;
                    
                    case "messsages" :
                        console.log("Setting message data to stale");
                        messagesLoaded = false;
                        break;
                    
                    case "notifications" :
                        console.log("Setting notification data to stale");
                        notificationsLoaded = false;
                        break;
                    
                    case "organizations" :
                        console.log("Setting organization data to stale");
                        organizationsLoaded = false;
                        break;
                    
                    case "rules" :
                        console.log("Setting rule data to stale");
                        rulesLoaded = false;
                        break;
                    
                    case "teams" :
                        console.log("Setting team data to stale");
                        teamsLoaded = false;
                        break;
                    
                    case "users" :
                        console.log("Setting user data to stale");
                        usersLoaded = false;
                        break;
                    
                    case "user invites" :
                        console.log("Setting user invite data to stale");
                        userInvitesLoaded = false;
                        break;
                    
                    case "access requests" :
                        console.log("Setting access request data to stale");
                        accessRequestsLoaded = false;
                        break;
                        
                    default:
                        break;
                }
            }          
        };
        
        this.setAllDataStale = function() {
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
        
        this.setUsersLoaded = function(loaded) {
            usersLoaded = loaded;
        };
        
        this.cleanupOnLogout = function() {
            $rootScope.clubs = {};
            $rootScope.roles = {};   
            $rootScope.ageGroups = {};
            events = {};
            $rootScope.facilities = {}; 
            $rootScope.fields = {}; 
            $rootScope.fieldSizes = {};
            $rootScope.genders = {};
            $rootScope.leagues = {}; 
            $rootScope.leagueTypes = {};
            messages = {};
            notifications = {};
            organizations = {};
            $rootScope.rules = {}; 
            $rootScope.teams = {};
            $rootScope.users = {}; 
            $rootScope.userInvites = {};
            accessRequests = {};

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
                
        this.getEvents = function() {
            return events;
        };
        
        this.getMessages = function() {
            return messages;
        };
        
        this.getNotifications = function() {
            return notifications;
        };
        
        this.getOrganizations = function() {
            return organizations;
        };
                
        this.getUsers = function() {
            return $rootScope.users;
        };
                
        this.getAccessRequests = function() {
            return accessRequests;
        };
        
        this.getGoogleMapURL = function(formattedAddress) {
            var url = googleMapsBaseURL + googleGeocodeKey +
                '&q=' + formattedAddress;            
            return url;
        };
        
        var localGoogleMapURL = this.getGoogleMapURL;
            
        this.getUnitPrettyName = function(unit) {
            var prettyName = unit;
            
            switch(unit) {
                case "YARDS":
                    prettyName = "yd";
                    break;
                    
                case "FEET":
                    prettyName = "ft";
                    break;
                    
                case "METERS":
                    prettyName = "m";
                    break;
                    
                default :
                    prettyName = unit;
                    break;   
            }
            
            return prettyName;
        };
        
        this.appDataLoad = function(curUser, curClubId) {
            
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
                    events = response.data;
                    eventsLoaded = true;
                }); 
            }
            
            if(!eventTypesLoaded) {
                //retrieve events:
                $http({
                    url: baseURL + 'event_types/',
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json' 
                    }
                }).then(function(response) {
                    console.log("Retrieved the event types from the API: ");
                    console.log(response);
                    $rootScope.eventTypes = response.data;
                    eventTypesLoaded = true;
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
                    messages = response.data;
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
                    notifications = response.data;
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
                    organizations = response.data;
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
                if(curClubId != null && curClubId != '') {
                    //retrieve teams just for current club:
                    $http({
                        url: baseURL + 'teams/getTeamWithLeagues/teams?club=' + curClubId,
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
                } else {
                    //load all teams:
                    $http({
                        url: baseURL + 'teams/getTeamWithLeagues/teams/',
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
            }
            
            if(!usersLoaded) {
                if(curClubId != null && curClubId != '') {
                    //retrieve users just for the current club:
                    $http({
                        url: baseURL + 'clubs/getClubMembers/' + curClubId,
                        method: 'GET',
                        headers: {
                            'content-type': 'application/json' 
                        }
                    }).then(function(response) {
                        console.log("Retrieved the users from the API: ");
                        console.log(response);
                        $rootScope.users = localPickActiveUsers(response.data);
                        usersLoaded = true;
                    });
                } else {
                    //retrieve all users:
                    $http({
                        url: baseURL + 'users/',
                        method: 'GET',
                        headers: {
                            'content-type': 'application/json' 
                        }
                    }).then(function(response) {
                        console.log("Retrieved the users from the API: ");
                        console.log(response);
                        $rootScope.users = localPickActiveUsers(response.data);
                        usersLoaded = true;
                    }); 
                }                
            }
            
            if(!userInvitesLoaded) {
                //retrieve user invites:
                $http({
                    url: baseURL + 'user_invites?status=SENT',
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
                console.log("attempting to retrieve access requests for user " + curUser + " with id: " + curUser._id);
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
                    accessRequests = response.data;
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
                }, function(errResponse) {
                    console.log("Failed to retrieve access requests based on current user.");
                }); 
            }
            
        };
        
        this.refreshAccessRequests = function(curUser) {
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
                accessRequests = response.data;
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
        };
        
        this.refreshClubUsers = function(curClubId) {
            if(curClubId != null && curClubId != '') {
                //retrieve users just for the current club:
                $http({
                    url: baseURL + 'clubs/getClubMembers/' + curClubId,
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json' 
                    }
                }).then(function(response) {
                    console.log("Retrieved the users from the API: ");
                    console.log(response);
                    $rootScope.users = localPickActiveUsers(response.data);
                    usersLoaded = true;
                });
            } else {
                //retrieve all users:
                $http({
                    url: baseURL + 'users/',
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json' 
                    }
                }).then(function(response) {
                    console.log("Retrieved the users from the API: ");
                    console.log(response);
                    $rootScope.users = localPickActiveUsers(response.data);
                    usersLoaded = true;
                }); 
            } 
        };
        
        this.refreshClubUsersAndWait = function(curClubId) {
            //retrieve users just for the current club:
            return $http({
                url: baseURL + 'clubs/getClubMembers/' + curClubId,
                method: 'GET',
                headers: {
                    'content-type': 'application/json' 
                }
            });
        };
        
        this.refreshUserInvites = function() {
            //retrieve invites:
            $http({
                url: baseURL + 'user_invites?status=SENT',
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
        };
        
        this.refreshTeams = function(curClubId) {
            //retrieve teams:
            if(curClubId != null && curClubId != '') {
                //retrieve teams just for current club:
                $http({
                    url: baseURL + 'teams/getTeamWithLeagues/teams?club=' + curClubId,
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
            } else {
                //load all teams:
                $http({
                    url: baseURL + 'teams/getTeamWithLeagues/teams/',
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
                $rootScope.ageGroups = response.data;  
                ageGroupsLoaded = true;
            }, function(errResponse) {
                console.log("Error encountered when refreshing age groups.");
                console.log(errResponse);
            });
        };
        
        var localRefreshAgeGroups = this.refreshAgeGroups; 
                
        this.refreshEventTypes = function() {
            //retrieve event types:            
            $http({
                url: baseURL + 'event_types/',
                method: 'GET',
                headers: {
                    'content-type': 'application/json' 
                }
            }).then(function(response) { 
                $rootScope.eventTypes = response.data;  
                eventTypesLoaded = true;
            }, function(errResponse) {
                console.log("Error encountered when refreshing event types.");
                console.log(errResponse);
            });
        };
        
        var localRefreshEventTypes = this.refreshEventTypes;
        
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
        
        this.refreshFields = function() {
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
        };
        
        var localRefreshFields = this.refreshFields;     
        
        this.refreshFieldSizes = function() {
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
        };
        
        var localRefreshFieldSizes = this.refreshFieldSizes; 
        
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
                ngDialog.close();
            }, function(errResponse) { 
                console.log("Failed on attempt to add age group:"); 
                console.log(errResponse); 
            });
        };
        
        this.addLeague = function(formData) {
            //post league:            
            var postString = '{ "name": "' + formData.name + '", "short_name": "' + formData.shortname + '", ';
            
            if(formData.minAgeGroup != null && formData.minAgeGroup != '') {
                postString += '"min_age_group": "' + formData.minAgeGroup + '", ';
            }
            
            if(formData.maxAgeGroup != null && formData.maxAgeGroup != '') {
                postString += '"max_age_group": "' + formData.maxAgeGroup + '", ';
            }
            
            if(formData.rescheduleDays != '') {
                postString += '"reschedule_time": "' + formData.rescheduleDays + '", ';
            }
            
            if(formData.consequence != '') {
                postString += '"reschedule_consequence": "' + formData.consequence + '", ';
            }
            
            if(formData.fine != '') {
                postString += '"reschedule_fine": "' + formData.fine + '", ';
            }
            
            if(formData.logoURL != '') {
                postString += '"logo_url": "' + formData.logoURL + '", ';
            }
            
            postString += '"type": "' + formData.type + '" }';   
            console.log("Posting league with string: " + postString);
            
            return $http({
                url: baseURL + 'leagues/',
                method: 'POST',
                headers: {
                    'content-type': 'application/json' 
                },
                data: postString
            })
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
        
        this.deleteLeague = function(league) {
            //first delete selected league and then refresh leagues stored in the scope:
            $http({
                url: baseURL + 'leagues/' + league._id,
                method: 'DELETE',
                headers: {
                    'content-type': 'application/json' 
                }
            }).then(function(response) {
                console.log("Successfully deleted league: ");
                console.log(response);
                localRefreshLeagues();
            }, function(errResponse) {
                console.log("Failed on attempt to delete league:");
                console.log(errResponse);
            });
        };
        
        this.deleteTeam = function(team) {
            //delete selected team and refresh the scope:
            return $http({
                url: baseURL + 'teams/' + team._id,
                method: 'DELETE',
                headers: {
                    'content-type': 'application/json' 
                }
            })
        };
        
        this.editLeague = function(formData) {
            //post league:            
            var postString = '{';
            
            if(formData.name != null && formData.name != '') {
                postString += '"name": "' + formData.name + '", ';
            }
            
            if(formData.shortname != null && formData.shortname != '') {
                postString += '"short_name": "' + formData.shortname + '", ';
            }
            
            if(formData.minAgeGroup != null && formData.minAgeGroup != '') {
                postString += '"min_age_group": "' + formData.minAgeGroup + '", ';
            }
            
            if(formData.maxAgeGroup != null && formData.maxAgeGroup != '') {
                postString += '"max_age_group": "' + formData.maxAgeGroup + '", ';
            }
            
            if(formData.rescheduleDays != null && formData.rescheduleDays != '') {
                postString += '"reschedule_time": "' + formData.rescheduleDays + '", ';
            }
            
            if(formData.consequence != null && formData.consequence != '') {
                postString += '"reschedule_consequence": "' + formData.consequence + '", ';
            }
            
            if(formData.fine != null && formData.fine != '') {
                postString += '"reschedule_fine": "' + formData.fine + '", ';
            }
            
            if(formData.logoURL != '') {
                postString += '"logo_url": "' + formData.logoURL + '", ';
            }
            
            if(formData.type != null && formData.type != '') {
                postString += '"type": "' + formData.type + '", ';
            }
            
            postString = postString.slice(0, -2);
            postString += '}';
            
            console.log("Editing league with string: " + postString + " and league id " + formData.leagueId);
            
            return $http({
                url: baseURL + 'leagues/' + formData.leagueId,
                method: 'PUT',
                headers: {
                    'content-type': 'application/json' 
                },
                data: postString
            })
        };
        
        this.addField = function(formData) {
            //build field post string:            
            var postString = '{ "name": "' + formData.name + '", "facility": "' + formData.facility._id + '", ';
            
            if(formData.surface != null) {
                postString += '"surface": "' + formData.surface + '", ';
            }
            
            if(formData.condition != '') {
                postString += '"condition": ' + formData.condition + ', ';
            }
            
            postString += '"lights": "' + formData.lights + '", ';
            postString += '"game": "' + formData.game + '", ';
            postString += '"practice": "' + formData.practice + '", ';
            postString += '"tournament": "' + formData.tournament + '", ';
            postString += '"training": "' + formData.training + '", ';
            postString += '"size": "' + formData.size + '" }';
            
            console.log("Posting rule with string: " + postString);
            
            $http({
                url: baseURL + 'fields/',
                method: 'POST',
                headers: {
                    'content-type': 'application/json' 
                },
                data: postString
            }).then(function(response) {
                console.log("Successfully added field: ");
                console.log(response);
                
                //next add field to facility, then refresh facilities:
                $http({
                    url: baseURL + 'facilities/addField/' + formData.facility._id + '/' + response.data._id,
                    method: 'PUT',
                    headers: {
                        'content-type': 'application/json' 
                    }
                }).then(function(facResponse) {
                    console.log("Successfully added field to facility: ");
                    console.log(facResponse);
                    localRefreshFacilities();
                    localRefreshFields();
                    
                    $http({
                        url: baseURL + 'field_availabilities/initializeForField/' + response.data._id,
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json' 
                        }
                    }).then(function(response) {
                        console.log("Successfully added field availability: ");
                        console.log(response);
                    }, function(errResponse) {
                        console.log("Failed on attempt to create field availability:");
                        console.log(errResponse);
                    });
                }, function(facErrResponse) {
                    console.log("Failed on attempt to add field to facility:");
                    console.log(facErrResponse);                    
                });
            }, function(errResponse) {
                console.log("Failed on attempt to add field:");
                console.log(errResponse);
            });
        };
        
        this.editField = function(formData) {
            //build field post string:            
            var postString = '{ "name": "' + formData.name + '", "facility": "' + formData.facility._id + '", ';
            
            if(formData.surface != null) {
                postString += '"surface": "' + formData.surface + '", ';
            }
            
            if(formData.condition != '') {
                postString += '"condition": ' + formData.condition + ', ';
            }
            
            postString += '"lights": "' + formData.lights + '", ';
            postString += '"game": "' + formData.game + '", ';
            postString += '"practice": "' + formData.practice + '", ';
            postString += '"tournament": "' + formData.tournament + '", ';
            postString += '"training": "' + formData.training + '", ';
            postString += '"size": "' + formData.size + '" }';
            
            console.log("Posting rule with string: " + postString);
            
            $http({
                url: baseURL + 'fields/' + formData.id,
                method: 'PUT',
                headers: {
                    'content-type': 'application/json' 
                },
                data: postString
            }).then(function(response) {
                console.log("Successfully updated field: ");
                console.log(response);                
                localRefreshFacilities();
                localRefreshFields();
            }, function(errResponse) {
                console.log("Failed on attempt to update field:");
                console.log(errResponse);
            });
        };
        
        this.deleteField = function(field) {
            //delete selected field and refresh the scope:
            return $http({
                url: baseURL + 'fields/' + field._id,
                method: 'DELETE',
                headers: {
                    'content-type': 'application/json' 
                }
            })
        };
        
        this.addRule = function(formData) {
            //post rule:            
            var postString = '{ "league": "' + formData.league + '", ';
            
            if(formData.duration != '') {
                postString += '"duration_minutes": ' + formData.duration + ', ';
            }
            
            if(formData.break != '') {
                postString += '"intermission_duration_minutes": ' + formData.break + ', ';
            }
                        
            if(formData.ballsize != '') {
                postString += '"ball_size": ' + formData.ballsize + ', ';
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
            postString += '"age_group": "' + formData.age + '" }';
            
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
        
        this.editRule = function(formData) {
            //post rule:            
            var postString = '{ "league": "' + formData.league + '", ';
            
            if(formData.duration != '') {
                postString += '"duration_minutes": ' + formData.duration + ', ';
            }
            
            if(formData.break != '') {
                postString += '"intermission_duration_minutes": ' + formData.break + ', ';
            }
                        
            if(formData.ballsize != '') {
                postString += '"ball_size": ' + formData.ballsize + ', ';
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
            postString += '"age_group": "' + formData.age + '" }';
            
            console.log("Posting rule with string: " + postString);
            
            $http({
                url: baseURL + 'rules/' + formData.ruleId,
                method: 'PUT',
                headers: {
                    'content-type': 'application/json' 
                },
                data: postString
            }).then(function(response) {
                console.log("Successfully updated rule: ");
                console.log(response);
                localRefreshRules();
            }, function(errResponse) {
                console.log("Failed on attempt to update rule:");
                console.log(errResponse);
            });
        };
        
        this.deleteRule = function(rule) {
            //delete selected rule and refresh the scope:
            return $http({
                url: baseURL + 'rules/' + rule._id,
                method: 'DELETE',
                headers: {
                    'content-type': 'application/json' 
                }
            })
        };
        
        this.addFieldSize = function(formData) {
            //post rule:            
            var postString = '{ "name": "' + formData.name + '", ';
                        
            if(formData.minlength != 0) {
                postString += '"min_length": ' + formData.minlength + ', ';
            }
            
            if(formData.maxlength != 0) {
                postString += '"max_length": ' + formData.maxlength + ', ';
            }
            
            if(formData.minwidth != 0) {
                postString += '"min_width": ' + formData.minwidth + ', ';
            }
            
            if(formData.maxwidth != 0) {
                postString += '"max_width": ' + formData.maxwidth + ', ';
            }
            
            postString += '"unit": "' + formData.unit + '" }';
            
            console.log("Posting field size with string: " + postString);
            
            $http({
                url: baseURL + 'field_sizes/',
                method: 'POST',
                headers: {
                    'content-type': 'application/json' 
                },
                data: postString
            }).then(function(response) {
                console.log("Successfully added field size: ");
                console.log(response);
                localRefreshFieldSizes();
            }, function(errResponse) {
                console.log("Failed on attempt to add field size:");
                console.log(errResponse);
            });
        };
        
        this.editFieldSize = function(formData) {
            //post rule:            
            var postString = '{ "name": "' + formData.name + '", ';
                        
            if(formData.minlength != 0) {
                postString += '"min_length": ' + formData.minlength + ', ';
            }
            
            if(formData.maxlength != 0) {
                postString += '"max_length": ' + formData.maxlength + ', ';
            }
            
            if(formData.minwidth != 0) {
                postString += '"min_width": ' + formData.minwidth + ', ';
            }
            
            if(formData.maxwidth != 0) {
                postString += '"max_width": ' + formData.maxwidth + ', ';
            }
            
            postString += '"unit": "' + formData.unit + '" }';
            
            console.log("Updating field size with string: " + postString);
            
            $http({
                url: baseURL + 'field_sizes/' + formData.id,
                method: 'PUT',
                headers: {
                    'content-type': 'application/json' 
                },
                data: postString
            }).then(function(response) {
                console.log("Successfully updated field size: ");
                console.log(response);
                localRefreshFieldSizes();
            }, function(errResponse) {
                console.log("Failed on attempt to update field size:");
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
                ps += '"club_affiliation": "' + form.club + '", ';
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
        
        this.editFacility = function(formData) {
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
                    console.log("Sending facility update with string: \n" + postString);
                    
                    //post the facility:
                    $http({
                        url: baseURL + 'facilities/' + formData.facilityId,
                        method: 'PUT',
                        headers: {
                            'content-type': 'application/json' 
                        },
                        data: postString
                    }).then(function(response) {
                        console.log("Successfully updated facility: ");
                        console.log(response);
                        localRefreshFacilities();
                    }, function(errResponse) {
                        console.log("Failed on attempt to updated facility:");
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
                    console.log("Sending facility update with string: \n" + postString);
                    
                    //post the facility:
                    $http({
                        url: baseURL + 'facilities/' + formData.facilityId,
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json' 
                        },
                        data: postString
                    }).then(function(response) {
                        console.log("Successfully updated facility: ");
                        console.log(response);
                        localRefreshFacilities();
                    }, function(errResponse) {
                        console.log("Failed on attempt to update facility:");
                        console.log(errResponse);
                    });  
                }, function(errResponse) {
                    console.log("Failed on attempt to retrieve geocode:");
                    console.log(errResponse);
                });
            }           
        }; 
        
        this.deleteFacility = function(facility) {
            //delete selected facility and refresh the scope:
            return $http({
                url: baseURL + 'facilities/' + facility._id,
                method: 'DELETE',
                headers: {
                    'content-type': 'application/json' 
                }
            })
        };
        
        this.pickActiveUsers = function(users) {
            var active = [];
            for(var i = 0; i < users.length; i++) {
                if(users[i].active) {
                    active.push(users[i]);
                }
            }
            return active;
        };
        
        var localPickActiveUsers = this.pickActiveUsers;
        
        this.addEventType = function(formData) {
            //post rule:            
            var postString = '{ "name": "' + formData.name + '", "priority": ' + formData.priority + ', "field_type": "' + formData.fieldtype + '"}';
            
            console.log("Posting event type with string: " + postString);
            
            $http({
                url: baseURL + 'event_types/',
                method: 'POST',
                headers: {
                    'content-type': 'application/json' 
                },
                data: postString
            }).then(function(response) {
                console.log("Successfully added event type: ");
                console.log(response);
                localRefreshEventTypes();                 
                ngDialog.close();
            }, function(errResponse) {
                console.log("Failed on attempt to add event type:");
                console.log(errResponse);                                 
                ngDialog.close();
            });
        };
        
        this.editEventType = function(formData) {          
            var putString = '{ "name": "' + formData.name + '", "priority": ' + formData.priority + ', "field_type": "' + formData.fieldtype + '"}';
                        
            console.log("Updating event type with string: " + putString);
            
            $http({
                url: baseURL + 'event_types/' + formData.id,
                method: 'PUT',
                headers: {
                    'content-type': 'application/json' 
                },
                data: putString
            }).then(function(response) {
                console.log("Successfully updated event type: ");
                console.log(response);  
                localRefreshEventTypes(); 
            }, function(errResponse) {
                console.log("Failed on attempt to update event type:");
                console.log(errResponse);
            });
        };
        
        this.deleteEventType = function(eventType) {
            //delete selected event type and refresh the scope:
            $http({
                url: baseURL + 'event_types/' + eventType._id,
                method: 'DELETE',
                headers: {
                    'content-type': 'application/json' 
                }
            }).then(function(response) {
                console.log("Successfully deleted event type: ");
                console.log(response);  
                localRefreshEventTypes(); 
            }, function(errResponse) {
                console.log("Failed on attempt to delete event type:");
                console.log(errResponse);
            });
        };
    }])

    .service('userService', ['$http', '$rootScope', '$state', 'baseURL', '$q', 'ngDialog', 'coreDataService', 'clubService', function($http, $rootScope, $state, baseURL, $q, ngDialog, coreDataService, clubService) {
        var usersClubs = [];
        var userHasClub = false;
        var userHasMultipleClubs = false;
        var currentUser = {};
        var currentUserStale = false;
        var currentRolesStale = false;
        $rootScope.userClubRoles = {};
        
        var hasRole = false;
        var hasMultipleRoles = false;
        var currentRole = {};     
        var fullname = '';
        
        this.getUserFullname = function() {
            return fullname;
        };
        
        this.getUserById = function(userId) {
            //call http and return promise:
            return $http({
                url: baseURL + 'users/' + userId,
                method: 'GET',
                headers: {
                    'content-type': 'application/json' 
                }
            }); 
        };
        
        this.populateUserRoles = function(roles) {
            console.log("Entering populate user roles");
            console.log("attempting to parse roles: " + roles.length); 
            console.log(roles);
            var role;
            
            if(roles.length < 1) {
                hasRole = false;
                hasMultipleRoles = false;
                return;
            } else if(roles.length > 1) {
                hasRole = true;
                hasMultipleRoles = true;
                console.log("\n\nUSER has multiple roles.");
            } else {
                hasRole = true;
                hasMultipleRoles = false;
                currentRole = roles[0];
                console.log("\n\nUSER has one role.");
            }            
        };      
        
        var localPopulateUserRoles = this.populateUserRoles;
                
        this.userHasRoles = function() {
            console.log("returning " + hasRole);
            return hasRole;
        };
        
        this.getCurrentUserId = function() {
            return currentUser._id;
        };
        
        this.getCurrentUser = function(promise) {
            var response = null;
            console.log("Attempting to get current user...currentUserStale: " + currentUserStale);
            if(currentUserStale) {
                currentUserStale = false;
                return $http({
                   url: baseURL + 'users/'+ currentUser._id,
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json' 
                    }
                });
                
            } else {
                if(promise) {
                    response = $q.when(currentUser);
                } else {
                    response = currentUser;
                }
                return response;
            }            
        };
        
        this.retrieveUserRoles = function(promise, userId) {
            var response = null;
            var user_id;
            
            if(userId == null || userId == 0) {
                user_id = currentUser._id;
            } else {
                user_id = userId;
            }
            console.log("Attempting to retrieve current user roles...currentRolesStale: " + currentRolesStale);
            if(currentRolesStale) {
                currentRolesStale = false;
                return $http({
                   url: baseURL + 'club_roles?member=' + user_id,
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json' 
                    }
                });
                
            } else {
                if(promise) {
                    response = $q.when($rootScope.userClubRoles);
                } else {
                    response = $rootScope.userClubRoles;
                }
                return response;
            }            
        };
        
        var localRetrieveUserRoles = this.retrieveUserRoles;
        
        this.setCurrentUser = function(user) {
            currentUser = user;
            console.log("Added new current user:");
            console.log(user);
            currentUserStale = false;
            fullname = user.first_name + " " + user.last_name;
        };
        
        this.setCurrentUserStale = function() {
            console.log("Setting current user stale");
            currentUserStale = true;
            console.log("currentUserStale: " + currentUserStale);
        };
        
        this.setCurrentRolesStale = function() {
            console.log("Setting current user roles stale");
            currentRolesStale = true;
            console.log("currentRolesStale: " + currentRolesStale);
        };
        
        var localSetCurrentRolesStale = this.setCurrentRolesStale;
        
        this.setUserClubRoles = function(clubRoles) {
            $rootScope.userClubRoles = clubRoles;  
            currentRolesStale = false;
        };
        
        this.getUserClubRoles = function() {
            return $rootScope.userClubRoles;
        };
        
        var localSetUserClubRoles = this.setUserClubRoles;
        
        this.getUserHasClub = function() {
            return userHasClub;
        };
        
        this.getUserHasMultipleClubs = function() {
            return userHasMultipleClubs;
        };
        
        this.getUserHasMultipleRoles = function() {
            return hasMultipleRoles;
        };
        
        this.getInviteByKey = function(inviteKey) {
            //make http request:
            return $http({
                url: baseURL + 'user_invites?invite_key=' + inviteKey,
                method: 'GET',
                headers: {
                    'content-type': 'application/json' 
                }
            });
        };
                
        this.sendUserInvite = function(formData) {
            //create invite then update rootscope userinvites
            
            //build postString
            var postString = '{ "invite_key" : "';
            var inviteKey = new Date().getTime();
            var role = coreDataService.getRoleIdByName(formData.role);
            var clubName = clubService.getCurrentClub().name
            var club = clubService.getCurrentClub();
            
            var html = "<h2>Welcome to MatchAware</h2><h3>The youth club sports-centric app for Field Utilization Management and Match Scheduling</h3>";
            html += "<p>You have been invited to join MatchAware by " + clubName + ". <br />";
            html += "Click <a href='http://matchaware.com/#!/invite/" + inviteKey +"' target='_blank'>here</a> to accept your invitation.</p>"
            var text = "You have been invited to join MatchAware by " + clubName;
            text += "To accept, go to http://matchaware.com/#!/invite/" + inviteKey;
            var subject = "Your Invite from " + clubName;
            
            postString += inviteKey + '", ';
            postString += '"sendToEmail" : "' + formData.email + '", '; 
            postString += '"role" : "' + role + '", ';
            postString += '"emailHtml" : "' + html + '", ';
            postString += '"emailText" : "' + text + '", ';
            postString += '"emailSubject" : "' + subject + '", ';
            postString += '"club" : "' + club._id + '", ';
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
        
        this.revokeUserInvite = function(inviteKey) {
            //make http request:
            $http({
                url: baseURL + 'user_invites/deleteByKey/' + inviteKey,
                method: 'DELETE',
                headers: {
                    'content-type': 'application/json' 
                }
            }).then(function(response) {
                console.log("Successfully revoked invite");
                console.log(response.data);
                coreDataService.refreshUserInvites();
            }, function(errResponse) {
                console.log("Failed to revoke invite");
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
                //onfirm there actually is an approver returned before going on.
                if(response.data == null || response.data.length == 0) {
                    console.log("Unable to find administrator for the selected club:");
                    console.log(response);
                    var message = '\
                    <div class="ngdialog-message">\
                    <div><h3>Access Request Creation Failed</h3></div>' +
                    '<div><p>Failed to send access request for ' + currentUser.first_name + ' ' + currentUser.last_name +
                    ' - as ' + formData.selectedRole.pretty_name;

                    if(teamId != null) {
                        message += ' with team ' + formData.selectedClub.name + ' ' + formData.selectedTeam.name +'</p></div>';
                    } else {
                        message += ' with club ' + formData.selectedClub.name + '</p></div>';
                    }
                    message += '<div><p>Please contact ' + formData.selectedClub.name + '.</p></div>';
                    message += '<div class="ngdialog-buttons"><button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=confirm("OK")>OK</button></div>';
                    ngDialog.openConfirm({ template: message, plain: 'true'});
                } else {
                    console.log("Successfully retrieved club admin.");
                    console.log(response);
                    console.log("Early release workaround, only sending access request to first found user with appropriate role. FIX IN VER2.0");
                    postString = '{"user": "' + currentUser._id + '", "club": "' + clubId + '", "role": "' + roleId + '", "status": "SENT", "approver": "' + response.data[0]._id + '"';
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
                        '<div><p>Successfully sent access request for ' + currentUser.first_name + ' ' + currentUser.last_name +
                        ' - as ' + formData.selectedRole.pretty_name;

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
                        '<div><p>Failed to send access request for ' + currentUser.first_name + ' ' + currentUser.last_name +
                        ' - as ' + formData.selectedRole.pretty_name;

                        if(teamId != null) {
                            message += ' with team ' + formData.selectedClub.name + ' ' + formData.selectedTeam.name +'</p></div>';
                        } else {
                            message += ' with club ' + formData.selectedClub.name + '</p></div>';
                        }
                        message += '<div class="ngdialog-buttons"><button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=confirm("OK")>OK</button></div>';
                        ngDialog.openConfirm({ template: message, plain: 'true'});
                    });
                }
            }, function(errReponse) {
                console.log("Failed to retrieve club admin.");
                var message = '\
                    <div class="ngdialog-message">\
                    <div><h3>Access Request Creation Failed</h3></div>' +
                    '<div><p>Failed to send access request for ' + currentUser.first_name + ' ' + currentUser.last_name +
                    ' - as ' + formData.selectedRole.pretty_name + '</p></div><div><p>' +  errResponse.data.err.message + '</p><p>' +
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
                url: baseURL + 'club_roles/findClubRole/' + formData.selectedClub._id + '/' + coreDataService.getRoleIdByName("CLUB_ADMIN"),
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
        
        this.getUsersClubs = function() {
            return usersClubs;
        };
        
        this.cleanupLoggedOutUser = function() {
            usersClubs = [];
            currentRole = {};
            currentUser = {};
            
            userHasClub = false;
            hasRole = false;
            hasMultipleRoles = false;
            userHasMultipleClubs = false;
            clubService.setCurrentClub({});
        };
        
        this.populateUsersClubs = function(clubs) {
            console.log("Entering populate users clubs");
            console.log(clubs);
            if(clubs.length == 1) {
                userHasClub = true;
                clubService.setCurrentClub(clubs[0]);
                usersClubs.push(clubs[0]);
            } else if(clubs.length > 1) {
                userHasMultipleClubs = true;
                userHasClub = true;
                for(var i = 0; i < clubs.length; i++) {
                    usersClubs.push(clubs[i]);
                }
            }
            if(userHasClub && !userHasMultipleClubs) {
                console.log("User belongs to " + clubService.getCurrentClub().name);
            } else if(userHasMultipleClubs) {
                console.log("User belongs to multiple clubs:");
                console.log(usersClubs);
            }
            
            console.log("userHasClub = " + userHasClub + " and userHasMultipleClubs = " + userHasMultipleClubs);
        };
        
        var localPopulateUsersClubs = this.populateUsersClubs;
        
        this.updateUserRoles = function(user, formData) {
            //gather all the new role ids into an array
            var newRoles = '[';
            if(formData.caCheck) {
                newRoles += '"' + coreDataService.getRoleIdByName("CLUB_ADMIN") + '" ,';
            }
            
            if(formData.faCheck) {
                newRoles += '"' + coreDataService.getRoleIdByName("FIELD_ADMIN") + '" ,';
            }
            
            if(formData.raCheck) {
                newRoles += '"' + coreDataService.getRoleIdByName("REFEREE_ASSIGNOR") + '" ,';
            }
            
            if(formData.taCheck) {
                newRoles += '"' + coreDataService.getRoleIdByName("TRAINING_ADMIN") + '" ,';
            }
            
            if(formData.coCheck) {
                newRoles += '"' + coreDataService.getRoleIdByName("COACH") + '" ,';
            }
            
            if(formData.trCheck) {
                newRoles += '"' + coreDataService.getRoleIdByName("TRAINER") + '" ,';
            }
            
            if(formData.reCheck) {
                newRoles += '"' + coreDataService.getRoleIdByName("REFEREE") + '" ,';
            }
            
            if(formData.paCheck) {
                newRoles += '"' + coreDataService.getRoleIdByName("PARENT") + '" ,';
            }
            
            if(formData.plCheck) {
                newRoles += '"' + coreDataService.getRoleIdByName("PLAYER") + '" ,';
            }
            
            //remove trailing comma
            newRoles = newRoles.slice(0, -2);
            newRoles += ']';
            
            console.log("New Roles contains");
            console.log(newRoles);
            
            var postString = '{"roleIds": ' + newRoles + '}';
            console.log("Attempting to add multiple roles with postData: " + postString);
            
            return $http({
                url: baseURL + 'club_roles/replaceAllRoles/' + user._id + '/' + clubService.getCurrentClubId(),
                method: 'POST',
                headers: {
                    'content-type': 'application/json' 
                }, 
                data: postString
            });
        };    
        
        this.userHasRole = function(userId, rolename) {
            
            var rolePresent = false;
            
            //retrieve user from stored users if user does not exist, retrieve from database
            var users = coreDataService.getUsers();
            var user = null;
            
            for(var i = 0; i < users.length; i++) {
                if(users[i]._id == userId) {
                    user = users[i];
                    break;
                }
            }
            
            if(user == null) {
                //retrieve user from database:
                $http({
                    url: baseURL + 'users/' + userId,
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json' 
                    }
                }).then(function(response) {
                    user = response.data;
                    
                    //now see if role exists in users roles:
                    var roles = user.roles;
                    for(var i = 0; i < roles.length; i++) {
                        if(roles[i].name === rolename) {
                            rolePresent = true;
                            break;
                        }
                    }
                    return rolePresent;                    
                }, function(errResponse) {
                    console.log("Failure while trying to retrieve user from datastore:");
                    console.log(errResponse);
                }); 
            } else {
                //see if role exists in users roles:
                var roles = user.roles;
                for(var i = 0; i < roles.length; i++) {
                    if(roles[i].role.name === rolename) {
                        rolePresent = true;
                        break;
                    }
                }
                return rolePresent; 
            }        
        };        
                
        this.getCurrentRole = function() {            
            return currentRole;  
        };
        
        this.setCurrentRole = function(role) {
            currentRole = role;
            $state.go("app.home");
        };
        
        this.addUserToClubRole = function(user_Id, club_Id, role_Id) {
            var postString = '{"club": "' + club_Id + '", "member": "' + user_Id + '", "role": "' + role_Id + '"}';
            console.log("Post string = " + postString);
            //add user to club role:
            return $http({
                url: baseURL + 'club_roles/',
                method: 'POST',
                headers: {
                    'content-type': 'application/json' 
                },
                data: postString
            });
        };
        
        this.processInviteAcceptance = function(inviteKey) {
            var accepted = '{"status":"ACCEPTED"}';
            console.log("\n\nENTERING INVITE UPDATE\n\n");
            $http({
                url: baseURL + 'user_invites/' + inviteKey,
                method: 'PUT',
                headers: {
                    'content-type': 'application/json' 
                },
                data: accepted
            }).then(function(response) {
                console.log("Updated user invite");
                console.log(response);  
            }, function(errResponse) {           
                console.log("Failed to update user invite");
                console.log(errResponse);
            });
        };
        
        this.processAccessRequestAccept = function(request) {
            var hasTeam = false;
            var userId = request.user._id;
            var clubId = request.club._id;
            var roleId = request.role._id;
            var teamId;
            var inClub = false;
            
            var postString = '{"club": "' + clubId + '", "member": "' + userId + '", "role": "' + roleId + '"}';
            var teamPostString = '{"team": "' + teamId + '", "member": "' + userId + '", "role": "' + roleId + '"}';
            
            if(request.team != null) {
                hasTeam = true;
                teamId = request.team._id;
            }
            
            //add user to club role:
            $http({
                url: baseURL + 'club_roles/',
                method: 'POST',
                headers: {
                    'content-type': 'application/json' 
                },
                data: postString
            }).then(function(response) {
                console.log("Successfully added user role");
                console.log(response); 
                localSetCurrentRolesStale();
                //retrieve user's club_roles:
                localRetrieveUserRoles(true)
                    .then(function(response) {
                        console.log("Retrieved the user's club_roles: " );
                        console.log(response);

                        localSetUserClubRoles(response.data);

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

                        localPopulateUserRoles(userRoles);  
                        localPopulateUsersClubs(userClubs);

                        //do app data load:
                        coreDataService.setAllDataStale();
                        coreDataService.appDataLoad(currentUser, clubService.getCurrentClubId());
                }, function(errResponse) {
                    console.log("Failed in attempt to retrieve users club_roles.");
                    console.log(errResponse);
                }); 
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
                coreDataService.refreshAccessRequests(currentUser);
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
                coreDataService.refreshAccessRequests(currentUser);
            }, function(errResponse) {
                console.log("Failed to mark access request REJECTED");
                console.log(errResponse);
            });     
            
            //TODO: send email/notification/text
        };
        
        this.retrieveUser = function(userId) {
            return $http({
                url: baseURL + 'users/' + userId,
                method: 'GET',
                headers: {
                    'content-type': 'application/json' 
                }
            });
        };
        
        this.deactivateUser = function(user) {
            //deactivate the selected user and then refresh all active users in the scope:
            $http({
                url: baseURL + 'users/deactivate/' + user._id,
                method: 'PUT',
                headers: {
                    'content-type': 'application/json' 
                }
            }).then(function(response) {
                console.log("Successfully deactivated user: ");
                console.log(response);
                coreDataService.refreshClubUsers(clubService.getCurrentClubId());
            }, function(errResponse) {
                console.log("Failed on attempt to deactivate user:");
                console.log(errResponse);
            });
        }
        
      }])

    .service('clubService', ['$http', 'baseURL', 'ngDialog', '$state', 'coreDataService', function($http, baseURL, ngDialog, $state, coreDataService) {        
        var currentClub = null;
        var currentClubId = '';
        
        this.getCurrentClubId = function() {
            var clubId = null;
            if(currentClub != null) {
                clubId = currentClub._id;
            }
            return clubId;
        };
        
        this.getCurrentClub = function() {
            return currentClub;
        };
        
        this.setCurrentClub = function(club) {
            currentClub = club;
            currentClubId = club._id;
            coreDataService
        };
        
        this.clearCurrentClub = function() {
            currentClub = null;
            currentClubId = '';
        };
        
        this.addTeam = function(formData) {            
            //add team object, then add team to league if one is specified:
            var leagueAdd = false;
            var postString = '{ "name": "' + formData.name + '", ';
            
            if(formData.gender != null && formData.gender != '') {
                postString += '"gender": "' + formData.gender + '", ';
            }
            
            if(formData.ageGroup != null && formData.ageGroup != '') {
                postString += '"age_group": "' + formData.ageGroup + '", ';
            }
            
            if(formData.league != null && formData.league != '') {
                leagueAdd = true;
            }
            
            postString += '"club": "' + currentClub._id + '" }';
            
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
                        data: '{ "league": "' + formData.league + '", "team": "' + response.data._id + '" }'
                    }).then(function(leagueResponse) {
                        console.log("Successfully entered team into league: ");
                        console.log(leagueResponse);
                    }, function(leagueErr) {
                        console.log("Failure entering team into league: ");
                        console.log(leagueErr);
                    });
                }
                coreDataService.refreshTeams(currentClub._id);
            }, function(errResponse) {
                console.log("Failed creating team: ");
                console.log(errResponse);
            });            
        };
        
        this.editTeam = function(formData) {       
            var leagueAdd = false;
            //edit team object, then remove league_team entry and replace with this one:
            var postString = '{ "name": "' + formData.name + '", ';
            
            if(formData.gender != null && formData.gender != '') {
                postString += '"gender": "' + formData.gender + '", ';
            }
            
            if(formData.ageGroup != null && formData.ageGroup != '') {
                postString += '"age_group": "' + formData.ageGroup + '", ';
            }
            
            if(formData.league != null && formData.league != '') {
                leagueAdd = true;
            }
            
            postString += '"club": "' + currentClub._id + '" }';
            
            console.log("Creating team with string: " + postString);
            
            $http({
                url: baseURL + 'teams/' + formData.teamId,
                method: 'PUT',
                headers: {
                    'content-type': 'application/json' 
                },
                data: postString
            }).then(function(response) {
                console.log("Edited team successfully: ");
                console.log(response);
                //now add team to the league if there is one:
                if(leagueAdd) {
                    $http({
                        url: baseURL + 'league_teams/' + formData.teamId,
                        method: 'DELETE',
                        headers: {
                            'content-type': 'application/json' 
                        }
                    }).then(function(leagueResponse) {
                        console.log("Successfully leagues for team: ");
                        console.log(leagueResponse);
                        $http({
                            url: baseURL + 'league_teams/',
                            method: 'POST',
                            headers: {
                                'content-type': 'application/json' 
                            },
                            data: '{ "league": "' + formData.league + '", "team": "' + formData.teamId + '" }'
                        }).then(function(leagueResponse) {
                            console.log("Successfully entered team into league: ");
                            console.log(leagueResponse);
                            coreDataService.refreshTeams(currentClub._id);
                        }, function(leagueErr) {
                            console.log("Failure entering team into league: ");
                            console.log(leagueErr);
                        });
                    }, function(leagueErr) {
                        console.log("Failure entering team into league: ");
                        console.log(leagueErr);
                    });
                }
                coreDataService.refreshTeams(currentClub._id);
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
        
        this.joinClub = function(userId, clubId, roleId) { 
            //make http request:
            console.log("Attempting to add user: " + userId + " to club: " + clubId + " with role:" + roleId);
            return $http({
                url: baseURL + 'club_roles/',
                method: 'POST',
                headers: {
                    'content-type': 'application/json' 
                },
                data: {"club": clubId, "member": userId, "role": roleId}
            });
        };        
        
    }])
    
    .service('schedulingService', ['$http', 'baseURL', 'coreDataService', 'datetimeService', function($http, baseURL, coreDataService, datetimeService) {        
    
        this.closeField = function(form) {
            console.log("Attempting to close field " + form.entity.name);
            var startTime;
            var endTime;
            var startMilli;
            var endMilli;
            var type = "CURRENT";
            
            if(form.duration != "other" && form.duration != "future") {
                startTime = new Date();
                endTime = datetimeService.addHours(form.duration, startTime);
            } else if(form.duration == "other") {
                startTime = new Date();
                endTime = datetimeService.combineDateTime(form.enddate, form.endtime);
            } else if(form.duration == "future") {
                startTime = datetimeService.combineDateTime(form.futureStartDate, form.futureStartTime);
                endTime = datetimeService.combineDateTime(form.futureEndDate, form.futureEndTime);
                type = "FUTURE";
            }
            
            startMilli = startTime.getTime();
            endMilli = endTime.getTime();
            
            var postString = '{ "message": "' + form.message + '", "start": ' + startMilli + ', "end": ' + endMilli + ', "type": "' + type + '" }';
            
            $http({
                url: baseURL + 'closures/',
                method: 'POST',
                headers: {
                    'content-type': 'application/json' 
                },
                data: postString
            }).then(function(response) {
                console.log("Successfully created closure: ");
                console.log(response);    
                postString = '{ "closures": ["' + response.data._id + '",';
                
                for(var i = 0; i < form.entity.closures.length; i++) {
                    postString += '"' + form.entity.closures[i]._id + '",'
                }
                console.log("First: " + postString);
                postString = postString.slice(0, -1);
                console.log("After: " + postString);
                postString += ']}';
                
                console.log("Updating field with string : " + postString);
                    
                //next submit closure to field:
                $http({
                    url: baseURL + 'fields/' + form.entity._id,
                    method: 'PUT',
                    headers: {
                        'content-type': 'application/json' 
                    },
                    data: postString
                }).then(function(fieldResponse) {
                    console.log("Successfully closed field: ");
                    console.log(fieldResponse); 
                    coreDataService.refreshFacilities();
                    coreDataService.refreshFields();
                }, function(closeError) {
                    console.log("Failed on attempt to close field:");
                    console.log(closeError);
                });                
                
            }, function(errResponse) {
                console.log("Failed on attempt to close field:");
                console.log(errResponse);
            }); 
        };
        
        this.openField = function(form) {
            console.log("Attempting to open field " + form.entity.name);
            console.log("in facility " + form.facility.name);
            var facilityWide = false;
            
            //first, check if the facility is affected by the same closure as the field
            var currentClosureId = form.currentClosure._id;
            var facilityClosures = form.facility.closures;
            
            if(facilityClosures.length > 0) {
                for(var i = 0; i < facilityClosures.length; i++) {
                    if(facilityClosures[i]._id == currentClosureId) {
                        facilityWide = true;
                        break;
                    }
                }
            }
            
            if(facilityWide) {
                console.log("Determined that this is a facility wide closure.");
                $http({ 
                    url: baseURL + 'closures/openFieldOnly/' + form.entity._id + '/' + currentClosureId,
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json' 
                    }
                }).then(function(response) {
                    console.log("Successfully opened field: " + form.entity.name);  
                    console.log(response);
                    coreDataService.refreshFacilities();
                    coreDataService.refreshFields(); 
                }, function(errResponse) {
                    console.log("Failed on attempt to open field:");
                    console.log(errResponse);
                });              
            } else {
                console.log("Determined that this closure only affects this field.");
                var putString = '{ "end": ' + new Date().getTime() + '}';
            
                $http({
                    url: baseURL + 'closures/' + form.currentClosure._id,
                    method: 'PUT',
                    headers: {
                        'content-type': 'application/json' 
                    },
                    data: putString
                }).then(function(response) {
                    console.log("Successfully opened field: " + form.entity.name);    
                    coreDataService.refreshFacilities();
                    coreDataService.refreshFields(); 
                }, function(errResponse) {
                    console.log("Failed on attempt to close field:");
                    console.log(errResponse);
                }); 
            }
        };
        
        this.updateClosure = function(form) {
            console.log("Attempting to update closure for " + form.entity.name);
            var startTime;
            var endTime;
            var startMilli;
            var endMilli;
            var type = "CURRENT";
            
            if(form.duration != "other" && form.duration != "future") {
                startTime = new Date(form.currentClosure.start);
                endTime = datetimeService.addHours(form.duration, new Date(form.currentClosure.start));
            } else if(form.duration == "other") {
                startTime = new Date(form.currentClosure.start);
                endTime = datetimeService.combineDateTime(form.enddate, form.endtime);
            } else if(form.duration == "future") {
                startTime = datetimeService.combineDateTime(form.futureStartDate, form.futureStartTime);
                endTime = datetimeService.combineDateTime(form.futureEndDate, form.futureEndTime);
                type = "FUTURE";
            }
            
            startMilli = startTime.getTime();
            endMilli = endTime.getTime();
            
            var putString = '{ "message": "' + form.message + '", "start": ' + startMilli + ', "end": ' + endMilli + ', "type": "' + type + '" }';
            
            $http({
                url: baseURL + 'closures/' + form.currentClosure._id,
                method: 'PUT',
                headers: {
                    'content-type': 'application/json' 
                },
                data: putString
            }).then(function(response) {
                console.log("Successfully updated closure: ");
                console.log(response);    
                coreDataService.refreshFacilities();
                coreDataService.refreshFields();
            }, function(errResponse) {
                console.log("Failed on attempt to update closure:");
                console.log(errResponse);
            });
        };
        
        this.closeFacility = function(form) {
            console.log("Attempting to close facility " + form.entity.name);
            var startTime;
            var endTime;
            var startMilli;
            var endMilli;
            var type = "CURRENT";
            
            if(form.duration != "other" && form.duration != "future") {
                startTime = new Date();
                endTime = datetimeService.addHours(form.duration, startTime);
            } else if(form.duration == "other") {
                startTime = new Date();
                endTime = datetimeService.combineDateTime(form.enddate, form.endtime);
            } else if(form.duration == "future") {
                startTime = datetimeService.combineDateTime(form.futureStartDate, form.futureStartTime);
                endTime = datetimeService.combineDateTime(form.futureEndDate, form.futureEndTime);
                type = "FUTURE";
            }
            
            startMilli = startTime.getTime();
            endMilli = endTime.getTime();
            
            var postString = '{ "message": "' + form.message + '", "start": ' + startMilli + ', "end": ' + endMilli + ', "type": "' + type + '" }';
            
            $http({
                url: baseURL + 'closures/',
                method: 'POST',
                headers: {
                    'content-type': 'application/json' 
                },
                data: postString
            }).then(function(response) {
                console.log("Successfully created closure: ");
                console.log(response);    
                
                //next submit closure to facility:
                $http({
                    url: baseURL + 'facilities/closeFacility/' + form.entity._id + '/' + response.data._id,
                    method: 'PUT',
                    headers: {
                        'content-type': 'application/json' 
                    }
                }).then(function(closeResponse) {
                    console.log("Successfully closed facility: ");
                    console.log(closeResponse); 
                    coreDataService.refreshFacilities();
                    coreDataService.refreshFields();
                }, function(closeError) {
                    console.log("Failed on attempt to close facility:");
                    console.log(closeError);
                });                
                
            }, function(errResponse) {
                console.log("Failed on attempt to close facility:");
                console.log(errResponse);
            });            
        };
        
        this.openFacility = function(form) {
            console.log("Attempting to open facility " + form.entity.name);
            
            $http({
                url: baseURL + 'facilities/openFacility/' + form.entity._id,
                method: 'PUT',
                headers: {
                    'content-type': 'application/json' 
                }
            }).then(function(response) {
                console.log("Successfully opened facility: ");
                console.log(response);    
                
                coreDataService.refreshFacilities();
                coreDataService.refreshFields();
            }, function(errResponse) {
                console.log("Failed on attempt to open facility:");
                console.log(errResponse);
            });            
        };
        
        this.reopenClosedFields = function(form) {
            //todo: simple call to facilities/reopenFields/:facilityId  
            var facilityId = form.entity._id;
            
            console.log("Attempting to open all closed fields in facility " + form.entity.name);
            
            return $http({
                url: baseURL + 'facilities/reopenFields/' + facilityId,
                method: 'PUT',
                headers: {
                    'content-type': 'application/json' 
                }
            });            
        };
        
        this.processPreseasonBidRequest = function(form) {
            console.log("Begin processing of the preseason practice slot bid request");
            
        };
        
    }])

    .service('datetimeService', [function() { 
        
        this.addHours = function(hours, date) {
            var returnMilis;
            var returnDate;
            var dateMilis = date.getTime();
            
            console.log("Updating date " + date.toISOString() + " by adding " + hours + " hours.");
            
            returnMilis = dateMilis + (hours * 60 * 60 * 1000);
            returnDate = new Date(returnMilis);
            
            console.log("Converted date to " + returnDate.toISOString());
            return returnDate;            
        };
        
        this.combineDateTime = function(date, time) {
            var returnMilis;
            var returnDate;
            
            console.log("Combining date portion of " + date.toISOString() + " with time portion of " + time.toISOString());
            returnDate = new Date(date.getFullYear(), date.getMonth()  , date.getDate(), time.getHours(), time.getMinutes(), time.getSeconds(), time.getMilliseconds());
                        
            console.log("Converted date to " + returnDate.toISOString());
            return returnDate;            
        };
        
        this.getIsoDate = function(milis) {
            var sent = new Date(milis);
            var today = new Date();
            var dateString = '';
            var isAm = true;
            
            if(sent.getHours() >= 12) {
                isAm = false;
            }
            
            //determine if invite was sent today, either way, set date portion of string:
            if(today.getFullYear() == sent.getFullYear() &&
               today.getMonth() == sent.getMonth() &&
               today.getDate() == sent.getDate()) {
                dateString += 'Today ';                
            } else {
                dateString += (sent.getMonth() + "/" + sent.getDate() + "/" + sent.getFullYear()) + " ";
            }
            
            //convert hours to am/pm
            var hour = sent.getHours() % 12;
            hour = hour ? hour : 12;
            dateString += (hour + ":" + sent.getMinutes());
            if(isAm) {
                dateString += "AM"; 
            } else {
                dateString += "PM";
            }   
            
            return dateString;            
        };  
        
        this.determineDuration = function(durationMillis) {
            var eight = 8 * 60 * 60 * 1000;
            var twelve = 12 * 60 * 60 * 1000;
            var eighteen = 18 * 60 * 60 * 1000;
            var twentyfour = 24 * 60 * 60 * 1000;
            
            var duration = '';
            if(isEquivalent(durationMillis, eight)) {
                duration = '8';
            } else if(isEquivalent(durationMillis, twelve)) {
                duration = '12';
            } else if(isEquivalent(durationMillis, eighteen)) {
                duration = '18';
            } else if(isEquivalent(durationMillis, twentyfour)) {
                duration = '24';
            }
            
            return duration;
        };
        
        this.convertToMilitary = function(time) {
            var militaryTime = '0000';
            console.log("Received time: " + time);
            return militaryTime;
        };
        
        function isEquivalent(value, target) {
            var targetPlus = target + 5000; 
            var targetMinus = target - 5000;
            var equivalent = false;
            
            //if the times match within 5 seconds, that is close enough:
            if(value >= targetMinus && value <= targetPlus) {
                equivalent = true;
            }
            return equivalent;
        };
    }])
                             
    .service('authService', ['$http', 'baseURL', 'ngDialog', '$state', 'userService', 'coreDataService', 'clubService', function($http, baseURL, ngDialog, $state, userService, coreDataService, clubService) {
        var authToken = undefined;
        var isAuthenticated = false;       
        
        this.isUserAuthenticated = function() {
            return isAuthenticated;
        };
        
        this.loginOnly = function (loginData) {
            //make http request and return promise:
            return $http({
                url: baseURL + 'users/login',
                method: 'POST',
                headers: {
                    'content-type': 'application/json' 
                },
                data: loginData
            });  
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
                internalSetUserCredentials({username:loginData.username, token: response.data.token, fullname: response.data.fullname, userId: response.data.userId});                 
                console.log("User " + response.data.fullname + " has been authenticated successfully.");
                
                //retrieve user and store in scope:
                $http({
                    url: baseURL + 'users/' + response.data.userId,
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json' 
                    }
                }).then(function(response) {
                    console.log("Retrieved the user from the API with value: ");
                    console.log(response);
                    console.log("\n\nSETTING CURRENT USER TO: " );
                    console.log(response.data);
                    userService.setCurrentUser(response.data);
                    
                    //retrieve user's club_roles:
                    $http({
                        url: baseURL + 'club_roles?member=' + response.data._id,
                        method: 'GET',
                        headers: {
                            'content-type': 'application/json' 
                        }
                    }).then(function(response) {
                        console.log("Retrieved the user's club_roles: " );
                        console.log(response);
                        
                        userService.setUserClubRoles(response.data);
                        
                        //create an array of Role objects:
                        var userRoles = [];
                        for(var i = 0; i < response.data.length; i++) {
                            userRoles.push(response.data[i].role);
                            console.log("Adding role to array:");
                            console.log(response.data[i].role);
                        }
                        
                        //create an array of Club objects:
                        var userClubs = [];
                        var userClubIds = [];
                        for(var i = 0; i < response.data.length; i++) {
                            console.log("Checking if " + response.data[i].club._id + "already exists");
                            if(userClubIds.indexOf(response.data[i].club._id) == -1) {  
                                console.log(response.data[i].club._id + "does not exist in");
                                console.log(userClubIds);
                                userClubs.push(response.data[i].club);
                                userClubIds.push(response.data[i].club._id);
                            } else {
                                console.log(response.data[i].club._id + "already exists");
                            }                           
                        }
                        
                        userService.populateUserRoles(userRoles);  
                        userService.populateUsersClubs(userClubs);
                    
                        //do app data load:
                        coreDataService.appDataLoad(userService.getCurrentUser(false), clubService.getCurrentClubId());
                        
                    }, function(errResponse) {
                        console.log("Failed in attempt to retrieve users club_roles.");
                        console.log(errResponse);
                    });             
                });   
                
                $state.go("app.home");
                ngDialog.close();
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
                isAuthenticated = false;
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
        
        this.registerOnly = function(registerData) {
            //make http request and return promise:
            console.log("Attempting to register user with data:");
            console.log(registerData);
            
            return $http({
                url: baseURL + 'users/register',
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                data: registerData
            });
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
                ngDialog.close();
                
                console.log("will attempt to log user in with username: " + registerData.username + " and password: " + registerData.password);
                internalLogin({username:registerData.username, password:registerData.password});
                var message = '\
                <div class="ngdialog-message">\
                <div><h3>Registration Successful</h3></div>' +
                '<div class="ngdialog-buttons">\
                    <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=confirm(1)>OK</button>\
                </div>'
            
                ngDialog.openConfirm({ template: message, plain: 'true'});
                
            }, function(response) {
                console.log("failed to registered a user.");
                $scope.showRegLoader = true;
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
        
        this.setUserCredentials = function(credentials) {
            isAuthenticated = true;
            authToken = credentials.token;

            // Set the token as header for your requests!
            $http.defaults.headers.common['x-access-token'] = authToken;
            console.log("user credentials have been set \nisAuthenticated: " + 
                        isAuthenticated + "\nusername: " + credentials.username + "\nauthToken: " + 
                        authToken + "\nfullname: " + credentials.fullname + "\nuserId: " + credentials.userId);
        };
        
        var internalSetUserCredentials = this.setUserCredentials;
        
        function destroyUserCredentials() {
            isAuthenticated = false;
            authToken = '';
                        
            clubService.clearCurrentClub();
            userService.cleanupLoggedOutUser();
            coreDataService.cleanupOnLogout();

            // Set the token as header for your requests!
            $http.defaults.headers.common['x-access-token'] = authToken;
            console.log("user credentials have been destroyed.");
        }; 
        
        this.isLoggedIn = function() {
            return isAuthenticated;
        };
    }])

;
