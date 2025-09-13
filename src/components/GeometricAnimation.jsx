import React, { useEffect, useRef } from 'react';

const debounce = (func, delay) => {
  let timeoutId;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(context, args), delay);
  }
};

const CyberSecurityAnimation = ({ paused }) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationIdRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // This function recreates all particles. It's expensive to run repeatedly.
    const createParticles = () => {
      const area = window.innerWidth * window.innerHeight;
      const count = area < 500000 ? 60 : 120;
      const baseSize = window.innerWidth < 500 ? 1.2 : window.innerWidth < 900 ? 1.8 : 2.2;

      particlesRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: baseSize + Math.random() * 1.8,
        opacity: Math.random() * 0.6 + 0.3,
        hue: Math.random() * 60 + 180, // Cyan to blue range
        shape: Math.random() < 0.15 ? 'shield' : (Math.random() < 0.25 ? 'lock' : (Math.random() < 0.35 ? 'eye' : (Math.random() < 0.45 ? 'diamond' : 'hexagon'))),
        pulsePhase: Math.random() * Math.PI * 2,
        scanLine: Math.random() < 0.1, // 10% chance to be a scanning line
        threatLevel: Math.random() < 0.05 ? 'high' : (Math.random() < 0.15 ? 'medium' : 'low') // Threat indicators
      }));
    };
    
    // --- FIX: Debounce the expensive resize operation for performance ---
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createParticles();
    };
    
    // Create a debounced version that will only run 250ms after the user stops resizing.
    const debouncedResize = debounce(handleResize, 250);

    const drawShape = (ctx, x, y, size, type = 'hexagon', threatLevel = 'low', time = 0) => {
      ctx.beginPath();
      
      // Color based on threat level
      let color;
      switch(threatLevel) {
        case 'high':
          color = `hsl(0, 80%, 70%)`; // Red for high threat
          break;
        case 'medium':
          color = `hsl(30, 90%, 70%)`; // Orange for medium threat
          break;
        default:
          color = `hsl(200, 80%, 70%)`; // Blue for low/normal
      }
      ctx.fillStyle = color;
      
      if (type === 'shield') {
        // Draw a security shield shape
        ctx.moveTo(x, y - size);
        ctx.quadraticCurveTo(x + size * 0.7, y - size * 0.8, x + size * 0.8, y);
        ctx.quadraticCurveTo(x + size * 0.8, y + size * 0.5, x, y + size * 1.2);
        ctx.quadraticCurveTo(x - size * 0.8, y + size * 0.5, x - size * 0.8, y);
        ctx.quadraticCurveTo(x - size * 0.7, y - size * 0.8, x, y - size);
        ctx.closePath();
      } else if (type === 'lock') {
        // Draw a lock symbol
        ctx.rect(x - size * 0.6, y - size * 0.2, size * 1.2, size * 0.8);
        ctx.moveTo(x - size * 0.4, y - size * 0.2);
        ctx.arc(x, y - size * 0.5, size * 0.4, Math.PI, 0, false);
        ctx.lineTo(x + size * 0.4, y - size * 0.2);
      } else if (type === 'eye') {
        // Draw an eye (surveillance/detection symbol)
        ctx.ellipse(x, y, size, size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.beginPath();
        ctx.arc(x, y, size * 0.4, 0, Math.PI * 2);
      } else if (type === 'diamond') {
        // Draw a diamond (data/encryption symbol)
        ctx.moveTo(x, y - size);
        ctx.lineTo(x + size * 0.7, y);
        ctx.lineTo(x, y + size);
        ctx.lineTo(x - size * 0.7, y);
        ctx.closePath();
      } else {
        // Default hexagon (honeycomb security pattern)
        const sides = 6;
        const angle = (Math.PI * 2) / sides;
        ctx.moveTo(x + size * Math.cos(0), y + size * Math.sin(0));
        for (let i = 1; i < sides; i++) {
          ctx.lineTo(x + size * Math.cos(i * angle), y + size * Math.sin(i * angle));
        }
        ctx.closePath();
      }
      ctx.fill();
      
      // Add scanning effect for certain particles
      if (Math.random() < 0.02) {
        ctx.strokeStyle = `rgba(0, 255, 255, 0.6)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    };

    const animate = (time) => {
      // The `paused` prop effectively stops the animation loop.
      if (paused) {
        animationIdRef.current = requestAnimationFrame(animate);
        return;
      }

      // Dark cyber background with slight blue tint
      ctx.fillStyle = 'rgba(0, 5, 15, 0.12)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;

      // Draw connection lines (neural network / data flow visualization)
      particles.forEach((p1, i) => {
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 85) {
            // Connection strength based on threat levels
            let connectionAlpha = 0.05;
            let connectionHue = 200; // Default blue
            
            if (p1.threatLevel === 'high' || p2.threatLevel === 'high') {
              connectionAlpha = 0.15;
              connectionHue = 0; // Red for threat connections
            } else if (p1.threatLevel === 'medium' || p2.threatLevel === 'medium') {
              connectionAlpha = 0.10;
              connectionHue = 30; // Orange
            }
            
            ctx.strokeStyle = `hsla(${connectionHue}, 70%, 70%, ${connectionAlpha})`;
            ctx.lineWidth = p1.threatLevel === 'high' || p2.threatLevel === 'high' ? 1.5 : 1;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
            
            // Add data packet visualization occasionally
            if (Math.random() < 0.002) {
              const midX = (p1.x + p2.x) / 2;
              const midY = (p1.y + p2.y) / 2;
              ctx.fillStyle = `hsla(${connectionHue + 60}, 90%, 80%, 0.8)`;
              ctx.beginPath();
              ctx.arc(midX, midY, 2, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      });

      // Draw scanning lines occasionally
      if (Math.random() < 0.01) {
        const scanY = Math.random() * canvas.height;
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, scanY);
        ctx.lineTo(canvas.width, scanY);
        ctx.stroke();
      }

      // Update and draw particles
      particles.forEach((p, i) => {
        // Movement with slight gravitational clustering
        p.x += p.vx;
        p.y += p.vy;
        
        // Wrap around screen edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Pulsing effect for threat detection
        const pulseIntensity = p.threatLevel === 'high' ? 0.8 : (p.threatLevel === 'medium' ? 0.5 : 0.3);
        const pulse = pulseIntensity * (0.5 + 0.5 * Math.sin(time * 0.003 + p.pulsePhase));
        
        ctx.save();
        ctx.globalAlpha = p.opacity * (0.6 + 0.4 * pulse);
        
        drawShape(ctx, p.x, p.y, p.size, p.shape, p.threatLevel, time);
        
        // Add glow effect for high threats
        if (p.threatLevel === 'high') {
          ctx.shadowColor = 'rgba(255, 0, 0, 0.5)';
          ctx.shadowBlur = 10;
          drawShape(ctx, p.x, p.y, p.size * 0.8, p.shape, p.threatLevel, time);
        } else if (p.threatLevel === 'medium') {
          ctx.shadowColor = 'rgba(255, 150, 0, 0.3)';
          ctx.shadowBlur = 6;
          drawShape(ctx, p.x, p.y, p.size * 0.9, p.shape, p.threatLevel, time);
        }
        
        ctx.restore();
        
        // Randomly change threat level occasionally (dynamic threat assessment)
        if (Math.random() < 0.0001) {
          p.threatLevel = Math.random() < 0.05 ? 'high' : (Math.random() < 0.15 ? 'medium' : 'low');
        }
      });

      // Add occasional "data breach" flash effect
      if (Math.random() < 0.0005) {
        ctx.fillStyle = 'rgba(255, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      animationIdRef.current = requestAnimationFrame(animate);
    };

    handleResize(); // Call once initially to set up the canvas
    window.addEventListener('resize', debouncedResize); // Use the debounced version for the listener
    animationIdRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationIdRef.current);
      window.removeEventListener('resize', debouncedResize); // Clean up the debounced listener
    };
  }, [paused]); // The dependency is correct

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-85 z-10"
      style={{ background: 'transparent' }}
      aria-hidden="true"
    />
  );
};

export default CyberSecurityAnimation;