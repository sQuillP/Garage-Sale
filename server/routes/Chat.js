const router = require("express").Router();

const {
    getMessages
} = require("../controllers/Chat");
const {
    authenticate        
} = require("../Middleware/Auth");




router.route("/:userId")
.get(authenticate,getMessages);


module.exports = router;