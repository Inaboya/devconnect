const express = require("express");
const router = express.Router();
const passport = require("passport");
const mongoose = require("mongoose");
//@route GET api/posts/test
//@desc Test post route
//@access Public

router.get("/test", (req, res) =>
  res.json({
    msg: "Posts works",
  })
);

module.exports = router;
