// Audio Engine: Web Audio Synth Sound Effects & Speech Synthesis

class AudioEngine {
  constructor() {
    this.audioCtx = null;
    this.synthPlaying = false;
    this.droneOsc1 = null;
    this.droneOsc2 = null;
    this.droneGain = null;
    this.synthSoundsEnabled = true;
    
    // Speech Synthesis
    this.synth = window.speechSynthesis || null;
    this.voices = [];
    this.selectedVoice = null;
    this.speechRate = 1.0;
    this.speechPitch = 1.0;
    this.isSpeaking = false;

    this.initSpeechVoices();
  }

  initAudioContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // Play funky sci-fi pop sound on interaction
  playPopSound(freq = 440, type = 'sine') {
    if (!this.synthSoundsEnabled) return;
    try {
      this.initAudioContext();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.8, this.audioCtx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.13);
    } catch (e) {
      console.warn("Audio Context playback error:", e);
    }
  }

  // Play a pleasant chime for favorite/copy actions
  playChimeSound() {
    if (!this.synthSoundsEnabled) return;
    try {
      this.initAudioContext();
      if (!this.audioCtx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime + idx * 0.05);

        gain.gain.setValueAtTime(0.1, this.audioCtx.currentTime + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + idx * 0.05 + 0.3);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(this.audioCtx.currentTime + idx * 0.05);
        osc.stop(this.audioCtx.currentTime + idx * 0.05 + 0.35);
      });
    } catch (e) {
      console.warn("Chime error:", e);
    }
  }

  // Toggle ambient atmospheric synth pad background loop
  toggleAmbientPad(onState) {
    try {
      this.initAudioContext();
      if (!this.audioCtx) return false;

      if (onState && !this.synthPlaying) {
        this.droneOsc1 = this.audioCtx.createOscillator();
        this.droneOsc2 = this.audioCtx.createOscillator();
        const filter = this.audioCtx.createBiquadFilter();
        this.droneGain = this.audioCtx.createGain();

        this.droneOsc1.type = 'sine';
        this.droneOsc2.type = 'triangle';

        // Warm chord frequencies (A major chord sub-frequencies)
        this.droneOsc1.frequency.setValueAtTime(110.0, this.audioCtx.currentTime); // A2
        this.droneOsc2.frequency.setValueAtTime(164.81, this.audioCtx.currentTime); // E3

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(350, this.audioCtx.currentTime);

        this.droneGain.gain.setValueAtTime(0.01, this.audioCtx.currentTime);
        this.droneGain.gain.linearRampToValueAtTime(0.08, this.audioCtx.currentTime + 2.0);

        this.droneOsc1.connect(filter);
        this.droneOsc2.connect(filter);
        filter.connect(this.droneGain);
        this.droneGain.connect(this.audioCtx.destination);

        this.droneOsc1.start();
        this.droneOsc2.start();
        this.synthPlaying = true;
        return true;
      } else if (!onState && this.synthPlaying) {
        if (this.droneGain) {
          this.droneGain.gain.linearRampToValueAtTime(0.001, this.audioCtx.currentTime + 1.0);
          setTimeout(() => {
            if (this.droneOsc1) this.droneOsc1.stop();
            if (this.droneOsc2) this.droneOsc2.stop();
            this.synthPlaying = false;
          }, 1000);
        }
        return false;
      }
    } catch (e) {
      console.warn("Ambient synth error:", e);
      return false;
    }
  }

  // Initialize browser Speech Synthesis voices
  initSpeechVoices() {
    if (!this.synth) return;
    const updateVoices = () => {
      this.voices = this.synth.getVoices();
      // Select preferred clear English voice if available
      this.selectedVoice = this.voices.find(v => v.lang.includes('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('David') || v.name.includes('Zira'))) || this.voices[0];
    };

    updateVoices();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = updateVoices;
    }
  }

  // Speak quote text
  speakQuote(text, author, onEndCallback) {
    if (!this.synth) {
      alert("Text-To-Speech is not supported in your browser.");
      return;
    }

    if (this.synth.speaking) {
      this.synth.cancel();
      this.isSpeaking = false;
      if (onEndCallback) onEndCallback(false);
      return;
    }

    const fullText = `${text} ... Quote by ${author}`;
    const utterance = new SpeechSynthesisUtterance(fullText);

    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }
    utterance.rate = this.speechRate;
    utterance.pitch = this.speechPitch;

    utterance.onend = () => {
      this.isSpeaking = false;
      if (onEndCallback) onEndCallback(false);
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      if (onEndCallback) onEndCallback(false);
    };

    this.isSpeaking = true;
    if (onEndCallback) onEndCallback(true);
    this.synth.speak(utterance);
  }

  stopSpeech() {
    if (this.synth && this.synth.speaking) {
      this.synth.cancel();
      this.isSpeaking = false;
    }
  }
}

const audioEngine = new AudioEngine();
