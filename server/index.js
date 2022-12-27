
/* import libraries */
const express = require("express");
const dotenv = require("dotenv").config({path:"./environments/globals.env"});
const colors = require("colors");
const mongoose = require("mongoose");
const morgan = require('morgan');
const connectDb = require('./environments/db');
const {Server} = require("socket.io");
const {createServer} = require('http');
const helmet = require("helmet");
const app = express();
const handleSockets = require('./sockets/index')

const cors = require('cors');

app.use(cors({
    origin:["http://localhost:4200"]
}));


/* Load middleware */
app.use(morgan('tiny'));
app.use(express.json());
app.use(helmet());


/* Import the routers */
const userRoutes = require("./routes/User");
const SalesRoutes = require("./routes/Sales");
const authRoutes = require("./routes/Auth");
const itemRoutes = require("./routes/Items");
const chatRoutes = require("./routes/Chat"); 
const catchError = require('./Middleware/Error');


/* Connect to db instance */
connectDb();


/*Mount routers*/
app.use("/api/v1/users",userRoutes);
app.use('/api/v1/auth',authRoutes);
app.use('/api/v1/sales',SalesRoutes);
app.use('/api/v1/items',itemRoutes);
app.use("/api/v1/chats", chatRoutes);
app.use(catchError);


const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:4200",
        // allowedHeaders: ["my-custom-header"],
        // credentials: true
      }
});


handleSockets(io);

// handleMessaging()

httpServer.listen(process.env.PORT);