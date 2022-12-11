const router = require("express").Router();
const {
 authenticate
} = require("../Middleware/Auth")
const {
    login, 
    signup, 
    refreshToken
} = require('../controllers/Auth');


router.route('/login')
.post(login)
;

router.route('/signup')
.post(signup)
;

router.route("/refreshToken")
.get(authenticate,refreshToken);


module.exports = router;