const express = require("express");
const mongoose = require("mongoose");
const users = require("./routes/api/user");
const profile = require("./routes/api/profile");
const post = require("./routes/api/posts");

const app = express();

//DB config
const db = require("./config/keys").mongoURL;

//Connect to mongoDB
mongoose
  .connect(db)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(error));

app.get("/", (req, res) => res.send("We can both love and build careers."));
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", post);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running at ${port}`));
