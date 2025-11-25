"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const TaskGateFishBackground = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<number | null>(null);
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

    // Scene & camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#050507");
    scene.fog = new THREE.FogExp2("#050507", 0.12);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    const cameraBaseRadius = 10.5;
    const cameraBaseHeight = 4.8;
    camera.position.set(8, 6, 8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Lights
    const ambient = new THREE.AmbientLight(0xb0b3c0, 0.8);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xdde2f5, 1.0);
    keyLight.position.set(5, 8, 7);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x7f83a0, 0.6);
    rimLight.position.set(-5, -6, -6);
    scene.add(rimLight);

    // === Fish Logo Group ===
    const fishGroup = new THREE.Group();
    scene.add(fishGroup);

    // --- Body: 3x3x3 cube voxels ---
    const BODY_GRID_SIZE = 3;
    const BODY_SPACING = 0.62;
    const logical = [-1, 0, 1];

    const bodyMaterialBase = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.28,
      roughness: 0.35,
      emissive: 0x050507,
      emissiveIntensity: 0.23,
    });

    const bodyGeom = new THREE.BoxGeometry(0.55, 0.55, 0.55);

    // Define one "hole" to echo the flat logo cutout
    const HOLE = { x: 1, y: 1, z: 2 }; // tweak if you want a different spot

    const bodyCubes: THREE.Mesh[] = [];

    for (let x = 0; x < BODY_GRID_SIZE; x++) {
      for (let y = 0; y < BODY_GRID_SIZE; y++) {
        for (let z = 0; z < BODY_GRID_SIZE; z++) {
          if (x === HOLE.x && y === HOLE.y && z === HOLE.z) continue;

          const mat = bodyMaterialBase.clone();
          // micro tint variation so it's not perfectly flat
          const tint = 0.93 + Math.random() * 0.07;
          mat.color.multiplyScalar(tint);

          const cube = new THREE.Mesh(bodyGeom, mat);

          const px = logical[x] * BODY_SPACING;
          const py = logical[y] * BODY_SPACING;
          const pz = logical[z] * BODY_SPACING;

          cube.position.set(px, py, pz);
          cube.userData.basePosition = cube.position.clone();

          fishGroup.add(cube);
          bodyCubes.push(cube);
        }
      }
    }

    // --- Tail: 3-sided cone (triangular fin) ---
    const tailLength = 1.3;
    const tailRadius = 0.55;
    const tailGeom = new THREE.ConeGeometry(tailRadius, tailLength, 3);
    const tailMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.28,
      roughness: 0.35,
      emissive: 0x050507,
      emissiveIntensity: 0.23,
    });

    const tail = new THREE.Mesh(tailGeom, tailMat);

    // Rotate & position to roughly match the 2D icon
    tail.rotation.z = Math.PI / 2; // lay on its side
    tail.rotation.y = Math.PI / 6; // slight twist
    tail.position.set(-BODY_SPACING * 1.9, BODY_SPACING * 0.35, 0);

    fishGroup.add(tail);

    // --- Eye: small dark sphere ---
    const eyeGeom = new THREE.SphereGeometry(0.12, 20, 20);
    const eyeMat = new THREE.MeshStandardMaterial({
      color: 0x050507,
      emissive: 0x050507,
      emissiveIntensity: 1.0,
    });

    const eye = new THREE.Mesh(eyeGeom, eyeMat);

    // Place on front-right-ish face (tweak to taste)
    eye.position.set(BODY_SPACING * 1.35, 0.0, BODY_SPACING * 0.68);
    fishGroup.add(eye);

    // Base orientation for the whole fish (approximate isometric)
    fishGroup.rotation.y = -Math.PI / 4;
    fishGroup.rotation.x = -Math.PI / 8;

    // Slight overall scale so it fits nicely in frame
    fishGroup.scale.set(1.1, 1.1, 1.1);

    // Clock for animation timing
    const clock = new THREE.Clock();

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

      // --- Fish idle motion ---
      // Gentle wobble / bob
      const wobbleY = 0.12 * Math.sin(elapsed * 0.9);
      fishGroup.position.y = wobbleY;

      const baseRotY = -Math.PI / 4;
      const baseRotX = -Math.PI / 8;
      fishGroup.rotation.y = baseRotY + 0.07 * Math.sin(elapsed * 0.7);
      fishGroup.rotation.x = baseRotX + 0.04 * Math.sin(elapsed * 0.5);

      // Very subtle per-cube breathing so it feels alive
      for (const cube of bodyCubes) {
        const basePos = cube.userData.basePosition as THREE.Vector3;
        const idNoise = (cube.id % 13) * 0.37; // deterministic offset
        const n = elapsed * 1.1 + idNoise;

        const offset = 0.02 * Math.sin(n);
        const offsetY = 0.018 * Math.cos(n * 1.3);
        cube.position.set(
          basePos.x + offset,
          basePos.y + offsetY,
          basePos.z - offset * 0.7
        );
      }

      // --- Camera slow orbit around the fish ---
      const orbitSpeed = 0.12;
      const orbitAngle = elapsed * orbitSpeed;

      const radialJitter = 0.35 * Math.sin(elapsed * 0.35);
      const heightJitter = 0.35 * Math.sin(elapsed * 0.42 + 1.4);

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

    // Cleanup
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

export default TaskGateFishBackground;
