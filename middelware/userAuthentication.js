const jwt = require("jsonwebtoken");
const User = require("../database/model/user");

const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    const verify = jwt.verify(token, process.env.JWT_SEKRET_KEY);

    const user = await User.findOne({ _id: verify._id });
    req.token = token;
    req.user = user;
    // console.log(user.userName);
    next();
  } catch (error) {
    res.status(404);
    res.redirect("/");
  }
};

console.log("userAuth is connected successfully");

module.exports = userAuth;
