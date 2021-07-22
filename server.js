const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const users = require("./routes/api/user");
const profile = require("./routes/api/profile");
const post = require("./routes/api/posts");

const app = express();

//Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Passport middleware
app.use(passport.initialize());

//Passport config
require("./config/passport")(passport);

//DB config
const db = require("./config/keys").mongoURL;

//Connect to mongoDB
mongoose
  .connect(db)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(error));

app.get("/", (req, res) => res.send("Oya let's get cracking"));
app.use("/api/user", users);
app.use("/api/profile", profile);
app.use("/api/posts", post);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running at ${port}`));
