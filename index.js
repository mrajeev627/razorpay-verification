const express = require('express');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
// key id = rzp_live_IAJfOSNz8YRcLn
// key sectet = yGIvtxmUs7ROTLRtaHonKhkQ

const key_secret = 'yGIvtxmUs7ROTLRtaHonKhkQ'; // ⚠️ Replace this with your Razorpay secret

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