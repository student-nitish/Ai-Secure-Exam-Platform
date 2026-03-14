const jwt = require("jsonwebtoken");

 exports.auth = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")?.trim() ||
       req.cookies.token ;
      
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user=decoded;
    next();
  } catch (error) {
    console.log("JWT VERIFY ERROR:", error.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};
