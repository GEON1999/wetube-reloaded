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
        const {newComment} = await response.json();
        addComment(text, newComment);
        console.log("this is new commentid", newComment);
        //addComment 는 comment를 추가할 때만 실행됨으로 comment 삭제 시의 함수를 추가하기엔 부적합하다 
    }
}

const addComment = (text, comment) => {

    const videoComments = document.querySelector(".video__comments ul");
    const newComment = document.createElement("li");
    const profileImg = document.createElement("img");
    const commentText = document.createElement("div");
    const commentUser = document.createElement("div");
    const p = document.createElement("p");
    const span = document.createElement("span");
    const small = document.createElement("small");
    const iconDelete = document.createElement("i");
    span.innerText = text;
    profileImg.src = comment.avatarUrl;
    small.innerText = comment.ownerName;
    p.innerText = new Date(comment.createdAt).toLocaleDateString();
    profileImg.className= "header__avatar"
    commentText.className = "comment_text"
    commentUser.className= "comment_text_user"
    iconDelete.classList.add("deleteComment","fas","fa-trash")
    // when the comment added, fake comment also get same class as real comment
    iconDelete.addEventListener("click", handleDelete)
    // the fake comment also get addEventListener. then, it's done!
    newComment.className = "comment"
    newComment.dataset.id = comment._id;
    commentUser.appendChild(small);
    commentUser.appendChild(p);
    commentText.appendChild(commentUser);
    commentText.appendChild(span);
    newComment.appendChild(profileImg);
    newComment.appendChild(commentText);
    newComment.appendChild(iconDelete);
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