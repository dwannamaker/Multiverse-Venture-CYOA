const express = require("express");
const router = express.Router();

const db = require("../models");


// Base Route is /stories

// Index
router.get("/", function (req, res) {
    db.Story.find({}, function (error, foundStorys) {
      if (error) return res.send(error);
  
      const context = {
        stories: foundStories,
      };
  
      res.render("story/index", context);
    });
  });
  
  // New
  router.get("/new", function (req, res) {
    db.User.find({}, function (err, foundUsers) {
      if (err) return res.send(err);
  
      const context = {
        users: foundUsers,
      };
  
      res.render("story/new", context);
    });
  });


// Create
router.post("/", async function (req, res) {
    console.log(req.body);
//     db.Story.create(req.body, function (err, createdStory) {
//       if (err) {
//         console.log(err);
//         return res.send(err);
//       }
//       db.User.findById(req.session.currentUser.id, function (err, foundUser) {
//         if (err) {
//           console.log(err);
//           return res.send(err);
//         }
  
//         foundUser.stories.push(createdStory);
//         foundUser.save(); 
  
//         res.redirect("/stories");
//       });
//     });

    try {
        const createdStory = await db.Story.create(req.body);
        const foundUser = await db.User.findById(req.body.user);
    
        foundUser.stories.push(createdStory);
        await foundUser.save();
    
        res.redirect("/stories");
      } catch (error) {
        console.log(error);
        res.send({ message: "Internal server error" });
      }
    });


// Show
router.get("/:id", function (req, res) {
    db.Story.findById(req.params.id, function (err, foundStory) {
      if (err) {
        console.log(err);
        return res.send(err);
      }
      const context = { story: foundStory };
      res.render("story/show", context);
    });
  });
  

// Edit
router.get("/:id/edit", function (req, res) {
    db.Story.findById(req.params.id, function (err, foundStory) {
      if (err) {
        console.log(err);
        return res.send(err);
      }
      const context = { story: foundStory };
      res.render("story/edit", context);
    });
  });
  

// Update
router.put("s:id", function (req, res) {
    db.Story.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
      function (err, updatedStory) {
        if (err) {
          console.log(err);
          return res.send(err);
        }
        res.redirect(`/stories/${updatedStory._id}`);
      }
    );
  });
  

// Delete
router.delete("/:id", function (req, res) {
    db.story.findByIdAndDelete(req.params.id, function (err, deletedStory) {
      if (err) {
        console.log(err);
        return res.send(err);
      }
  
      db.User.findById(deletedStory.user, function (err, foundUser) {
        if (err) {
          console.log(err);
          return res.send(err);
        }
  
        foundUser.stories.remove(deletedStory);
        foundUser.save();
  
        res.redirect("/stories");
      });
    });
  });

  
module.exports = router;
