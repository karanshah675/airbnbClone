//! creating model speratliy from index.js
const mongoose = require('mongoose')
const Schema = mongoose.Schema; 

let listingSchema = new Schema({
    title:{
        type:String,
        require:true
    },
    description:String,
    image:{
        type:String,
        default:"https://images.unsplash.com/photo-1646748019039-e908f7e41282?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set:(v)=> v===""?"https://images.unsplash.com/photo-1646748019039-e908f7e41282?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D":v,
    },
    price:Number,
    location:String,
    country:String,
})

const listing = mongoose.model("Listing",listingSchema)

module.exports = listing