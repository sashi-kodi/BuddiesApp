var express = require('express');
var router = express.Router();
router.use('/api/buddies',require('./buddiesRouter'));
module.exports=router;