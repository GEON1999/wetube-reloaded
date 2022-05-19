import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    fileUrl: { type: String, required: true},
    description: { type: String, required: true, trim: true },
    createdAt: { type:Date, required: false, trim: true, default: Date.now },
    hashtags: [{ type: String, trim: true }],
    meta: {
        views: { type: Number, defalut: 0, required: false },
        rating: { type: Number, defalut: 0, required: false },
    },
    owner: {type: mongoose.Schema.Types.ObjectId, required: true, ref:"User"},
});

videoSchema.static("formatHashtags", function(hashtags) {
    return hashtags
    .split(",")
    .map((word) => (word.startsWith("#") ? word :`#${word}`));
});

const Video = mongoose.model("Video", videoSchema);
export default Video