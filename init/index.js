const mongoose = require("mongoose");
const initdata = require("./data");
const Listing = require("../models/listing");

mongoose
  .connect("mongodb://127.0.0.1:27017/airBnb")
  .then((res) => {
    console.log("database connected");
  })
  .catch((err) => {
    console.log(err);
  });

let initDb = async () => {
  await Listing.deleteMany({});
  initdata.data = initdata.data.map((obj)=>({...obj,owner:"6af4a6c55396b988a3992ad2"}))
  await Listing.insertMany(initdata.data);
  console.log("data inserted")
};
initDb()