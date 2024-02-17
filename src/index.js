//imported library below
require('dotenv').config();
const express = require('express');
const pasth = require('path');
const bcrypt = require('bcrypt');
const collection = require("./config");
//started express application
const app = express();

// convert data into json format
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

//use ejs as view engine
app.set('view engine','ejs');

//static file
app.use(express.static("public"));

app.get("/",(req,res)=>{
    res.render("login");
})

app.get("/signup",(req,res)=>{
    res.render("signup");
})

//register user
app.post("/signup",async(req,res)=>{

    const data = {
        name: req.body.username,
        password: req.body.password
    }

     // Check if the username already exists in the database
     const existingUser = await collection.findOne({ name: data.name });

     if (existingUser) {
         res.send('User already exists. Please choose a different username.');
    }else{
         // Hash the password using bcrypt
        const saltRounds = 10; // Number of salt rounds for bcrypt
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);
 
        data.password = hashedPassword; // Replace the original password with the hashed one

        const userdata = await collection.insertMany(data);
        console.log(userdata);  
        res.render("home");
    }

    
})

app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.username });
        if (!check) {
            return res.send("User name cannot found")
        }
        // Compare the hashed password from the database with the plaintext password
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (!isPasswordMatch) {
            res.send("wrong Password");
        }
        else {
            res.render("home");
        }
    }
    catch {
        res.send("wrong Details");
    }
})

app.get("/login",(req,res)=>{
    res.render("login");
})







const port = 3001;
app.listen(port,()=>{
    console.log(`your port is running successfully on ${port}`)
})