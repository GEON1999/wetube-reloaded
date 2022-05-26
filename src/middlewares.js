import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

const s3 = new aws.S3({
    credentials: {
        accessKeyId: process.env.AWS_ID,
        secretAccessKey: process.env.AWS_SECRET,
    }
})

export const localsMiddleware = (req, res, next) => {
    res.locals.siteName = "Wetube";
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.loggedInUser = req.session.user || {};
    next();
};

export const protectorMiddleware = (req, res, next) => {
    if (req.session.loggedIn) {
        next();
    } else {
        req.flash("error", "Log In First" )
        return res.redirect("/login");
    }
};

export const publicOnlyMiddleware = (req, res, next) => {
    if (!req.session.loggedIn) {
        next();
    } else {
        req.flash("error", "Already Loged In")
        return res.redirect("/");
    }
};

const s3ImageUploader = multerS3({
    s3: s3,
    bucket: 'geontube/images',
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
})

const s3VideoUploader = multerS3({
    s3: s3,
    bucket: 'geontube/videos',
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
})

export const avatarUpload = multer({
    dest: "uploads/avatars/",
    limits: {
      fileSize: 10000000,
    },
    storage: s3ImageUploader,
  });
  export const videoUpload = multer({
    dest: "uploads/videos/",
    limits: {
      fileSize: 100000000,
    },
    storage: s3VideoUploader,
  });