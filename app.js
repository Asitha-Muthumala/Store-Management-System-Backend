const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const user_router = require('./route/user_routes');
const operation_router = require('./route/operation_route');
const auth_middleware = require('./auth_service/authentication_middleware');

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/user", user_router);
app.use("/api/operation", auth_middleware, operation_router);//authenticated endpoints

app.all("*", (req, res, next) => {
    res.status(400).json({
        status: false,
        message: "Invalid endpoint"
    })
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


