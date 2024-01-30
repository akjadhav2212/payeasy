
const mongoose = require('mongoose');

const bankaccountSchema = mongoose.Schema({
    id:mongoose.Schema.Types.ObjectId,
    balance:Number
})

const bankAccount = mongoose.model('bankAccount',bankaccountSchema);

module.exports = bankAccount;