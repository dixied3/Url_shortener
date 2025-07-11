require("dotenv").config();


const express = require('express') ; 
const app = express() ; 
const mongoose = require('mongoose');
const path = require('path') ; 
const urlRouter = require("./routes/url"); 
const session = require("express-session");
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError") ; 
const ejsMate = require("ejs-mate") ; 
const methodOverride = require("method-override");


const dbURL = process.env.MONGO_URL ; 

main()
    .then(() => {console.log("Database connected")})
    .catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbURL);
}


app.set("view engine" , "ejs") ; 
app.set("views" , path.join(__dirname , "views")) ; 

app.use(express.json()) ; 
app.use(express.urlencoded({extended : true})) ; 
app.use(methodOverride('_method'));

app.engine("ejs" , ejsMate) ; 

app.use(session({
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: true
}));


app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});


app.use("/" , urlRouter) ; 


app.use((req , res , next) => {
    next(new ExpressError(404 , "Page Not Found")) ;
}) ; 

// Error-handling middleware
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs" , {
        err , 
        success: req.flash("success"),
        error: req.flash("error")
    }) ;
    // res.status(statusCode).send(message);
});


app.listen(3000 , () => {console.log("Listening at server 3000")}) ; 