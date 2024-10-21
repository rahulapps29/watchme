const express = require("express");
const app = express();
const tasks = require("./routes/tasks");
const connectDB = require("./db/connect");
const notFound = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const cors = require("cors");

const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
require("dotenv").config();

const port = process.env.PORT || 4003;

app.use(cors());
// Serve only public assets (CSS, etc.)
app.use(express.static(path.join(__dirname, "public")));
// app.use(express.static("./public"));
// app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

const authenticateToken = require("./middleware/auth");

// Middleware to verify JWT token

app.use("/api/tasks", tasks);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/login.html", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

// Route to serve protected JavaScript file securely
app.get("/browser-app.js", authenticateToken, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "browser-app.js"));
});

// Route to serve protected HTML page after authentication
app.get("/protected", authenticateToken, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "protected.html"));
});

app.get("/edit-task.js", authenticateToken, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "edit-task.js"));
});

// Route to serve protected HTML page after authentication
app.get("/task.html", authenticateToken, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "task.html"));
});

// Login route
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === process.env.USERNAME1 && password === process.env.PASSWORD) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.cookie(
      "token",
      token
      //   , {
      //   httpOnly: true,
      //   secure: true,
      //   sameSite: "Strict",
      // }
    );
    return res.redirect("/protected");
  } else {
    res.send(`
      <html>
        <body>
          <h1>Invalid Credentials</h1>
          <a href="/">Go back to Login</a>
        </body>
      </html>
    `);
  }
});

// Logout route to clear token
app.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

app.use(notFound);
app.use(errorHandlerMiddleware);

// Start the server
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
