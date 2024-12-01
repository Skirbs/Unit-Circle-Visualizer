import {useEffect, useRef} from "react";

export default function Background() {
  const canvasRef = useRef();
  useEffect(() => {
    const colors = ["#737373", "#525252", "#262626", "#171717"];
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Particle {
      constructor(x, y) {
        this.x = x ? x : Math.random() * window.innerWidth; // if the "x" have no value, get a randomized value
        this.y = y ? y : window.innerHeight + 20; // if the "y" have no value, get a randomized value
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      draw() {
        const radius = Math.min(Math.max(innerWidth * 0.005, 5), 35);
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
      }

      update() {
        this.y -= 3;
        this.draw();
      }
    }

    let particles = [];

    setInterval(() => {
      // Create new particle every 10 ms
      particles.push(new Particle());
    }, 10);

    window.addEventListener("resize", () => {
      particles = [];
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    });

    function init() {
      // Create N amount of particles at the start
      // with random position
      for (let i = 0; i < 200; i++) {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        particles.push(new Particle(x, y));
      }
    }

    function animate() {
      requestAnimationFrame(animate);

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (const particle of particles) {
        if (particle.y < 20) {
          // If its out of bounds
          particles = particles.filter((item) => item != particle);
          continue;
        }
        particle.update();
      }
    }
    init();
    animate();
  }, []);
  return <canvas ref={canvasRef} className="fixed pointer-events-none bg-gradient-to-t from-neutral-800 to-neutral-700 opacity-30" />;
  // return <canvas ref={canvasRef} className="fixed" />;
}
