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
    highestBidder:{
        type: mongoose.Schema.ObjectId,
        ref: 'user'
    },
    purchased: {
        type: Boolean,
        default: false,
        required: true
    }
});


/* Index the name property for ease of search */
ItemSchema.index({name:"text"});


/* Place a single picture of the item into the associated sale gallery */
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
    await sale.save({
        validateBeforeSave: true,
    });
    next();
});


const ItemModel = mongoose.model('item',ItemSchema);
module.exports = ItemModel;