// Romantic audio controller
// Dedicated HTML5 Audio Player for Devano playlist (Surat Hati, Rembulan, Menyimpan Rasa)

class RomanticAudioController {
  constructor() {
    this.audioElement = null;
    this.isPlaying = false;
    this.volume = 0.7;
    this.onTrackChangeCallback = null;
    this.onPlayStateChangeCallback = null;

    this.playlist = [
      { title: "Surat Hati", artist: "Devano", src: "/audio/surathati.mp3" },
      { title: "Rembulan", artist: "Devano", src: "/audio/rembulan.mp3" },
      { title: "Menyimpan Rasa", artist: "Devano", src: "/audio/menyimpanrasa.mp3" }
    ];
    this.currentTrackIndex = 0;

    if (typeof window !== "undefined") {
      this.initAudioElement();
    }
  }

  initAudioElement() {
    try {
      this.audioElement = new Audio();
      this.audioElement.src = this.playlist[this.currentTrackIndex].src;
      this.audioElement.loop = false;
      this.audioElement.volume = this.volume;
      this.audioElement.preload = "auto";

      this.audioElement.onerror = (e) => {
        console.warn("Gagal memuat file audio:", this.playlist[this.currentTrackIndex]?.src, e);
      };

      this.audioElement.onplay = () => {
        this.isPlaying = true;
        if (this.onPlayStateChangeCallback) {
          this.onPlayStateChangeCallback(true);
        }
      };

      this.audioElement.onpause = () => {
        this.isPlaying = false;
        if (this.onPlayStateChangeCallback) {
          this.onPlayStateChangeCallback(false);
        }
      };

      this.audioElement.onended = () => {
        this.nextTrack();
      };
    } catch (e) {
      console.error("Gagal inisialisasi audio element:", e);
    }
  }

  getAudio() {
    return this.audioElement;
  }

  getCurrentTrack() {
    return this.playlist[this.currentTrackIndex];
  }

  getCurrentTime() {
    if (!this.audioElement) return 0;
    return this.audioElement.currentTime || 0;
  }

  getDuration() {
    if (!this.audioElement) return 0;
    return Number.isFinite(this.audioElement.duration)
      ? this.audioElement.duration
      : 0;
  }

  seek(time) {
    if (!this.audioElement) return;
    const duration = this.getDuration();
    if (!Number.isFinite(duration)) return;
    const safeTime = Math.max(0, Math.min(time, duration));
    this.audioElement.currentTime = safeTime;
  }

  restart() {
    if (!this.audioElement) return;
    this.audioElement.currentTime = 0;
  }

  nextTrack() {
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.playlist.length;
    this.loadAndPlayCurrent(true);
  }

  prevTrack() {
    this.currentTrackIndex =
      (this.currentTrackIndex - 1 + this.playlist.length) % this.playlist.length;
    this.loadAndPlayCurrent(true);
  }

  loadAndPlayCurrent(forcePlay = false) {
    if (this.audioElement) {
      this.audioElement.src = this.playlist[this.currentTrackIndex].src;
      this.audioElement.load();
      if (this.isPlaying || forcePlay) {
        this.isPlaying = true;
        const playPromise = this.audioElement.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn("Autoplay terhalang atau gagal:", err);
          });
        }
      }
    }
    if (this.onTrackChangeCallback) {
      this.onTrackChangeCallback(this.playlist[this.currentTrackIndex]);
    }
  }

  setTrackChangeListener(callback) {
    this.onTrackChangeCallback = callback;
  }

  setPlayStateListener(callback) {
    this.onPlayStateChangeCallback = callback;
  }

  start() {
    if (!this.audioElement) return Promise.resolve(false);

    const playPromise = this.audioElement.play();
    if (playPromise !== undefined) {
      return playPromise
        .then(() => {
          this.isPlaying = true;
          if (this.onPlayStateChangeCallback) {
            this.onPlayStateChangeCallback(true);
          }
          return true;
        })
        .catch((error) => {
          console.warn("Audio play menunggu interaksi pengguna (user gesture):", error);
          this.isPlaying = false;
          if (this.onPlayStateChangeCallback) {
            this.onPlayStateChangeCallback(false);
          }
          return false;
        });
    }
    return Promise.resolve(false);
  }

  stop() {
    this.isPlaying = false;
    if (this.audioElement) {
      try {
        this.audioElement.pause();
      } catch (e) {
        console.warn("Gagal pause audio:", e);
      }
    }
    if (this.onPlayStateChangeCallback) {
      this.onPlayStateChangeCallback(false);
    }
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }
}

export const romanticAudio =
  typeof window !== "undefined"
    ? new RomanticAudioController()
    : null;