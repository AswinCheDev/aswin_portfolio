export class AudioManager {
  private static ctx: AudioContext | null = null;
  private static enabled = false;

  public static init() {
    if (!this.ctx) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        this.ctx = new AudioContextClass();
        this.enabled = true;
        
        // Browsers block autoplay until user interaction. Resume context on first click/keydown.
        const resumeAudio = () => {
          if (this.ctx?.state === 'suspended') {
            this.ctx.resume();
          }
        };
        window.addEventListener('click', resumeAudio, { once: true });
        window.addEventListener('keydown', resumeAudio, { once: true });
        
      } catch (e) {
        console.warn('Web Audio API not supported', e);
      }
    } else if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public static playBoot() {
    if (!this.enabled || !this.ctx) return;
    this.playTone(440, 'square', 0.1, 0.1);
  }

  public static playShoot() {
    if (!this.enabled || !this.ctx) return;
    
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(220, this.ctx.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
    
    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  public static playExplosion() {
    if (!this.enabled || !this.ctx) return;
    
    const bufferSize = this.ctx.sampleRate * 0.1; // 100ms
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1; // White noise
    }
    
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1000;
    
    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
    
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
