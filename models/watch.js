const mongoose = require('mongoose');
const watchSchema = new mongoose.Schema({
    watchId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Watch"
    },
    reference:{
        type:String,
        required:true,
        unique:true
    },
    model:{
        type:String,
        required:false
    },
    make:{
        type:String,
        required:false
    },
    yop:{
        type:String,
        required:false
    },
    sale_contents:{
        type:Object,
        required:false
    },
    straps:{
        type:Object,
        required:false
    },
    dial_color:{
        type:String,
        required:false
    },
    special_ed:{
        type:Boolean,
        required:false
    },
    case_size:{
        type:String,
        required:false
    },
    lug_width:{
        type:String,
        required:false
    }

});

const Watch = mongoose.model("Watch", watchSchema);

module.exports = Watch;