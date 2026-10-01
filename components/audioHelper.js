// Romantic audio controller
// Real audio player with fallback synth

class RomanticAudioController {
  constructor() {
    this.audioElement = null;
    this.ctx = null;
    this.isPlaying = false;
    this.timer = null;
    this.currentStep = 0;
    this.volume = 0.35;
    this.useSynth = false;
    this.onTrackChangeCallback = null;

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
      this.audioElement = new Audio(this.playlist[this.currentTrackIndex].src);

      this.audioElement.loop = false; // We handle track ending ourselves
      this.audioElement.volume = 0.7;
      this.audioElement.preload = "metadata";

      this.audioElement.onerror = () => {
        console.warn("Audio file tidak ditemukan. Menggunakan synth.");
        this.useSynth = true;
      };

      this.audioElement.onplay = () => {
        this.isPlaying = true;
      };

      this.audioElement.onpause = () => {
        this.isPlaying = false;
      };

      this.audioElement.onended = () => {
        this.nextTrack();
      };
    } catch (e) {
      console.error("Gagal membuat audio:", e);
      this.useSynth = true;
    }
  }

  // =========================
  // REAL AUDIO CONTROLS
  // =========================

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
    this.currentTrackIndex = this.currentTrackIndex + 1;
    if (this.currentTrackIndex >= this.playlist.length) {
      this.currentTrackIndex = 0; // Kembali ke lagu pertama (Surat Hati)
    }
    this.loadAndPlayCurrent(true); // Paksa mainkan lagu baru
  }
  
  prevTrack() {
    this.currentTrackIndex = this.currentTrackIndex - 1;
    if (this.currentTrackIndex < 0) {
      this.currentTrackIndex = this.playlist.length - 1;
    }
    this.loadAndPlayCurrent(true);
  }
  
  loadAndPlayCurrent(forcePlay = false) {
    if (this.audioElement) {
      this.audioElement.src = this.playlist[this.currentTrackIndex].src;
      this.audioElement.load();
      if (this.isPlaying || forcePlay) {
        this.isPlaying = true;
        this.audioElement.play().catch(() => {
           this.useSynth = true;
           this.startSynth();
        });
      }
    }
    if (this.onTrackChangeCallback) {
       this.onTrackChangeCallback(this.playlist[this.currentTrackIndex]);
    }
  }
  
  setTrackChangeListener(callback) {
     this.onTrackChangeCallback = callback;
  }

  // =========================
  // SYNTH FALLBACK
  // =========================

  initContext() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;

      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  playNote(freq, time, duration = 1.6) {
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, time);

      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();

      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(freq * 2, time);

      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(
        this.volume * 0.16,
        time + 0.06
      );
      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        time + duration
      );

      gain2.gain.setValueAtTime(0, time);
      gain2.gain.linearRampToValueAtTime(
        this.volume * 0.04,
        time + 0.05
      );
      gain2.gain.exponentialRampToValueAtTime(
        0.0001,
        time + duration * 0.85
      );

      osc.connect(gain);
      osc2.connect(gain2);

      gain.connect(this.ctx.destination);
      gain2.connect(this.ctx.destination);

      osc.start(time);
      osc2.start(time);

      osc.stop(time + duration);
      osc2.stop(time + duration);
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  playArpeggio(notes, time, duration = 3.0) {
    notes.forEach((freq, idx) => {
      this.playNote(
        freq,
        time + idx * 0.14,
        duration
      );
    });
  }

  startSynth() {
    this.initContext();

    if (!this.ctx) return;

    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    this.isPlaying = true;

    const chords = [
      [130.81, 164.81, 196.0, 261.63, 329.63],
      [123.47, 146.83, 196.0, 246.94, 293.66],
      [110.0, 164.81, 196.0, 220.0, 261.63],
      [87.31, 130.81, 174.61, 220.0, 261.63, 329.63],
    ];

    const melodyTones = [
      [329.63, 293.66, 261.63],
      [293.66, 261.63, 246.94],
      [261.63, 220.0, 261.63],
      [329.63, 349.23, 392.0],
    ];

    const stepDuration = 3.2;

    const tick = () => {
      if (!this.isPlaying) return;

      const now = this.ctx.currentTime;
      const step = this.currentStep % chords.length;

      this.playArpeggio(
        chords[step],
        now,
        stepDuration * 1.3
      );

      const melodic = melodyTones[step];

      melodic.forEach((note, nIdx) => {
        this.playNote(
          note,
          now + 0.8 + nIdx * 0.7,
          1.8
        );
      });

      this.currentStep =
        (this.currentStep + 1) % chords.length;

      this.timer = setTimeout(
        tick,
        stepDuration * 1000
      );
    };

    tick();
  }

  stopSynth() {
    this.isPlaying = false;

    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  // =========================
  // PLAY / PAUSE
  // =========================

  start() {
    if (this.audioElement && !this.useSynth) {
      this.audioElement
        .play()
        .then(() => {
          this.isPlaying = true;
        })
        .catch((error) => {
          console.warn(
            "Audio gagal diputar:",
            error
          );

          this.useSynth = true;
          this.startSynth();
        });
    } else {
      this.startSynth();
    }
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

    this.stopSynth();
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
      return false;
    }

    this.start();
    return true;
  }
}

export const romanticAudio =
  typeof window !== "undefined"
    ? new RomanticAudioController()
    : null;