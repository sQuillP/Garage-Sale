const mongoose = require('mongoose');

const SaleSchema = new mongoose.Schema({
    start_date:{
        type: Date,
        required: [true,`Please specify a sale date`]
    },
    end_date:{
        type:Date,
        required:[true,`Please specify an end date`]
    },
    address:{
        type:String,
        required:[true,`Please specify an address`],
    },
    description:{
        type:String,
        required: true
    },
    title:{
        type:String,
        required: true,
        maxLength: [45,`Description must be at most 45 characters`]
    },
    terms_conditions:{
        type:String,
        required:[true, `Please specify terms and conditions`]
    },
    userId:{
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: [true, `Sale must have an owner`]
    },
    gallery:{
        type: [String],
        default: []
    },
    location:{
        type: {
            type: String,
            enum:["Point"],
            required: true
        },
        coordinates:{
            type: [Number],
            required: [true,`Please insert coordinates here`],
            validate: {
                validator: function(vals){
                    return Math.abs(vals[0]) <= 180 && Math.abs(vals[1]) <= 90;
                },
                message: `Longtitude values must range from [-180,180] and latitude must range from [-90,90]`
            }
        },
    },
    expireAt: {
        type: Date,
        expires: 0,
        required: true,
        default: Date.now()+86400000
    },
    viewCount:{
        type: Number,
        default: 0,
        required:true
    },
    itemCount:{
        type:Number,
        default:0,
    }
},{
    timestamps: true
});


//Create 2dsphere index for $near
SaleSchema.index({location: "2dsphere"});


SaleSchema.pre('save',function(next){
    this.expireAt = this.end_date;
    next();
})

/* Cascade delete when sale gets deleted */
SaleSchema.pre('deleteOne', async function(next){
    await this.model("Item").deleteMany({saleId: this._id});
    next();
});

SaleSchema.pre('deleteMany', async function(next){
    console.log('in pre delete many'.red.bold);
})

const SaleModel = mongoose.model('sale',SaleSchema);
module.exports = SaleModel;