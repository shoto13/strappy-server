const mongoose = require('mongoose');
const strapSchema = new mongoose.Schema({
    strapId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Strap"
    },
    reference:{
        type:String,
        required:true,
        unique:true
    },
    material:{
        type:String,
        required:true
    },
    closure:{
        type:String,
        required:false
    },
    finish:{
        type:String,
        required:false
    },
    make:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:false
    }
});

const Strap = mongoose.model("Strap", strapSchema);

module.exports = Strap;