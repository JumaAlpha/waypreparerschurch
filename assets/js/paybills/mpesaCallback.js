const handleMpesaCallback = (req, res) => {
    const { Body } = req.body;

    if (Body.stkCallback.ResultCode === 0) {
        const transactionData = Body.stkCallback.CallbackMetadata.Item.reduce((acc, item) => {
            acc[item.Name] = item.Value;
            return acc;
        }, {});
        console.log('Transaction Successful:', transactionData);
        // Update the article purchase status in the database here
    } else {
        console.error('Transaction Failed:', Body.stkCallback.ResultDesc);
    }

    res.status(200).send('Callback received');
};

module.exports = { handleMpesaCallback };
