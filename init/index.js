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
  await Listing.insertMany(initdata.data);
  console.log("data inserted")
};
initDb()