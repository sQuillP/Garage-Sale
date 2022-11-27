const asyncHandler = require("../Middleware/AsyncHandler");
const Item = require("../models/Item");
const User = require("../models/User");
const ErrorResponse = require("../utils/ErrorResponse");


/**
 * @Route: 
 *  - GET api/v1/items
 *  - GET api/v1/sales/:saleId/items
 * @Scope: Public
 * @Params:
 * - limit:number the number of items you want retrieved per request
 * - page:number which page you would like to view of the items.
 * - name:string - the type of name you would like to search for in the items.
 * - maxPrice:number the max price for a certain item
 * - minPrice:number the minimum price for a certain item
 * - lat:number latitude of geographic location
 * - long:number longitude of geographic location
 * -sortByPrice:string -> ("ascending", "descending")
 */
exports.getItems = asyncHandler( async (req,res,next)=> {
    const [limit, page] = [req.query.limit || 100, req.query.page || 1];
    const METERS_PER_MILE = 1609.34;
    let query = {};
    let items = null;
    console.log(req.query);
    if(req.params.saleId){//if querying only items for a sale
        items = await Item.find({saleId: req.params.saleId});
        if(items == null){
            return next(
                new ErrorResponse(
                    404,
                    `Sale ${req.params.saleId} does not exist`
                )
            );
        }
        res.status(200).json({
            status: 200,
            data:items
        });
        return next();
    }
    if(req.query.radius){ //query to find how far an item is
        if(!req.query.long || !req.query.lat){
            return next(
                new ErrorResponse(
                    401,
                    `Please specify lat and long when including radius`
                )
            );
        }
        query['location'] = {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(req.query.long,10),parseFloat(req.query.lat,10)]
                    },
                    $maxDistance: parseFloat(req.query.radius,10)*METERS_PER_MILE, //takes in units for meters
                    $minDistance: 0
                }
        }
    }

    if(req.query.name)
        query['name'] = new RegExp(req.query.name,'gi');

    if(req.query.maxPrice)
        query['price'] = { $lt: parseFloat(req.query.maxPrice,10)};
    if(req.query.minPrice)
        query['price']['$gt'] = parseFloat(req.query.minPrice,10);

    if(req.query.sortByPrice){
        const param = req.query.sortByPrice;
        console.log(param);
        if(param.toLowerCase() !== "asc" && param.toLowerCase() !== "desc")
            return next(
                new ErrorResponse(
                    401,
                    `sortByPrice value must be specified as "asc | desc"`
                )
            );
    }
    query['isPurchased'] = false;
    items =  Item.find(query);

    if(req.query.sortByPrice)
        items = items.sort({price: req.query.sortByPrice==="asc"?1:-1});
    
    items = await items.skip((page-1)*limit).limit(limit);

    res.status(200).json({
        status: 200,
        data: items
    });
});


/**
 * @Route: POST api/v1/items
 * @Scope: Private, must be signed in
 */
 exports.createItem = asyncHandler( async (req,res,next)=> {
    const createdItem = await Item.create(req.body);

    res.status(201).json({
        status: 201,
        data: createdItem
    })
});


/**
 * @Route: GET api/v1/items/:itemId
 * @Scope: Public
 */
exports.getItem = asyncHandler( async (req,res,next) => {

    const fetchedResult = await Item.findById(req.params.itemId).populate("saleId");

    //I am not sure how to handle strict populate so this will have to do for now...
    fetchedResult.saleId.userId = await User.findById(fetchedResult.saleId.userId);

    if(fetchedResult == null){
        return next(
            new ErrorResponse(
                404,
                `Item with id ${req.params.itemId} does not exist`
            )
        );
    }


    res.status(200).json({
        status: 200,
        data: fetchedResult
    });
});



/**
 * @Route: PUT api/v1/items/:itemId
 * @Scope: Private, must be signed in
 */
 exports.updateItem = asyncHandler( async (req,res,next)=> {
    const updatedItem = await Item.findByIdAndUpdate(req.params.itemId);

    if(updatedItem == null){
        return next(
            new ErrorResponse(
                404,
                `Item with id ${req.params.itemId} does not exist`
            )
        );
    }

    res.status(201).json({
        status: 201,
        data: updatedItem
    })
});



/**
 * @Route: DELETE api/v1/items/itemId
 * @Scope: Private, must be signed in
 */
 exports.deleteItem = asyncHandler( async (req,res,next)=> {
    const deletedItem = await Item.findByIdAndDelete(req.params.itemId);

    if(deletedItem == null){
        return next(
            new ErrorResponse(
                404,
                `Item with id ${req.params.itemId} does not exist`
            )
        );
    }

    res.status(201).json({
        status: 201,
        data: deletedItem
    })
});


