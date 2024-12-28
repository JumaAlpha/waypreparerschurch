const axios = require('axios');

const consumerKey = 'kVRcapxxYznoZfju2xjR8RtQGRhL59jSxBfpDcE6Xigyx4bN';
const consumerSecret = 'gVWM2uTDJ5UCwuILOs67tDZOHn2PpBISSOLsYcfknTsfKEUkhf5gLQn4evgsRTuN';
const shortCode = '174379';
const passkey = 'C2zsxZENBzfI2LNmgDRUpYFF90Cr1YetV+TDFGWDzn5SaJCYMcp9fySv4Rgrra8WA2pJ+L96Wre46DMBbgr0BBnqbX6GsiW5EL8eg7SofRDdG8xtcIgXDjK5YAWo2FEXslfWgFE30fcHwl221wXII/RS4IiDzeDAd6gnki19VYO0htogT2N4TDJ8nYFziq8M4OfxkD5RHVCSHtBAy99M7bp1lGPWJFMO17ABMtfaQ08PhdGDsqdWCqC9wHL5QAzjlap1zXL3IES/y2fUyzguU+5UCS1WXs8ZAcFNj9MJ7BLN078MJCRZ8AwZGDGTPM9rVgMr58O2LcT7R0ihVyOQtg==';
const callbackURL = 'http://localhost:3000/mpesa/callback';

const getAccessToken = async () => {
    const url = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
    try {
        const response = await axios.get(url, { headers: { Authorization: `Basic ${auth}` } });
        return response.data.access_token;
    } catch (error) {
        console.error('Error getting access token:', error);
        throw error;
    }
};

const initiateSTKPush = async (req, res) => {
    const { phone, amount } = req.body;

    const accessToken = await getAccessToken();
    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
    const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString('base64');

    const url = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';
    const data = {
        BusinessShortCode: shortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: phone,
        PartyB: shortCode,
        PhoneNumber: phone,
        CallBackURL: callbackURL,
        AccountReference: 'Purchase Article',
        TransactionDesc: 'Payment for Article'
    };

    try {
        const response = await axios.post(url, data, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        res.status(200).json({ message: 'STK Push initiated', data: response.data });
    } catch (error) {
        console.error('Error initiating STK Push:', error);
    
        const sellerPhone = '254712345678'; // Seller's WhatsApp number
        const redirectUrl = `http://localhost:3000/waoops?phone=${sellerPhone}&amount=${amount}`;
        res.redirect(redirectUrl);
    }
    
};

module.exports = { initiateSTKPush };
