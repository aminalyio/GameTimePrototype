import { PlayerDecorator } from "@sscale/syncsdk";

export default class DemoYoutubePlayerDecorator extends PlayerDecorator {
  getPrecisionThreshold() {
    return 50;
  }

  isSeekable() {
    return true;
  }

  isStalled() {
    try {
      return this.player.getPlayerState() === 3;
    } catch (e) {
      console.error("Is stalled error:", e);
    }

    return false;
  }

  play() {
    try {
      this.player.playVideo();
    } catch (e) {
      console.error("Play error:", e);
    }
  }

  pause() {
    try {
      this.player.pauseVideo();
    } catch (e) {
      console.error("Pause error:", e);
    }
  }

  getCurrentPosition() {
    try {
      return Math.round(this.player.getCurrentTime() * 1000);
    } catch (e) {
      console.error("Get current position error:", e);
    }

    return 0;
  }

  getPlaybackRate() {
    try {
      return this.player.getPlaybackRate();
    } catch (e) {
      console.error("Get playback rate error:", e);
    }

    return 0;
  }

  fastSeekToPosition(position) {
    try {
      this.player.seekTo(position);
    } catch (e) {
      console.error("Fast seek error:", e);
    }
  }

  isPlaying() {
    try {
      return (
        this.player.getPlayerState() === 1 || this.player.getPlayerState() === 3
      );
    } catch (e) {
      console.error("Is playing error:", e);
    }

    return false;
  }

  mute() {
    try {
      this.player.mute();
    } catch (e) {
      console.error("Mute error:", e);
    }
  }

  unmute(){
    try {
      this.player.unmute();
    } catch (e) {
      console.error("Unmute error:", e);
    }
  }

  changePlaybackRate(rate){
    try {
      this.player.setPlaybackRate(rate);
    } catch (e) {
      console.error("Set playback rate error:", e);
    }
  }

  setVolume(volume) {
    try {
      this.player.setVolume(volume * 100);
    } catch (e) {
      console.error("Set volume error:", e);
    }
  }
}
