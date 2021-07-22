const express = require("express");
const router = express.Router();
const passport = require("passport");
const mongoose = require("mongoose");

//Load the User Model
const User = require("../../models/User");

//Load the Post Model
const Posts = require("../../models/Posts");

//Load the Profile Model
const UserProfile = require("../../models/Profile");

//Load Post validation input fields

const validatePostInput = require("../../validation/post");

//@route GET api/posts/test
//@desc Test post route
//@access Public

router.get("/test", (req, res) =>
  res.json({
    msg: "Posts works",
  })
);

//@route GET api/posts
//@desc FETCH  posts
//@access Public

router.get("/", (req, res) => {
  Posts.find()
    .sort({ date: -1 })
    .then((posts) => res.json(posts))
    .catch((err) => res.status(404).json({ err: "There are no posts" }));
});

//@route GET api/posts/:id
//@desc FETCH a single post by id
//@access Public

router.get("/:id", (req, res) => {
  Posts.findById(req.params.id)
    .then((posts) => res.json(posts))
    .catch((err) =>
      res.status(404).json({ err: "There's no such user by that id" })
    );
});

//@route POST api/posts
//@desc Create a post
//@access Private

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //Check validation
    const { errors, isValid } = validatePostInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }
    const newPosts = new Posts({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.body.user,
    });

    newPosts.save().then((post) => res.json(post));
  }
);

//@route DELETE api/posts
//desc DELETE posts
//@access Private

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    UserProfile.findOne({ user: req.user.id }).then((profile) => {
      Posts.findById(req.params.id)
        .then((post) => {
          //Check for owner
          if (post.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ notauthorized: "User not authorized" });
          }

          //Delete
          post.remove().then(() => res.json({ success: true }));
        })
        .catch((err) =>
          res.status(404).json({ postnotfound: "Post not found" })
        );
    });
  }
);

module.exports = router;
