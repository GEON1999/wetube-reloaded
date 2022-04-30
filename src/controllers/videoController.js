let videos = [
    {
        title: "1st video",
        rating: 4,
        comments: 2,
        views: 1,
        id: 1,
    },
    {
        title: "2st video",
        rating: 3,
        comments: 1,
        views: 5,
        id: 2,
    },
    {
        title: "3st video",
        rating: 4,
        comments: 2,
        views: 1,
        id: 3,
    }
    ];

export const tranding = (req, res) => {
    return res.render("home", {pageName: "Home", videos});
}
export const watch = (req, res) => {
    const {id} = req.params;
    const video = videos[id - 1];
    return res.render("watch", {pageName: `Watching ${video.title}`, video});
}
export const getEdit = (req, res) => {
    const {id} = req.params;
    const video = videos[id - 1];
    return res.render("edit", {pageName: `editing ${video.title}`, video});
}
export const postEdit = (req, res) => {
    const {id} = req.params;
    const {title} = req.body;
    videos[id - 1].title = title;
    return res.redirect(`/video/${id}`);
}
