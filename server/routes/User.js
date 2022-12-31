const router = require('express').Router();
const {
    authenticate
} = require("../Middleware/Auth");
const {
    getUsers,
    createUser,
    deleteUser,
    updateUser,
    findUser,
    getMe
} = require('../controllers/User');

router
.route('/')
.get(authenticate, getUsers)
.post(createUser);

router.route('/getme')
.get(authenticate, getMe);

router.route("/updateUser")
.put(authenticate, updateUser);


//important bug fix: Please make sure all hardcoded defined routes are first before
//looking at params
router.route('/:userId')
.get(authenticate, findUser)
.delete(deleteUser);





// update, delete, getbyid routes for user.
module.exports = router;