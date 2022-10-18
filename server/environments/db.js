const mongoose = require('mongoose');
const colors = require("colors");
const dotenv = require('dotenv');


const connection = async ()=> {
    try{
        const connection = await mongoose.connect(process.env.DB_URI);
        console.log("Successfully connected to database".blue.underline.bold);
    } catch(error){
        console.log('unable to connect to database'.red.bold);
        console.log(error.message);
        process.exit();
    }
}


module.exports = connection;