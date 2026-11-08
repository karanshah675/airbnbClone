const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
 
const asyncWrap = require("../utils/wrapAsync");
const ExpressError = require("../utils/expressError");
const path = require("path");

router.get("/signup",(req,res)=>{
    res.render("user/signup.ejs")
})

module.exports = router