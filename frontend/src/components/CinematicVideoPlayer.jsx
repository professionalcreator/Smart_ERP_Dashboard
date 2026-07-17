import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, Shield, Sparkles } from 'lucide-react';

export default function CinematicVideoPlayer() {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const mouseRef = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationId;
    let particles = [];
    const maxParticles = 60;

    // Resize canvas
    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle template
    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 20;
        this.size = Math.random() * 3.5 + 1;
        this.speedY = -(Math.random() * 0.8 + 0.3);
        this.speedX = Math.random() * 0.4 - 0.2;
        this.color = Math.random() > 0.5 
          ? `rgba(255, 94, 132, ${Math.random() * 0.35 + 0.15})` // pink
          : `rgba(255, 204, 213, ${Math.random() * 0.4 + 0.2})`; // light rose
        this.angle = Math.random() * 360;
        this.spin = Math.random() * 0.5 - 0.25;
      }

      update() {
        this.y += this.speedY * (isPlaying ? 1.5 : 0.4);
        this.x += this.speedX;
        this.angle += this.spin;

        // Mouse attraction/repulsion
        if (mouseRef.current.active) {
          const dx = mouseRef.current.x - this.x;
          const dy = mouseRef.current.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            this.x += dx * 0.02;
            this.y += dy * 0.02;
          }
        }

        if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.angle * Math.PI) / 180);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        // Draw soft cherry blossom petal shape or soft glow circle
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Initialize particles
    for (let i = 0; i < maxParticles; i++) {
      const p = new Particle();
      p.y = Math.random() * canvas.height; // scatter initial particles
      particles.push(p);
    }

    // Loop
    const drawLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      // Ambient scanning line when playing
      if (isPlaying) {
        const scanY = (Date.now() / 15) % (canvas.height * 2.5) - canvas.height;
        const grad = ctx.createLinearGradient(0, scanY, 0, scanY + 60);
        grad.addColorStop(0, 'rgba(255, 94, 132, 0)');
        grad.addColorStop(0.5, 'rgba(255, 94, 132, 0.025)');
        grad.addColorStop(1, 'rgba(255, 94, 132, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, scanY, canvas.width, 60);
      }

      animationId = requestAnimationFrame(drawLoop);
    };
    drawLoop();

    // Mouse events
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const parent = canvas.parentElement;
    parent.addEventListener('mousemove', handleMouseMove);
    parent.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
      parent.removeEventListener('mousemove', handleMouseMove);
      parent.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isPlaying]);

  return (
    <div 
      className="cinematic-video-container" 
      onClick={() => setIsPlaying(!isPlaying)}
      title="Click to Play/Pause cinematic motion loop"
    >
      {/* Background Graphic Zooming */}
      <img
        src={`${import.meta.env.BASE_URL}smarterp_hero_cinematic.jpg`}
        alt="SmartERP Cinematic View"
        className="cinematic-video-media"
        style={{
          animationPlayState: isPlaying ? 'running' : 'paused'
        }}
      />

      {/* Interactive Particle Layer Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      {/* Video controls & details overlay */}
      <div className="cinematic-video-overlay" style={{ zIndex: 2 }}>
        <div className="cinematic-header">
          <span className="cinematic-badge">INTRODUCING SMARTERP DEMO</span>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Sparkles size={14} color="var(--accent-primary)" />
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '700' }}>Higgsfield Loop</span>
          </div>
        </div>

        {/* Play/Pause indicator */}
        <div className="cinematic-play-btn-wrapper">
          <div className="cinematic-play-btn">
            {isPlaying ? (
              <Pause size={24} color="var(--accent-primary)" fill="var(--accent-primary)" />
            ) : (
              <Play size={24} color="var(--accent-primary)" fill="var(--accent-primary)" style={{ marginLeft: '4px' }} />
            )}
          </div>
        </div>

        <div className="cinematic-footer">
          <div>
            <h4 className="cinematic-title-small">Personalized Workspace Flow</h4>
            <p className="cinematic-meta">Figma Prototype transformed into Production Code</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Shield size={14} color="var(--accent-primary)" />
            <span style={{ fontSize: '11px', fontWeight: '800' }}>0:45 SEC</span>
          </div>
        </div>
      </div>
    </div>
  );
}
