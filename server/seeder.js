const mongoose = require("mongoose");
const colors = require('colors');
const User = require("./models/User");
const Sale = require("./models/Sale");
const Item = require("./models/Item");
const Chat = require("./models/Chat");
const env = require("dotenv").config({path: "./environments/globals.env"});
const connectDb = require("./environments/db");
const fs = require("fs");

const populate = async ()=> {
    const UserData = JSON.parse(
        fs.readFileSync("./_data/Users.json",{encoding:"utf-8",}));

    const SalesData = JSON.parse(
        fs.readFileSync("./_data/Sales.json",{encoding:"utf-8"})
    );

    const ItemsData = JSON.parse(
        fs.readFileSync("./_data/Items.json",{encoding:"utf-8"})
    );

    let userIds = [], saleIds = [];
    
    //Populate the users with newly created id
    try{
        await connectDb();
        for(let user of UserData){
            let uid = new mongoose.Types.ObjectId();
            user._id = uid;
            userIds.push(uid);
            await User.create(user);
        }
        //Populate sales
        for(let sale of SalesData){
            let sailId = new mongoose.Types.ObjectId();
            saleIds.push(sailId);
            sale._id = sailId;
            sale.start_date = Date.now(); 
            sale.viewCount = Math.floor(Math.random()*10000 + 1);
            sale.end_date = Date.now()+1000*60*60*24*Math.floor(1 + Math.random()*6);
            
            let [lat,long] = [ //generate lat, long coordinates with variation
                41.0+(Math.random()*2),
                -88.0+(Math.random()*2)
            ];

            sale.location.coordinates = [long,lat]; //assign lat, long coordinates and save the sale.
            sale.userId = userIds[Math.floor(Math.random()*userIds.length)]; //assign userid to the sale
            await Sale.create(sale); 
        }
        
        //Populate Items while manually creating an id
        for(let item of ItemsData){
            let itemId = new mongoose.Types.ObjectId();
            item._id = itemId;
            item.saleId = saleIds[Math.floor(Math.random()*saleIds.length)];
            await Item.create(item);
        }
    } catch(exception){
        console.log('unable to seed db'.red.bold,exception.message);
        process.exit();
    }
    console.log('Database has been seeded!'.green.bold.underline);
    process.exit();
}


//Remove users from the database
const cleanDb = async ()=> {
    try{
        await connectDb();
        await User.deleteMany();
        await Item.deleteMany();
        await Sale.deleteMany();
        await Chat.deleteMany();
        console.log('database has been cleaned'.green.underline.bold);
        process.exit();
    } catch(error){
        console.log('unable to delete items in db.')
    }
}
if(process.argv[2] === '-d'){
    cleanDb();
} else if(process.argv[2] == '-s'){
    populate();
} else{
    console.log('Use: node seeder -<s|d>'.yellow.bold)
}