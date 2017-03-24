var express= require('express');
var bodyparser = require('body-parser');
var mongoose = require('mongoose');
var app= express();
app.use(express.static(__dirname + "/public"));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));

mongoose.connect('mongodb://sashikodi:omsai28@ds151927.mlab.com:51927/sandbox');
var db=mongoose.connection;
db.on('error', console.error.bind(console,'connection error'));
db.once('open', function(){
    console.log('database connection to Mongoose has been established');
});
app.use('/', require('./routes'));

app.listen(3000);
console.log('server is listening on port 3000');
