const VIDEO_URL = 'http://147.182.148.189:8080/live/_hi/index.m3u8';

var video = document.getElementById("video");
if(Hls.isSupported()) {
    var hls = new Hls();
    hls.loadSource(VIDEO_URL);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED,function() {
    video.play();
    });
}

function addSourceToVideo(element, src, type) {
    var source = document.createElement('source');
    source.src = src;
    source.type = type;
    element.appendChild(source);
}