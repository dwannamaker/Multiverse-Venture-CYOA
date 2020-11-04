const express = require("express");
const router = express.Router();
const db = require("../models");
const bcrypt = require("bcryptjs");

// base path /

// register form
router.get("/register", function(req, res) {
    res.render("Auth/register");
});

// register post
router.post("/register", async function(req, res) {
    try {
        // search db to see if user already exists (using email)
        const foundUser = await db.User.findOne({ email: req.body.email });
        // if a user is found, send back an error
        if(foundUser) {
            return res.send({ message: "Account is already registered" });
        }
        // if no user is found, hash password
        // salt increases the amount of computations that are possible for the hash in order to make the hash more complex. 10 rounds is both performant and secure.
        // combat rainbow table attacks
        const salt = await bcrypt.genSalt(10);
        // takes each character and turns it into multiple random characters
        const hash = await bcrypt.hash(req.body.password, salt);
        req.body.password = hash;
        // create user with req.body and hashed password
        const createUser = await db.User.create(req.body);
        console.log("Created a User", createUser);

        // redirect to login
        res.redirect("/login");
    } catch (error) {
        res.send({ message: "Internal Server Error", err: error });
    }
});

// login form
router.get("/login", function(req, res) {
    res.render("Auth/login");
});

// login post <- authentication
router.post("/login", async function(req, res) {
    try {
        // see if the user exists (using email)
        const foundUser = await db.User.findOne({ username: req.body.username });
        // if they do not exist, send error
        if(!foundUser) {
            return res.send({ message: "Username or Password incorrect" });
        }
        // if they do exist, compare db password with entered password using bcrypt (return true/false)
        const match = await bcrypt.compare(req.body.password, foundUser.password);
        // if passwords don't match, send error
        if(!match) {
            return res.send({ message: "Username or Password incorrect" });
        }
        // if passwords match, create sesssion for authentication
        req.session.currentUser = {
            username: foundUser.username,
            id: foundUser._id,
        }

        console.log("Found User", foundUser);


        // redirect to home
        res.redirect("/")
    } catch (error) {
        res.send({ message: "Internal Server Error", err: error });
    }
})

// logout delete <- destroy session
router.delete("/logout", async function(req, res) {
    await req.session.destroy();
    res.redirect("/");
})


module.exports = router;
