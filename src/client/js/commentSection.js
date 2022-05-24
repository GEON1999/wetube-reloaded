import { async } from "regenerator-runtime";


const videoContainer = document.getElementById("videoContainer")
const form = document.getElementById("commentForm");
const deleteComment = document.querySelectorAll(".deleteComment");
// getElementById response only for firstChild



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
        //addComment 는 comment를 추가할 때만 실행됨으로 comment 삭제 시의 함수를 추가하기엔 부적합하다 
    }
}

const addComment = (text, id) => {
    console.log(id);
    const videoComments = document.querySelector(".video__comments ul");
    const newComment = document.createElement("li");
    const span = document.createElement("span");
    const spanDelete = document.createElement("span");
    span.innerText = text;
    spanDelete.innerText = "X";
    spanDelete.className = "deleteComment"
    // when the comment added, fake comment also get same class as real comment
    spanDelete.addEventListener("click", handleDelete)
    // the fake comment also get addEventListener. then, it's done!
    newComment.className = "comment"
    newComment.dataset.id = id;
    newComment.appendChild(span);
    newComment.appendChild(spanDelete);
    videoComments.prepend(newComment);
}


const handleDelete =  async (event) => {
    console.log("i'm clicked")
    const comment = event.target.parentNode;
    const commentId = comment.dataset.id;
    comment.remove();
    await fetch(`/api/comments/${commentId}/delete`, {
        method: "DELETE",

    }
)
};





deleteComment.forEach(deleteComment => deleteComment.addEventListener("click", handleDelete));
// forEach = specified action for each node in list}


if (form){
    form.addEventListener("submit", handleSubmit);

}