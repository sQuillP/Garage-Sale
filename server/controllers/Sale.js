const mongoose = require("mongoose");
const asyncHandler = require("../Middleware/AsyncHandler");
const Sale = require("../models/Sale");
const ErrorResponse = require("../utils/ErrorResponse");



/**
 * @Scope: Public
 * @description: Show list of garage sales that are currently active.
 * should receive more updates eventually.
 * @route: GET: api/v1/sales
 * @Params: 
 *  - page: which page the user would like to see
 *  - limit: how many items per query
 *  - radius: distance in miles to view other garage sales.
 *  - long: longitude coordinate reference point 
 *  - lat: latitude coordinate reference point 
 *  - dayRange:Object -> Get sales within the day range.
 *      - start: the first day the sale begins
 *      - end: the last day of the garage sale.
 *  - mostPopular: boolean -> return the list of most viewed sales in ascending order
 */
exports.getSales = asyncHandler(async (req,res,next)=> {
    const METERS_PER_MILE = 1609.34;
    const [page,pageLimit] = [+req.query.page || 1, +req.query.limit || 10];
    let totalPages = await Sale.countDocuments();
    totalPages = Math.floor(totalPages/pageLimit) === 0? 1: Math.floor(totalPages/pageLimit);
    let query = {};
    if(req.query.radius){
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
    if(req.query.start_date && req.query.end_date) {
        console.log(req.query)
        query['start_date'] = {
            $gte: new Date(req.query.start_date),
        };
        query["end_date"] = {
            $lte: new Date(req.query.end_date)
        };
    }
    if(req.query.mostPopular){
        query['$sort'] = {
            visits:-1
        }
    }
    const queryResults = await Sale.find(query).skip(pageLimit*(page-1)).limit(pageLimit);
    return res.status(200).json({
        totalPages,
        page: page,
        limit: pageLimit,
        status: 200,
        data: queryResults
    });
});


/**
 * @Route: GET api/v1/sale/:saleId
 * @Scope: Must be authenticated
 */
exports.getSale = asyncHandler( async(req,res,next)=> {

    const fetchedSale = await Sale.findById(req.params.saleId).populate("userId");

    if(fetchedSale == null){
        return next(
            new ErrorResponse(
                404,
                `Sale ${req.params.saleId} does not exist`
            )
        );
    }

    res.status(200).json({
        status: 200,
        data: fetchedSale
    });

});


/**
 * @Scope: Must be authenticated and logged in
 * @Route: POST /api/v1/sale
 */
exports.createSale = asyncHandler(async(req,res,next)=> {

    const createdSale = await Sale.create(req.body);

    return res.status(200).json({
        status:200,
        data: createdSale
    });
    
});



/**
 * @Scope: must be owner of sale to update
 * @Route: PUT /api/v1/sale/:saleId
 */
exports.updateSale = asyncHandler( async(req,res,next)=> {
    const updatedSale = await Sale.findByIdAndUpdate(req.params.saleId);
    
    if(updatedSale == null){
        return next(
            new ErrorResponse(
                404,
                `Sale ${req.params.saleId} does not exist`
            )
        );
    }

    res.status(201).json({
        status: 201,
        data: updatedSale
    });
});


/**
 * @Route: DELETE api/v1/sales
 * @Scope: Must be owner of sale to delete
 */
exports.deleteSale = asyncHandler( async( req,res,next)=> {

    const deletedSale = await Sale.findByIdAndDelete(req.params.saleId);

    if(deletedSale == null){
        return next(
            new ErrorResponse(
                404,
                `Sale ${req.params.saleId} does not exist`
            )
        );
    }

    res.status(200).json({
        status: 200,
        data: deletedSale
    });
    
});


/**
 * @Route: GET api/v1/sales/mysales
 * @Scope: Requires auth token
 */
exports.mySales = asyncHandler( async (req,res,next) => {
    
    const mySales = await Sale.find({userId: req.user._id});

    res.status(200).json({
        status: 200,
        data:mySales
    });
});