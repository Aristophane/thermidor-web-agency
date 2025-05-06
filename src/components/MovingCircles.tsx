import React, { useEffect, useRef } from "react";

type MovingCirclesProps = {
  colors: string[]; // 5 couleurs attendues
};

type Circle = {
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
  color: string;
};

const MovingCircles: React.FC<MovingCirclesProps> = ({ colors }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const circles = useRef<Circle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || colors.length !== 5) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);
    const heightFactor = window.innerWidth < 768 ? 0.8 : 1;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.scale(dpr, dpr);

    // Crée 5 cercles avec couleurs et vitesse aléatoire
    circles.current = colors.map((color) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      dx: (Math.random() - 0.5) * 1,
      dy: (Math.random() - 0.5) * 1,
      radius: heightFactor * 150 + Math.random() * 150,
      color,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Appliquer un effet de flou léger
      ctx.save();
      ctx.filter = "blur(8px)";

      circles.current.forEach((circle) => {
        // Mouvement
        circle.x += circle.dx;
        circle.y += circle.dy;

        // Rebonds sur les bords
        if (circle.x < 0 || circle.x > width) circle.dx *= -1;
        if (circle.y < 0 || circle.y > height) circle.dy *= -1;

        // Dessin
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.fillStyle = circle.color;
        ctx.fill();
      });

      ctx.restore();
      requestAnimationFrame(animate);
    };

    animate();
  }, [colors]);

  return (
    <>
      <div className="canvasContainer">
        <canvas
          ref={canvasRef}
          style={{
            width: "100%",
            height: "100%",
            position: "fixed",
            top: "0",
            zIndex: "0",
          }}
        />
      </div>
    </>
  );
};

export default MovingCircles;
