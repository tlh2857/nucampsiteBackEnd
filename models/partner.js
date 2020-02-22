const mongoose = require('mongoose'); // cant do destructuring with require like you can with import
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency; 



const partnerSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    }, 
    image: {
        type: String, 
        required: true
    }, 
    featured: {
        type: Boolean, 
        default: false
    }
}, {
    timestamps: true
});

const Partner = mongoose.model('Partner', partnerSchema); // looks for Partner document and if not there, will 
//create new Partner Document 

module.exports = Partner;