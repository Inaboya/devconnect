const express = require("express");
const router = express.Router();
const passport = require("passport");
const mongoose = require("mongoose");

//Load Profile Inputs

const validateProfileInput = require("../../validation/profile");

//Load experience input fields
const validateExperienceInput = require("../../validation/experience");

//Load education input fields
const validateEducationInput = require("../../validation/education");

//Load User Model
const User = require("../../models/User");

//Load profile Model
const UserProfile = require("../../models/Profile");

//@route GET api/profile/test
//@desc Test profile route
//@access Public

router.get("/test", (req, res) =>
  res.json({
    msg: "Profile works",
  })
);

//@route GET api/profile
//@desc current user profile
//@access Private

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //Load User profile
    const errors = {};

    UserProfile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"])
      .then((profile) => {
        if (!profile) {
          errors.noprofile = "This user does not have a profile yet";
          return res.status(404).json(errors);
        }

        res.json(profile);
      })
      .catch((err) => res.status(404).json(err));
  }
);

//@route GET api/profile/all
//@desc GET all profiles
//@access Public

router.get("/all", (req, res) => {
  const errors = {};
  UserProfile.find()
    .populate("user", ["name", "avatar"])
    .then((profiles) => {
      if (!profiles) {
        errors.noprofiles = "There is no profile yet";
        res.status(404).json(errors);
      }

      res.json(profiles);
    })
    .catch(() =>
      res
        .status(404)
        .json({ profiles: "An error occurred fetching all the profiles" })
    );
});

//@route GET api/profile/handle/:handle
//@desc GET Profile by handle
//@access Public

router.get("/handle/:handle", (req, res) => {
  const errors = {};
  UserProfile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then((profile) => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch((err) => res.json(err));
});

//@route GET api/profile/user/:user_id
//@desc GET Profile by handle
//@access Public

router.get("/user/:user_id", (req, res) => {
  const errors = {};
  UserProfile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then((profile) => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch((err) =>
      res.status(404).json({ profile: "There is no profile for this user" })
    );
});

//@route POST api/profile
//@desc Create or edit user profile
//@access Private

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);

    //Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    //Get Fields

    const profileFields = {};
    profileFields.user = req.user.id;

    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.status) profileFields.status = req.body.status;

    //Skills - Split into an array

    if (typeof req.body.skills !== "undefined") {
      profileFields.skills = req.body.skills.split(",");
    }

    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.github) profileFields.github = req.body.github;

    //Social Links

    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.linkedIn) profileFields.social.youtube = req.body.youtube;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    UserProfile.findOne({ user: req.user.id }).then((profile) => {
      if (profile) {
        //Update

        UserProfile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then((profile) => res.json(profile));
      } else {
        //Create

        //Check if handles exists
        UserProfile.findOne({ handle: profileFields.handle }).then(
          (profile) => {
            if (profile) {
              errors.handle = "This profile already exists";
              res.status(400).json(errors);
            }

            //Create or save new profile

            new UserProfile(profileFields)
              .save()
              .then((profile) => res.json(profile));
          }
        );
      }
    });
  }
);

//@route POST api/profile/experience
//@desc Add experience to profile
//@access Private

router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);

    //Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    UserProfile.findOne({ user: req.user.id }).then((profile) => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description,
      };

      //Add to experience array

      profile.experience.unshift(newExp);

      profile.save().then((profile) => res.json(profile));
    });
  }
);

//@route POST api/profile/education
//@desc Add experience to profile
//@access Private

router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);

    //Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    UserProfile.findOne({ user: req.user.id }).then((profile) => {
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description,
      };

      //Add to experience array

      profile.education.unshift(newEdu);

      profile.save().then((profile) => res.json(profile));
    });
  }
);

//@route DELETE api/user/:user:id
//@desc DELETE user profile
//@access Private

router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    UserProfile.findOneAndRemove({ user: req.user.id }).then(() => {
      User.findOneAndRemove({ _id: req.user.id }).then(() =>
        res.json({ success: true })
      );
    });
  }
);

//@route DELETE api/profile/experience:exp_id
//@desc Delete experience
//@access Private

router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    UserProfile.findOne({ user: req.user.id })
      .then((profile) => {
        //Get remove index
        const removeIndex = profile.experience
          .map((item) => item.id)
          .indexOf(req.params.exp_id);

        //Splice out of array
        profile.experience.splice(removeIndex, 1);

        //save
        profile.save().then((profile) => res.json(profile));
      })
      .catch((err) => res.status(404).json(err));
  }
);

//@route DELETE api/profile/experience:exp_id
//@desc Delete experience
//@access Private

router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    UserProfile.findOne({ user: req.user.id })
      .then((profile) => {
        //Get remove index
        const removeIndex = profile.education
          .map((item) => item.id)
          .indexOf(req.params.edu_id);

        //Splice out of array
        profile.education.splice(removeIndex, 1);

        //save
        profile.save().then((profile) => res.json(profile));
      })
      .catch((err) => res.status(404).json(err));
  }
);
module.exports = router;
