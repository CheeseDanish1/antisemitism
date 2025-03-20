const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const KEY = process.env.JWT_SECRET;
const SALT_ROUNDS = parseInt(process.env.PASSWORD_SALT_ROUNDS) || 10

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(password, salt);
}

async function comparePassword(password, storedHash) {
  return bcrypt.compare(password, storedHash);
}

function signJWT(data) {
  return jwt.sign(data, KEY, { expiresIn: process.env.JWT_EXPIRATION });
}

function verifyJWT(data) {
  try {
    return jwt.verify(data, KEY);
  } catch (e) {
    return null;
  }
}

module.exports = { hashPassword, comparePassword, signJWT, verifyJWT };