import jwt from "jsonwebtoken";

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token || token === "undefined") {
    return res.status(401).json({ message: "No token provided" });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }

  if (!decoded || !decoded.userId) {
    return res.status(401).json({ message: "Invalid token payload" });
  }

  req.userId = decoded.userId;
  next();
};

export default protect;
