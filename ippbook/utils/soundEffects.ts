// Web Audio API procedural sound synthesizer for authentic book interactions and atmosphere

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private ambientSource: AudioBufferSourceNode | null = null;
  private isAmbientPlaying = false;
  private isMuted = false;

  private initContext() {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.ambientGain) {
      this.ambientGain.gain.setValueAtTime(0, this.ctx?.currentTime || 0);
    } else if (!muted && this.ambientGain && this.isAmbientPlaying && this.ctx) {
      this.ambientGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    }
  }

  public getMuted() {
    return this.isMuted;
  }

  // Realistic parchment paper flip sound
  public playPageFlip() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const bufferSize = ctx.sampleRate * 0.28; // 280ms duration
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Pink/brown noise generation for organic paper friction
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99765 * b0 + white * 0.0990460;
        b1 = 0.96300 * b1 + white * 0.2965164;
        b2 = 0.57000 * b2 + white * 1.0526913;
        data[i] = (b0 + b1 + b2 + white * 0.1848) * 0.12;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      // Bandpass filter to simulate paper frequency
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(950, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(350, ctx.currentTime + 0.25);
      filter.Q.setValueAtTime(1.8, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.26);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
    } catch {
      // Audio autoplay policy fallback
    }
  }

  // Deep grimoire heavy leather opening thump
  public playBookOpen() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(120, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.45);

      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.55);

      // Add soft rustle
      setTimeout(() => this.playPageFlip(), 180);
    } catch {
      // Ignore
    }
  }

  // Soft mystical click chime
  public playChime() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.2); // A5

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } catch {
      // Ignore
    }
  }

  // Procedural spooky night ambient wind & ember crackle
  public toggleAmbient(forceState?: boolean): boolean {
    const ctx = this.initContext();
    if (!ctx) return false;

    const targetState = forceState !== undefined ? forceState : !this.isAmbientPlaying;

    if (!targetState) {
      if (this.ambientSource) {
        try {
          this.ambientSource.stop();
          this.ambientSource.disconnect();
        } catch {
          // Ignore
        }
        this.ambientSource = null;
      }
      this.isAmbientPlaying = false;
      return false;
    }

    try {
      const bufferSize = ctx.sampleRate * 4; // 4 seconds looped noise
      const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);

      for (let channel = 0; channel < 2; channel++) {
        const channelData = buffer.getChannelData(channel);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          // Brownian low frequency wind rumble
          channelData[i] = (lastOut + (0.02 * white)) / 1.02;
          lastOut = channelData[i];
          // Add occasional ember pops
          if (Math.random() < 0.0004) {
            channelData[i] += (Math.random() - 0.5) * 0.4;
          }
        }
      }

      this.ambientSource = ctx.createBufferSource();
      this.ambientSource.buffer = buffer;
      this.ambientSource.loop = true;

      const lowpass = ctx.createBiquadFilter();
      lowpass.type = "lowpass";
      lowpass.frequency.setValueAtTime(420, ctx.currentTime);

      this.ambientGain = ctx.createGain();
      const currentGain = this.isMuted ? 0 : 0.08;
      this.ambientGain.gain.setValueAtTime(0.001, ctx.currentTime);
      this.ambientGain.gain.linearRampToValueAtTime(currentGain, ctx.currentTime + 1.5);

      this.ambientSource.connect(lowpass);
      lowpass.connect(this.ambientGain);
      this.ambientGain.connect(ctx.destination);

      this.ambientSource.start();
      this.isAmbientPlaying = true;
      return true;
    } catch {
      this.isAmbientPlaying = false;
      return false;
    }
  }

  public getIsAmbientPlaying() {
    return this.isAmbientPlaying;
  }
}

export const sound = new SoundSynthesizer();
