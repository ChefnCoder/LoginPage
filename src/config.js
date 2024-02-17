const mongoose = require("mongoose");
const connect = mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });


//check db connection
connect.then(()=>{
    console.log("db connected successfully");
})
.catch(()=>{
    console.log("db not connected");
})

const Loginschema = new mongoose.Schema({
    name:{type:String,required:true},
    password: {type:String, required:true}
})

const collection = new mongoose.model("users", Loginschema);

module.exports = collection;
