const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.post('/order', async(req, res) => {

    try{
    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    const options = req.body;
    const order = await razorpay.orders.create(options);

    if(!order) {
        return res.status(500).send('Error creating order');
    }

    res.json(order);
    }catch(err){
        console.error('Error creating order:', err); 
        res.status(500).send('Error Occurred');
    }   
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});