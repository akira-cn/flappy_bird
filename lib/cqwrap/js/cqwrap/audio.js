define(function(require, exports, module){

var audio = cc.AudioEngine.getInstance();
var audio_enable = {effect: true, music: true};

var Audio = {
    preloadEffect: function(name){
        audio.preloadEffect(name);
    },
    preloadMusic: function(name){
        audio.preloadMusic(name);
    },
    playEffect: function(name){
        if(audio_enable.effect){
            audio.playEffect(name, false);
        }
    },
    playMusic: function(name){        
        if(audio_enable.music){
            audio.playMusic(name, true);
        }
        this._music = name;
    },
    pauseMusic: function(){
        if(audio_enable.music){
            audio.pauseMusic();
        }
    },
    resumeMusic: function(){
        if(audio_enable.music){
            audio.resumeMusic();
        }
    },
    stopMusic: function(){
        if(audio_enable.music){
            audio.stopMusic();
        }
    },
    isMusicPlaying: function(){
        return audio.isMusicPlaying();
    },
    setEnable: function(enable){
        if(typeof enable !== 'object'){
            enable = {effect: enable, music: enable};
        }

        if(audio_enable.music == true && enable.music == false){
            audio.stopMusic();
        }else if(audio_enable.music == false && enable.music == true){
            if(this._music){
                audio.playMusic(this._music);
            }
        }
        audio_enable = {effect: enable.effect, music: enable.music};
    }
};

module.exports = Audio;

});