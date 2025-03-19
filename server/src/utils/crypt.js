const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const KEY = process.env.JWT_SECRET;
const SALT_ROUNDS = process.env.PASSWORD_SALT_ROUNDS

async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
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