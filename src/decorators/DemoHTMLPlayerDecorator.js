import Hls from 'hls.js';
import { PlayerDecorator } from '@sscale/syncsdk';

export default class DemoHtmlPlayerDecorator extends PlayerDecorator {
  static DEFAULT_PTS_FREQUENCY = 90000;

  streamOffset = 0;
  rememberedPosition = 0;
  usingProgramDateTime = false;

  load() {
    if (!Hls.isSupported()) {
      return;
    }

    const initPTS = this.player.hls.streamController.initPTS;
    if (initPTS[0]) {
      const streamOffset = (Math.abs(initPTS[0]) / DemoHtmlPlayerDecorator.DEFAULT_PTS_FREQUENCY) * 1000;
      this.streamOffset = Math.round(streamOffset);
    } else {
      this.player.hls.on(Hls.Events.INIT_PTS_FOUND, (event, eventData) => {
        if (eventData.initPTS > 0) {
          const streamOffset = (Math.abs(eventData.initPTS) / DemoHtmlPlayerDecorator.DEFAULT_PTS_FREQUENCY) * 1000;
          this.streamOffset = Math.round(streamOffset);
        }
      });
    }

    const fragPlaying = this.player.hls.streamController.fragPlaying;
    if (fragPlaying?.programDateTime) {
      this.usingProgramDateTime = true;

      this.rememberedPosition = fragPlaying.start;
      this.streamOffset = Math.round(fragPlaying?.programDateTime);
    }

    this.player.hls.on(Hls.Events.FRAG_CHANGED, (event, eventData) => {
      if (eventData.frag.programDateTime) {
        this.usingProgramDateTime = true;

        this.rememberedPosition = this.player.video.currentTime;
        this.streamOffset = Math.round(eventData.frag.programDateTime);
      }
    });
  }

  unload() {
    // hls.destroy() takes care of everything
  }

  getPrecisionThreshold() {
    if (this.usingProgramDateTime) {
      return 50;
    }

    return 5;
  }

  isStalled() {
    return this.player.video.readyState < this.player.video.HAVE_FUTURE_DATA;
  }

  isSeekable() {
    return false;
  }

  play() {
    try {
      this.player.video.play();
    } catch (e) {
      console.error('Play error:', e);
    }
  }

  pause() {
    try {
      this.player.video.pause();
    } catch (e) {
      console.error('Pause error:', e);
    }
  }

  mute() {
    try {
      this.player.video.muted = true;
    } catch (e) {
      console.log('Mute error:', e);
    }
  }

  unmute() {
    try {
      this.player.video.muted = false;
    } catch (e) {
      console.log('Unmute error:', e);
    }
  }

  getCurrentPosition() {
    try {
      return Math.round(this.streamOffset + (this.player.video.currentTime - this.rememberedPosition) * 1000);
    } catch (e) {
      console.error('Get current position error:', e);
    }

    return 0;
  }

  fastSeekToPosition(position) {
    if (position != null) {
      const time = (position - this.streamOffset + this.rememberedPosition * 1000) / 1000;

      try {
        const start = this.player.video.seekable.start(0);
        const end = this.player.video.seekable.end(0);
        if (time <= end && time >= start) {
          window.sdkSeek = true;
          this.player.video.currentTime = time;
        }
      } catch (e) {
        console.error('Fast seek error:', e);
      }
    }
  }

  isPlaying() {
    try {
      return !this.player.video.paused;
    } catch (e) {
      console.error('Is playing error:', e);
    }

    return false;
  }

  changePlaybackRate(rate) {
    try {
      this.player.video.playbackRate = rate;
    } catch (e) {
      console.error('Set playback rate error:', e);
    }
  }

  getPlaybackRate() {
    try {
      return this.player.video.playbackRate;
    } catch (e) {
      console.error('Get playback rate error:', e);
    }

    return 0;
  }

  setVolume(volume) {
    try {
      this.player.video.volume = volume;
    } catch (e) {
      console.error('Set volume error:', e);
    }
  }
}
