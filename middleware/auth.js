const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect("/"); // Redirect to login if no token
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err && err.name === "TokenExpiredError") {
      console.log("Token expired");
      // Clear the cookie if the token is expired
      res.clearCookie("token");
      return res.redirect("/login");
    }

    if (err) {
      // Invalid token
      console.log("Invalid token");
      res.clearCookie("token"); // Clear the invalid token cookie
      return res.redirect("/"); // Redirect to login if token invalid
    }

    // Get the current time and the expiration time
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    const expirationTime = user.exp; // Expiration time from the token

    // Calculate the remaining time
    const remainingTime = expirationTime - currentTime;

    remainingTime > 0 ? console.log(remainingTime) : "expired token!!!"; // Return remaining time or 0 if expired

    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
