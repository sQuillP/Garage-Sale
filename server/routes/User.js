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
.get(getUserById)
.put(updateUser)
.delete(deleteUser);


// update, delete, getbyid routes for user.
module.exports = router;