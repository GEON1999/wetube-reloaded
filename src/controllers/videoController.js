import Video from "../models/Video";

export const home = async(req, res) => {
    const videos = await Video.find({});
    console.log(videos);
    return res.render("home", {pageName: "Home", videos,});
}

export const watch = async (req, res) => {
    const {id} = req.params;
    const video = await Video.findById(id);
    if(!video) {
        return res.render("404", {pageName: "Video not found."}); 
    }
    return res.render("watch", {pageName: video.title, video});
}

export const getEdit = async(req, res) => {
    const {id} = req.params;
    const video = await Video.findById(id); 
    if(!video) {
        return res.render("404", {pageName: "Video not found."}); 
    }
    return res.render("edit", {pageName: `Edit ${video.title}`, video});
}

export const postEdit = async(req, res) => {
    const {id} = req.params;
    const { title, description, hashtags } = req.body;
    const video = await Video.exists({_id:id}); 
    if(!video) {
        return res.status(404).res.render("404", {pageName: "Video not found."}); 
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
    const {title, hashtags, description} = req.body;
    try {
        await Video.create({
            title,
            description,
            hashtags: Video.formatHashtags(hashtags),
        });
        return res.redirect("/");
        
    } catch (error) {
        return res.status(400).res.render("upload", {
            pageName: `Upload Video`,
            errorMessage: error._message,
        });
    }
}

export const deleteVideo = async(req,res) => {
    const { id } = req.params;
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
        });
    }
    return res.render("search", {pageName: "Search", videos});
};