angular.module('studentsApp').factory('BuddiesFactory', function($http){
    var factory={};
    factory.getAllContacts= function(){
        return $http.get('/api/buddies');
    }
    
    factory.getContact = function(username){
        return $http.get('/api/buddies/'+ username);
        
    };
    
    factory.updateContact = function(data){
        var username = data.username;
        return $http.put('/api/buddies/'+username,data);
    }
    
    factory.addContact = function(data){
        return $http.post('/api/buddies',data);
    }
    factory.deleteContact = function(username){
        
        return $http.delete('/api/buddies/'+ username);
        
    }
    return factory;
});