/* Tiny synthesised sound engine — no audio files. Off by default; the user
   opts in with the speaker toggle. All sounds are soft and short. */

type SoundName = 'pop' | 'squish' | 'select' | 'success';

const KEY = 'squishy.sound';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  enabled =
    typeof localStorage !== 'undefined' && localStorage.getItem(KEY) === 'on';
  private listeners = new Set<(on: boolean) => void>();

  private ensure() {
    if (!this.ctx) {
      const AC =
        window.AudioContext || (window as any).webkitAudioContext;
      if (!AC) return null;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.22;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  }

  subscribe(fn: (on: boolean) => void) {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  toggle() {
    this.setEnabled(!this.enabled);
    if (this.enabled) this.play('pop');
  }

  setEnabled(on: boolean) {
    this.enabled = on;
    try {
      localStorage.setItem(KEY, on ? 'on' : 'off');
    } catch {
      /* ignore */
    }
    if (on) this.ensure();
    this.listeners.forEach((l) => l(on));
  }

  private blip(
    ctx: AudioContext,
    freq: number,
    dur: number,
    type: OscillatorType,
    gain = 1,
    bend?: number,
  ) {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (bend) osc.frequency.exponentialRampToValueAtTime(bend, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g);
    g.connect(this.master!);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  play(name: SoundName) {
    if (!this.enabled) return;
    const ctx = this.ensure();
    if (!ctx || !this.master) return;
    switch (name) {
      case 'pop':
        this.blip(ctx, 420, 0.14, 'sine', 0.9, 720);
        break;
      case 'squish':
        this.blip(ctx, 260, 0.22, 'triangle', 0.8, 130);
        this.blip(ctx, 520, 0.12, 'sine', 0.3, 900);
        break;
      case 'select':
        this.blip(ctx, 660, 0.07, 'sine', 0.5, 880);
        break;
      case 'success':
        [523, 659, 784, 1046].forEach((f, i) =>
          setTimeout(() => this.blip(ctx, f, 0.16, 'sine', 0.6, f * 1.02), i * 90),
        );
        break;
    }
  }
}

export const sound = new SoundEngine();
