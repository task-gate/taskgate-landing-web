"use client";

import { useEffect, useRef, useState } from "react";

const VoxelGalaxyBackground = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const timeRef = useRef(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    
    // Animation parameters
    const ANIMATION_DURATION = 15000; // 15 seconds total loop
    const TRANSFORM_START = 5000; // Start transforming at 5s
    const TRANSFORM_DURATION = 5000; // Transform takes 5s
    const VOXEL_DURATION = 5000; // Stay as voxels for 5s

    // Planet data
    const planets = [
      { distance: 80, size: 8, speed: 0.8, color: "#8C7853", name: "Mercury" },
      { distance: 120, size: 12, speed: 0.6, color: "#FFC649", name: "Venus" },
      { distance: 160, size: 13, speed: 0.5, color: "#4A90E2", name: "Earth" },
      { distance: 200, size: 10, speed: 0.4, color: "#E74C3C", name: "Mars" },
      { distance: 280, size: 24, speed: 0.2, color: "#F39C12", name: "Jupiter" },
      { distance: 360, size: 22, speed: 0.15, color: "#E6C79C", name: "Saturn" },
      { distance: 440, size: 18, speed: 0.1, color: "#4FD0E7", name: "Uranus" },
      { distance: 520, size: 17, speed: 0.08, color: "#4166F5", name: "Neptune" },
    ];

    // Voxel class
    class Voxel {
      constructor(x, y, z, size, color, targetX, targetY, targetZ) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.size = size;
        this.color = color;
        this.targetX = targetX;
        this.targetY = targetY;
        this.targetZ = targetZ;
        this.originalX = x;
        this.originalY = y;
        this.originalZ = z;
        this.twinkle = Math.random();
      }

      update(progress) {
        // Smoothly interpolate position based on transform progress
        if (progress < 0) {
          // Solar system state
          this.x = this.originalX;
          this.y = this.originalY;
          this.z = this.originalZ;
        } else if (progress > 1) {
          // Full voxel state
          this.x = this.targetX;
          this.y = this.targetY;
          this.z = this.targetZ;
        } else {
          // Transitioning
          const eased = this.easeInOutCubic(progress);
          this.x = this.originalX + (this.targetX - this.originalX) * eased;
          this.y = this.originalY + (this.targetY - this.originalY) * eased;
          this.z = this.originalZ + (this.targetZ - this.originalZ) * eased;
        }
      }

      easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      }

      draw(ctx, centerX, centerY, opacity = 1) {
        // Simple isometric projection
        const isoX = centerX + (this.x - this.y) * 0.866;
        const isoY = centerY + (this.x + this.y) * 0.5 - this.z;

        // Calculate depth-based size and brightness
        const depthFactor = 1 - (this.z / 300) * 0.3;
        const drawSize = this.size * depthFactor;

        // Twinkle effect
        const twinkleValue = Math.sin(this.twinkle * Math.PI * 2) * 0.3 + 0.7;

        // Parse color and adjust brightness
        const r = parseInt(this.color.slice(1, 3), 16);
        const g = parseInt(this.color.slice(3, 5), 16);
        const b = parseInt(this.color.slice(5, 7), 16);

        ctx.save();
        ctx.globalAlpha = opacity * twinkleValue;

        // Draw voxel faces for 3D effect
        // Top face (lighter)
        ctx.fillStyle = `rgba(${Math.min(255, r + 40)}, ${Math.min(255, g + 40)}, ${Math.min(255, b + 40)}, ${opacity})`;
        ctx.beginPath();
        ctx.moveTo(isoX, isoY - drawSize * 0.5);
        ctx.lineTo(isoX + drawSize * 0.866, isoY - drawSize * 0.25);
        ctx.lineTo(isoX + drawSize * 0.866, isoY + drawSize * 0.25);
        ctx.lineTo(isoX, isoY + drawSize * 0.5);
        ctx.closePath();
        ctx.fill();

        // Left face
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
        ctx.beginPath();
        ctx.moveTo(isoX, isoY - drawSize * 0.5);
        ctx.lineTo(isoX, isoY + drawSize * 0.5);
        ctx.lineTo(isoX - drawSize * 0.866, isoY + drawSize * 0.25);
        ctx.lineTo(isoX - drawSize * 0.866, isoY - drawSize * 0.25);
        ctx.closePath();
        ctx.fill();

        // Right face (darker)
        ctx.fillStyle = `rgba(${Math.max(0, r - 40)}, ${Math.max(0, g - 40)}, ${Math.max(0, b - 40)}, ${opacity})`;
        ctx.beginPath();
        ctx.moveTo(isoX + drawSize * 0.866, isoY - drawSize * 0.25);
        ctx.lineTo(isoX + drawSize * 0.866, isoY + drawSize * 0.25);
        ctx.lineTo(isoX, isoY + drawSize * 0.5);
        ctx.lineTo(isoX, isoY - drawSize * 0.5);
        ctx.closePath();
        ctx.fill();

        // Soft glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        ctx.globalAlpha = opacity * 0.3 * twinkleValue;
        ctx.fillRect(isoX - drawSize, isoY - drawSize, drawSize * 2, drawSize * 2);

        ctx.restore();
      }
    }

    // Generate voxels for each planet and sun
    const allVoxels = [];

    // Sun voxels
    const sunVoxels = [];
    const sunVoxelSize = 4;
    const sunRadius = 35;
    for (let i = 0; i < 150; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * sunRadius;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      const z = (Math.random() - 0.5) * sunRadius * 0.5;

      // Voxel galaxy position (pulsating cluster)
      const targetAngle = Math.random() * Math.PI * 2;
      const targetDist = Math.random() * sunRadius * 1.5;
      const targetX = Math.cos(targetAngle) * targetDist;
      const targetY = Math.sin(targetAngle) * targetDist;
      const targetZ = (Math.random() - 0.5) * sunRadius;

      sunVoxels.push(new Voxel(x, y, z, sunVoxelSize, "#FF8C00", targetX, targetY, targetZ));
    }
    allVoxels.push({ type: "sun", voxels: sunVoxels });

    // Planet voxels
    planets.forEach((planet, planetIndex) => {
      const planetVoxels = [];
      const voxelSize = 3;
      const numVoxels = Math.floor(planet.size * 3);

      for (let i = 0; i < numVoxels; i++) {
        // Initial position (on planet surface)
        const phi = Math.random() * Math.PI * 2;
        const theta = Math.random() * Math.PI;
        const r = planet.size / 2;
        const x = r * Math.sin(theta) * Math.cos(phi);
        const y = r * Math.sin(theta) * Math.sin(phi);
        const z = r * Math.cos(theta);

        // Target position (scattered in galaxy)
        const targetPhi = Math.random() * Math.PI * 2;
        const targetTheta = Math.random() * Math.PI;
        const targetR = planet.distance * 0.8 + (Math.random() - 0.5) * planet.size * 2;
        const targetX = targetR * Math.sin(targetTheta) * Math.cos(targetPhi);
        const targetY = targetR * Math.sin(targetTheta) * Math.sin(targetPhi);
        const targetZ = (Math.random() - 0.5) * 100;

        planetVoxels.push(
          new Voxel(x, y, z, voxelSize, planet.color, targetX, targetY, targetZ)
        );
      }

      allVoxels.push({
        type: "planet",
        planet: planet,
        voxels: planetVoxels,
        initialAngle: planetIndex * 0.5,
      });
    });

    // Background stars (always present)
    const stars = [];
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random(),
        size: Math.random() * 2,
        brightness: Math.random(),
        twinkleSpeed: Math.random() * 0.002 + 0.001,
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

    const animate = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const centerX = width / 2;
      const centerY = height / 2;

      // Clear with dark background
      ctx.fillStyle = "#0a0a0f";
      ctx.fillRect(0, 0, width, height);

      // Update time
      const deltaTime = 16.67;
      timeRef.current = (timeRef.current + deltaTime) % ANIMATION_DURATION;
      const time = timeRef.current;

      // Calculate animation phase
      let transformProgress = 0;
      if (time >= TRANSFORM_START && time < TRANSFORM_START + TRANSFORM_DURATION) {
        transformProgress = (time - TRANSFORM_START) / TRANSFORM_DURATION;
      } else if (time >= TRANSFORM_START + TRANSFORM_DURATION) {
        transformProgress = 1;
      }

      // Draw background stars
      stars.forEach((star) => {
        const twinkle = Math.sin(time * star.twinkleSpeed + star.brightness * Math.PI * 2) * 0.5 + 0.5;
        ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness * twinkle * 0.6})`;
        ctx.beginPath();
        ctx.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw orbit lines (fade out during transformation)
      if (transformProgress < 0.5) {
        const orbitOpacity = 1 - transformProgress * 2;
        planets.forEach((planet) => {
          ctx.beginPath();
          ctx.arc(centerX, centerY, planet.distance, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * orbitOpacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        });
      }

      // Sort voxels by depth for proper rendering
      const allVoxelsFlat = [];
      
      allVoxels.forEach((group) => {
        if (group.type === "sun") {
          // Sun stays at center, just updates voxels
          group.voxels.forEach((voxel) => {
            voxel.update(transformProgress);
            voxel.twinkle = (voxel.twinkle + 0.02) % 1;
            allVoxelsFlat.push({ voxel, x: voxel.x, y: voxel.y, z: voxel.z });
          });
        } else if (group.type === "planet") {
          // Planets orbit in solar system mode
          const angle = group.initialAngle + time * 0.0001 * group.planet.speed;
          const orbitX = Math.cos(angle) * group.planet.distance;
          const orbitY = Math.sin(angle) * group.planet.distance;

          group.voxels.forEach((voxel) => {
            voxel.update(transformProgress);
            voxel.twinkle = (voxel.twinkle + 0.01) % 1;

            // In solar system mode, position relative to orbit
            // In voxel mode, position is absolute
            const worldX = transformProgress < 1 
              ? orbitX + voxel.x 
              : voxel.x;
            const worldY = transformProgress < 1 
              ? orbitY + voxel.y 
              : voxel.y;

            allVoxelsFlat.push({ 
              voxel, 
              x: worldX, 
              y: worldY, 
              z: voxel.z 
            });
          });
        }
      });

      // Sort by z-depth (painter's algorithm)
      allVoxelsFlat.sort((a, b) => a.z - b.z);

      // Draw all voxels
      allVoxelsFlat.forEach(({ voxel, x, y, z }) => {
        // Temporarily set world position for drawing
        const origX = voxel.x;
        const origY = voxel.y;
        voxel.x = x;
        voxel.y = y;
        voxel.draw(ctx, centerX, centerY, 1);
        voxel.x = origX;
        voxel.y = origY;
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

export default VoxelGalaxyBackground;
