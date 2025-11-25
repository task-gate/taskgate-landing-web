"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const ImpossibleRotationBackground = () => {
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
    scene.fog = new THREE.FogExp2("#050507", 0.12);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(6, 5, 9);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Lights
    const ambient = new THREE.AmbientLight(0xb0b3c0, 0.85);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xdde2f5, 1.0);
    keyLight.position.set(5, 8, 7);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x7f83a0, 0.6);
    rimLight.position.set(-5, -6, -6);
    scene.add(rimLight);

    // === Escher-style "impossible" cube ===
    const root = new THREE.Group();
    scene.add(root);

    // Base cube
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.25,
      roughness: 0.4,
      emissive: 0x050507,
      emissiveIntensity: 0.2,
    });

    const baseGeom = new THREE.BoxGeometry(2.4, 2.4, 2.4);
    const baseCube = new THREE.Mesh(baseGeom, baseMat);
    root.add(baseCube);

    // Edge frames (slightly extruded edges that will rotate differently)
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0xcfd3e4,
      metalness: 0.35,
      roughness: 0.25,
      emissive: 0x11121c,
      emissiveIntensity: 0.35,
    });

    const edgeThickness = 0.11;
    const edgeLength = 2.4 + edgeThickness * 2;

    const edgeGroupOuter = new THREE.Group();
    const edgeGroupInner = new THREE.Group();
    root.add(edgeGroupOuter);
    root.add(edgeGroupInner);

    const makeEdge = (length, thickness) => {
      return new THREE.BoxGeometry(length, thickness, thickness);
    };

    const edgeGeom = makeEdge(edgeLength, edgeThickness);

    const addEdge = (group, position, rotation) => {
      const mesh = new THREE.Mesh(edgeGeom, frameMat.clone());
      mesh.position.copy(position);
      mesh.rotation.set(rotation.x, rotation.y, rotation.z);
      group.add(mesh);
    };

    const half = edgeLength / 2;

    // Outer frame edges (axis-aligned)
    addEdge(edgeGroupOuter, new THREE.Vector3(0, half, 0), new THREE.Euler(0, 0, 0));
    addEdge(edgeGroupOuter, new THREE.Vector3(0, -half, 0), new THREE.Euler(0, 0, 0));
    addEdge(
      edgeGroupOuter,
      new THREE.Vector3(0, 0, half),
      new THREE.Euler(0, Math.PI / 2, 0)
    );
    addEdge(
      edgeGroupOuter,
      new THREE.Vector3(0, 0, -half),
      new THREE.Euler(0, Math.PI / 2, 0)
    );
    addEdge(
      edgeGroupOuter,
      new THREE.Vector3(half, 0, 0),
      new THREE.Euler(0, 0, Math.PI / 2)
    );
    addEdge(
      edgeGroupOuter,
      new THREE.Vector3(-half, 0, 0),
      new THREE.Euler(0, 0, Math.PI / 2)
    );

    // Inner frame edges (slightly inset & rotated to create "impossible" feel)
    const innerOffset = 0.35;

    addEdge(
      edgeGroupInner,
      new THREE.Vector3(0, half - innerOffset, 0),
      new THREE.Euler(0.18, 0.12, 0.05)
    );
    addEdge(
      edgeGroupInner,
      new THREE.Vector3(0, -half + innerOffset, 0),
      new THREE.Euler(-0.18, -0.12, -0.03)
    );
    addEdge(
      edgeGroupInner,
      new THREE.Vector3(0, 0, half - innerOffset),
      new THREE.Euler(0.1, Math.PI / 2 + 0.18, 0.08)
    );
    addEdge(
      edgeGroupInner,
      new THREE.Vector3(0, 0, -half + innerOffset),
      new THREE.Euler(-0.12, Math.PI / 2 - 0.16, -0.07)
    );
    addEdge(
      edgeGroupInner,
      new THREE.Vector3(half - innerOffset, 0, 0),
      new THREE.Euler(0.14, 0.06, Math.PI / 2 + 0.16)
    );
    addEdge(
      edgeGroupInner,
      new THREE.Vector3(-half + innerOffset, 0, 0),
      new THREE.Euler(-0.16, -0.08, Math.PI / 2 - 0.16)
    );

    // Thin diagonal connectors to enhance "impossible" perception
    const diagGeom = new THREE.BoxGeometry(edgeThickness, edgeThickness, edgeLength * 0.9);
    const diagMat = new THREE.MeshStandardMaterial({
      color: 0xd8dff5,
      metalness: 0.4,
      roughness: 0.25,
      emissive: 0x11121c,
      emissiveIntensity: 0.4,
    });

    const diag1 = new THREE.Mesh(diagGeom, diagMat);
    diag1.position.set(0.6 * half, 0.6 * half, 0);
    diag1.rotation.set(Math.PI / 4, 0, Math.PI / 4);
    edgeGroupInner.add(diag1);

    const diag2 = new THREE.Mesh(diagGeom, diagMat);
    diag2.position.set(-0.6 * half, -0.6 * half, 0);
    diag2.rotation.set(-Math.PI / 4, 0, -Math.PI / 4);
    edgeGroupInner.add(diag2);

    // Initial orientation
    root.rotation.x = -Math.PI / 6;
    root.rotation.y = Math.PI / 4;

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

      // Base cube rotation
      const slow = elapsed * 0.25;
      root.rotation.y = Math.PI / 4 + 0.3 * Math.sin(slow);
      root.rotation.x = -Math.PI / 6 + 0.2 * Math.sin(slow * 0.7 + 1.2);

      // Outer edges rotate slightly differently from base cube
      edgeGroupOuter.rotation.y = 0.15 * Math.sin(elapsed * 0.5 + 0.8);
      edgeGroupOuter.rotation.x = 0.1 * Math.sin(elapsed * 0.4);

      // Inner edges counter-rotate to create "impossible" motion
      edgeGroupInner.rotation.y = -0.25 * Math.sin(elapsed * 0.6 + 1.4);
      edgeGroupInner.rotation.x = -0.15 * Math.sin(elapsed * 0.5 + 0.3);

      // Camera subtle orbit for surreal parallax
      const orbitSpeed = 0.1;
      const orbitAngle = elapsed * orbitSpeed;
      const radius = 10.5 + 0.3 * Math.sin(elapsed * 0.3);
      const height = 4.8 + 0.3 * Math.sin(elapsed * 0.4 + 1.1);

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

export default ImpossibleRotationBackground;
