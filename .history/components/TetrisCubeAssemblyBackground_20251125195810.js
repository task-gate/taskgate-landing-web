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

    // === Fish Assembly: Cube body + Pyramid tail + Eye ===
    const fishGroup = new THREE.Group();
    scene.add(fishGroup);

    const CUBE_SIZE = 0.6;
    const GAP = 0.06;
    const UNIT = CUBE_SIZE + GAP;

    // Materials
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.25,
      roughness: 0.4,
      emissive: 0x050510,
      emissiveIntensity: 0.2,
    });

    const eyeMaterial = new THREE.MeshStandardMaterial({
      color: 0x050507,
      metalness: 0.3,
      roughness: 0.3,
      emissive: 0x000000,
      emissiveIntensity: 0,
    });

    const tailMaterial = new THREE.MeshStandardMaterial({
      color: 0xe8ecff,
      metalness: 0.28,
      roughness: 0.35,
      emissive: 0x050510,
      emissiveIntensity: 0.25,
    });

    const cubeGeom = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);

    // Fish body: 3x3x3 cube grid
    const GRID_SIZE = 3;
    const bodyOffset = -((GRID_SIZE - 1) * UNIT) / 2;

    // Eye position (front-top-right of the body)
    const eyeGridPos = { x: 2, y: 2, z: 2 };

    // All target pieces: body cubes + tail
    const allPieces = [];

    // Create body cube targets
    for (let x = 0; x < GRID_SIZE; x++) {
      for (let y = 0; y < GRID_SIZE; y++) {
        for (let z = 0; z < GRID_SIZE; z++) {
          const isEye =
            x === eyeGridPos.x && y === eyeGridPos.y && z === eyeGridPos.z;
          allPieces.push({
            type: "cube",
            isEye,
            targetPos: new THREE.Vector3(
              bodyOffset + x * UNIT,
              bodyOffset + y * UNIT,
              bodyOffset + z * UNIT
            ),
          });
        }
      }
    }

    // Tail: square pyramid with TIP at the back-bottom-left corner of the cube body
    // The fish will be oriented diagonally (corner-first) so it looks like a fish
    const bodyFaceSize = GRID_SIZE * UNIT;
    const tailBaseSize = bodyFaceSize * 1.0; // same size as body diagonal face
    const tailHeight = bodyFaceSize * 1.4; // length of the tail

    // The back-bottom-left corner of the body cube is at:
    // x = bodyOffset - CUBE_SIZE/2, y = bodyOffset - CUBE_SIZE/2, z = bodyOffset - CUBE_SIZE/2
    // The pyramid tip should be AT that corner, with the base extending outward
    const cornerX = bodyOffset - CUBE_SIZE / 2;
    const cornerY = bodyOffset - CUBE_SIZE / 2;
    const cornerZ = bodyOffset - CUBE_SIZE / 2;

    // Pyramid center is at tip + half height along the tail direction
    // Tail points diagonally outward from corner: direction (-1, -1, -1) normalized
    const tailDir = new THREE.Vector3(-1, -1, -1).normalize();
    const tailCenterPos = new THREE.Vector3(
      cornerX + (tailDir.x * tailHeight) / 2,
      cornerY + (tailDir.y * tailHeight) / 2,
      cornerZ + (tailDir.z * tailHeight) / 2
    );

    allPieces.push({
      type: "tail",
      targetPos: tailCenterPos,
      tailHeight: tailHeight,
      tailBaseSize: tailBaseSize,
    });

    // Shuffle pieces for varied assembly order (but keep tail for last few)
    const shuffleArray = (arr) => {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    };

    // Animation state
    let assembledMeshes = [];
    let currentPieceIndex = 0;
    let assemblyPhase = "falling";
    let phaseStartTime = 0;
    let currentFallingMesh = null;
    let fallingData = null;

    const FALL_DURATION = 600;
    const WAIT_BETWEEN = 120;
    const COMPLETE_PAUSE = 3000;
    const EXPLODE_DURATION = 1200;

    let shuffledPieces = [];

    const createFallingPiece = (pieceData, startTime) => {
      let mesh;

      if (pieceData.type === "cube") {
        const mat = pieceData.isEye
          ? eyeMaterial.clone()
          : bodyMaterial.clone();
        if (!pieceData.isEye) {
          const tint = 0.92 + Math.random() * 0.08;
          mat.color.multiplyScalar(tint);
        }
        mesh = new THREE.Mesh(cubeGeom, mat);
      } else if (pieceData.type === "tail") {
        // Square-based pyramid for the fish tail
        const tHeight = pieceData.tailHeight;
        const tBaseSize = pieceData.tailBaseSize;

        // ConeGeometry: tip at +Y by default, base at -Y
        // radius = half diagonal of square base
        const halfBase = tBaseSize / 2;
        const pyramidGeom = new THREE.ConeGeometry(halfBase, tHeight, 4);

        mesh = new THREE.Mesh(pyramidGeom, tailMaterial.clone());

        // We need tip pointing toward (+1,+1,+1) direction (toward the body corner)
        // and base extending toward (-1,-1,-1) direction
        // Default cone: tip at +Y. We need tip pointing toward (1,1,1) normalized
        //
        // To point tip toward (1,1,1): rotate around axis perpendicular to Y and (1,1,1)
        // Using quaternion for cleaner rotation
        const tipDir = new THREE.Vector3(1, 1, 1).normalize();
        const defaultUp = new THREE.Vector3(0, 1, 0);
        const quaternion = new THREE.Quaternion().setFromUnitVectors(
          defaultUp,
          tipDir
        );
        mesh.quaternion.copy(quaternion);

        // Rotate 45° around the tip axis so square base edges look clean
        mesh.rotateOnAxis(tipDir, Math.PI / 4);
      }

      // Starting position: above with random offset
      const startY = 10 + Math.random() * 4;
      const startX = (Math.random() - 0.5) * 6;
      const startZ = (Math.random() - 0.5) * 6;

      mesh.position.set(startX, startY, startZ);

      // Random starting rotation
      const startRot = new THREE.Euler(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );
      if (pieceData.type === "cube") {
        mesh.rotation.copy(startRot);
      }

      fishGroup.add(mesh);

      return {
        mesh,
        startPos: new THREE.Vector3(startX, startY, startZ),
        startRot: startRot.clone(),
        targetPos: pieceData.targetPos.clone(),
        targetRot: new THREE.Euler(0, 0, 0), // Will use quaternion for tail
        isTail: pieceData.type === "tail",
        startTime,
        duration: FALL_DURATION,
        pieceType: pieceData.type,
      };
    };

    const resetAssembly = (time) => {
      // Remove all meshes
      while (fishGroup.children.length > 0) {
        fishGroup.remove(fishGroup.children[0]);
      }
      assembledMeshes = [];
      currentPieceIndex = 0;
      currentFallingMesh = null;
      fallingData = null;

      // Shuffle: body cubes first, tail last
      const bodyCubes = allPieces.filter((p) => p.type === "cube");
      const tailPiece = allPieces.filter((p) => p.type === "tail");
      shuffledPieces = [...shuffleArray(bodyCubes), ...tailPiece];

      assemblyPhase = "falling";
      phaseStartTime = time;

      // Start first piece
      fallingData = createFallingPiece(shuffledPieces[0], time);
      currentFallingMesh = fallingData.mesh;
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
    const bodyCubes = allPieces.filter((p) => p.type === "cube");
    const tailPiece = allPieces.filter((p) => p.type === "tail");
    shuffledPieces = [...shuffleArray(bodyCubes), ...tailPiece];
    fallingData = createFallingPiece(shuffledPieces[0], 0);
    currentFallingMesh = fallingData.mesh;

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
      if (assemblyPhase === "falling" && fallingData) {
        const t = Math.min(
          1,
          (nowMs - fallingData.startTime) / fallingData.duration
        );
        const easedT = easeOutBack(Math.min(t, 1));

        // Interpolate position
        fallingData.mesh.position.lerpVectors(
          fallingData.startPos,
          fallingData.targetPos,
          easedT
        );

        // Interpolate rotation
        if (fallingData.pieceType === "cube") {
          fallingData.mesh.rotation.x =
            fallingData.startRot.x * (1 - easeOutQuad(t));
          fallingData.mesh.rotation.y =
            fallingData.startRot.y * (1 - easeOutQuad(t));
          fallingData.mesh.rotation.z =
            fallingData.startRot.z * (1 - easeOutQuad(t));
        }
        // Tail uses quaternion set at creation, just let it settle

        // When landed
        if (t >= 1) {
          fallingData.mesh.position.copy(fallingData.targetPos);
          assembledMeshes.push({
            mesh: fallingData.mesh,
            targetPos: fallingData.targetPos.clone(),
          });

          currentPieceIndex++;

          if (currentPieceIndex < shuffledPieces.length) {
            assemblyPhase = "waiting";
            phaseStartTime = nowMs;
          } else {
            assemblyPhase = "complete";
            phaseStartTime = nowMs;
          }
        }
      } else if (assemblyPhase === "waiting") {
        if (nowMs - phaseStartTime > WAIT_BETWEEN) {
          fallingData = createFallingPiece(
            shuffledPieces[currentPieceIndex],
            nowMs
          );
          currentFallingMesh = fallingData.mesh;
          assemblyPhase = "falling";
        }
      } else if (assemblyPhase === "complete") {
        if (nowMs - phaseStartTime > COMPLETE_PAUSE) {
          assemblyPhase = "exploding";
          phaseStartTime = nowMs;

          // Setup explosion for each mesh
          assembledMeshes.forEach((item) => {
            const dir = item.targetPos
              .clone()
              .normalize()
              .multiplyScalar(8 + Math.random() * 4);
            dir.y += 3 + Math.random() * 2;
            item.explodeDir = dir;
            item.explodeRot = new THREE.Vector3(
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
          assembledMeshes.forEach((item) => {
            const dir = item.explodeDir;
            const startPos = item.targetPos;

            item.mesh.position.set(
              startPos.x + dir.x * easedT,
              startPos.y + dir.y * easedT - 4 * easedT * easedT,
              startPos.z + dir.z * easedT
            );

            item.mesh.rotation.x += item.explodeRot.x * 0.02;
            item.mesh.rotation.y += item.explodeRot.y * 0.02;
            item.mesh.rotation.z += item.explodeRot.z * 0.02;

            // Fade out
            item.mesh.material.opacity = 1 - easedT;
            item.mesh.material.transparent = true;
          });
        } else {
          resetAssembly(nowMs);
        }
      }

      // Rotate fish so corner faces forward (like TaskGate logo fish)
      // Base orientation: tilt so the diagonal (1,1,1) corner points "forward" (+Z)
      const baseRotY = -Math.PI / 4; // 45° around Y
      const baseRotX = Math.atan(1 / Math.SQRT2); // ~35° tilt to show corner

      // Add gentle swimming motion on top
      fishGroup.rotation.y =
        baseRotY + elapsed * 0.1 + 0.06 * Math.sin(elapsed * 0.5);
      fishGroup.rotation.x = -baseRotX + 0.05 * Math.sin(elapsed * 0.4);
      fishGroup.rotation.z = 0.04 * Math.sin(elapsed * 0.6);

      // Subtle swim bob
      fishGroup.position.y = 0.12 * Math.sin(elapsed * 0.7);

      // Camera orbit
      const camOrbitSpeed = 0.08;
      const camOrbitAngle = elapsed * camOrbitSpeed;
      const camRadius = 11 + 0.5 * Math.sin(elapsed * 0.25);
      const camHeight = 5 + 0.4 * Math.sin(elapsed * 0.3 + 0.8);

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
