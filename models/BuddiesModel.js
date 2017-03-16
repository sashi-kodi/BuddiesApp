var mongoose =require('mongoose');
var buddyschema = new mongoose.Schema({
    username:String,
    fname: String,
    lname: String,
    status: String,
    email: String,
    bdate : Date,
    bio: String,
    lastSignin : Date
});

var BuddyModel = mongoose.model('BuddyModel', buddyschema, 'Buddies');
module.exports=BuddyModel;