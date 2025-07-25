const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Razorpay credentials
const key_id = 'rzp_live_IAJfOSNz8YRcLn';
const key_secret = 'yGIvtxmUs7ROTLRtaHonKhkQ';

const razorpay = new Razorpay({
    key_id,
    key_secret
});

// 🧾 Route to create Razorpay order
app.post('/create-order', async (req, res) => {
    try {
        const { amount } = req.body;
        const options = {
            amount: amount * 100, // amount in paise
            currency: "INR",
            receipt: `receipt_order_${Math.floor(Math.random() * 10000)}`
        };

        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Order creation failed', details: error });
    }
});

// ✅ Route to verify Razorpay signature
app.post('/verify', (req, res) => {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac('sha256', key_secret)
        .update(body.toString())
        .digest('hex');

    if (expectedSignature === razorpay_signature) {
        res.json({ verified: true });
    } else {
        res.status(400).json({ verified: false, error: "Invalid signature" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});