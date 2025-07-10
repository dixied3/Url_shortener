const mongoose = require('mongoose') ;
const {Schema} = mongoose ; 

const urlSchema = new Schema({
    shortId : {
        type : String , 
        required : true 
    } ,
    enteredUrl : {
        type : String , 
        required : true 
    } , 
    vistHistory : [
        {timestamp : {type : Number}}
    ]
}) ; 

const URL = mongoose.model("URL" , urlSchema) ; 

module.exports = URL ; 