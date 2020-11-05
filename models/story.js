const mongoose = require("mongoose");
const storySchema = new mongoose.Schema (
    {
        title: { type: String, required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        body: { type: String, required: true },
        Author: { type: String },
        img: { type: String, required: true }
    },
);

const Story = mongoose.model("Story", storySchema);

module.exports = Story;
