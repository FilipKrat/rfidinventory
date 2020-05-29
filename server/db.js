const  mongoose  = require("mongoose");
mongoose.Promise  = require("bluebird");
const  url  =  "mongodb+srv://inventory:Inventory123@inventory-mhrqj.mongodb.net/inventory?retryWrites=true&w=majority";
const  dbconnect  =  mongoose.connect(url, {
    useUnifiedTopology: true, useNewUrlParser: true  })
    .then(() => console.log("Connected to Database"))
    .catch(err => console.error("An error has occured", err));
module.exports  =  dbconnect;
