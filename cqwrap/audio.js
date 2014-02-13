define(function(require, exports, module){

var audio = cc.AudioEngine.getInstance();
var audio_enable = {effect: true, music: true};

var Audio = {
    playEffect: function(name){
        if(audio_enable.effect){
            audio.playEffect(name, false);
        }
    },
    playMusic: function(name){
        if(audio_enable.music){
            audio.playMusic(name, true);
        }
    },
    pauseMusic: function(){
        audio.pauseMusic();
    },
    resumeMusic: function(){
        audio.resumeMusic();
    },
    setEnable: function(enable){
        if(typeof enable !== 'object'){
            enable = {effect: enable, music: enable};
        }

        audio_enable = enable;
    }
};

module.exports = Audio;

});