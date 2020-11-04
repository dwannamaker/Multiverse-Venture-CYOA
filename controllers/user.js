const express = require("express");
const router = express.Router();
// const router = require("express").Router()

const { User, Story } = require("../models");


// Base Route is /users


// Index View /users
router.get("/", async function (req, res) {
  // mongoose code
  // db.User.find({}, function (error, foundUsers) {
  //   if (error) return res.send(error);

  //   const context = {
  //     users: foundUsers,
  //   };

  //   res.render("user/index", context);
  // });

  // 1. async/await keywords
  // 2. try/catch block
  try {
    const foundUsers = await User.find({});
    const context = {
      users: foundUsers,
    };
    res.render("user/index", context);
  } catch (error) {
    console.log(error);
    res.send({ message: "Internal Server Error" });
  }
});


// New
router.get("/new", function (req, res) {
  res.render("user/new");
});


// Create
router.post("/", function (req, res) {
  User.create(req.body, function (err, createdUser) {
    if (err) {
      console.log(err);
      return res.send(err);
    }

    res.redirect("/users");
  });
});


// Show
router.get("/:id", function (req, res) {
  /* db.User.findById(req.params.id, function (err, foundUser) {
    if (err) {
      console.log(err);
      return res.send(err);
    }
    const context = { author: foundUser };
    res.render("user/show", context);
  }); */

  User.findById(req.params.id)
    .populate("stories")
    .exec(function (err, foundUser) {
      if (err) {
        console.log(err);
        return res.send(err);
      }
      const context = { user: foundUser };
      res.render("user/show", context);
    });
});


// Edit <- view
router.get("/:id/edit", function (req, res) {
  User.findById(req.params.id, function (err, foundUser) {
    if (err) {
      console.log(err);
      return res.send(err);
    }
    const context = { user: foundUser };
    res.render("user/edit", context);
  });
});


// Update <- db change
router.put("/:id", function (req, res) {
  User.findByIdAndUpdate(req.params.id, req.body, { new: true }, function (
    err,
    updatedUser
  ) {
    if (err) {
      console.log(err);
      return res.send(err);
    }

    res.redirect(`/users/${updatedUser._id}`);
  });
});


// Delete
router.delete("/:id", function (req, res) {
  User.findByIdAndDelete(req.params.id, function (err, deletedUser) {
    if (err) {
      console.log(err);
      return res.send(err);
    }

    Story.remove({ user: deletedUser._id }, function (
      err,
      removedStories
    ) {
      if (err) {
        console.log(err);
        return res.send(err);
      }
      res.redirect("/users");
    });
  });
});

module.exports = router;
