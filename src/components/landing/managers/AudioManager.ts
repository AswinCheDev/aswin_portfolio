export class AudioManager {
  private static ctx: AudioContext | null = null;
  private static enabled = false;

  public static init() {
    if (typeof window === 'undefined') return;

    const setupContext = () => {
      if (!this.ctx) {
        try {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          this.ctx = new AudioContextClass();
          this.enabled = true;
        } catch (e) {
          console.warn('Web Audio API not supported', e);
        }
      } else if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    };

    window.addEventListener('click', setupContext, { once: true });
    window.addEventListener('keydown', setupContext, { once: true });
  }

  public static playBoot() {
    if (!this.enabled || !this.ctx) return;
    this.playTone(440, 'square', 0.1, 0.1);
  }

  public static playShoot() {
    if (!this.enabled || !this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();
    
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    
    // Star Wars Blaster "Pew" Effect
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.4, this.ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);
    
    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  public static playExplosion() {
    if (!this.enabled || !this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();
    
    const duration = 0.5;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      // White noise with exponential decay
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / bufferSize * 5);
    }
    
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    
    // Add a lowpass filter to make it sound "boomy" and muffled
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + duration);
    
    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(0.8, this.ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
    
    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.ctx.destination);
    
    noise.start();
  }

  public static playWarning() {
    if (!this.enabled || !this.ctx) return;
    this.playTone(660, 'square', 0.1, 0.2);
  }

  public static playJingle() {
    if (!this.enabled || !this.ctx) return;
    
    const notes = [261.63, 329.63, 392.00, 523.25]; // C, E, G, C
    const timePerNote = 0.15;
    
    notes.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gainNode = this.ctx!.createGain();
      
      osc.type = 'square';
      osc.frequency.value = freq;
      
      const startTime = this.ctx!.currentTime + i * timePerNote;
      
      gainNode.gain.setValueAtTime(0.1, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + timePerNote);
      
      osc.connect(gainNode);
      gainNode.connect(this.ctx!.destination);
      
      osc.start(startTime);
      osc.stop(startTime + timePerNote);
    });
  }

  private static playTone(freq: number, type: OscillatorType, volume: number, duration: number) {
    if (!this.ctx) return;
    
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    
    osc.type = type;
    osc.frequency.value = freq;
    
    gainNode.gain.setValueAtTime(volume, this.ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
    
    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }
}
