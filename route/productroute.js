const express = require('express');
const router = express.Router();
const UserControllers= require('../controller/productcontroller');
const auth=require('../middelware/auth')
const path=require('path');
const upload = require('../middelware/multer');
const { route } = require('./userroute');

router.post('/product' ,auth,upload.array('url'),UserControllers.postproduct);
router.post('/image' ,auth,upload.array('url'),UserControllers.postimage);
router.get('/getdata',UserControllers.getdata);

router.get('/showdata',UserControllers.displaydata);
router.get('/getpdf',UserControllers.getpdf);
 module.exports=router;