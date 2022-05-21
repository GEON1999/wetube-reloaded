import Video from "../models/Video";
import User from "../models/User";

export const home = async(req, res) => {
    const videos = await Video.find({})
    .populate("owner");
    return res.render("home", {pageName: "Home", videos,});
}

export const watch = async (req, res) => {
    const {id} = req.params;
    const video = await Video.findById(id).populate("owner");
    if(!video) {
        return res.render("404", {pageName: "Video not found."}); 
    }
    return res.render("watch", {pageName: video.title, video});
}

export const getEdit = async(req, res) => {
    const { id } =req.params;
    const {
        user: {_id},
    } = req.session;
    const video = await Video.findById(id);
    if(!video) {
        return res.status(404).render("404", {pageName: "Video not fuound."});
    }
    if(String(video.owner) !== _id) {
        return res.status(403).redirect("/");
    }
    return res.render("edit", {pageName: `Edit ${video.title}`, video, });
}

export const postEdit = async(req, res) => {
    const {
        user: {_id},
    } = req.session;
    const {id} = req.params;
    const { title, description, hashtags } = req.body;
    const video = await Video.exists({_id:id}); 
    const myVideo = await Video.findById(id);

    if(!video) {
        return res.status(404).res.render("404", {pageName: "Video not found."}); 
    }
     if(String(myVideo.owner) !== _id) {
        return res.status(403).redirect("/");
    }
    await Video.findByIdAndUpdate(id, {
        title,
        description,
        hashtags: Video.formatHashtags(hashtags),
    });

    return res.redirect(`/videos/${id}`);
}
export const getUpload = (req, res) => {   
    return res.render("upload", {pageName: `Upload Video`, });
}

export const postUpload = async(req, res) => {
    const {user: {_id}} = req.session;
    const file = req.file;
    const {title, hashtags, description } = req.body;
    try {
        const newVideo = await Video.create({
            title,
            description,
            fileUrl: file.path,
            owner: _id,
            hashtags: Video.formatHashtags(hashtags),
        });
        const user = await User.findById(_id);
        user.videos.push(newVideo._id);
        user.save();
        return res.redirect("/");
        
    } catch (error) {
        console.log(error);
        return res.status(404).render("upload",
         {pageName: "Upload Video",
         errorMessage: "error!"});
    }
}

export const deleteVideo = async(req,res) => {
    const { id } = req.params;
    const {
        user: {_id},
    } = req.session;
    const video = await Video.findById(id);
    if(!video) {
        return res.status(404).res.render("404", {pageName: "Video not found."}); 
    }
    if(String(video.owner) !== _id) {
        return res.status(403).redirect("/");
    }
    await Video.findByIdAndDelete(id);
    return res.redirect("/");
}

export const search = async(req,res) => {
    const { keyword } = req.query;
    let videos = [];
    if (keyword) {
        videos = await Video.find({
            title: {
                $regex: new RegExp(keyword, "i"),
            },
        }).populate("owner");
    }
    return res.render("search", {pageName: "Search", videos});
};

export const registerView = async(req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    if(!video){
        return res.sendStatus(404);
    }
    video.meta.views = video.meta.views + 1;
    await video.save();
    return res.sendStatus(200);
}