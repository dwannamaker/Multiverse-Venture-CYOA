const mongoose = require("mongoose");
const storySchema = new mongoose.Schema (
    {
        title: {},
        body: {},
    },
);

const Story = mongoose.model("Story", storySchema);

module.exports = Story;
