"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const SlidingPuzzleWallBackground = () => {
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

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#050507");
    scene.fog = new THREE.FogExp2("#050507", 0.018);

    // Camera - angled view to show depth and 3D feel
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 300);
    // Position camera at an angle: looking at the wall from upper-right
    camera.position.set(25, 18, 55);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Lighting
    const ambient = new THREE.AmbientLight(0x9099b0, 0.6);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xdde2f5, 0.9);
    keyLight.position.set(10, 20, 30);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x8090b0, 0.4);
    fillLight.position.set(-15, -10, 20);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x6070a0, 0.3);
    rimLight.position.set(0, 0, -20);
    scene.add(rimLight);

    // Wall configuration - larger grid to fill screen from angled view
    const COLS = 20;
    const ROWS = 14;
    const CUBE_SIZE = 3.0;
    const GAP = 0.12;
    const UNIT = CUBE_SIZE + GAP;

    // Number of empty spaces
    const NUM_EMPTY = 8;

    // Materials with subtle color variations
    const baseMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.2,
      roughness: 0.45,
      emissive: 0x080810,
      emissiveIntensity: 0.15,
    });

    const cubeGeom = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);

    // Create grid data structure
    // grid[row][col] = { cube: Mesh | null, isEmpty: boolean }
    const grid = [];
    const allCubes = [];

    // Calculate offsets to center the wall
    const offsetX = -((COLS - 1) * UNIT) / 2;
    const offsetY = -((ROWS - 1) * UNIT) / 2;

    // Initialize grid with cubes
    for (let row = 0; row < ROWS; row++) {
      grid[row] = [];
      for (let col = 0; col < COLS; col++) {
        const mat = baseMaterial.clone();
        // Subtle color variation
        const tint = 0.88 + Math.random() * 0.12;
        mat.color.setRGB(tint, tint, tint * 1.02);

        const cube = new THREE.Mesh(cubeGeom, mat);
        const x = offsetX + col * UNIT;
        const y = offsetY + row * UNIT;
        const z = 0;

        cube.position.set(x, y, z);
        cube.userData = {
          gridRow: row,
          gridCol: col,
          basePos: new THREE.Vector3(x, y, z),
        };

        scene.add(cube);
        allCubes.push(cube);

        grid[row][col] = {
          cube: cube,
          isEmpty: false,
        };
      }
    }

    // Create empty spaces by removing random cubes
    const emptyPositions = [];
    const usedPositions = new Set();

    while (emptyPositions.length < NUM_EMPTY) {
      const row = Math.floor(Math.random() * ROWS);
      const col = Math.floor(Math.random() * COLS);
      const key = `${row},${col}`;

      if (!usedPositions.has(key)) {
        usedPositions.add(key);

        // Remove the cube
        const cell = grid[row][col];
        if (cell.cube) {
          scene.remove(cell.cube);
          const idx = allCubes.indexOf(cell.cube);
          if (idx > -1) allCubes.splice(idx, 1);
          cell.cube = null;
        }
        cell.isEmpty = true;
        emptyPositions.push({ row, col });
      }
    }

    // Animation state for sliding
    const activeSlides = []; // Array of { cube, fromPos, toPos, startTime, duration, fromCell, toCell }
    const SLIDE_DURATION = 400; // ms
    const SLIDE_INTERVAL = 200; // ms between starting new slides

    let lastSlideTime = 0;
    const clock = new THREE.Clock();

    // Find neighbors of an empty cell
    const getNeighbors = (row, col) => {
      const neighbors = [];
      const directions = [
        { dr: -1, dc: 0 }, // up
        { dr: 1, dc: 0 },  // down
        { dr: 0, dc: -1 }, // left
        { dr: 0, dc: 1 },  // right
      ];

      for (const { dr, dc } of directions) {
        const nr = row + dr;
        const nc = col + dc;
        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
          const cell = grid[nr][nc];
          if (cell.cube && !cell.isEmpty) {
            neighbors.push({ row: nr, col: nc, cube: cell.cube });
          }
        }
      }
      return neighbors;
    };

    // Check if a cube is currently sliding
    const isSliding = (cube) => {
      return activeSlides.some((slide) => slide.cube === cube);
    };

    // Start a new slide
    const startNewSlide = (nowMs) => {
      // Find an empty cell that can accept a slide
      const availableEmpties = emptyPositions.filter((empty) => {
        // Check this empty isn't being filled by an active slide
        const beingFilled = activeSlides.some(
          (slide) => slide.toCell.row === empty.row && slide.toCell.col === empty.col
        );
        if (beingFilled) return false;

        // Check it has at least one non-sliding neighbor
        const neighbors = getNeighbors(empty.row, empty.col);
        return neighbors.some((n) => !isSliding(n.cube));
      });

      if (availableEmpties.length === 0) return;

      // Pick a random empty
      const empty = availableEmpties[Math.floor(Math.random() * availableEmpties.length)];

      // Get non-sliding neighbors
      const neighbors = getNeighbors(empty.row, empty.col).filter((n) => !isSliding(n.cube));
      if (neighbors.length === 0) return;

      // Pick a random neighbor to slide
      const neighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
      const cube = neighbor.cube;

      // Calculate positions
      const fromPos = cube.position.clone();
      const toX = offsetX + empty.col * UNIT;
      const toY = offsetY + empty.row * UNIT;
      const toPos = new THREE.Vector3(toX, toY, 0);

      // Start the slide
      activeSlides.push({
        cube,
        fromPos,
        toPos,
        startTime: nowMs,
        duration: SLIDE_DURATION,
        fromCell: { row: neighbor.row, col: neighbor.col },
        toCell: { row: empty.row, col: empty.col },
      });
    };

    // Easing
    const easeInOutCubic = (t) => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

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

      // Start new slides periodically
      if (nowMs - lastSlideTime > SLIDE_INTERVAL) {
        // Try to start multiple slides for a more dynamic feel
        const slidesToStart = Math.min(3, NUM_EMPTY - activeSlides.length);
        for (let i = 0; i < slidesToStart; i++) {
          startNewSlide(nowMs);
        }
        lastSlideTime = nowMs;
      }

      // Update active slides
      for (let i = activeSlides.length - 1; i >= 0; i--) {
        const slide = activeSlides[i];
        const t = (nowMs - slide.startTime) / slide.duration;

        if (t >= 1) {
          // Slide complete
          slide.cube.position.copy(slide.toPos);

          // Update grid
          grid[slide.fromCell.row][slide.fromCell.col].cube = null;
          grid[slide.fromCell.row][slide.fromCell.col].isEmpty = true;
          grid[slide.toCell.row][slide.toCell.col].cube = slide.cube;
          grid[slide.toCell.row][slide.toCell.col].isEmpty = false;

          // Update empty positions
          const emptyIdx = emptyPositions.findIndex(
            (e) => e.row === slide.toCell.row && e.col === slide.toCell.col
          );
          if (emptyIdx > -1) {
            emptyPositions[emptyIdx] = { row: slide.fromCell.row, col: slide.fromCell.col };
          }

          // Update cube userData
          slide.cube.userData.gridRow = slide.toCell.row;
          slide.cube.userData.gridCol = slide.toCell.col;
          slide.cube.userData.basePos = slide.toPos.clone();

          // Remove from active slides
          activeSlides.splice(i, 1);
        } else {
          // Animate position
          const easedT = easeInOutCubic(t);
          slide.cube.position.lerpVectors(slide.fromPos, slide.toPos, easedT);

          // Subtle depth pop during slide
          const depthPop = Math.sin(t * Math.PI) * 0.3;
          slide.cube.position.z = depthPop;
        }
      }

      // Very subtle camera movement for depth feel
      const baseCamX = 25;
      const baseCamY = 18;
      const baseCamZ = 55;
      camera.position.x = baseCamX + 3 * Math.sin(elapsed * 0.1);
      camera.position.y = baseCamY + 2 * Math.sin(elapsed * 0.08 + 0.5);
      camera.position.z = baseCamZ + 2 * Math.sin(elapsed * 0.06);
      camera.lookAt(0, 0, 0);

      // Subtle wall breathing - all cubes micro-move
      for (const cube of allCubes) {
        if (!isSliding(cube)) {
          const basePos = cube.userData.basePos;
          const noise = elapsed * 0.8 + cube.userData.gridRow * 0.3 + cube.userData.gridCol * 0.2;
          cube.position.z = 0.08 * Math.sin(noise);
        }
      }

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

export default SlidingPuzzleWallBackground;
