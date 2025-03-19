const { decryptData } = require('../utils/crypt');
const COOKIE_NAME = process.env.AUTH_COOKIE_NAME;

const authMiddleware = (req, res, next) => {
  const token = req.headers[COOKIE_NAME]?.split(" ")[1]

  if (!token) {
    return res.status(401).json({ error: "Unauthorized - No token provided" });
  }

  const decoded = decryptData(token);
  if (!decoded) {
    return res.status(401).json({ error: "Unauthorized - Invalid token" });
  }

  if (!decoded.role) return res.status(403).json({ error: 'You are not logged in' });

  req.user = decoded;
  next();
};

module.exports = authMiddleware;