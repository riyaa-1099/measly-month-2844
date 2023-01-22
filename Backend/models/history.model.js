const mongoose=require("mongoose")

const QuerySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    url: {
        type: String,
        required: true
    },
    method: {
        type: String,
        required: true
    },
    headers: {
        type: Object
    },
    params: {
        type: Object
    },
    date: {
        type: Date,
        default: Date.now
    }
});
const Historymodel = mongoose.model('History', QuerySchema);

QuerySchema.pre('save', function(next) {
    Historymodel.countDocuments({userId:this.userId}).then(count => {
        if(count>10) {
            Historymodel.deleteMany({ userId: this.userId }).sort({date:-1}).limit(count-10).then(()=>{
                next();
            })
        } else {
            next();
        }
    });
});

module.exports={
    Historymodel
}