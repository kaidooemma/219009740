const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
    firstName: {type: String},
    lastName: {type: String},
    DOB: {type: Date, default: Date.now},
    contact: {type: String},
    residentAddress: {type: String},
    emergencyNo: {type: String}
})
const Patient =  mongoose.model('Patient', PatientSchema);

const PaymentSchema = new mongoose.Schema({

})
const Payment = mongoose.model('Payment', PaymentSchema)

module.exports = { Patient,  Payment }