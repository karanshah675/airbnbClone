const Listing = require("./models/listing");

module.exports.isLoggedin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl
    // console.log(req);
    req.flash("error", "you must be logged in");
    return res.redirect("/login"); 
  }
  next();
};
module.exports.redUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl
  }
  next()
}
module.exports.isOwner = async (req,res,next)=>{
  let {id} = req.params
  let listing = await Listing.findById(id)

 if(!res.locals.currUser._id.equals(listing.owner._id)){
    req.flash("error","permisson denied")
    return res.redirect(`/listing`)
 } 
 next()
}


