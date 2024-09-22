const express = require('express');
const { user_register_controller, user_login_controller } = require('../controller/user_controller');

const router = express.Router();

router.route("/register").post(user_register_controller);
router.route("/login").post(user_login_controller);

module.exports = router;