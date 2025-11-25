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
    scene.fog = new THREE.FogExp2("#050507", 0.08);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 80);
    const cameraBaseRadius = 10;
    const cameraBaseHeight = 4.5;
    camera.position.set(8, 5, 12);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xcad1dd, 0.8);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight.position.set(4, 8, 6);
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0x5db4ff, 0.6);
    rimLight.position.set(-6, 3, -5);
    scene.add(rimLight);

    const fishGroup = new THREE.Group();
    fishGroup.position.y = -0.3;
    scene.add(fishGroup);

    const fishPattern = [
      "........11........",
      ".......1111.......",
      "......111111......",
      ".....11111111.....",
      "....1111111111....",
      "...111111111111...",
      "..11111111111111..",
      ".1111111111111111.",
      "111111111111111111",
      ".1111111111111111.",
      "..11111111111111..",
      "...111111111111...",
      "....1111111111....",
      ".....11111111.....",
      "......111111......",
      ".......1111.......",
      "........11........",
    ];

    const CELL_SIZE = 0.35;
    const patternHeight = fishPattern.length;
    const patternWidth = fishPattern[0].length;
    const offsetX = -((patternWidth - 1) * CELL_SIZE) / 2;
    const offsetY = ((patternHeight - 1) * CELL_SIZE) / 2;

    const baseMaterial = new THREE.MeshStandardMaterial({
      color: 0xf5f7ff,
      metalness: 0.2,
      roughness: 0.4,
      emissive: 0x0f1014,
      emissiveIntensity: 0.25,
    });

    const cubeGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.7);
    const thinGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.4);
    const fishCubes = [];

    const createCube = (x, y, depthScale = 1, translucency = 1) => {
      const material = baseMaterial.clone();
      material.color.offsetHSL(0, 0, (Math.random() - 0.5) * 0.08);
      material.transparent = translucency < 1;
      material.opacity = translucency;

      const mesh =
        depthScale < 1
          ? new THREE.Mesh(thinGeometry, material)
          : new THREE.Mesh(cubeGeometry, material);
      mesh.position.set(x, y, depthScale < 1 ? 0.15 : 0);
      fishGroup.add(mesh);
      fishCubes.push({
        mesh,
        basePosition: mesh.position.clone(),
        phase: Math.random() * Math.PI * 2,
      });
    };

    fishPattern.forEach((row, rowIdx) => {
      [...row].forEach((cell, colIdx) => {
        if (cell !== "1") return;
        const x = offsetX + colIdx * CELL_SIZE;
        const y = offsetY - rowIdx * CELL_SIZE;

        const isTail = colIdx < patternWidth * 0.35;
        const isHead = colIdx > patternWidth * 0.65;
        const translucency = isTail ? 0.7 : 1;
        const depthScale = isHead ? 0.7 : 1;

        createCube(x, y, depthScale, translucency);
      });
    });

    const eyeGeometry = new THREE.SphereGeometry(0.12, 18, 12);
    const eyeMaterial = new THREE.MeshStandardMaterial({
      color: 0x050507,
      metalness: 0.4,
      roughness: 0.4,
      emissive: 0x000000,
    });
    const eye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    eye.position.set(patternWidth * 0.085, 0.25, 0.2);
    fishGroup.add(eye);

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

      fishCubes.forEach(({ mesh, basePosition, phase }) => {
        const yOffset = Math.sin(elapsed * 1.5 + phase) * 0.06;
        const zOffset = Math.cos(elapsed * 1.2 + phase) * 0.04;
        mesh.position.y = basePosition.y + yOffset;
        mesh.position.z = basePosition.z + zOffset;
      });

      const tailWave = Math.sin(elapsed * 2.1) * 0.25;
      fishGroup.rotation.y = tailWave * 0.15;
      fishGroup.rotation.x = Math.sin(elapsed * 0.6) * 0.05 - 0.15;
      fishGroup.position.x = Math.sin(elapsed * 0.35) * 0.8;
      fishGroup.position.z = Math.cos(elapsed * 0.3) * 0.4;

      const orbitSpeed = 0.07;
      const orbitAngle = elapsed * orbitSpeed;
      const radialJitter = 0.3 * Math.sin(elapsed * 0.14);
      const heightJitter = 0.3 * Math.sin(elapsed * 0.17 + 1.1);

      const radius = cameraBaseRadius + radialJitter;
      const height = cameraBaseHeight + heightJitter;

      camera.position.x = Math.cos(orbitAngle) * radius;
      camera.position.z = Math.sin(orbitAngle) * radius;
      camera.position.y = height;
      camera.lookAt(0, 0.5, 0);

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
