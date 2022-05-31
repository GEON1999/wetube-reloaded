import User from "../models/User";
import Video from "../models/Video";
import bcrypt from "bcrypt";
import fetch from "node-fetch";
import { async } from "regenerator-runtime";
import { query } from "express";
import { json } from "express/lib/response";
import { qs } from "qs";


export const getJoin = (req, res) => {
    res.render("join", { pageName: "Join" })
};
export const postJoin = async(req, res) => {
    const {name, username, email, password, password2, location, description} = req.body;
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
            description,
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
    const user = await User.findOne({username, socialOnly: false});
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
        client_id: process.env.GH_CLIENT,
        scope: "read:user user:email" 
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
};

export const finishGithubLogin = async(req, res) => {
    const baseUrl = "https://github.com/login/oauth/access_token";
    const config = {
        client_id: process.env.GH_CLIENT,
        client_secret: process.env.GH_SECRET,
        code: req.query.code,
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    const tokenRequest = await (
        await fetch(finalUrl, {
        method: "POST",
        headers: {
            Accept: "application/json",
        },
    })
    ).json();
    if ("access_token" in tokenRequest) {
        const {access_token} = tokenRequest;
        const apiURL = "https://api.github.com";
        const userData = await 
        (await fetch(`${apiURL}/user`, {
            headers: {
                Authorization: `token ${access_token}`,
            },
        })
        ).json();
        const emailData = await
        (await fetch(`${apiURL}/user/emails`, {
            headers: {
                Authorization: `token ${access_token}`,
            },
        })).json();
        const emailObj = emailData.find(
            (email) => email.primary === true && email.verified === true
        );
        if(!emailObj){
            return res.redirect("/login");
        }
        let user = await User.findOne({email: emailObj.email});
        if (!user) {
                user = await User.create({
                avatarUrl: userData.avatar_url,
                name : userData.name,
                username: userData.login,
                email: emailObj.email,
                password: "", 
                socialOnly: true,
                location: userData.location,               
            })};
            req.session.loggedIn = true;
            req.session.user = user;
            return res.redirect("/");
 
    } else {
        return res.redirect("/login");
    }
};

export const getEdit = async (req, res) => {
    return res.render("edit-profile", {pageName: "Edit Profile"})
};

export const postEdit = async(req, res) => {
    const {
        session: {
            user: {_id, avatarUrl },
        },
        body: { name, email, username, location, description },
        file,
    } = req;
    const updateUser = await User.findByIdAndUpdate(_id, {
        avatarUrl: file ? file.location : avatarUrl,        
        name,
        email,
        username,
        location,
        description,
    },
    { new: true }
    );
    req.session.user = updateUser;
    return res.redirect("edit-profile");
};

export const logout = (req, res) => {
    req.session.destroy();
    return res.redirect("/");
};

export const getChangePassword = (req, res) => {
    if (req.session.user.socialOnly === true) {
        return res.redirect("/");
    }
    return res.render("change-password", {pageName: "Change Password"});
};

export const postChangePassword = async(req, res) => {
    const {
        session: {
            user: {_id, password },
        },
        body: { oldPassword, newPassword, newPasswordConfirm },
    } = req;
    const ok = await bcrypt.compare(oldPassword, password);
    if(!ok)  {
        return res.status(400).render("change-password", {pageName: "Change Password",
         errorMessage: "The password is incorrect"});
    }
    if(newPassword !== newPasswordConfirm) {
        return res.status(400).render("change-password", {pageName: "Change Password",
         errorMessage: "The password does not match"});
    }
    const user = await User.findById(_id);
    user.password = newPassword;
    await user.save();
    req.session.user.password = user.password
    return res.redirect("/user/logout");

};

export const see = async (req, res) => {
    const {id} = req.params;
    const user = await User.findById(id).populate({
        path: "videos",
        populate: {
            path: "owner",
            model: "User",
        }
    });
    if(!user) {
        return res.status(404).render("404", {pageName: "User not found."});
    }
    return res.render("profile", {
        pageName : user.name,
        user,
    });     
}





export const startKakao = (req, res) => {
    const config = {
        client_id :process.env.KA_CLIENT,
        client_secret : process.env.KA_SECRET,
        redirect_uri : process.env.KA_REDIRECT
    }
    
    return res.redirect(`https://kauth.kakao.com/oauth/authorize?client_id=${config.client_id}&redirect_uri=${config.redirect_uri}&response_type=code`);
} 

export const finishKakao = async (req, res) => {
    const config = {
        client_id : process.env.KA_CLIENT,
        client_secret : process.env.KA_SECRET,
        redirect_uri : process.env.KA_REDIRECT
    }

    const bodyData = {
        grant_type: "authorization_code",
        client_id: config.client_id,
        client_secret: config.client_secret,
        redirect_uri: config.redirect_uri,
        code: req.query.code
    }
    const queryStringBody = Object.keys(bodyData)
    .map(k=> encodeURIComponent(k)+"="+encodeURI(bodyData[k]))
    .join("&")

    const requsetToken = await fetch("https://kauth.kakao.com/oauth/token", {
        method: "POST",
        headers:{
            'content-type':'application/x-www-form-urlencoded'
        },
        body : queryStringBody
    })
    const kakaoToken = await requsetToken.json();
    console.log(kakaoToken);
    if(!kakaoToken.access_token) {
        return res.redirect("/login");
    }

    const seeToken = await fetch("https://kapi.kakao.com/v2/user/me", {
        method: "POST",
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `bearer ${kakaoToken.access_token}`
        },      
    })

    const tokenUse = await seeToken.json();
    console.log(tokenUse);

    let user = await User.findOne({email: tokenUse.kakao_account.email});
    if(!tokenUse.kakao_account.email) {
        req.flash("error", "Email access required")
        return res.redirect("/login");
    } else {
        if(!user) {
            user= await User.create({
                avatarUrl: tokenUse.properties.profile_image,
                name: tokenUse.properties.nickname,
                username: tokenUse.properties.nickname,
                email: tokenUse.kakao_account.email,
                password: "",
                socialOnly: true,
                location: ""
            })
        }
        req.session.loggedIn = true;
        req.session.user = user;
        return res.redirect("/");
    }
       
}
