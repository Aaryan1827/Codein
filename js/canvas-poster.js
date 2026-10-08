// Canvas Poster Exporter: Generates aesthetic poster image downloads of quotes

class CanvasPosterExporter {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
  }

  exportQuotePoster(quote, bgImageUrl, fontStyle = 'Space Grotesk') {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = bgImageUrl;

      img.onload = () => {
        // Set standard poster resolution (1200 x 1200 square or 1200 x 1500 poster format)
        const width = 1200;
        const height = 1200;
        this.canvas.width = width;
        this.canvas.height = height;

        // Draw background image scaled cover-style
        const imgRatio = img.width / img.height;
        const canvasRatio = width / height;
        let renderW, renderH, offsetX, offsetY;

        if (imgRatio > canvasRatio) {
          renderH = height;
          renderW = height * imgRatio;
          offsetX = (width - renderW) / 2;
          offsetY = 0;
        } else {
          renderW = width;
          renderH = width / imgRatio;
          offsetX = 0;
          offsetY = (height - renderH) / 2;
        }

        this.ctx.drawImage(img, offsetX, offsetY, renderW, renderH);

        // Dark gradient overlay for text readability
        const overlay = this.ctx.createLinearGradient(0, 0, 0, height);
        overlay.addColorStop(0, 'rgba(10, 10, 20, 0.45)');
        overlay.addColorStop(0.5, 'rgba(15, 12, 30, 0.65)');
        overlay.addColorStop(1, 'rgba(5, 5, 12, 0.85)');
        this.ctx.fillStyle = overlay;
        this.ctx.fillRect(0, 0, width, height);

        // Draw Glassmorphic Card outline container in canvas
        const cardX = 100;
        const cardY = 150;
        const cardW = width - 200;
        const cardH = height - 300;
        const borderRadius = 32;

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.roundRect(cardX, cardY, cardW, cardH, borderRadius);
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
        this.ctx.fill();
        this.ctx.lineWidth = 3;
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        this.ctx.stroke();
        this.ctx.restore();

        // Draw Funky Header Badge
        this.ctx.save();
        this.ctx.font = 'bold 24px "Space Grotesk", sans-serif';
        this.ctx.fillStyle = '#FF5E97';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('✦ QUOTIVERSE AESTHETICS ✦', width / 2, cardY + 70);
        this.ctx.restore();

        // Draw Large Quote Marks
        this.ctx.save();
        this.ctx.font = '90px "Syne", serif';
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('“', width / 2, cardY + 140);
        this.ctx.restore();

        // Wrap and Draw Quote Text
        this.ctx.save();
        const fontSize = quote.text.length > 100 ? 38 : quote.text.length > 60 ? 46 : 54;
        this.ctx.font = `600 ${fontSize}px "${fontStyle}", sans-serif`;
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.textAlign = 'center';
        this.ctx.shadowColor = 'rgba(0,0,0,0.6)';
        this.ctx.shadowBlur = 15;

        const maxTextWidth = cardW - 140;
        const lines = this.getWrappedText(quote.text, maxTextWidth, `${fontSize}px "${fontStyle}", sans-serif`);
        
        let startY = cardY + 230 + (4 - lines.length) * 15;
        lines.forEach(line => {
          this.ctx.fillText(line, width / 2, startY);
          startY += fontSize * 1.35;
        });
        this.ctx.restore();

        // Draw Author Name
        this.ctx.save();
        this.ctx.font = 'bold 30px "Outfit", sans-serif';
        const authorGrad = this.ctx.createLinearGradient(width/2 - 150, 0, width/2 + 150, 0);
        authorGrad.addColorStop(0, '#00F2FE');
        authorGrad.addColorStop(1, '#4FACFE');
        this.ctx.fillStyle = authorGrad;
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`— ${quote.author}`, width / 2, cardY + cardH - 100);
        this.ctx.restore();

        // Draw Category Pill Tag
        if (quote.category) {
          this.ctx.save();
          const catText = `★ ${quote.category.toUpperCase()} ★`;
          this.ctx.font = 'bold 18px "Space Grotesk", sans-serif';
          const textWidth = this.ctx.measureText(catText).width;
          const px = width / 2 - textWidth / 2 - 20;
          const py = cardY + cardH - 60;
          const pw = textWidth + 40;
          const ph = 36;

          this.ctx.beginPath();
          this.ctx.roundRect(px, py, pw, ph, 18);
          this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
          this.ctx.fill();
          this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
          this.ctx.stroke();

          this.ctx.fillStyle = '#FFFFFF';
          this.ctx.textAlign = 'center';
          this.ctx.fillText(catText, width / 2, py + 24);
          this.ctx.restore();
        }

        // Footer Branding Watermark
        this.ctx.save();
        this.ctx.font = '18px "Space Grotesk", sans-serif';
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Generated with Quotiverse • Premium Quote Engine', width / 2, height - 50);
        this.ctx.restore();

        // Trigger Download
        try {
          const dataUrl = this.canvas.toDataURL('image/png');
          const link = document.createElement('a');
          const safeAuthor = quote.author.replace(/[^a-zA-Z0-9]/g, '_');
          link.download = `Quotiverse_${safeAuthor}_Quote.png`;
          link.href = dataUrl;
          link.click();
          resolve(true);
        } catch (err) {
          reject(err);
        }
      };

      img.onerror = (err) => {
        reject(err);
      };
    });
  }

  getWrappedText(text, maxWidth, fontStr) {
    this.ctx.font = fontStr;
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = this.ctx.measureText(currentLine + " " + word).width;
      if (width < maxWidth) {
        currentLine += " " + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  }
}

const canvasExporter = new CanvasPosterExporter();
