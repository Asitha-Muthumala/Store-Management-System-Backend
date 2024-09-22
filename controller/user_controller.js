const connection = require('../utils/database');
const { isEmpty } = require('../utils/object_isEmpty');
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');

const { USER_MODEL, USER_LOGIN_MODEL } = require('../validation/user');
const JWT_SECRET = process.env.JWT_SECRET;

exports.user_register_controller = (req, res, next) => {
    if (isEmpty(req.body)) {
        res.status(401).json({
            status: false,
            message: "Object is empty"
        })
    }

    try {

        const { error } = USER_MODEL.validate(req.body);

        if (error) return res.status(402).json({ status: false, message: "Invalid request data", error: error.details[0].message });

        connection.query("SELECT * FROM user WHERE email = ?", [[req.body.email]], async (err, data, fields) => {
            if (err) return res.status(500).json({ status: false, message: "Server error" });

            if (data.length) {
                return res.status(403).json({ status: false, message: "Email is already exist" });
            }

            const solt = await bcrypt.genSalt(10);

            const hashedPassword = await bcrypt.hash(req.body.password, solt);

            connection.query("INSERT INTO user VALUES(Null, ?)", [[req.body.name, req.body.email, hashedPassword]], (err, data, fields) => {
                if (err) return res.status(500).json({ status: false, message: "Server error" });

                res.status(200).json({
                    status: true,
                    message: "Registration successful"
                })
            })
        })

    }
    catch (err) {
        return res.status(500).json({ status: false, message: "Server error" });
    }
}

exports.user_login_controller = (req, res, next) => {
    if (isEmpty(req.body)) {
        res.status(401).json({
            status: false,
            message: "Object is empty"
        })
    }

    try {

        const { error } = USER_LOGIN_MODEL.validate(req.body);

        if (error) return res.status(402).json({ status: false, message: "Invalid request data", error: error.details[0].message });

        connection.query("SELECT * FROM user WHERE email = ?", [[req.body.email]], async (err, data, fields) => {
            if (err) return res.status(500).json({ status: false, message: "Server error" });

            if (!data.length) return res.status(403).json({ status: false, message: "email or password invalid" });

            const isMatch = await bcrypt.compare(req.body.password, data[0].password);

            if (!isMatch) return res.status(403).json({ status: false, message: "email or password invalid" });

            const token = JWT.sign({ name: data[0].name, email: data[0].email }, JWT_SECRET, { expiresIn: "30min" });

            res.status(200).json({
                status: true,
                message: "Login successful",
                name: data[0].name,
                token: token
            })

        })

    }
    catch (err) {
        res.status(500).json({ status: false, message: "Server error" });
    }
}