// Main Quotiverse Application Logic & Animation Controller

class QuotiverseApp {
  constructor() {
    this.quotes = [...QUOTES_DATA];
    this.currentCategory = 'all';
    this.currentQuoteIndex = 0;
    this.favorites = JSON.parse(localStorage.getItem('quotiverse_favs') || '[]');
    this.currentFontIndex = 0;
    this.fontClasses = ['', 'font-syne', 'font-hand', 'font-outfit', 'font-amaranth'];
    this.fontNames = ['Space Grotesk', 'Syne', 'Marker', 'Outfit', 'Amaranth'];
    
    // Background images list
    this.backgrounds = [
      { name: 'Neon Cyberpunk', url: 'assets/images/bg-neon.jpg' },
      { name: 'Cosmic Dreams', url: 'assets/images/bg-cosmic.jpg' },
      { name: 'Retro Sunset', url: 'assets/images/bg-retro.jpg' },
      { name: 'Pop Art Memphis', url: 'assets/images/bg-pop.jpg' },
      { name: 'Zen Forest', url: 'assets/images/bg-zen.jpg' }
    ];
    this.currentBgIndex = 0;
    this.autoSlideInterval = null;
    this.isAutoPlay = false;

    this.initDOM();
    this.initParticles();
    this.initEventListeners();
    this.renderCurrentQuote();
  }

  initDOM() {
    // DOM Elements
    this.quoteCard = document.getElementById('quote-card');
    this.quoteText = document.getElementById('quote-text');
    this.quoteAuthor = document.getElementById('quote-author');
    this.quoteBadge = document.getElementById('quote-badge');
    this.quoteTags = document.getElementById('quote-tags');
    this.bgContainer = document.getElementById('bg-container');
    this.particlesCanvas = document.getElementById('particles-canvas');
    
    // Action Buttons
    this.btnShuffle = document.getElementById('btn-shuffle');
    this.btnFavorite = document.getElementById('btn-favorite');
    this.btnSpeak = document.getElementById('btn-speak');
    this.btnDownload = document.getElementById('btn-download');
    this.btnCopy = document.getElementById('btn-copy');
    this.btnFont = document.getElementById('btn-font');
    this.fontLabel = document.getElementById('font-label');
    this.btnAmbient = document.getElementById('btn-ambient');
    this.btnAutoplay = document.getElementById('btn-autoplay');
    
    // Modals
    this.modalFavs = document.getElementById('modal-favorites');
    this.modalCreate = document.getElementById('modal-create');
    this.favsListContainer = document.getElementById('favs-list-container');
    
    // Render Background Layers
    this.backgrounds.forEach((bg, idx) => {
      const layer = document.createElement('div');
      layer.className = `bg-layer ${idx === 0 ? 'active' : ''}`;
      layer.style.backgroundImage = `url('${bg.url}')`;
      layer.id = `bg-layer-${idx}`;
      this.bgContainer.appendChild(layer);
    });

    this.updateFavButtonState();
  }

  // Floating Particle Animation System
  initParticles() {
    const ctx = this.particlesCanvas.getContext('2d');
    let width = (this.particlesCanvas.width = window.innerWidth);
    let height = (this.particlesCanvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = this.particlesCanvas.width = window.innerWidth;
      height = this.particlesCanvas.height = window.innerHeight;
    });

