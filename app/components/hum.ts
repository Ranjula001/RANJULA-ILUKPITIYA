/**
 * Generative ambient hum, synthesised with the Web Audio API.
 * No audio files: a detuned drone on A, a filtered noise bed, a generated
 * reverb tail and sparse pentatonic notes that drift in and out.
 */

const ROOT = 55; // A1
const NOTES = [220, 261.63, 293.66, 329.63, 392, 440, 523.25]; // A minor pentatonic

type Voice = { osc: OscillatorNode; lfo: OscillatorNode };

export class Hum {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private wet: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private bins: Uint8Array<ArrayBuffer> | null = null;
  private voices: Voice[] = [];
  private noteTimer: number | null = null;
  private suspendTimer: number | null = null;
  playing = false;

  private build() {
    const Ctx =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = new Ctx();
    this.ctx = ctx;

    const master = ctx.createGain();
    master.gain.value = 0;
    const limiter = ctx.createDynamicsCompressor();
    limiter.threshold.value = -18;
    limiter.ratio.value = 6;
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.86;
    master.connect(limiter).connect(analyser).connect(ctx.destination);
    this.master = master;
    this.analyser = analyser;
    this.bins = new Uint8Array(new ArrayBuffer(analyser.frequencyBinCount));

    // Generated reverb: stereo noise with an exponential tail.
    const seconds = 4.5;
    const impulse = ctx.createBuffer(2, ctx.sampleRate * seconds, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = impulse.getChannelData(ch);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / data.length) ** 3.2;
      }
    }
    const reverb = ctx.createConvolver();
    reverb.buffer = impulse;
    const wet = ctx.createGain();
    wet.gain.value = 0.55;
    wet.connect(reverb).connect(master);
    this.wet = wet;

    // The drone runs through one slow-breathing low-pass.
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 420;
    filter.Q.value = 0.7;
    filter.connect(master);
    filter.connect(wet);
    this.filter = filter;

    const sweep = ctx.createOscillator();
    sweep.frequency.value = 0.045;
    const sweepDepth = ctx.createGain();
    sweepDepth.gain.value = 140;
    sweep.connect(sweepDepth).connect(filter.detune);
    sweep.start();

    // [ratio to root, wave, level, detune cents, tremolo rate]
    const partials: [number, OscillatorType, number, number, number][] = [
      [1, "sine", 0.34, 0, 0.05],
      [1.5, "sine", 0.16, 3, 0.07],
      [2, "triangle", 0.11, -6, 0.033],
      [2, "triangle", 0.11, 7, 0.041],
      [3, "sine", 0.05, 4, 0.09],
      [4, "sine", 0.03, -3, 0.061],
    ];
    for (const [ratio, type, level, detune, rate] of partials) {
      const osc = ctx.createOscillator();
      osc.type = type;
      osc.frequency.value = ROOT * ratio;
      osc.detune.value = detune;
      const gain = ctx.createGain();
      gain.gain.value = level;
      const lfo = ctx.createOscillator();
      lfo.frequency.value = rate;
      const depth = ctx.createGain();
      depth.gain.value = level * 0.55;
      lfo.connect(depth).connect(gain.gain);
      osc.connect(gain).connect(filter);
      osc.start();
      lfo.start();
      this.voices.push({ osc, lfo });
    }

    // Noise bed: brown-ish noise, band-passed so it reads as room air.
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate);
    const noise = noiseBuffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < noise.length; i++) {
      last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
      noise[i] = last * 3.5;
    }
    const bed = ctx.createBufferSource();
    bed.buffer = noiseBuffer;
    bed.loop = true;
    const band = ctx.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = 480;
    band.Q.value = 0.4;
    const bedGain = ctx.createGain();
    bedGain.gain.value = 0.09;
    bed.connect(band).connect(bedGain).connect(master);
    bed.start();
  }

  private scheduleNote = () => {
    if (!this.playing || !this.ctx || !this.wet) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const freq = NOTES[Math.floor(Math.random() * NOTES.length)];
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.045, now + 1.2);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 6.5);
    osc.connect(gain).connect(this.wet);
    osc.start(now);
    osc.stop(now + 7);
    this.noteTimer = window.setTimeout(
      this.scheduleNote,
      3500 + Math.random() * 5500,
    );
  };

  async start() {
    if (!this.ctx) this.build();
    const ctx = this.ctx!;
    if (this.suspendTimer !== null) window.clearTimeout(this.suspendTimer);
    this.suspendTimer = null;
    await ctx.resume();
    this.playing = true;
    const g = this.master!.gain;
    g.cancelScheduledValues(ctx.currentTime);
    g.setValueAtTime(g.value, ctx.currentTime);
    g.linearRampToValueAtTime(0.5, ctx.currentTime + 2.4);
    if (this.noteTimer !== null) window.clearTimeout(this.noteTimer);
    this.noteTimer = window.setTimeout(this.scheduleNote, 2200);
  }

  stop() {
    if (!this.ctx || !this.master) return;
    const ctx = this.ctx;
    this.playing = false;
    if (this.noteTimer !== null) window.clearTimeout(this.noteTimer);
    this.noteTimer = null;
    const g = this.master.gain;
    g.cancelScheduledValues(ctx.currentTime);
    g.setValueAtTime(g.value, ctx.currentTime);
    g.linearRampToValueAtTime(0, ctx.currentTime + 0.7);
    this.suspendTimer = window.setTimeout(() => {
      if (!this.playing) void ctx.suspend();
    }, 900);
  }

  /** Opens the filter as the page scrolls: 0 at the top, 1 at the bottom. */
  setDepth(progress: number) {
    if (!this.ctx || !this.filter || !this.playing) return;
    this.filter.frequency.setTargetAtTime(
      380 + progress * 520,
      this.ctx.currentTime,
      0.6,
    );
  }

  /** A short, quiet tick for hover feedback. */
  tick() {
    if (!this.ctx || !this.wet || !this.playing) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1320, now + 0.08);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.03, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
    osc.connect(gain).connect(this.wet);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  /** Fills `out` with band levels in 0..1 and returns the overall level. */
  levels(out: number[]) {
    if (!this.analyser || !this.bins || !this.playing) {
      out.fill(0);
      return 0;
    }
    this.analyser.getByteFrequencyData(this.bins);
    let total = 0;
    for (let i = 0; i < out.length; i++) {
      // The energy sits low, so sample the first bins on a gentle curve.
      const bin = Math.round(1 + i ** 1.6 * 1.4);
      out[i] = this.bins[bin] / 255;
      total += out[i];
    }
    return total / out.length;
  }

  destroy() {
    if (this.noteTimer !== null) window.clearTimeout(this.noteTimer);
    if (this.suspendTimer !== null) window.clearTimeout(this.suspendTimer);
    this.playing = false;
    void this.ctx?.close();
    this.ctx = null;
  }
}
