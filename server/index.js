
/* import libraries */
const express = require("express");
const dotenv = require("dotenv").config({path:"./environments/globals.env"});
const colors = require("colors");
const mongoose = require("mongoose");
const morgan = require('morgan');
const connectDb = require('./environments/db');
const helmet = require("helmet");
const app = express();


/* Load middleware */
app.use(morgan('tiny'));
app.use(express.json());
app.use(helmet());


/* Import the routers */
const userRoutes = require("./routes/User");
const SalesRoutes = require("./routes/Sales");
const authRoutes = require("./routes/Auth");
const itemRoutes = require("./routes/Items");
const catchError = require('./Middleware/Error');


/* Connect to db instance */
connectDb();


/*Mount routers*/
app.use("/api/v1/users",userRoutes);
app.use('/api/v1/auth',authRoutes);
app.use('/api/v1/sales',SalesRoutes);
app.use('/api/v1/items',itemRoutes);
app.use(catchError);


/* Initialize server and run application */
app.listen(process.env.PORT || 5000,()=> {
    console.log(`App is running on port ${process.env.PORT || 5000}`.green.bold);
});