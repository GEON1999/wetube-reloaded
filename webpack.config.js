const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

const BASE_JS = "./src/client/js/";

module.exports = {
    entry: {
        main: BASE_JS + "main.js",
        videoPlayer: BASE_JS + "videoPlayer.js",
        recorder: BASE_JS + "recorder.js",
        commentSection: BASE_JS + "commentSection.js"
    },
    // code which i wnat to change shapes
    plugins: [new MiniCssExtractPlugin({
        filename: "css/styles.css",
    })],
    mode: "development", 
    // it shows us to the dev mode
    watch: true,
    // it helps not to npm run assets all the time
    output: {
        filename: "js/[name].js",
        path: path.resolve(__dirname, "assets"),
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [["@babel/preset-env", {targets: "defaults"}]],
                    }
                }
            },
            {
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
            }
        ]
    }
}

// #Goal: we want to chage the shape of codes which are js, css.
// #Order: webpack sense(detect) code of js -> load babel -> sass-loader (scss -> css) -> css-loader(handel imports)
// -> use minicssextractplugin (compiled code put into the css/styles.css)
// -> use pug to connect with css & js to the frontend
