const express = require('express');
const { add_product_controller, get_all_product_controller, get_product_controller, delete_product_controller } = require('../controller/admin_operation_controller');

const router = express.Router();

router.route("/addProduct").post(add_product_controller);
router.route("/getAllProduct/:page/:pageSize").get(get_all_product_controller);
router.route("/getProduct/:id").get(get_product_controller);
router.route("/deleteProduct/:id").delete(delete_product_controller);

module.exports = router;