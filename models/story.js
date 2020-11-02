const mongoose = require("mongoose");
const storySchema = new mongoose.Schema (
    {
        title: { type: String, required: true },
        body: { type: String, required: true },
    },
);

const Story = mongoose.model("Story", storySchema);

module.exports = Story;
