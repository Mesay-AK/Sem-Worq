const mongoose = require("mongoose");

const ServicesSchema = new mongoose.Schema({
    title : {type:String, required: true},
    description : {type:String, required: true},
    createdAt: {type: Date,default: Date.now},
    updtedAt: {type:Date, default:Date.now}
}, 
  {
    timestamps: true,
  });

const ServiceModel = mongoose.model('Services', ServicesSchema);


module.exports = 
     ServiceModel; 

    