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
          this.drawFlatNet(ctx);
        } else if (progress === 1) {
          this.drawFoldedCube(ctx);
        } else {
          this.drawOrigamiTransition(ctx, progress);
        }

        ctx.restore();
      }

      // Flat "net" of a cube: center square plus four flaps
      drawFlatNet(ctx) {
        const s = this.size;
        const h = s / 2;

        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(180, 180, 190, 0.35)";
        ctx.fillStyle = "rgba(110, 110, 120, 0.15)";

        // Center square
        ctx.beginPath();
        ctx.rect(-h, -h, s, s);
        ctx.fill();
        ctx.stroke();

        // Top flap
        ctx.fillStyle = "rgba(130, 130, 140, 0.12)";
        ctx.beginPath();
        ctx.rect(-h, -h - s, s, s);
        ctx.fill();
        ctx.stroke();

        // Bottom flap
        ctx.beginPath();
        ctx.rect(-h, h, s, s);
        ctx.fill();
        ctx.stroke();

        // Left flap
        ctx.beginPath();
        ctx.rect(-h - s, -h, s, s);
        ctx.fill();
        ctx.stroke();

        // Right flap
        ctx.beginPath();
        ctx.rect(h, -h, s, s);
        ctx.fill();
        ctx.stroke();
      }

      // Fully folded, simplified cube
      drawFoldedCube(ctx) {
        const s = this.size;
        const h = s / 2;
        const depth = s * 0.5;

        // Top
        ctx.fillStyle = "rgba(160, 160, 170, 0.20)";
        ctx.strokeStyle = "rgba(200, 200, 210, 0.4)";
        ctx.beginPath();
        ctx.moveTo(-h, -h - depth);
        ctx.lineTo(h, -h - depth);
        ctx.lineTo(h, -h);
        ctx.lineTo(-h, -h);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Front
        ctx.fillStyle = "rgba(120, 120, 130, 0.18)";
        ctx.strokeStyle = "rgba(180, 180, 190, 0.35)";
        ctx.beginPath();
        ctx.rect(-h, -h, s, s);
        ctx.fill();
        ctx.stroke();

        // Shadow base
        ctx.shadowBlur = 18;
        ctx.shadowColor = "rgba(200, 200, 220, 0.15)";
        ctx.strokeStyle = "rgba(200, 200, 220, 0.2)";
        ctx.beginPath();
        ctx.rect(-h - 2, -h - depth - 2, s + 4, s + depth + 4);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Origami-style hinged folding
      drawOrigamiTransition(ctx, progress) {
        const s = this.size;
        const h = s / 2;
        const angle = (Math.PI / 2) * this.easeInOutCubic(progress);

        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(190, 190, 200, 0.4)";

        // Draw center square (stays flat)
        ctx.fillStyle = "rgba(120, 120, 130, 0.18)";
        ctx.beginPath();
        ctx.rect(-h, -h, s, s);
        ctx.fill();
        ctx.stroke();

        // Helper to rotate a flap around its hinge
        const drawFlap = (hx, hy, wx, wy, orientation, baseShade) => {
          ctx.save();
          ctx.translate(hx, hy);

          let rot = angle;
          if (orientation === "bottom") rot = -angle;
          if (orientation === "left") rot = angle;
          if (orientation === "right") rot = -angle;

          ctx.rotate(rot);

          ctx.fillStyle = baseShade;
          ctx.beginPath();
          ctx.rect(0, -s, s, s);
          ctx.fill();
          ctx.stroke();

          ctx.restore();
        };

        // Top flap (folding up)
        drawFlap(-h, -h, 0, -s, "top", "rgba(160, 160, 175, 0.20)");

        // Bottom flap
        drawFlap(-h, h, 0, s, "bottom", "rgba(110, 110, 120, 0.16)");

        // Left flap
        ctx.save();
        ctx.translate(-h, -h);
        ctx.rotate(-angle);
        ctx.fillStyle = "rgba(135, 135, 145, 0.18)";
        ctx.beginPath();
        ctx.rect(-s, 0, s, s);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // Right flap
        ctx.save();
        ctx.translate(h, -h);
        ctx.rotate(angle);
        ctx.fillStyle = "rgba(105, 105, 115, 0.16)";
        ctx.beginPath();
        ctx.rect(0, 0, s, s);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // Slight glow on edges during folding
        ctx.shadowBlur = 12 * progress;
        ctx.shadowColor = `rgba(210, 210, 225, ${0.18 * progress})`;
        ctx.strokeStyle = `rgba(210, 210, 225, ${0.25 * progress})`;
        ctx.beginPath();
        ctx.rect(-h, -h, s, s);
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