    const particles = [];
    const numParticles = 45;

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.5 + 0.5,
        color: ['rgba(255, 0, 127, ', 'rgba(0, 242, 254, ', 'rgba(255, 230, 0, '][Math.floor(Math.random() * 3)],
        alpha: Math.random() * 0.7 + 0.2,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4 - 0.2
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.alpha + ')';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ffffff';
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();
  }

  // Filter quotes by category
  getFilteredQuotes() {
    if (this.currentCategory === 'all') return this.quotes;
    return this.quotes.filter(q => q.category === this.currentCategory);
  }

  // Render Quote to UI
  renderCurrentQuote() {
    const filtered = this.getFilteredQuotes();
    if (filtered.length === 0) return;

    if (this.currentQuoteIndex >= filtered.length) {
      this.currentQuoteIndex = 0;
    }

    const q = filtered[this.currentQuoteIndex];

    // Smooth fade out effect
    this.quoteText.style.opacity = '0';
    this.quoteAuthor.style.opacity = '0';
    this.quoteCard.style.transform = 'scale(0.97)';

    setTimeout(() => {
      this.quoteText.textContent = q.text;
      this.quoteAuthor.textContent = `— ${q.author}`;
      this.quoteBadge.textContent = `✦ ${q.category ? q.category.toUpperCase() : 'MOTIVATION'} ✦`;

      // Render Tags
      this.quoteTags.innerHTML = '';
      if (q.tags && q.tags.length) {
        q.tags.forEach(tag => {
          const chip = document.createElement('span');
          chip.className = 'tag-item';
          chip.textContent = `#${tag}`;
          this.quoteTags.appendChild(chip);
        });
      }

      // Switch matching background image
      this.setBackgroundByPath(q.bg);

      // Fade back in
      this.quoteText.style.opacity = '1';
      this.quoteAuthor.style.opacity = '1';
      this.quoteCard.style.transform = 'none';

      this.updateFavButtonState();
    }, 250);
  }

  // Background Image Switcher
  setBackgroundIndex(idx) {
    this.currentBgIndex = idx;
    document.querySelectorAll('.bg-layer').forEach((layer, i) => {
      layer.classList.toggle('active', i === idx);
    });
    document.querySelectorAll('.bg-thumb').forEach((thumb, i) => {
      thumb.classList.toggle('active', i === idx);
    });
  }

  setBackgroundByPath(path) {
    const foundIdx = this.backgrounds.findIndex(b => b.url === path);
    if (foundIdx !== -1) {
      this.setBackgroundIndex(foundIdx);
    }
  }

  // Shuffle Next Quote
  shuffleQuote() {
    audioEngine.playPopSound(520, 'sine');
    this.triggerConfetti();

    const filtered = this.getFilteredQuotes();
    if (filtered.length <= 1) return;

    let nextIdx = Math.floor(Math.random() * filtered.length);
    while (nextIdx === this.currentQuoteIndex) {
      nextIdx = Math.floor(Math.random() * filtered.length);
    }
    this.currentQuoteIndex = nextIdx;
    this.renderCurrentQuote();
  }

  // Canvas Confetti FX
  triggerConfetti() {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 45,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#ff007f', '#00f2fe', '#ffe600', '#ffffff']
      });
    }
  }

  // Favorites Toggle
  toggleFavorite() {
    const filtered = this.getFilteredQuotes();
    const currentQ = filtered[this.currentQuoteIndex];

    const existingIndex = this.favorites.findIndex(item => item.id === currentQ.id || item.text === currentQ.text);

    if (existingIndex !== -1) {
      this.favorites.splice(existingIndex, 1);
      this.showToast('Removed from Favorites 💔');
    } else {
      this.favorites.push(currentQ);
      audioEngine.playChimeSound();
      this.showToast('Added to Favorites! ❤️');
    }

    localStorage.setItem('quotiverse_favs', JSON.stringify(this.favorites));
    this.updateFavButtonState();
  }

  updateFavButtonState() {
    const filtered = this.getFilteredQuotes();
    if (filtered.length === 0) return;
    const currentQ = filtered[this.currentQuoteIndex];

    const isFav = this.favorites.some(item => item.id === currentQ.id || item.text === currentQ.text);
    if (isFav) {
      this.btnFavorite.classList.add('is-active');
      this.btnFavorite.innerHTML = '❤️';
    } else {
      this.btnFavorite.classList.remove('is-active');
      this.btnFavorite.innerHTML = '🤍';
    }
  }

  // Download Quote Poster Image
  async downloadPoster() {
    const filtered = this.getFilteredQuotes();
    const q = filtered[this.currentQuoteIndex];
    audioEngine.playPopSound(600, 'triangle');
    this.showToast('Generating HD Poster... 🎨');

    try {
      const currentBg = this.backgrounds[this.currentBgIndex].url;
      const font = this.fontNames[this.currentFontIndex];
      await canvasExporter.exportQuotePoster(q, currentBg, font);
      this.showToast('Poster Downloaded! 📥');
    } catch (err) {
      console.error(err);
      this.showToast('Error generating poster');
    }
  }

  // Copy Quote Text to Clipboard
  copyQuoteText() {
    const filtered = this.getFilteredQuotes();
    const q = filtered[this.currentQuoteIndex];
    const textToCopy = `"${q.text}" — ${q.author}`;

    navigator.clipboard.writeText(textToCopy).then(() => {
      audioEngine.playChimeSound();
      this.showToast('Quote copied to clipboard! 📋');
    });
  }

  // Speak Quote (TTS)
  toggleSpeech() {
    const filtered = this.getFilteredQuotes();
    const q = filtered[this.currentQuoteIndex];

    if (audioEngine.isSpeaking) {
      audioEngine.stopSpeech();
      this.btnSpeak.classList.remove('speaking');
    } else {
      this.btnSpeak.classList.add('speaking');
      audioEngine.speakQuote(q.text, q.author, (active) => {
        if (!active) {
          this.btnSpeak.classList.remove('speaking');
        }
      });
    }
  }

  // Switch Typography
  cycleFont() {
    this.currentFontIndex = (this.currentFontIndex + 1) % this.fontClasses.length;
    
    // Clear old font classes
    this.fontClasses.forEach(cls => {
      if (cls) this.quoteText.classList.remove(cls);
    });

    const newClass = this.fontClasses[this.currentFontIndex];
    if (newClass) this.quoteText.classList.add(newClass);

    this.fontLabel.textContent = this.fontNames[this.currentFontIndex];
    audioEngine.playPopSound(350, 'sine');
  }

  // Toggle Ambient Audio Synth Pad
  toggleAmbientSound() {
    const isPlaying = audioEngine.toggleAmbientPad(!audioEngine.synthPlaying);
    if (isPlaying) {
      this.btnAmbient.classList.add('active');
      this.btnAmbient.innerHTML = '🎵 Sound: ON';
      this.showToast('Ambient Synth Playing 🎶');
    } else {
      this.btnAmbient.classList.remove('active');
      this.btnAmbient.innerHTML = '🎵 Sound: OFF';
      this.showToast('Ambient Synth Muted 🔇');
    }
  }

  // Toggle Auto-Slideshow
  toggleAutoplay() {
    this.isAutoPlay = !this.isAutoPlay;
    if (this.isAutoPlay) {
      this.btnAutoplay.classList.add('active');
      this.btnAutoplay.innerHTML = '⏱️ Auto: ON';
      this.showToast('Autoplay Started (Every 7s) 🚀');
      this.autoSlideInterval = setInterval(() => {
        this.shuffleQuote();
      }, 7000);
    } else {
      this.btnAutoplay.classList.remove('active');
      this.btnAutoplay.innerHTML = '⏱️ Auto: OFF';
      this.showToast('Autoplay Paused ⏸️');
      clearInterval(this.autoSlideInterval);
    }
  }

  // Show Toast Message
  showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `✨ ${message}`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  // Open Favorites Modal
  renderFavoritesList() {
    this.favsListContainer.innerHTML = '';

    if (this.favorites.length === 0) {
      this.favsListContainer.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: rgba(255,255,255,0.5);">
          <p style="font-size: 2rem; margin-bottom: 0.5rem;">💔</p>
          <p>No saved quotes yet. Click the heart icon on quotes you love!</p>
        </div>
      `;
      return;
    }

    this.favorites.forEach((fav, idx) => {
      const card = document.createElement('div');
      card.className = 'fav-card-item';
      card.innerHTML = `
        <div>
          <div class="fav-card-text">"${fav.text}"</div>
          <div class="fav-card-author">— ${fav.author}</div>
        </div>
        <div class="fav-card-actions">
          <button class="action-icon-btn" onclick="app.loadFavorite(${idx})" title="Load Quote">✨</button>
          <button class="action-icon-btn" onclick="app.removeFavorite(${idx})" title="Remove">🗑️</button>
        </div>
      `;
      this.favsListContainer.appendChild(card);
    });
  }

  loadFavorite(index) {
    const fav = this.favorites[index];
    this.quoteText.textContent = fav.text;
    this.quoteAuthor.textContent = `— ${fav.author}`;
    this.setBackgroundByPath(fav.bg);
    this.modalFavs.classList.remove('open');
    this.showToast('Loaded Favorite Quote!');
  }

  removeFavorite(index) {
    this.favorites.splice(index, 1);
    localStorage.setItem('quotiverse_favs', JSON.stringify(this.favorites));
    this.renderFavoritesList();
    this.updateFavButtonState();
    this.showToast('Favorite removed');
  }

  // Create Custom Quote
  submitCustomQuote(e) {
    e.preventDefault();
    const text = document.getElementById('custom-text').value.trim();
    const author = document.getElementById('custom-author').value.trim() || 'Anonymous';
    const category = document.getElementById('custom-cat').value;

    if (!text) {
      alert('Please enter a quote!');
      return;
    }

    const newQuote = {
      id: Date.now(),
      text: text,
      author: author,
      category: category,
      bg: this.backgrounds[this.currentBgIndex].url,
      tags: ['Custom', 'UserQuote'],
      theme: 'custom'
    };

    this.quotes.unshift(newQuote);
    this.currentQuoteIndex = 0;
    this.renderCurrentQuote();
    this.modalCreate.classList.remove('open');
    document.getElementById('custom-quote-form').reset();
    this.showToast('Custom Quote Created! 🎉');
  }

  // Setup Event Listeners
  initEventListeners() {
    // 3D Tilt Card Animation
    this.quoteCard.addEventListener('mousemove', (e) => {
      const rect = this.quoteCard.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const tiltX = (y / (rect.height / 2)) * -10;
      const tiltY = (x / (rect.width / 2)) * 10;

      this.quoteCard.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    this.quoteCard.addEventListener('mouseleave', () => {
      this.quoteCard.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });

    // Button Actions
    this.btnShuffle.addEventListener('click', () => this.shuffleQuote());
    this.btnFavorite.addEventListener('click', () => this.toggleFavorite());
    this.btnSpeak.addEventListener('click', () => this.toggleSpeech());
    this.btnDownload.addEventListener('click', () => this.downloadPoster());
    this.btnCopy.addEventListener('click', () => this.copyQuoteText());
    this.btnFont.addEventListener('click', () => this.cycleFont());
    this.btnAmbient.addEventListener('click', () => this.toggleAmbientSound());
    this.btnAutoplay.addEventListener('click', () => this.toggleAutoplay());

    // Background Selector Thumbs
    document.querySelectorAll('.bg-thumb').forEach((thumb, idx) => {
      thumb.addEventListener('click', () => {
        this.setBackgroundIndex(idx);
        audioEngine.playPopSound(400, 'sine');
      });
    });

    // Category Filter Chips
    document.querySelectorAll('.cat-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        document.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active'));
        e.target.classList.add('active');

        this.currentCategory = e.target.dataset.cat;
        this.currentQuoteIndex = 0;
        this.renderCurrentQuote();
        audioEngine.playPopSound(480, 'sine');
      });
    });

    // Modals Open/Close
    document.getElementById('btn-open-favs').addEventListener('click', () => {
      this.renderFavoritesList();
      this.modalFavs.classList.add('open');
    });

    document.getElementById('btn-open-create').addEventListener('click', () => {
      this.modalCreate.classList.add('open');
    });

    document.querySelectorAll('.modal-close-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.modalFavs.classList.remove('open');
        this.modalCreate.classList.remove('open');
      });
    });

    // Form Submit
    document.getElementById('custom-quote-form').addEventListener('submit', (e) => this.submitCustomQuote(e));
  }
}

// Initialize App when DOM is loaded
let app;
document.addEventListener('DOMContentLoaded', () => {
  app = new QuotiverseApp();
});
