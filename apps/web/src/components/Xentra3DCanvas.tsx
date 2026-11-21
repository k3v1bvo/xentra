import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * Xentra3DCanvas — Escena 3D Cinemática y Espacial
 * Con detección segura de WebGL y fallback automático a gradientes espaciales
 * para garantizar que la web cargue instantáneamente en cualquier celular o PC.
 */
export const Xentra3DCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hasWebGLError, setHasWebGLError] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Verificar soporte de WebGL antes de inicializar
    try {
      const canvasTest = document.createElement('canvas');
      const gl = canvasTest.getContext('webgl') || canvasTest.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGLError(true);
        return;
      }
    } catch {
      setHasWebGLError(true);
      return;
    }

    let renderer: THREE.WebGLRenderer | null = null;
    let animationFrameId: number;
    let nodeGeometry: THREE.IcosahedronGeometry;
    let nodeMaterial: THREE.MeshPhysicalMaterial;
    let lineGeometry: THREE.BufferGeometry;
    let lineMaterial: THREE.LineBasicMaterial;
    let coreGeometry: THREE.DodecahedronGeometry;
    let coreMaterial: THREE.MeshPhysicalMaterial;
    let particleGeometry: THREE.BufferGeometry;
    let particleMaterial: THREE.PointsMaterial;

    try {
      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;

      // 1. Escena & Niebla Espacial
      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x020617, 0.035);

      // 2. Cámara Cinemática
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.set(0, 0, 18);

      // 3. Renderer con protección contra fallos de GPU
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'default'
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      container.appendChild(renderer.domElement);

      // 4. Luces Dinámicas
      const ambientLight = new THREE.AmbientLight(0x1e293b, 1.8);
      scene.add(ambientLight);

      const dirLight1 = new THREE.DirectionalLight(0x3b82f6, 3.0);
      dirLight1.position.set(10, 15, 10);
      scene.add(dirLight1);

      const dirLight2 = new THREE.DirectionalLight(0x10b981, 2.5);
      dirLight2.position.set(-10, -10, -5);
      scene.add(dirLight2);

      // 5. Constelación de Nodos OTB
      const centralGroup = new THREE.Group();
      scene.add(centralGroup);

      nodeGeometry = new THREE.IcosahedronGeometry(0.35, 1);
      nodeMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x60a5fa,
        emissive: 0x1d4ed8,
        emissiveIntensity: 0.6,
        roughness: 0.2,
        metalness: 0.8
      });

      const nodesCount = 18;
      const nodePositions: THREE.Vector3[] = [];

      for (let i = 0; i < nodesCount; i++) {
        const radius = 5.5 + Math.random() * 3.5;
        const theta = (i / nodesCount) * Math.PI * 2 + Math.random() * 0.4;
        const phi = (Math.random() - 0.5) * Math.PI * 0.8;

        const pos = new THREE.Vector3(
          radius * Math.cos(theta) * Math.cos(phi),
          radius * Math.sin(phi),
          radius * Math.sin(theta) * Math.cos(phi)
        );

        nodePositions.push(pos);
        const nodeMesh = new THREE.Mesh(nodeGeometry, nodeMaterial);
        nodeMesh.position.copy(pos);
        nodeMesh.scale.setScalar(0.7 + Math.random() * 0.6);
        centralGroup.add(nodeMesh);
      }

      // Conectores del Grafo
      const lineCoords: number[] = [];
      for (let i = 0; i < nodePositions.length; i++) {
        for (let j = i + 1; j < nodePositions.length; j++) {
          const dist = nodePositions[i].distanceTo(nodePositions[j]);
          if (dist < 4.8) {
            lineCoords.push(
              nodePositions[i].x, nodePositions[i].y, nodePositions[i].z,
              nodePositions[j].x, nodePositions[j].y, nodePositions[j].z
            );
          }
        }
      }

      lineGeometry = new THREE.BufferGeometry();
      lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(lineCoords, 3));
      lineMaterial = new THREE.LineBasicMaterial({
        color: 0x3b82f6,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending
      });
      const linesMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
      centralGroup.add(linesMesh);

      // Núcleo Dodecaedro
      coreGeometry = new THREE.DodecahedronGeometry(1.6, 0);
      coreMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x10b981,
        emissive: 0x064e3b,
        emissiveIntensity: 0.5,
        wireframe: true,
        roughness: 0.1,
        metalness: 0.9
      });
      const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
      centralGroup.add(coreMesh);

      // Nube de Partículas
      const particlesCount = 120;
      const particlePositions = new Float32Array(particlesCount * 3);
      for (let i = 0; i < particlesCount * 3; i += 3) {
        particlePositions[i] = (Math.random() - 0.5) * 32;
        particlePositions[i + 1] = (Math.random() - 0.5) * 24;
        particlePositions[i + 2] = (Math.random() - 0.5) * 20;
      }

      particleGeometry = new THREE.BufferGeometry();
      particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
      particleMaterial = new THREE.PointsMaterial({
        color: 0x67e8f9,
        size: 0.12,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending
      });
      const particlesField = new THREE.Points(particleGeometry, particleMaterial);
      scene.add(particlesField);

      // Parallax e Interacción
      let mouseX = 0;
      let mouseY = 0;
      let targetX = 0;
      let targetY = 0;

      const handlePointerMove = (e: MouseEvent) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
      };

      window.addEventListener('pointermove', handlePointerMove, { passive: true });

      const clock = new THREE.Clock();
      const animate = () => {
        const elapsedTime = clock.getElapsedTime();

        targetX = THREE.MathUtils.lerp(targetX, mouseX * 2.0, 0.05);
        targetY = THREE.MathUtils.lerp(targetY, mouseY * 1.5, 0.05);

        centralGroup.rotation.y = elapsedTime * 0.08 + targetX * 0.25;
        centralGroup.rotation.x = Math.sin(elapsedTime * 0.12) * 0.1 + targetY * 0.15;

        const coreScale = 1 + Math.sin(elapsedTime * 1.5) * 0.06;
        coreMesh.scale.set(coreScale, coreScale, coreScale);
        coreMesh.rotation.y += 0.01;

        particlesField.rotation.y = elapsedTime * 0.02;

        camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX * 0.4, 0.04);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY * 0.4, 0.04);
        camera.lookAt(0, 0, 0);

        if (renderer) renderer.render(scene, camera);
        animationFrameId = requestAnimationFrame(animate);
      };

      animate();

      const handleResize = () => {
        if (!container || !renderer) return;
        const newWidth = container.clientWidth || window.innerWidth;
        const newHeight = container.clientHeight || window.innerHeight;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationFrameId);

        nodeGeometry?.dispose();
        nodeMaterial?.dispose();
        lineGeometry?.dispose();
        lineMaterial?.dispose();
        coreGeometry?.dispose();
        coreMaterial?.dispose();
        particleGeometry?.dispose();
        particleMaterial?.dispose();

        if (renderer) {
          renderer.dispose();
          if (renderer.domElement && container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement);
          }
        }
      };
    } catch (err) {
      console.warn('WebGL init skipped:', err);
      setHasWebGLError(true);
    }
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
      style={{ touchAction: 'pan-y' }}
    >
      {/* Resplandor ambiental de respaldo (siempre visible con alta estética) */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none" />
    </div>
  );
};
