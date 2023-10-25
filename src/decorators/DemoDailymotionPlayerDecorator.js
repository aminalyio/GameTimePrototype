import { PlayerDecorator } from "@sscale/syncsdk";

export default class DemoDailymotionDecorator extends PlayerDecorator {

  isBuffering = false;
  currentPosition = 0;
  playbackRate = 0;
  playing = false;
  loaded = false;
  isLive = 0;

  timeout = 0;

  load() {
    this.loaded = true;

    const onPlaying = () => {
      this.playing = true;
      this.isBuffering = false;

      this.queryProgress();
    };

    // this.player.getState().then((state) => {
    //   if(state.isPlaying) {
    //     onPlaying();
    //   }
    // });

    onPlaying();


    // this.player.on(dailymotion.events.VIDEO_PLAY, onPlaying());


    this.player.on(dailymotion.events.VIDEO_PLAY, () => {
      console.log('play again!');
      onPlaying()
    });

    this.player.on(dailymotion.events.VIDEO_PAUSE, () => {
      console.log('pause');
      this.playing = false;

      clearTimeout(this.timeout);
    });

    this.player.on(dailymotion.events.VIDEO_BUFFERING, () => {
      this.isBuffering = true;
    });
  }

  unload() {
    this.loaded = false;
    clearTimeout(this.timeout);
  }

  getSeekThreshold() {
    return 10000;
  }

  queryProgress() {
    clearTimeout(this.timeout);

    if (!this.playing || !this.loaded) {
      return;
    }

    this.timeout = setTimeout(async () => {

      const state = await this.player.getState();
      this.isBuffering = state.playerIsBuffering;
      this.currentPosition = state.videoTime;
      this.playbackRate = state.playerPlaybackSpeed;
      this.playing = state.playerIsPlaying;
      this.isLive = state.videoDuration;

      this.queryProgress();
    }, 25);

  }
  
  getPrecisionThreshold() {
    return 400;
  }

  isSeekable() {
    return true;
  }

  isStalled() {
    try {
      return this.isBuffering;
    } catch (e) {
      console.error("Is stalled error:", e);
    }

    return false;
  }

  play() {
    try {
      this.player.play();
    } catch (e) {
      console.error("Play error:", e);
    }
  }

  pause() {
    try {
      this.player.pause();
    } catch (e) {
      console.error("Pause error:", e);
    }
  }

  getCurrentPosition() {
    try {
      return Math.round(this.currentPosition * 1000);
    } catch (e) {
      console.error("Get current position error:", e);
    }

    return 0;
  }

  getPlaybackRate() {
    try {
      return this.playbackRate;
    } catch (e) {
      console.error("Get playback rate error:", e);
    }

    return 0;
  }

  fastSeekToPosition(position) {
    try {
      this.player.seek(position / 1000);
    } catch (e) {
      console.error("Fast seek error:", e);
    }
  }

  isPlaying() {
    try {
      return this.playing;
    } catch (e) {
      console.error("Is playing error:", e);
    }
    return false;
  }

  mute() {
    try {
      this.player.setMute(true);
    } catch (e) {
      console.error("Mute error:", e);
    }
  }

  unmute(){
    try {
      this.player.setMute(false);
    } catch (e) {
      console.error("Unmute error:", e);
    }
  }

  changePlaybackRate(rate){
    try {
      if (rate < 1 && rate >= 0.75) { //this is a hack to work around dailymotion round up
        this.player.setPlaybackSpeed(0.75);
      } else {
        this.player.setPlaybackSpeed(rate);
      }
    } catch (e) {
      console.error("Set playback rate error:", e);
    }
  }

  setVolume(volume) {
    try {
      this.player.setVolume(volume);
    } catch (e) {
      console.error("Set volume error:", e);
    }
  }
}