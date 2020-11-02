const mongoose = require("mongoose");
const homepageSchema = new mongoose.Schema (
    {
        title: {},
        body: {},
    },
);

const Homepage = mongoose.model("Homepage", homepageSchema);

module.exports = Homepage;
