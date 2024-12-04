// checkUser.js
const jwt = require("jsonwebtoken");

const checkUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; 

  console.log(token, 'tokenn')

  if (!token) {
    return res.status(401).json({ error: "Token is required" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    res.status(401).json({ error: "Token is invalid" });
  }
};

module.exports = checkUser;
