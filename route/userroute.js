const express = require('express');
const router = express.Router();
const UserControllers= require('../controller/usercontroller')
const path=require('path');

router.post('/register' ,UserControllers.userregister);
router.post('/login' ,UserControllers.userlogin);
router.get('/verify/:token' ,UserControllers.verifyuser);

 module.exports=router;