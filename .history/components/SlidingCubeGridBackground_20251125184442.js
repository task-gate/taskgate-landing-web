"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const SlidingCubeGridBackground = () => {
  const mountRef = useRef(null);
  const animationRef = useRef(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const mount = mountRef.current;
    if (!mount) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#050507");
    scene.fog = new THREE.FogExp2("#050507", 0.09);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    const cameraBaseRadius = 11;
    const cameraBaseHeight = 5.5;
    camera.position.set(6, 6, 10);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Lighting
    const ambient = new THREE.AmbientLight(0xb0b3c0, 0.7);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xdde2f5, 0.9);
    dirLight.position.set(4, 8, 6);
    scene.add(dirLight);

    const backLight = new THREE.DirectionalLight(0x8084a0, 0.4);
    backLight.position.set(-4, -6, -5);
    scene.add(backLight);

    // Cube grid (3x3x3 with one empty)
    const GRID_SIZE = 3;
    const SPACING = 1.1;

    const cubeGroup = new THREE.Group();
    scene.add(cubeGroup);

    const grid = [];
    for (let x = 0; x < GRID_SIZE; x++) {
      grid[x] = [];
      for (let y = 0; y < GRID_SIZE; y++) {
        grid[x][y] = new Array(GRID_SIZE).fill(null);
      }
    }

    // Logical positions in -1,0,1 for centering
    const logicalCoords = [-1, 0, 1];

    const baseMaterial = new THREE.MeshStandardMaterial({
      color: 0xcfd3e4,
      metalness: 0.35,
      roughness: 0.22,
      emissive: 0x101013,
      emissiveIntensity: 0.3,
    });

    const geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);

    // Choose one empty position (center)
    let emptyPos = { x: 1, y: 1, z: 1 };

    for (let xi = 0; xi < GRID_SIZE; xi++) {
      for (let yi = 0; yi < GRID_SIZE; yi++) {
        for (let zi = 0; zi < GRID_SIZE; zi++) {
          if (xi === emptyPos.x && yi === emptyPos.y && zi === emptyPos.z) {
            grid[xi][yi][zi] = null;
            continue;
          }

          const cube = new THREE.Mesh(geometry, baseMaterial.clone());
          const lx = logicalCoords[xi];
          const ly = logicalCoords[yi];
          const lz = logicalCoords[zi];

          cube.position.set(lx * SPACING, ly * SPACING, lz * SPACING);

          // Slight per-cube tint
          const tint = 0.9 + Math.random() * 0.1;
          cube.material.color.multiplyScalar(tint);

          cube.userData.logical = { x: xi, y: yi, z: zi };

          cubeGroup.add(cube);
          grid[xi][yi][zi] = cube;
        }
      }
    }

    // Animation state
    let currentSlide = null; // { cube, from, to, startTime, duration, fromLogical, toLogical }
    const SLIDE_DURATION = 550; // ms
    const STEP_INTERVAL = 900; // ms between starting new slides
    let lastStepTime = 0;

    const clock = new THREE.Clock();

    const chooseNextSlide = (nowMs) => {
      // Compute neighbors to emptyPos (sharing a face)
      const neighbors = [];
      const directions = [
        { dx: 1, dy: 0, dz: 0 },
        { dx: -1, dy: 0, dz: 0 },
        { dx: 0, dy: 1, dz: 0 },
        { dx: 0, dy: -1, dz: 0 },
        { dx: 0, dy: 0, dz: 1 },
        { dx: 0, dy: 0, dz: -1 },
      ];

      directions.forEach(({ dx, dy, dz }) => {
        const nx = emptyPos.x + dx;
        const ny = emptyPos.y + dy;
        const nz = emptyPos.z + dz;
        if (
          nx >= 0 &&
          nx < GRID_SIZE &&
          ny >= 0 &&
          ny < GRID_SIZE &&
          nz >= 0 &&
          nz < GRID_SIZE
        ) {
          const neighborCube = grid[nx][ny][nz];
          if (neighborCube) {
            neighbors.push({ x: nx, y: ny, z: nz, cube: neighborCube });
          }
        }
      });

      if (!neighbors.length) return;

      // Pick random neighbor
      const choice = neighbors[Math.floor(Math.random() * neighbors.length)];

      const fromPos = choice.cube.position.clone();
      const targetLogical = { x: emptyPos.x, y: emptyPos.y, z: emptyPos.z };
      const tx = logicalCoords[targetLogical.x] * SPACING;
      const ty = logicalCoords[targetLogical.y] * SPACING;
      const tz = logicalCoords[targetLogical.z] * SPACING;
      const toPos = new THREE.Vector3(tx, ty, tz);

      currentSlide = {
        cube: choice.cube,
        from: fromPos,
        to: toPos,
        startTime: nowMs,
        duration: SLIDE_DURATION,
        fromLogical: { x: choice.x, y: choice.y, z: choice.z },
        toLogical: targetLogical,
      };
    };

    const easeInOut = (t) =>
      t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", onResize);

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      const nowMs = elapsed * 1000;

      // Start new slide if idle and enough time passed
      if (!currentSlide && nowMs - lastStepTime > STEP_INTERVAL) {
        chooseNextSlide(nowMs);
        lastStepTime = nowMs;
      }

      // Update current slide
      if (currentSlide) {
        const t = (nowMs - currentSlide.startTime) / currentSlide.duration;
        if (t >= 1) {
          // Finish slide
          currentSlide.cube.position.copy(currentSlide.to);

          // Update grid logical positions
          grid[currentSlide.toLogical.x][currentSlide.toLogical.y][
            currentSlide.toLogical.z
          ] = currentSlide.cube;
          grid[currentSlide.fromLogical.x][currentSlide.fromLogical.y][
            currentSlide.fromLogical.z
          ] = null;

          emptyPos = { ...currentSlide.fromLogical };
          currentSlide.cube.userData.logical = { ...currentSlide.toLogical };

          currentSlide = null;
        } else {
          const easedT = easeInOut(Math.max(0, Math.min(1, t)));
          currentSlide.cube.position.lerpVectors(
            currentSlide.from,
            currentSlide.to,
            easedT
          );
        }
      }

      // Very slow cube rotation for calm parallax
      cubeGroup.rotation.y = 0.18 * Math.sin(elapsed * 0.08);
      cubeGroup.rotation.x = 0.12 * Math.sin(elapsed * 0.06) - 0.2;

      // Add subtle camera orbit around the cube cluster
      const orbitSpeed = 0.12; // smaller = slower orbit
      const orbitAngle = elapsed * orbitSpeed;
      const radialJitter = 0.4 * Math.sin(elapsed * 0.18);
      const heightJitter = 0.4 * Math.sin(elapsed * 0.11 + 1.3);

      const radius = cameraBaseRadius + radialJitter;
      const height = cameraBaseHeight + heightJitter;

      camera.position.x = Math.cos(orbitAngle) * radius;
      camera.position.z = Math.sin(orbitAngle) * radius;
      camera.position.y = height;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [isClient]);

  if (!isClient) return null;

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

export default SlidingCubeGridBackground;
