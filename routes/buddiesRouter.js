var express= require('express');
var router= express.Router();
var BuddiesModel = require('../Models/BuddiesModel');


router.get('/', function(req,res,next){
    BuddiesModel.find({},function(err,buddiesdata){
        if (err) {
            console.log("error occured at server while trying to fetch contact records");
            res.send(err);
        }
        else{
            res.json(buddiesdata);
        }
        
    });
    
        
});

router.post('/',function(req,res,next){
   BuddiesModel.create(req.body,function(err,data){
       
       if(err) {
           res.send(err);
           console.log("error occured at server while trying to post a contact record");
       }
       else{
           res.json({message:'New buddy has been successfully added'})
       }
       
   });
});

router.get('/:username', function(req,res,next){
   BuddiesModel.findOne({username:req.params.username}, function(err,data){
       
    if (err){
        console.log("an error occured while trying to read  record from database");
        res.send(err);
    }
       else{
           if(!data) {
               res.json({message:"Such a buddy does not exist in the database"});
           }
           else{
               res.json(data);
           }
       }
       
   });
});

router.put('/:username',function(req,res){
    
    var newdata = req.body;
    
 BuddiesModel.findOne({username:req.params.username},function(err,contact){
     if (err) {
         console.log("An error occured while trying to fetch buddy details from database");
         res.send(err);
     }
     else{
         if(!contact){
             console.log("such a buddy does not exists");
           res.json({message:"Such a buddy does not exist"});  
         }
         else{
             for(key in newdata)
                 contact[key]=newdata[key];
             
             console.log("new contact : "+ contact);
             contact.save(function(err,newcontact){
                 res.json({message: "Buddy updated successfully"});
             });
             
         }
     }
 });
 });   


router.delete('/:username', function(req,res,next){
    
    BuddiesModel.findOne({username:req.params.username}, function(err,contact){
        
        if(err) res.send("An error occured while trying to fetch the contact record");
        else{
            if(!contact) res.json({message:"such a buddy does not exist"});
            else{
                contact.remove(function(err,data){
                    res.json({message:"Buddy has been removed successfully"});
                });
            }
        }
        
        
    });
   
});

module.exports=router;