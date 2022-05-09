import User from "../models/User";
import bcrypt from "bcrypt";
import req from "express/lib/request";
import res from "express/lib/response";

export const getJoin = (req, res) => {
    res.render("join", { pageName: "Join" })
};
export const postJoin = async(req, res) => {
    const {name, username, email, password, password2, location} = req.body;
    const pageName = "Join";
    if (password !== password2) {
        return res.status(400).render("join", {
            pageName,
            errorMessage: "Password confirmation does not match.",
        });
    };
    const usernameExists = await User.exists({username});
    if(usernameExists){
        return res.status(400).render("join", {
            pageName,
            errorMessage: "This username is already taken."
        });
    };
    const emailExists = await User.exists({email});
    if(emailExists){
        return res.status(400).render("join", {
            pageName,
            errorMessage: "This email is already taken."
        });    
    };
    try{
        await User.create({
            name, 
            username, 
            email, 
            password,
            password2, 
            location,
        });
        return res.redirect("/login");
    } catch (error) {
        return res.status(400).render("join", {
            pageName,
            errorMessage: error._message,
        });
    };
};

export const getLogin = (req, res) => res.render("login", {pageName: "Login"});

export const postLogin = async (req, res) => {
    const {username, password} = req.body;
    const user = await User.findOne({username});
    const pageName = "Login";
    if(!user) {
        return res.status(400).render("login", {
            pageName,
            errorMessage: "An account withe this username does not exists.",
        });
    }    
    const ok = await bcrypt.compare(password, user.password);
    if(!ok) {
        return res.status(400).render("login", {
            pageName,
            errorMessage: "Wrong password",
        });    
    };
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
};

export const startGithubLogin = (req, res) =>{
    const baseUrl = "https://github.com/login/oauth/authorize";
    const config = {
        client_id: "979c4ed2bed0302ea516",
        scope: "read:user user:email" 
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
}

export const finishGithubLogin = (req, res) => {

}

export const edit = (req, res) => res.send("edit user");
export const remove = (req, res) => res.send("remove user");
export const see = (req, res) => res.send("see user");
export const logout = (req, res) => res.send("logout");

