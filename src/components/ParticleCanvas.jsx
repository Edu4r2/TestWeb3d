import React, { useEffect, useRef } from 'react';

export default function ParticleCanvas({ theme }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const section = canvas.parentElement; // Parent is #products

        let animationFrameId;
        let particlesArray = [];
        let particlesActive = false;
        let mouse = { x: null, y: null, radius: 150 };

        const resize = () => {
            canvas.width = section.offsetWidth;
            canvas.height = section.offsetHeight;
            createParticles();
        };

        const handleMouseMove = (e) => {
            const rect = section.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        };

        const handleMouseLeave = () => {
            mouse.x = null;
            mouse.y = null;
        };

        class Particle {
            constructor(x, y, dx, dy, size, color) {
                this.x = x; this.y = y; this.dx = dx; this.dy = dy;
                this.size = size; this.color = color;
                this.baseX = x; this.baseY = y;
                this.density = (Math.random() * 30) + 1;
            }
            draw() {
                ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color; ctx.fill();
            }
            update() {
                let dx = mouse.x - this.x; let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                let forceDirectionX = dx / distance; let forceDirectionY = dy / distance;
                let force = (mouse.radius - distance) / mouse.radius;
                if (distance < mouse.radius) {
                    this.x -= forceDirectionX * force * this.density;
                    this.y -= forceDirectionY * force * this.density;
                } else {
                    if (this.x !== this.baseX) { this.x -= (this.x - this.baseX) / 10; }
                    this.x += this.dx; this.y += this.dy;
                }
                if (this.x < 0 || this.x > canvas.width) this.dx = -this.dx;
                if (this.y < 0 || this.y > canvas.height) this.dy = -this.dy;
                this.draw();
            }
        }

        function createParticles() {
            particlesArray = [];
            let numberOfParticles = (canvas.width * canvas.height) / 9000;
            const particleColor = theme === 'light' ? 'rgba(80, 80, 80, 0.4)' : 'rgba(200, 200, 200, 0.5)';

            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 2) + 1;
                let x = Math.random() * canvas.width;
                let y = Math.random() * canvas.height;
                let dx = (Math.random() * 0.4) - 0.2;
                let dy = (Math.random() * 0.4) - 0.2;
                particlesArray.push(new Particle(x, y, dx, dy, size, particleColor));
            }
        }

        function animate() {
            animationFrameId = requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particlesArray.forEach(p => p.update());
        }
        resize();
        animate();
        window.addEventListener('resize', resize);
        section.addEventListener('mousemove', handleMouseMove);
        section.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('resize', resize);
            section.removeEventListener('mousemove', handleMouseMove);
            section.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, [theme]); // Re-run when theme changes to update color

    return <canvas id="particles-canvas" ref={canvasRef} />;
}
