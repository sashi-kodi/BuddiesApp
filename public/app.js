var studentsApp = angular.module('studentsApp', ['ui.bootstrap','ui.grid']);
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
        
//        $scope.reverse=false;
//        $scope.sortorder="username";
//        $scope.sort= function(str){
//            if($scope.sortorder=== str){
//                $scope.reverse=!$scope.reverse;
//                
//            }
//            else{
//                $scope.sortorder=str;
//            }
//        }
        
        $scope.gridoptions={
            enableSorting: true,
            enableFiltering:true,
            columnDefs:[{name:'User Name', field:'username'},
                        {name:'First Name', field:'fname'},
                        {name:'Last Name', field:'lname'},
                        {name:'Status', field:'status'},
                        {name:'Edit', cellTemplate: './partials/editButton.html', width: 50, enableSorting: false, enableFiltering:false},
                         {name:'Delete', cellTemplate: './partials/deleteButton.html', width: 50, enableSorting:false, enableFiltering:false }
                       ]
        };
        
        
        BuddiesFactory.getAllContacts()
        .then(
    function(res){
        $scope.students= res.data;
         $scope.gridoptions.data = $scope.students;
       
        
    },
        function(data,status,header,config){
            $scope.students = null;
            console.log("An error occured while retrieving  buddies list from the server");
        }
    );
        
         $scope.gridoptions.data = $scope.students;
        
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

        $scope.delete = function(row){
            console.log(row.entity);
            var modalInstance = $uibModal.open({
                templateUrl:'partials/deleteBuddy.html',
                controller: 'StudentModalDeleteController',
                resolve:{
                    studentname : function(){
                        return row.entity.username;
                    }
                }
            });
            modalInstance.result.then(function(studentname){
                
                BuddiesFactory.deleteContact(row.entity.username)
                .then(function(res){
                    var position = search(row.entity.username);
                     $scope.students.splice(position,1);
                    
                }, function(data,status,header,config){
                    console.log("Error occured while trying to delete the record from database ");
                });
                
                

            },function(){
                console.log("the user cancelled the delete operation");
            });
        };
        function search(username){
            var pos=-1;
            for (var i=0;i<$scope.students.length;i++){
                if($scope.students[i].username===username) {
                    pos=i;
                    break;
                }
            }
            return pos;
            
        }
        $scope.update = function(row){
            console.log(row.entity);
       
           var position = search(row.entity.username);
           
          var buddy=angular.copy($scope.students[position]);
           
            
            var modalInstance = $uibModal.open({
                templateUrl:'./partials/createBuddy.html',
                controller:'StudentModalUpdateController',
                resolve:{
                    student : function(){
                        return buddy;
                    }
                }
            });

            modalInstance.result.then(function(newbuddy){
                BuddiesFactory.updateContact(newbuddy)
              .then(function(res){
                    // $scope.students[index]=angular.copy(newstud);
                    var position = $scope.students.indexOf(row.entity.username);
                    $scope.students[position] = angular.copy(newbuddy);
                    
                }, function(data,status,header,config){
                    console.log("Error occured while trying to update the record at database ");
                });
                //$scope.students[index]=angular.copy(newstud);
            },function(){
                console.log('The user has cancelled the update operation');
            });


        };
    });