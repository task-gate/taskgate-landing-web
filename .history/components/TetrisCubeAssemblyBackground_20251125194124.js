"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const TetrisCubeAssemblyBackground = () => {
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
    scene.fog = new THREE.FogExp2("#050507", 0.08);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(7, 6, 10);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Lights
    const ambient = new THREE.AmbientLight(0xb0b3c0, 0.8);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xdde2f5, 1.0);
    keyLight.position.set(5, 10, 7);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x7f83a0, 0.5);
    rimLight.position.set(-5, -4, -6);
    scene.add(rimLight);

    // === Tetris-style Cube Assembly ===
    const assemblyGroup = new THREE.Group();
    scene.add(assemblyGroup);

    const CUBE_SIZE = 0.65;
    const GAP = 0.08;
    const UNIT = CUBE_SIZE + GAP;

    // Define Tetris-like piece shapes (relative voxel positions)
    const pieceShapes = [
      // L-piece
      [
        [0, 0, 0],
        [1, 0, 0],
        [2, 0, 0],
        [2, 1, 0],
      ],
      // T-piece
      [
        [0, 0, 0],
        [1, 0, 0],
        [2, 0, 0],
        [1, 1, 0],
      ],
      // Z-piece
      [
        [0, 1, 0],
        [1, 1, 0],
        [1, 0, 0],
        [2, 0, 0],
      ],
      // Square
      [
        [0, 0, 0],
        [1, 0, 0],
        [0, 1, 0],
        [1, 1, 0],
      ],
      // Line
      [
        [0, 0, 0],
        [1, 0, 0],
        [2, 0, 0],
        [3, 0, 0],
      ],
      // S-piece
      [
        [1, 0, 0],
        [2, 0, 0],
        [0, 1, 0],
        [1, 1, 0],
      ],
      // Corner
      [
        [0, 0, 0],
        [1, 0, 0],
        [0, 1, 0],
      ],
      // Single
      [[0, 0, 0]],
      // Pair
      [
        [0, 0, 0],
        [1, 0, 0],
      ],
    ];

    // Materials with subtle color variations
    const colors = [
      0xffffff, 0xe8ecff, 0xd8dff5, 0xc8cfea, 0xf0f3ff, 0xe0e5f8, 0xd0d8f0,
    ];

    const makeMaterial = (colorIndex) => {
      return new THREE.MeshStandardMaterial({
        color: colors[colorIndex % colors.length],
        metalness: 0.25,
        roughness: 0.4,
        emissive: 0x050510,
        emissiveIntensity: 0.2,
      });
    };

    const cubeGeom = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);

    // Target: 3x3x3 cube grid (27 positions)
    const GRID_SIZE = 3;
    const targetPositions = [];
    const offset = -((GRID_SIZE - 1) * UNIT) / 2;

    for (let x = 0; x < GRID_SIZE; x++) {
      for (let y = 0; y < GRID_SIZE; y++) {
        for (let z = 0; z < GRID_SIZE; z++) {
          targetPositions.push(
            new THREE.Vector3(
              offset + x * UNIT,
              offset + y * UNIT,
              offset + z * UNIT
            )
          );
        }
      }
    }

    // Shuffle target positions for varied assembly order
    const shuffleArray = (arr) => {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    };

    // Piece state
    let pieces = [];
    let currentPieceIndex = 0;
    let assemblyPhase = "falling"; // 'falling' | 'waiting' | 'complete' | 'exploding'
    let phaseStartTime = 0;

    const FALL_DURATION = 800; // ms per piece
    const WAIT_BETWEEN = 150; // ms between pieces
    const COMPLETE_PAUSE = 2500; // ms to admire completed cube
    const EXPLODE_DURATION = 1200; // ms for explosion

    let shuffledTargets = [];
    let targetIndex = 0;

    const createPiece = (startTime) => {
      const shapeIndex = Math.floor(Math.random() * pieceShapes.length);
      const shape = pieceShapes[shapeIndex];
      const colorIndex = Math.floor(Math.random() * colors.length);

      const pieceGroup = new THREE.Group();

      // Get target positions for this piece
      const pieceTargets = [];
      for (let i = 0; i < shape.length && targetIndex < shuffledTargets.length; i++) {
        pieceTargets.push(shuffledTargets[targetIndex]);
        targetIndex++;
      }

      if (pieceTargets.length === 0) return null;

      // Calculate piece center (for rotation pivot)
      const center = new THREE.Vector3();
      pieceTargets.forEach((t) => center.add(t));
      center.divideScalar(pieceTargets.length);

      // Create cubes
      const cubes = [];
      pieceTargets.forEach((targetPos, i) => {
        const mat = makeMaterial(colorIndex + i);
        const cube = new THREE.Mesh(cubeGeom, mat);
        cube.userData.targetPos = targetPos.clone();
        cube.userData.localOffset = targetPos.clone().sub(center);
        cubes.push(cube);
        pieceGroup.add(cube);
      });

      // Starting position: above the assembly area with random horizontal offset
      const startY = 8 + Math.random() * 3;
      const startX = (Math.random() - 0.5) * 4;
      const startZ = (Math.random() - 0.5) * 4;

      pieceGroup.position.set(startX, startY, startZ);

      // Random starting rotation
      pieceGroup.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );

      pieceGroup.userData = {
        cubes,
        startPos: pieceGroup.position.clone(),
        startRot: pieceGroup.rotation.clone(),
        targetCenter: center,
        startTime,
        duration: FALL_DURATION,
      };

      assemblyGroup.add(pieceGroup);
      return pieceGroup;
    };

    const resetAssembly = (time) => {
      // Clear all pieces
      while (assemblyGroup.children.length > 0) {
        assemblyGroup.remove(assemblyGroup.children[0]);
      }
      pieces = [];
      currentPieceIndex = 0;
      targetIndex = 0;
      shuffledTargets = shuffleArray(targetPositions);
      assemblyPhase = "falling";
      phaseStartTime = time;

      // Create first piece
      const piece = createPiece(time);
      if (piece) pieces.push(piece);
    };

    // Easing functions
    const easeOutBack = (t) => {
      const c1 = 1.70158;
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    };

    const easeOutQuad = (t) => 1 - (1 - t) * (1 - t);

    const easeInCubic = (t) => t * t * t;

    const clock = new THREE.Clock();

    // Initialize
    shuffledTargets = shuffleArray(targetPositions);
    const initialPiece = createPiece(0);
    if (initialPiece) pieces.push(initialPiece);

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

      // Handle assembly phases
      if (assemblyPhase === "falling") {
        // Animate current piece
        const currentPiece = pieces[currentPieceIndex];
        if (currentPiece) {
          const t = Math.min(
            1,
            (nowMs - currentPiece.userData.startTime) / currentPiece.userData.duration
          );
          const easedT = easeOutBack(Math.min(t, 1));

          // Interpolate position
          currentPiece.position.lerpVectors(
            currentPiece.userData.startPos,
            currentPiece.userData.targetCenter,
            easedT
          );

          // Interpolate rotation to zero
          currentPiece.rotation.x =
            currentPiece.userData.startRot.x * (1 - easeOutQuad(t));
          currentPiece.rotation.y =
            currentPiece.userData.startRot.y * (1 - easeOutQuad(t));
          currentPiece.rotation.z =
            currentPiece.userData.startRot.z * (1 - easeOutQuad(t));

          // When piece lands, snap cubes to final positions
          if (t >= 1) {
            currentPiece.userData.cubes.forEach((cube) => {
              cube.position.copy(cube.userData.localOffset);
            });

            // Check if more pieces needed
            if (targetIndex < shuffledTargets.length) {
              assemblyPhase = "waiting";
              phaseStartTime = nowMs;
            } else {
              assemblyPhase = "complete";
              phaseStartTime = nowMs;
            }
          }
        }
      } else if (assemblyPhase === "waiting") {
        if (nowMs - phaseStartTime > WAIT_BETWEEN) {
          const newPiece = createPiece(nowMs);
          if (newPiece) {
            pieces.push(newPiece);
            currentPieceIndex = pieces.length - 1;
          }
          assemblyPhase = "falling";
        }
      } else if (assemblyPhase === "complete") {
        if (nowMs - phaseStartTime > COMPLETE_PAUSE) {
          assemblyPhase = "exploding";
          phaseStartTime = nowMs;

          // Give each piece an explosion direction
          pieces.forEach((piece) => {
            const dir = piece.userData.targetCenter
              .clone()
              .normalize()
              .multiplyScalar(8 + Math.random() * 4);
            dir.y += 3 + Math.random() * 2;
            piece.userData.explodeDir = dir;
            piece.userData.explodeRot = new THREE.Vector3(
              (Math.random() - 0.5) * 6,
              (Math.random() - 0.5) * 6,
              (Math.random() - 0.5) * 6
            );
          });
        }
      } else if (assemblyPhase === "exploding") {
        const t = (nowMs - phaseStartTime) / EXPLODE_DURATION;

        if (t < 1) {
          const easedT = easeInCubic(t);
          pieces.forEach((piece) => {
            const dir = piece.userData.explodeDir;
            const startCenter = piece.userData.targetCenter;

            piece.position.set(
              startCenter.x + dir.x * easedT,
              startCenter.y + dir.y * easedT - 4 * easedT * easedT,
              startCenter.z + dir.z * easedT
            );

            const rot = piece.userData.explodeRot;
            piece.rotation.x += rot.x * 0.02;
            piece.rotation.y += rot.y * 0.02;
            piece.rotation.z += rot.z * 0.02;

            // Fade out
            piece.userData.cubes.forEach((cube) => {
              cube.material.opacity = 1 - easedT;
              cube.material.transparent = true;
            });
          });
        } else {
          // Reset and start over
          resetAssembly(nowMs);
        }
      }

      // Slow rotation of the whole assembly
      assemblyGroup.rotation.y = elapsed * 0.15;
      assemblyGroup.rotation.x = 0.1 * Math.sin(elapsed * 0.2) - 0.15;

      // Camera subtle movement
      const camOrbitSpeed = 0.08;
      const camOrbitAngle = elapsed * camOrbitSpeed;
      const camRadius = 12 + 0.5 * Math.sin(elapsed * 0.25);
      const camHeight = 5.5 + 0.4 * Math.sin(elapsed * 0.3 + 0.8);

      camera.position.x = Math.cos(camOrbitAngle) * camRadius;
      camera.position.z = Math.sin(camOrbitAngle) * camRadius;
      camera.position.y = camHeight;
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

export default TetrisCubeAssemblyBackground;
