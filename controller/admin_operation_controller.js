const connection = require('../utils/database');
const { isEmpty } = require('../utils/object_isEmpty');
const { ADD_PRODUCT_MODEL } = require('../validation/product');

exports.add_product_controller = (req, res, next) => {

    if (isEmpty(req.body)) {
        res.status(401).json({
            status: false,
            message: "Object is empty"
        })
    }

    try {

        const { error } = ADD_PRODUCT_MODEL.validate(req.body);

        if (error) return res.status(402).json({ status: false, message: "Invalid request data", error: error.details[0].message });

        connection.query("SELECT * FROM product WHERE name = ?", [[req.body.name]], async (err, data, fields) => {
            if (err) return res.status(500).json({ status: false, message: "Server error" });

            if (data.length) return res.status(409).json({ status: false, message: "Product name already exist" });

            connection.query("INSERT INTO product VALUES(Null, ?)", [[req.body.name, req.body.description, req.body.price, req.body.quantity]], (err, data, fields) => {
                if (err) return res.status(500).json({ status: false, message: "Server error" });
    
                res.status(200).json({
                    status: true,
                    message: "Product Added Success"
                })
            })
        })

    } catch (err) {
        return res.status(500).json({ status: false, message: "Server error" });
    }

}

exports.get_all_product_controller = (req, res, next) => {
    try {
        let page = req.params.page;
        let pageSize = req.params.pageSize;

        page = parseInt(page) || 1;
        pageSize = parseInt(pageSize) || 5;

        const offset = (page - 1) * pageSize;

        const countQuery = "SELECT COUNT(*) AS totalProducts FROM product";

        const paginatedQuery = "SELECT * FROM product LIMIT ? OFFSET ?";

        connection.query(countQuery, (err, countResult) => {
            if (err) return res.status(500).json({ status: false, message: "Server error" });

            const totalProducts = countResult[0].totalProducts;
            const totalPages = Math.ceil(totalProducts / pageSize);

            connection.query(paginatedQuery, [pageSize, offset], (err, data) => {
                if (err) return res.status(500).json({ status: false, message: "Server error" });

                res.status(200).json({
                    status: true,
                    data: data,
                    message: "Products retrieved successfully",
                    pagination: {
                        totalProducts: totalProducts,
                        totalPages: totalPages,
                        currentPage: page,
                        pageSize: pageSize
                    }
                });
            });
        });

    } catch (err) {
        return res.status(500).json({ status: false, message: "Server error" });
    }
};

exports.get_product_controller = (req, res, next) => {

    let id = req.params.id;

    try {

        connection.query("SELECT * FROM product WHERE id = ?", [[id]], (err, data, fields) => {
            if (err) return res.status(500).json({ status: false, message: "Server error" });

            res.status(200).json({
                status: true,
                data: data,
                message: "Retrieve product success"
            })
        })

    } catch (err) {
        return res.status(500).json({ status: false, message: "Server error" });
    }

}

exports.delete_product_controller = (req, res, next) => {

    let id = req.params.id;

    try {

        connection.query("DELETE FROM product WHERE id = ?", [[id]], (err, data, fields) => {
            if (err) return res.status(500).json({ status: false, message: "Server error" });

            res.status(200).json({
                status: true,
                message: "Delete product success"
            })
        })

    } catch (err) {
        return res.status(500).json({ status: false, message: "Server error" });
    }

}