const router = require('express').Router({mergeParams:true});
const {
    getItem,
    getItems,
    updateItem,
    deleteItem,
    createItem
} = require("../controllers/Items");



router.route('/')
.get(getItems)
.post(createItem)
;

router.route("/:itemId")
.get(getItem)
.put(updateItem)
.delete(deleteItem)
;

module.exports = router;