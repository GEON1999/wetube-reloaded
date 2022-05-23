import { async } from "regenerator-runtime";

const videoContainer = document.getElementById("videoContainer")
const form = document.getElementById("commentForm");

const addComment = (text, id) => {
    const videoComments = document.querySelector(".video__comments ul");
    const newComment = document.createElement("li");
    const span = document.createElement("span");
    const spanDelete = document.createElement("span");

    span.innerText = text;
    spanDelete.innerText = "X";
    spanDelete.className = "comment_delete"
    newComment.className = "comment"
    newComment.dataset.id = id;
    newComment.appendChild(span);
    newComment.appendChild(spanDelete);
    videoComments.prepend(newComment);
}


const handleSubmit = async (event) => {
    event.preventDefault();
    const textarea = form.querySelector("textarea");
    const text = textarea.value;
    const videoId = videoContainer.dataset.id;
    if(text === "") {
        return;
    }
    const response = await fetch(`/api/videos/${videoId}/comment`, {
        method:"post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({text})
    });

    
    if (response.status == 201) {
        textarea.value = "";
        const {newCommentId} = await response.json();
        addComment(text, newCommentId);
    }
}

if (form){
    form.addEventListener("submit", handleSubmit);
}