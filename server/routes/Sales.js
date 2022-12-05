const router = require('express').Router();
const {
    getSales,
    updateSale,
    createSale,
    deleteSale,
    getSale,
    mySales
}  = require("../controllers/Sale");

const {
    authenticate
} = require('../Middleware/Auth')
const itemsRoute = require('./Items');

router.use("/:saleId/items",itemsRoute);

router.route('/')
.get(authenticate,getSales)
.post(createSale)
;

router.route('/mysales')
.get(mySales)
;


router.route('/:saleId')
.get(getSale)
.put(updateSale)
.delete(deleteSale)
;

module.exports = router;