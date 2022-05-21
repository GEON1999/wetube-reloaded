const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile

const handleDownload = () => {
    const a = document.createElement("a");
    a.href = videoFile;
    a.download = "MyRecording.mp4";
    document.body.appendChild(a);
    a.click();
}

const handleStop = () => {
    startBtn.innerText = "Download Recording"
    startBtn.removeEventListener("click", handleStop);
    startBtn.addEventListener("click", handleDownload);
    recorder.stop();
}

const handleStart = () => {
    startBtn.innerText = "Stop Recording";
    startBtn.removeEventListener("click", handleStart);
    startBtn.addEventListener("click", handleStop);
    recorder = new MediaRecorder(stream, {mimeType:"video/mp4"});
    recorder.ondataavailable = (event) => {
        videoFile = URL.createObjectURL(event.data)
        video.srcObject = null;
        video.src = videoFile;
        video.loop = true;
        video.play();
    }
    // MediaRecorder.stop() 이 실행될 때 발생하는 이벤트 
    recorder.start();
}

const init = async() => {
 stream =await navigator.mediaDevices.getUserMedia({
     audio: true,
     video: true,
 })
 video.srcObject = stream;
 video.play();
}

init();

startBtn.addEventListener("click", handleStart);