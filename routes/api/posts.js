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

//@route POST api/posts/like:id
//@route Like post
//@access Private
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    UserProfile.findOne({ user: req.user.id }).then((profile) => {
      Posts.findById(req.params.id).then((post) => {
        //Check if the user has already liked the post

        if (
          post.likes.filter((like) => like.user.toString() === req.user.id)
            .length > 0
        ) {
          return res
            .status(400)
            .json({ Alreadyliked: "User already liked this post" });
        }

        //Add the user id to the like array

        post.likes.push({ user: req.user.id });

        post.save().then((post) => res.json(post));
      });
    });
  }
);

//@route POST api/posts/unlike/:id
//@desc unlike a post
//@access Private

router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    UserProfile.findOne({ user: req.user.id }).then((profile) => {
      Posts.findById(req.params.id)
        .then((post) => {
          // check if the user has not liked this post
          if (
            post.likes.filter((like) => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ notliked: "You have not liked this post" });
          }

          // To remove a like
          const removeIndex = post.likes
            .map((item) => item.user.toString())
            .indexOf(req.user.id);

          //Splice out of the array
          post.likes.splice(removeIndex, 1);

          //save
          post.save().then((post) => res.json(post));
        })
        .catch((err) => res.status(404).json({ post: "Post not found" }));
    });
  }
);

//@route POST api/posts/comment/:id
//@route ADD comments to post
//@access Private

router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //Check validation
    const { errors, isValid } = validatePostInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    Posts.findById(req.params.id)
      .then((post) => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id,
        };

        //ADD to the comments array

        post.comments.push(newComment);

        //save
        post.save().then((post) => res.json(post));
      })
      .catch((err) => res.status(404).json({ err: "An error occured" }));
  }
);

//@route DELETE api/posts/comment/:id/:comment_id
//@route DELETE cpmments by id
//@route Private

router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Posts.findById(req.params.id).then((post) => {
      //check if the comment exists
      if (
        post.comments.filter(
          (comment) => comment._id.toString() === req.params.comment_id
        ).length === 0
      ) {
        return res
          .status(404)
          .json({ commentnotexist: "comment does not exist" });
      }

      //get the remove index

      const removeIndex = post.comments
        .map((item) => item._id.toString())
        .indexOf(req.params.comment_id);

      //Splice out of the array
      post.comments.splice(removeIndex, 1);

      //save
      post.save().then((post) => res.json(post));
    });
  }
);
module.exports = router;
