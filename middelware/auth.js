const jwt=require('jsonwebtoken');
const beareer=(req,res,next)=>{
    const token=req.headers['authorization'];
    if(!token){
        res.status(500).json({message:"invalid token"});
    }
    else{
        const bearer=token.split(" ");
        const value=bearer[1];
        // req.token=value;
        const user=jwt.verify(value,process.env.secretkey);
       const userid=user.id;
       req.userid=userid;
        
    }
next();



}

module.exports=beareer;