const jwt = require("jsonwebtoken");

const Auth = async (req, res, next) => {
  const Headers = req.header.authorization;
  if (!Headers || !Headers.startsWith("Bearer ")) {
    res.status(403).json({ msg: "Access Denied" });
    return;
  }
  try {
    const token = Headers.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: decoded.userId, firstName: decoded.name };
    next();
  } catch (error) {
    res.status(401).json({ msg: "invalid Credentials" });
  }
};

module.exports = Auth;
