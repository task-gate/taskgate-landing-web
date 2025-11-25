"use client";

import { useEffect, useRef, useState } from "react";

const SolarSystemBackground = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const timeRef = useRef(0);
  const imagesRef = useRef({});
  const imagesLoadedRef = useRef(false);
  const [isClient, setIsClient] = useState(false);

  console.log("SolarSystemBackground component rendering, isClient:", isClient);

  useEffect(() => {
    console.log("First useEffect running - setting isClient to true");
    setIsClient(true);
  }, []);

  useEffect(() => {
    console.log("Second useEffect running - isClient:", isClient);
    if (!isClient) return;

    const canvas = canvasRef.current;
    if (!canvas) {
      console.log("Canvas ref is null!");
      return;
    }

    console.log("Initializing solar system, canvas:", canvas);
    const ctx = canvas.getContext("2d");
    const scale = 1.3;
    const coreSize = 40.0 * scale;

    // Planet sizes (increased for better visibility)
    const orbSizes = [12, 16, 16, 14, 28, 26, 22, 20].map((s) => s * scale);

    // Calculate orbit radii with tighter spacing
    const baseRadius = 35.0;
    const minGap = 12.0;
    const gap = minGap * scale;
    const orbitRadii = [];
    for (let i = 0; i < orbSizes.length; i++) {
      if (i === 0) {
        orbitRadii.push(baseRadius * scale);
      } else {
        const prev = i - 1;
        const nextRadius =
          orbitRadii[prev] + (orbSizes[prev] + orbSizes[i]) / 2.0 + gap;
        orbitRadii.push(nextRadius);
      }
    }

    // Realistic orbital speeds (relative to Earth's 1.0)
    // Based on actual planetary orbital periods
    const orbitSpeeds = [
      4.15, // Mercury (87.97 days)
      1.625, // Venus (224.7 days)
      1.0, // Earth (365.26 days)
      0.531, // Mars (687 days)
      0.0843, // Jupiter (11.86 years)
      0.0339, // Saturn (29.46 years)
      0.0119, // Uranus (84.01 years)
      0.006, // Neptune (164.79 years)
    ];

    // Planet image paths
    const planetImages = [
      "/mercury.png",
      "/venus.png",
      "/earth.png",
      "/mars.png",
      "/jupiter.png",
      "/saturn.png",
      "/uranus.png",
      "/neptune.png",
    ];

    // Planet colors for glow effects
    const planetColors = [
      "#8C7853", // Mercury
      "#FFC649", // Venus
      "#4A90E2", // Earth
      "#E74C3C", // Mars
      "#F39C12", // Jupiter
      "#E6C79C", // Saturn
      "#4FD0E7", // Uranus
      "#4166F5", // Neptune
    ];

    // Load images
    const loadImages = () => {
      const images = { sun: new Image() };
      images.sun.src = "/sun.png";

      planetImages.forEach((src, i) => {
        images[`planet${i}`] = new Image();
        images[`planet${i}`].src = src;
      });

      // Wait for all images to load
      let loadedCount = 0;
      const totalImages = Object.keys(images).length;

      Object.values(images).forEach((img) => {
        img.onload = () => {
          loadedCount++;
          if (loadedCount === totalImages) {
            imagesLoadedRef.current = true;
          }
        };
        img.onerror = () => {
          loadedCount++;
          if (loadedCount === totalImages) {
            imagesLoadedRef.current = true;
          }
        };
      });

      imagesRef.current = images;
    };

    loadImages();

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

    const animate = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Expand orbit radii to fit within viewport
      const viewportWidth = width;
      const refIndex = orbitRadii.length > 3 ? 3 : orbitRadii.length - 1;
      const currentRef = orbitRadii[refIndex];
      const lastOriginal = orbitRadii[orbitRadii.length - 1];
      const desiredRefReach = viewportWidth * 0.35;
      const desiredLastReach = viewportWidth * 0.45;
      const sA = currentRef > 0 ? desiredRefReach / currentRef : 1.0;
      const sB = lastOriginal > 0 ? desiredLastReach / lastOriginal : 1.0;
      const orbitStretch = Math.max(Math.max(sA, sB), 1.0, 2.0);

      const stretchedRadii = orbitRadii.map((r) => r * orbitStretch);

      const centerX = width / 2;
      const centerY = height / 2;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Time-based animation
      timeRef.current += 16.67; // ~60fps
      const time = timeRef.current;
      const baseAngle = time * 0.00006; // Increased from 0.00003 for faster orbit
      const pulseValue = Math.sin(time * 0.0015) * 0.5 + 0.5;
      const corePulseSize = coreSize + pulseValue * 8 * scale;
      const orbitSpeedBoost = 1.0; // Increased from 0.5 for faster movement

      // Draw orbit rings
      stretchedRadii.forEach((radius) => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, 0.1)`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });

      // Draw sun with glow
      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        corePulseSize * 2
      );
      gradient.addColorStop(0, "rgba(255, 165, 0, 0.8)");
      gradient.addColorStop(0.3, "rgba(255, 200, 0, 0.6)");
      gradient.addColorStop(0.6, "rgba(255, 165, 0, 0.3)");
      gradient.addColorStop(1, "rgba(255, 165, 0, 0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, corePulseSize * 2, 0, Math.PI * 2);
      ctx.fill();

      // Draw sun with image if loaded
      if (
        imagesLoadedRef.current &&
        imagesRef.current.sun?.complete &&
        imagesRef.current.sun?.naturalWidth > 0
      ) {
        ctx.save();
        ctx.shadowBlur = 50 * scale;
        ctx.shadowColor = "rgba(255, 165, 0, 0.8)";
        ctx.beginPath();
        ctx.arc(centerX, centerY, corePulseSize / 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(
          imagesRef.current.sun,
          centerX - corePulseSize / 2,
          centerY - corePulseSize / 2,
          corePulseSize,
          corePulseSize
        );
        ctx.restore();
      } else {
        // Fallback sun rendering
        ctx.fillStyle = "#FFA500";
        ctx.shadowBlur = 30 * scale;
        ctx.shadowColor = "rgba(255, 165, 0, 0.8)";
        ctx.beginPath();
        ctx.arc(centerX, centerY, corePulseSize / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Draw planets
      stretchedRadii.forEach((radius, i) => {
        const angle = baseAngle * orbitSpeeds[i] * orbitSpeedBoost + i * 1.5;
        const px = centerX + radius * Math.cos(angle);
        const py = centerY + radius * Math.sin(angle);
        const planetScale = 1.0 + Math.sin(time * 0.004 + i) * 0.08;
        const size = (orbSizes[i] * planetScale) / 2;

        // Planet glow
        const glowGradient = ctx.createRadialGradient(
          px,
          py,
          0,
          px,
          py,
          size * 2
        );
        glowGradient.addColorStop(0, planetColors[i] + "80");
        glowGradient.addColorStop(0.5, planetColors[i] + "40");
        glowGradient.addColorStop(1, planetColors[i] + "00");

        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(px, py, size * 2, 0, Math.PI * 2);
        ctx.fill();

        // Draw planet with image if loaded
        const planetImg = imagesRef.current[`planet${i}`];
        if (
          imagesLoadedRef.current &&
          planetImg?.complete &&
          planetImg?.naturalWidth > 0
        ) {
          ctx.save();
          ctx.shadowBlur = i === 4 || i === 5 ? 16 : 12;
          ctx.shadowColor = planetColors[i];
          ctx.beginPath();
          ctx.arc(px, py, size, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(planetImg, px - size, py - size, size * 2, size * 2);
          ctx.restore();
        } else {
          // Fallback planet rendering
          ctx.fillStyle = planetColors[i];
          ctx.shadowBlur = i === 4 || i === 5 ? 16 : 12;
          ctx.shadowColor = planetColors[i];
          ctx.beginPath();
          ctx.arc(px, py, size, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
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

  if (!isClient) {
    console.log("Returning null - isClient is false");
    return null;
  }

  console.log("Rendering canvas element");
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 1, zIndex: 0 }}
    />
  );
};

export default SolarSystemBackground;
