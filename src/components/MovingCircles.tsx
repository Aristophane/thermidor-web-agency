import React, { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

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
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || colors.length !== 5) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);
    const heightFactor = window.innerWidth < 768 ? 0.6 : 0.8;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.scale(dpr, dpr);

    circles.current = colors.map((color) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      dx: (Math.random() - 0.5) * 2,
      dy: (Math.random() - 0.5) * 2,
      radius: heightFactor * 150 + Math.random() * 80,
      color,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.filter = "blur(8px)";

      circles.current.forEach((circle) => {
        circle.x += circle.dx;
        circle.y += circle.dy;

        if (circle.x < 0 || circle.x > width) circle.dx *= -1;
        if (circle.y < 0 || circle.y > height) circle.dy *= -1;

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
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 0,
        width: "100%",
        height: "100%",
        opacity,
        pointerEvents: "none",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </motion.div>
  );
};

export default MovingCircles;
