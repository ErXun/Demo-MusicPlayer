var musicList = []
var currentIndex = 0
var audio = new Audio()
audio.autoplay = true
function $(selector){
    return document.querySelector(selector)
}
getMusicList(function(list){
    musicList = list
    loadMusic(list[currentIndex])
})
// 进度条控制，时间显示和播放结束控制
audio.ontimeupdate = function(){
    $('.progress .progress-now').style.width = (this.currentTime/audio.duration)*100+"%"
}
audio.onplay = function(){
    clock = setInterval(function(){
        var min = Math.floor(audio.currentTime/60)
        var sec = Math.floor(audio.currentTime)%60 + ''
        sec = sec.length===2?sec:'0'+sec
        $('.progress .time').innerText = min +':'+ sec
    },1000)
}
audio.onpause = function(){
    clearInterval(clock)
}
// 定点播放
$('.progress .bar').onclick =function(e){
    var percent = e.offsetX/parseInt(getComputedStyle(this).width)
    audio.currentTime = audio.duration * percent
}
// 播放结束后，自动下一曲
audio.onended = function(){
    currentIndex = (++currentIndex) % musicList.length
    loadMusic(musicList[currentIndex])
}
// 播放和暂停
$('#change').onclick= function(){
    if(audio.paused){
        audio.play()
        $('#change i').classList.add('icon-pause')
        $('#change i').classList.remove('icon-play')
    }else{
    audio.pause()
    $('#change i').classList.remove('icon-pause')
    $('#change i').classList.add('icon-play')
    }
}
//切换下一首song
$('.music-action #next').onclick = function(){
    currentIndex = (++currentIndex)%musicList.length
    loadMusic(musicList[currentIndex])
}
$('.music-action #previous').onclick = function(){
    currentIndex = (--currentIndex+musicList.length)%musicList.length
    loadMusic(musicList[currentIndex])
}
//获取音乐数据
function getMusicList(callback){
    var xhr = new XMLHttpRequest()
    xhr.open("GET","https://github.com/ErXun/Demo-MusicPlayer/music.json",true)
    xhr.onload = function(){
        if((xhr.status>=200 && xhr.status<300)||xhr.status ===304){
            console.log(JSON.parse(this.responseText))
            callback(JSON.parse(this.responseText))
        }else{
            console.log("获取数据失败")
        }
    }
    xhr.onerror = function(){
        console.log("网络异常 ")
    }
    xhr.send()
}
// 导入音乐info
function loadMusic(musicObj){
    $('.music-box .title').innerText = musicObj.title
    $('.music-box .auther').innerText = musicObj.auther
    $('.cover').style.backgroundImage = 'url('+ musicObj.img +')'
    audio.src = musicObj.src
}
