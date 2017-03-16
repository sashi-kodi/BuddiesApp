var studentsApp = angular.module('studentsApp', ['ui.bootstrap']);
    studentsApp.controller('StudentModalUpdateController', function($scope,$uibModalInstance,student){
        $scope.title ="Update";
        $scope.stud = student;
      $scope.statuslist=['available', 'busy', 'idle', 'Offline'];
        $scope.ok = function(){
            $uibModalInstance.close($scope.stud);
        };

        $scope.cancel = function(){
            $scope.stud = student;
            $uibModalInstance.dismiss('cancel');
        };

    });
    studentsApp.controller('StudentModalDeleteController', function($scope,$uibModalInstance,studentname){
        $scope.studentname = studentname;
        $scope.ok = function(){
            $uibModalInstance.close($scope.studentname);
        };

        $scope.cancel = function(){

            $uibModalInstance.dismiss('cancel');
        };

    });
    studentsApp.controller('StudentModalAddController', function($scope,$uibModalInstance){
        $scope.title ="Add";
        $scope.statuslist=['available', 'busy', 'idle', 'Offline'];
        $scope.ok = function(){

            $uibModalInstance.close($scope.stud);
        };

        $scope.cancel = function(){

            $uibModalInstance.dismiss('cancel');
        };

    });
    studentsApp.controller('studentsController', function($scope,$uibModal,BuddiesFactory){

//        $scope.students = [{username:'isha',fname:'sashi', lname:'kodi', status:'available',bdate:new Date('1981-11-19'), bio:'i like chatting', email:'sashikv@yahoo.com'},
//            {username:'shake',fname:'sekhar', lname:'kodi', status:'busy', email:'sekhar.sh@gmail.com',bdate:new Date('1979-02-28'), bio:'likes to do research'}];
        
        BuddiesFactory.getAllContacts()
        .then(
    function(res){
        $scope.students= res.data;
        
    },
        function(data,status,header,config){
            $scope.students = null;
            console.log("An error occured while retrieving  buddies list from the server");
        }
    );
        
        $scope.addStudent = function(){
            var modalInstance = $uibModal.open({
                templateUrl:'partials/createBuddy.html',
                controller:'StudentModalAddController'
            });
            modalInstance.result.then(function(newStudent){
                //console.log(newStudent);
               
                BuddiesFactory.addContact(newStudent)
                .then(function(res){
                     $scope.students.push(newStudent);
                    
                }, function(data,status,header,config){
                    console.log("Error occured while posting the new record to server");
                });
                
            }, function(){
                console.log("New student details were not entered");
            });
        };

        $scope.delete = function(index){

            var modalInstance = $uibModal.open({
                templateUrl:'partials/deleteBuddy.html',
                controller: 'StudentModalDeleteController',
                resolve:{
                    studentname : function(){
                        return $scope.students[index].username;
                    }
                }
            });
            modalInstance.result.then(function(studentname){
                
                BuddiesFactory.deleteContact($scope.students[index].username)
                .then(function(res){
                     $scope.students.splice(index,1);
                    
                }, function(data,status,header,config){
                    console.log("Error occured while trying to delete the record from database ");
                });
                
                

            },function(){
                console.log("the user cancelled the delete operation");
            });
        };

        $scope.update = function(index){
           var student1= angular.copy($scope.students[index]);
            console.log("inside update method");
            console.log(student1);
            var modalInstance = $uibModal.open({
                templateUrl:'./partials/createBuddy.html',
                controller:'StudentModalUpdateController',
                resolve:{
                    student : function(){
                        return student1;
                    }
                }
            });

            modalInstance.result.then(function(newstud){
                BuddiesFactory.updateContact(newstud)
              .then(function(res){
                     $scope.students[index]=angular.copy(newstud);
                    
                }, function(data,status,header,config){
                    console.log("Error occured while trying to update the record at database ");
                });
                //$scope.students[index]=angular.copy(newstud);
            },function(){
                console.log('The user has cancelled the update operation');
            });


        };
    });