const models = require('../models');
const jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const User = models.User;



var transpoter = nodemailer.createTransport({
    service: 'gmail',

    auth: {
        user: process.env.User_email,
        pass: process.env.User_password
    },
    tls: {
        rejectUnauthorized: false
    }

});




// User register

exports.userregister= async(req,res,next)=>{
    try {
        const {first_name,last_name,email,address,password,verified}=(req.body);
        const data = await User.findOne({ where: { email: email } });

        // email check
        if (data) {
            res.status(500).json({ message: "email already exsit" });
            return;
        } 

        // hashpassword
        const hashpass = await bcrypt.hash(password, 12);

        // create data
         const user=await User.create({
            first_name:first_name,
            last_name:last_name,
            email:email,
            address:address,
            password:hashpass,
          
         });
        //  console.log("user data",user);

        

         const payload = {
            id: user.id,
            email: user.email

        }
         const token = jwt.sign(payload, process.env.secretkey, { expiresIn: '12h' });
         const url = `http://localhost:3000/verify/${token}`
        var mailOptions = {
            from: ' s12348946@gmail.com',
            to: email,
            subject: 'reset link',
            text:url
        }
         
        transpoter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            }

        })
        
        res.status(200).json({ status: 'sucess', message: 'verify link set your email...', data: user, token: token });

    } catch (error) {
        console.log(error);
        res.status(400).json({error});
    }
  
}


// User login

exports.userlogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({where: {email:email}});
        console.log(user)
        if(!user){
            res.status(400).json({message:"Invalid email Credential"});
            return;
        }

        const payload = {
            email: user.email,
            id: user.id
        }
console.log(payload);
        const token = jwt.sign(payload, process.env.secretkey, { expiresIn: '15m' });
        console.log(token)
        if (user.verified == '0') {
            const url = `http://localhost:3000/verify/${token}`
            console.log(url);
console.log(user.verified);
            var mailOptions = {
                from: ' s12348946@gmail.com',
                to: email,
                subject: 'reset link',
               text:url
            }
             
            transpoter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                }
    
            })
            console.log(user);
        

            return res.status(200).json({ status: "ok", msg: "sent email to verify your account" });

        }


        const isMatch = await bcrypt.compare(password,user.password);
        console.log(isMatch);
            if(!isMatch){
                res.status(400).json({message:'Invalid Credential'});
                return;
            }
            res.status(200).json({success:"ok",msg:"login Successful",data:user,token:token});

    } catch (error) {
        console.log(e);
        res.send(400).json({error});

    }
}

exports.verifyuser=async (req,res,next)=>{
    try {
        const token = req.params.token;

        const verifyUser = jwt.verify(token, process.env.secretkey);

        const { id } = verifyUser;

        const user = await User.findOne({ where: { id: id } });
        if (!user) {
            res.status(200).json({ msg: "User does not exist" });
        }
        await User.update({
            verified: '1'
        },
            {
                where: { id: id }
            })
//    console.log(update);
        res.status(200).json({ msg: "Email verified Succesfully" });
    } catch (error) {
        console.log(error)
        res.send(error);
    }
}