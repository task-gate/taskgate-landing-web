"use client";

import { useEffect, useRef, useState } from "react";

const FoldingBlocksBackground = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // Animation timing
    const CYCLE_DURATION = 8000; // 8 seconds per full cycle
    const STAGGER_DELAY = 200; // Delay between each block starting

    class FoldingBlock {
      constructor(x, y, size, index) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.index = index;
        this.foldProgress = 0; // 0 = flat square, 1 = full cube
        this.delay = index * STAGGER_DELAY;
      }

      update(time) {
        // Calculate progress with delay
        const adjustedTime = (time - this.delay) % CYCLE_DURATION;

        if (adjustedTime < 0) {
          this.foldProgress = 0;
          return;
        }

        const FOLD_DURATION = 2000; // 2s to fold
        const HOLD_DURATION = 2000; // 2s hold as cube
        const UNFOLD_DURATION = 2000; // 2s to unfold
        const REST_DURATION = 2000; // 2s rest as square

        if (adjustedTime < FOLD_DURATION) {
          // Folding up
          this.foldProgress = this.easeInOutCubic(adjustedTime / FOLD_DURATION);
        } else if (adjustedTime < FOLD_DURATION + HOLD_DURATION) {
          // Hold as cube
          this.foldProgress = 1;
        } else if (
          adjustedTime <
          FOLD_DURATION + HOLD_DURATION + UNFOLD_DURATION
        ) {
          // Unfolding
          const unfoldTime = adjustedTime - FOLD_DURATION - HOLD_DURATION;
          this.foldProgress =
            1 - this.easeInOutCubic(unfoldTime / UNFOLD_DURATION);
        } else {
          // Rest as flat
          this.foldProgress = 0;
        }
      }

      easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      }

      draw(ctx, centerX, centerY) {
        ctx.save();
        ctx.translate(centerX + this.x, centerY + this.y);

        const progress = this.foldProgress;

        if (progress === 0) {
          // Flat square
          this.drawFlatSquare(ctx);
        } else if (progress === 1) {
          // Full cube
          this.drawCube(ctx);
        } else {
          // Transitioning - origami fold effect
          this.drawFoldingTransition(ctx, progress);
        }

        ctx.restore();
      }

      drawFlatSquare(ctx) {
        const halfSize = this.size / 2;

        // Main square with subtle gradient
        const gradient = ctx.createLinearGradient(
          -halfSize,
          -halfSize,
          halfSize,
          halfSize
        );
        gradient.addColorStop(0, "rgba(100, 100, 110, 0.15)");
        gradient.addColorStop(1, "rgba(80, 80, 90, 0.1)");

        ctx.fillStyle = gradient;
        ctx.strokeStyle = "rgba(150, 150, 160, 0.3)";
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.rect(-halfSize, -halfSize, this.size, this.size);
        ctx.fill();
        ctx.stroke();

        // Subtle inner glow
        ctx.strokeStyle = "rgba(200, 200, 220, 0.2)";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.rect(-halfSize + 2, -halfSize + 2, this.size - 4, this.size - 4);
        ctx.stroke();
      }

      drawCube(ctx) {
        const halfSize = this.size / 2;
        const depth = this.size * 0.5;

        // Isometric cube - three visible faces

        // Top face (lightest)
        ctx.fillStyle = "rgba(140, 140, 150, 0.25)";
        ctx.strokeStyle = "rgba(180, 180, 190, 0.4)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, -halfSize - depth * 0.5);
        ctx.lineTo(halfSize, -halfSize - depth * 0.25);
        ctx.lineTo(halfSize, halfSize - depth * 0.25);
        ctx.lineTo(0, halfSize);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Left face (medium)
        ctx.fillStyle = "rgba(100, 100, 110, 0.2)";
        ctx.strokeStyle = "rgba(150, 150, 160, 0.35)";
        ctx.beginPath();
        ctx.moveTo(0, -halfSize - depth * 0.5);
        ctx.lineTo(0, halfSize);
        ctx.lineTo(-halfSize, halfSize - depth * 0.25);
        ctx.lineTo(-halfSize, -halfSize - depth * 0.25);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Right face (darkest)
        ctx.fillStyle = "rgba(70, 70, 80, 0.15)";
        ctx.strokeStyle = "rgba(120, 120, 130, 0.3)";
        ctx.beginPath();
        ctx.moveTo(halfSize, -halfSize - depth * 0.25);
        ctx.lineTo(halfSize, halfSize - depth * 0.25);
        ctx.lineTo(0, halfSize);
        ctx.lineTo(0, -halfSize - depth * 0.5);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Soft glow around cube
        ctx.shadowBlur = 20;
        ctx.shadowColor = "rgba(200, 200, 220, 0.1)";
        ctx.strokeStyle = "rgba(200, 200, 220, 0.15)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -halfSize - depth * 0.5);
        ctx.lineTo(halfSize, -halfSize - depth * 0.25);
        ctx.lineTo(halfSize, halfSize - depth * 0.25);
        ctx.lineTo(0, halfSize);
        ctx.lineTo(-halfSize, halfSize - depth * 0.25);
        ctx.lineTo(-halfSize, -halfSize - depth * 0.25);
        ctx.closePath();
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      drawFoldingTransition(ctx, progress) {
        const halfSize = this.size / 2;
        const depth = this.size * 0.5;
        const foldAngle = (progress * Math.PI) / 2; // 0 to 90 degrees

        // Calculate 3D rotation effect
        const liftHeight = Math.sin(foldAngle) * depth;
        const compression = Math.cos(foldAngle);

        // Draw base (bottom square, gradually compressed)
        ctx.fillStyle = `rgba(90, 90, 100, ${0.12 + progress * 0.03})`;
        ctx.strokeStyle = `rgba(140, 140, 150, ${0.25 + progress * 0.1})`;
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(-halfSize, halfSize * compression);
        ctx.lineTo(halfSize, halfSize * compression);
        ctx.lineTo(halfSize, -halfSize * compression);
        ctx.lineTo(-halfSize, -halfSize * compression);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Draw folding sides (origami effect)
        // Left flap
        ctx.fillStyle = `rgba(110, 110, 120, ${0.15 + progress * 0.05})`;
        ctx.strokeStyle = `rgba(150, 150, 160, ${0.3 + progress * 0.05})`;
        ctx.beginPath();
        ctx.moveTo(-halfSize, -halfSize * compression);
        ctx.lineTo(-halfSize, halfSize * compression);
        ctx.lineTo(
          -halfSize * (1 - progress * 0.5),
          halfSize * compression - liftHeight * 0.3
        );
        ctx.lineTo(
          -halfSize * (1 - progress * 0.5),
          -halfSize * compression - liftHeight * 0.3
        );
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Right flap
        ctx.fillStyle = `rgba(80, 80, 90, ${0.12 + progress * 0.03})`;
        ctx.strokeStyle = `rgba(130, 130, 140, ${0.28 + progress * 0.05})`;
        ctx.beginPath();
        ctx.moveTo(halfSize, -halfSize * compression);
        ctx.lineTo(halfSize, halfSize * compression);
        ctx.lineTo(
          halfSize * (1 - progress * 0.5),
          halfSize * compression - liftHeight * 0.3
        );
        ctx.lineTo(
          halfSize * (1 - progress * 0.5),
          -halfSize * compression - liftHeight * 0.3
        );
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Top forming face
        ctx.fillStyle = `rgba(130, 130, 140, ${0.2 * progress})`;
        ctx.strokeStyle = `rgba(170, 170, 180, ${0.35 * progress})`;
        ctx.beginPath();
        ctx.moveTo(
          -halfSize * (1 - progress * 0.5),
          -halfSize * compression - liftHeight * 0.3
        );
        ctx.lineTo(
          halfSize * (1 - progress * 0.5),
          -halfSize * compression - liftHeight * 0.3
        );
        ctx.lineTo(
          halfSize * (1 - progress * 0.5),
          halfSize * compression - liftHeight * 0.3
        );
        ctx.lineTo(
          -halfSize * (1 - progress * 0.5),
          halfSize * compression - liftHeight * 0.3
        );
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Subtle glow during transformation
        ctx.shadowBlur = 15 * progress;
        ctx.shadowColor = `rgba(200, 200, 220, ${0.15 * progress})`;
        ctx.strokeStyle = `rgba(200, 200, 220, ${0.2 * progress})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-halfSize, -halfSize * compression);
        ctx.lineTo(-halfSize, halfSize * compression);
        ctx.moveTo(halfSize, -halfSize * compression);
        ctx.lineTo(halfSize, halfSize * compression);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    }

    // Create grid of blocks
    const blocks = [];
    const blockSize = 60;
    const spacing = 120;
    const gridCols = 8;
    const gridRows = 6;

    let index = 0;
    for (let row = 0; row < gridRows; row++) {
      for (let col = 0; col < gridCols; col++) {
        // Offset even rows for more interesting pattern
        const offsetX = row % 2 === 0 ? 0 : spacing / 2;
        const x = (col - gridCols / 2) * spacing + offsetX;
        const y = (row - gridRows / 2) * spacing;
        blocks.push(new FoldingBlock(x, y, blockSize, index));
        index++;
      }
    }

    // Floating particles for subtle background movement
    const particles = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random(),
        y: Math.random(),
        size: Math.random() * 2 + 0.5,
        speedY: Math.random() * 0.0001 + 0.00005,
        opacity: Math.random() * 0.3 + 0.1,
      });
    }

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      ctx.scale(dpr, dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
    };

    resize();
    window.addEventListener("resize", resize);

    let startTime = Date.now();

    const animate = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const centerX = width / 2;
      const centerY = height / 2;

      const currentTime = Date.now() - startTime;

      // Clear with dark monotone background
      ctx.fillStyle = "#0f0f12";
      ctx.fillRect(0, 0, width, height);

      // Draw subtle gradient overlay
      const bgGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        Math.max(width, height)
      );
      bgGradient.addColorStop(0, "rgba(20, 20, 25, 0)");
      bgGradient.addColorStop(1, "rgba(5, 5, 8, 0.5)");
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // Draw floating particles
      particles.forEach((particle) => {
        particle.y = (particle.y + particle.speedY) % 1;

        ctx.fillStyle = `rgba(180, 180, 200, ${particle.opacity})`;
        ctx.beginPath();
        ctx.arc(
          particle.x * width,
          particle.y * height,
          particle.size,
          0,
          Math.PI * 2
        );
        ctx.fill();
      });

      // Update and draw all blocks
      blocks.forEach((block) => {
        block.update(currentTime);
        block.draw(ctx, centerX, centerY);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isClient]);

  if (!isClient) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 1, zIndex: 0 }}
    />
  );
};

export default FoldingBlocksBackground;
