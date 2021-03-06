const express = require("express");
const router = express.Router();

const db = require("../models");


// Base Route is /story

// Index
router.get("/", function (req, res) {
    db.Story.find({}, function (error, foundStories) {
      if (error) return res.send(error);
      console.log("Found Stories", foundStories);
      const context = {
        stories: foundStories,
      };
  
      res.render("story/index", context);
    });
  });
  
  // New
  router.get('/new', (req, res) => {
    // res.send("New this, New that, New now functional")
    res.render('story/new.ejs')
  })


  // router.get("/new", function (req, res) {
  //   db.User.find({}, function (err, foundUsers) {
  //     if (err) return res.send(err);
  
  //     const context = {
  //       users: foundUsers,
  //     };
  
  //     res.render("story/new", context);
  //   });
  // });


// Create
router.post("/", async function (req, res) {
    console.log("req.body functional", req.body);
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
  
//         res.redirect("/story");
//       });
//     });

    try {
        const createdStory = await db.Story.create(req.body);
        const foundUser = await db.User.findById(req.body.user);
    
        // foundUser.stories.push(createdStory);
        // await foundUser.save();
        console.log("Found user");
    
        res.redirect("/story");
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
router.put("/:id", function (req, res) {
    db.Story.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
      function (err, updatedStory) {
        if (err) {
          console.log(err);
          return res.send(err);
        }
        res.redirect(`/story/${updatedStory._id}`);
      }
    );
  });
  

// Delete
router.delete("/:id", function (req, res) {
    db.Story.findByIdAndDelete(req.params.id, function (err, deletedStory) {
      if (err) {
        console.log(err);
        return res.send(err);
      }
  
      console.log("Deleted Story!", deletedStory)

/*       db.User.findById( { user: deletedUser._id }, function (err, foundUser) {
        
        if (err) {
          console.log(err);
          return res.send(err);
        }
  
        // console.log("Found User!", foundUser)
        console.log("Deleted Story!", deletedStory.user)

        // foundUser.story.remove(deletedStory);
        // foundUser.save();
  
        res.redirect("/story");
      }); */
      res.redirect("/story");

    });
  });

  
module.exports = router;
