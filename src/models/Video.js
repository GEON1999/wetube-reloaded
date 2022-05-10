import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    createdAt: { type:Date, required: true, trim: true, default: Date.now },
    hashtags: [{ type: String, trim: true }],
    meta: {
        views: { type: Number, defalut: 0, required: true },
        rating: { type: Number, defalut: 0, required: true },
    },
});

videoSchema.static("formatHashtags", function(hashtags) {
    return hashtags
    .split(",")
    .map((word) => (word.startsWith("#") ? word :`#${word}`));
});

const Video = mongoose.model("Video", videoSchema);
export default Video