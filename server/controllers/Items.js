const asyncHandler = require("../Middleware/AsyncHandler");
const Item = require("../models/Item");
const ErrorResponse = require("../utils/ErrorResponse");


/**
 * @Route: 
 *  - GET api/v1/items
 *  - GET api/v1/sales/:saleId/items
 * @Scope: Public
 * @Params:
 * - limit: the number of items you want retrieved per request
 * - page: which page you would like to view of the items.
 * - name: the type of name you would like to search for in the items.
 * - maxPrice: the max price for a certain item
 * - minPrice: the minimum price for a certain item
 * 
 */
exports.getItems = asyncHandler( async (req,res,next)=> {
    const [limit, page] = [req.query.limit || 100, req.query.page || 1];
    let query = {};
    let items = null;
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
    if(req.query.name)
        query['name'] = new RegExp(req.query.name,'gi');
    if(req.query.maxPrice)
        query['price'] = { $lt: parseFloat(req.query.maxPrice,10)};
    if(req.query.minPrice)
        query['price']['$gt'] = parseFloat(req.query.minPrice,10);

    query['isPurchased'] = false;

    items = await Item.find(query).skip((page-1)*limit).limit(limit);

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

    const fetchedResult = await Item.findById(req.params.itemId);

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


