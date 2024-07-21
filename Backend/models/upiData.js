const mongoose = require('mongoose');

const upiDataSchema = new mongoose.Schema({
    upi_id: String,
    upi_name: String,
    payment_options: {
        divphonepe: Boolean,
        divbhimupi: Boolean,
        divgooglepay: Boolean,
        divupi: Boolean
    }
});

const UpiData = mongoose.model('UpiData', upiDataSchema, 'upi_data');

module.exports = UpiData;
