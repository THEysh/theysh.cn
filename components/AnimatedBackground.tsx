import React, { useEffect, useRef } from 'react';

const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      baseOpacity: number;
      pulseSpeed: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 2 + 0.5; // Size between 0.5px and 2.5px
        
        // Very slow movement simulating floating dust/stars
        this.speedX = Math.random() * 0.4 - 0.2; 
        this.speedY = Math.random() * -0.4 - 0.1; // Slight upward drift
        
        this.baseOpacity = Math.random() * 0.5 + 0.1;
        this.opacity = this.baseOpacity;
        this.pulseSpeed = (Math.random() * 0.01 + 0.005) * (Math.random() > 0.5 ? 1 : -1);
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Twinkle/Pulse effect
        this.opacity += this.pulseSpeed;
        if (this.opacity >= this.baseOpacity + 0.2 || this.opacity <= Math.max(0, this.baseOpacity - 0.2)) {
            this.pulseSpeed = -this.pulseSpeed;
        }

        // Wrap around screen
        if (this.y < -10) {
            this.y = canvas!.height + 10;
            this.x = Math.random() * canvas!.width;
        }
        if (this.x < -10) this.x = canvas!.width + 10;
        if (this.x > canvas!.width + 10) this.x = -10;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, this.opacity)})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      // Calculate particle count based on screen size for performance
      const particleCount = Math.min(Math.floor(window.innerWidth * 0.08), 100); 
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      if (!canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#0f172a]">
      {/* 1. Base Layer: Colorful Moving Blobs (CSS Animation) */}
      <div 
        className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob"
        style={{ animationDelay: '0s' }}
      ></div>
      <div 
        className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob"
        style={{ animationDelay: '2s' }}
      ></div>
      <div 
        className="absolute -bottom-32 left-1/3 w-[600px] h-[600px] bg-blue-600/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob"
        style={{ animationDelay: '4s' }}
      ></div>
      <div 
        className="absolute bottom-0 right-1/3 w-[500px] h-[500px] bg-teal-500/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob"
        style={{ animationDelay: '6s' }}
      ></div>
      
      {/* 2. Middle Layer: Particle Canvas */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
      
      {/* 3. Top Layer: Texture Overlay for Depth */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[0.5px]"></div>
      
      {/* Optional: Vignette effect to focus on center */}
      <div className="absolute inset-0 bg-[radial-gradient(transparent_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none"></div>
    </div>
  );
};

export default AnimatedBackground;