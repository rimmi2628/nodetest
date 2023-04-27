const models = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
// const { Op } = require('sequelize');
const Product=models.Product;
const Product_image=models.Product_Image;
const Image=models.Image;
const pdf=require('html-pdf');
const fs=require('fs');
const path=require('path');

exports.postproduct=async(req,res,next)=>{
     try {
    
        const userid = req.userid;
        const user=await Product.create({
         
         product_name:req.body.product_name,
         price:req.body.price,
         description:req.body.description,
         user_id:userid,
      
        });
        
   
        
        const images = req.body.image;
        const product_image = [];
        for (const im of images) {
            product_image.push({
                product_id: user.id,
                image_id: im.images
            })

        }
        const pro = await Product_image.bulkCreate(product_image);

      //   const getdata=await Product.findAll({where:{id:user.id},

      //    include: [
      //       {
      //           model: Image,
      //           as: 'product_image',
      //           attributes: ['id', 'url'],
                
      //       },
      //    ]
      // })
  
        
        res.status(200).json({message:"sucees",data:user});
     } catch (error) {
      console.log(error);
        res.status(400).json({error})
     }

}

exports.postimage=async(req,res,next)=>{
   try {
      const product_id = req.body.product_id;
      const image = [];
      for (const im of req.files) {
          image.push({
              url: im.filename,
              product_id:product_id
             
        

          })
      }

      const user = await Image.bulkCreate(image);
      res.status(201).json({ sucess: 'ok', data: user });
   } catch (error) {
      console.log(error);
      res.status(400).json({error});
      
   }
}

// exports.getdata=async(req,res,next)=>{
//    try {
//       const user=await Product.findAll({
//         attributes:['product_name','price']

//       })
//          // include:[
//          //    {
//          //     model:Image,
//          //     as:'product_image',
//          //     attributes:['product_name',"price","id","url"]
//          //    }
//          // ]
        
        
//       // const userimage=await Image.findAll({attributes:['id','url']});
 
//       res.send(200).json({data:user})
//           } catch (error) {
//             console.log(error);
//              res.send(400).json({error});
      
//    }
// }



exports.getdata=async(req,res,next)=>{
   try {
      const user=await Product.findAll({
         attributes:['product_name','price'],
         include:[{
            model:Image
         }]

      });
      res.status(200).json({data:user})
   } catch (error) {
      console.log(error);
      res.status(400).json({error});
      
   }
}



exports.getpdf=async(req,res,next)=>{
   try {
      const user=await Product.findAll();
      const data={
         user:user
      }
      // console.log(user);
      // const template=fs.readFileSync('htmlpdf.ejs','utf-8');
      const filepath=path.resolve(__dirname,'../views/htmlpdf.ejs');
      console.log("filepath" , filepath)
      const htmlfile=fs.readFileSync(filepath).toString();
     let options={
          format:"Letter"
     }
     const ejsfile= ejs.render(htmlfile,data);

     pdf.create(ejsfile,options).toFile('user.pdf',(err,response)=>{
         if(err)
            console.log(err);
           const filepath=path.resolve(__dirname,"../user.pdf");

           fs.readFile(filepath,(err,file)=>{
            if(err)
              console.log(err);
            res.setHeader('Content-Type','application/pdf');
            res.setHeader('Content-Disposition','attachment;filename="user.pdf"');
            res.send(file);

           });
          
         //   res.send(filepathh);
            console.log('file generated');
       
         
     }
     );

      
   } catch (error) {
      console.log(error);
   }
}
exports.displaydata = async (req,res,next)=>{
   try {
       const product = await Product.findAll();
      

   res.render('layout',{
       products:product
   })
   } catch (e) {
       console.log(e);
   }
}
