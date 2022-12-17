const mongoose = require('mongoose');
const ErrorResponse = require('../utils/ErrorResponse');
const Sale = require("./Sale");


const ItemSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, `Please enter a name for the item`]
    },
    price:{
        type:Number,
        required:[true,`Please specify a price for the item`]
    },
    gallery:{
        type: [String],
        maxLength:[5,`No more than 5 pictures for the gallery`],
        minLength:[1,`Please provide a photo of the item`]
    },
    saleId: {
        type: mongoose.Schema.ObjectId,
        ref:'sale',
        required:[true,`Please provide a sale id`]
    },
    description:{
        type:String,
        required: [true, 'please enter a description for item']
    },
    highestBidder:{
        type: mongoose.Schema.ObjectId,
        ref: 'user'
    },
    expireAt: {
        type: Date,
        expires: 0,
        required: true,
        default: Date.now()+3600000
    },
    purchased: {
        type: Boolean,
        default: false,
        required: true
    },
    start_date:{
        type: Date,
        required: true,
        default: Date.now()
    },
    end_date:{
        type:Date,
        required:true,
        default: Date.now()+3600000 
    },
    location:{
        type: {
            type: String,
            enum:["Point"], 
            required: true,
            default: "Point"
        },
        coordinates:{
            type: [Number],
            required: [true,`Please insert coordinates here`],
            validate: {
                validator: function(vals){
                    return Math.abs(vals[0]) <= 180 && Math.abs(vals[1]) <= 90;
                },
                message: `Longtitude values must range from [-180,180] and latitude must range from [-90,90]`
            },
            default:[0,0]
        },
    },
    terms:{
        type:String,
        required: true,
        default: "there are no terms & conditions for this product. Please consult seller for any concerns."
    }
},{
    timestamps: true
});


/* Index the name property for ease of search */
// ItemSchema.index({name:"text"});

ItemSchema.index({location:"2dsphere"});

/* Place a single picture of the item into the associated sale gallery
set the expiration date of the item to the sale's expiration date. */
ItemSchema.pre('save', async function(next){
    const sale = await Sale.findById(this.saleId);
    if(sale == null){
        return next(
            new ErrorResponse(
                404,
                `Sale ${this.saleId} does not exist`
            )
        );
    }

    sale.gallery.push(this.gallery[0]);
    sale.itemCount+= 1;

    await sale.save({
        validateBeforeSave: true,
    });

    updateItemFields(this,sale);
    next();
});


/* When multiple items are inserted into database. */
ItemSchema.pre('insertMany',async function(next, items) {
    const sale = await Sale.findById(items[0].saleId);
    if(sale == null){
        return next(
            new ErrorResponse(
                404,
                `Sale ${this.saleId} does not exist`
            )
        );
    }

    for(const item of items){
        sale.gallery.push(item.gallery[0])
        sale.itemCount ++;
        updateItemFields(item,sale);
    }
    await sale.save({
        validateBeforeSave: true
    });

})


  //Assign some of the fields from parent object
    // this.terms = sale.terms_conditions;
    // this.location.coordinates = sale.location.coordinates;
    // this.expireAt = sale.expireAt;
    // this.start_date = sale.start_date;
    // this.end_date = sale.end_date;

function updateItemFields(item, sale){
    item.terms = sale.terms_conditions;
    item.location.coordinates = sale.location.coordinates;
    item.expireAt = sale.expireAt;
    item.start_date = sale.start_date;
    item.end_date = sale.end_date;
}


const ItemModel = mongoose.model('item',ItemSchema);
module.exports = ItemModel;