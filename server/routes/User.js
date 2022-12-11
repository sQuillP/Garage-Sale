const router = require('express').Router();
const {
    authenticate
} = require("../Middleware/Auth");
const {
    getUsers,
    createUser,
    getUserById,
    deleteUser,
    updateUser
} = require('../controllers/User');

router
.route('/')
.get(authenticate, getUsers)
.post(createUser);

router.route('/:userId')
.get(authenticate, getUserById)
.delete(deleteUser);

router.route("/updateUser")
.put(authenticate, updateUser);



// update, delete, getbyid routes for user.
module.exports = router;