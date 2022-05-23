const { createFFmpeg, fetchFile } = require('@ffmpeg/ffmpeg');
import { async } from "regenerator-runtime";
const actionBtn = document.getElementById("actionBtn");
const actionIcon = actionBtn.querySelector("i");
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile

const files = {
    input: "recording.webm",
    output: "output.mp4",
    thumb: "thumbnail.jpg"
}

const downloadFIle = (fileUrl, fileName) => {
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = fileName;
    document.body.appendChild(a);
    // const a 에서는 선언만 했고 여기서 a를 document 에 생성함
    a.click();  
}

const handleFinishDownload = () => {
    actionIcon.classList = "fas fa-check";
    actionBtn.addEventListener("click", handleStart);
}

const handleDownload = async() => {
    actionIcon.classList = "fas fa-spinner";
    actionBtn.removeEventListener("click", handleDownload);

    const ffmpeg = createFFmpeg({corePath:"/convert/ffmpeg-core.js", log: true });
    await ffmpeg.load();
 
    ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile));

    await ffmpeg.run("-i", files.input, "-r", "60", files.output);
    await ffmpeg.run(
        "-i", 
        files.input, 
        "-ss", 
        "00:00:01", 
        "-frames:v", 
        "1", 
        files.thumb
    );

    const mp4File = ffmpeg.FS("readFile", files.output);
    const thumbfile = ffmpeg.FS("readFile", files.thumb);

    const mp4Blob = new Blob([mp4File.buffer], {type:"video/mp4"});
    const thumbBlob = new Blob([thumbfile.buffer], {type:"image/jpg"});

    const mp4Url = URL.createObjectURL(mp4Blob);
    const thumbUrl = URL.createObjectURL(thumbBlob);

    downloadFIle(mp4Url, "MyRecording.mp4");
    downloadFIle(thumbUrl, "MyThumbnail.jpg");
       
    ffmpeg.FS("unlink", files.output);
    ffmpeg.FS("unlink", files.thumb);
    ffmpeg.FS("unlink", files.input);

    URL.revokeObjectURL(mp4Url);
    URL.revokeObjectURL(thumbUrl);
    URL.revokeObjectURL(videoFile);

    handleFinishDownload();
}

const handleStop = () => {
    actionIcon.classList = "fas fa-download";
    actionBtn.removeEventListener("click", handleStop);
    actionBtn.addEventListener("click", handleDownload);
    recorder.stop();
}

const handleRecordStart = () => {
    actionIcon.classList = "fas fa-stop";
    actionBtn.removeEventListener("click", handleRecordStart);
    actionBtn.addEventListener("click", handleStop);
    recorder.start();
    setTimeout(() => {
        recorder.stop();
      }, 60000);
}

const handleStart = () => {
    video.srcObject = stream;
    video.play();  

    actionIcon.classList = "fas fa-play";
    actionBtn.removeEventListener("click", handleStart);
    actionBtn.addEventListener("click", handleRecordStart);
    recorder = new MediaRecorder(stream, {mimeType: "video/webm"});
    recorder.ondataavailable = (event) => {
        videoFile = URL.createObjectURL(event.data)
        console.log(videoFile);
        video.srcObject = null;
        video.src = videoFile;
        video.loop = true;
        video.play();
    }
    // MediaRecorder.stop() 이 실행될 때 발생하는 이벤트 
    
}

const init = async() => {
    stream =await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: {
        width: 1024,
        height: 576,
      },
 })


}

init();

actionBtn.addEventListener("click", handleStart);