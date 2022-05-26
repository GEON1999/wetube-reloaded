import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    text: { type: String },
    owner: {type: mongoose.Schema.Types.ObjectId, required: true, ref:"User"},
    // who wrote a comment
    video: {type: mongoose.Schema.Types.ObjectId, required: true, ref:"Video"},
    // what video has a comment
    createdAt: { type: Date, required: true, default: Date.now },
})

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;





