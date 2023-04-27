
const publishable_key='pk_test_51BTUDGJAJfZb9HEBwDg86TN1KNprHjkfipXmEDMb0gSCassK5T3ZfxsAbcgKVmAIXF7oZ6ItlZZbXO6idTHE67IM007EwQ4uN3';
const secret_key='sk_test_tR3PYbcVNZZ796tH88S4VQ2u';
const stripe = require("stripe")(secret_key);



exports.gethome=async(req,res)=>{
    res.render('checkout',{
        key:publishable_key
    });
}
  exports.payment=async(req,res)=>{
  try {
    const customer= await stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken,
        name: 'Rimzim',
        address: {
        line1: 'TC 9/4 Old MES colony',
        postal_code: '110092',
        city: 'New Delhi',
        state: 'Delhi',
        country: 'India',
        }
        });

        const charges=await stripe.charges.create({
            amount: 7000, // Charing Rs 25
            description: 'Web Development Product',
            currency: 'INR',
            customer: customer.id
        })
        
        res.status(200).json({message:"sucees"});
  } catch (error) {
    console.log(error);
    res.status(400).json({error})
  }
     
        }

