import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Xentra3DCanvas — Escena 3D Cinemática y Espacial
 * Construida siguiendo las especificaciones de threejs-skills & web3d-integration-patterns:
 * - Renderer WebGL con ToneMapping ACESFilmic y SRGBColorSpace.
 * - Pixel ratio limitado a Math.min(window.devicePixelRatio, 2).
 * - Constelación de Nodos Comunitarios OTB + Partículas flotantes de Tesorería.
 * - Parallax suave con interpolación (lerp) sincronizado con el puntero.
 * - Limpieza estricta de geometrías, materiales y buffers al desmontar.
 */
export const Xentra3DCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Escena & Niebla Espacial Profunda
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030712, 0.035);

    // 2. Cámara Cinemática
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 18);

    // 3. Renderer de Alto Rendimiento
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 4. Iluminación Dinámica Cruzada
    const ambientLight = new THREE.AmbientLight(0x1e293b, 1.5);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x3b82f6, 3.0); // Azul tecnológico
    dirLight1.position.set(10, 15, 10);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x10b981, 2.5); // Verde esmeralda (Bolivia)
    dirLight2.position.set(-10, -10, -5);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0x8b5cf6, 4.0, 25); // Púrpura de gobernanza
    pointLight.position.set(0, 2, 5);
    scene.add(pointLight);

    // 5. Grupo Central: Constelación de Nodos OTB (Grafo Comunitario)
    const centralGroup = new THREE.Group();
    scene.add(centralGroup);

    // Geometría y Material PBR de los Nodos Barriales
    const nodeGeometry = new THREE.IcosahedronGeometry(0.35, 1);
    const nodeMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x60a5fa,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.8,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1
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

    // Líneas Conectoras del Grafo (XENTRA TRACE DAG)
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

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(lineCoords, 3));
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending
    });
    const linesMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    centralGroup.add(linesMesh);

    // Núcleo Central: Dodecaedro de Gobernanza Transparente
    const coreGeometry = new THREE.DodecahedronGeometry(1.6, 0);
    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x10b981,
      emissive: 0x064e3b,
      emissiveIntensity: 0.4,
      wireframe: true,
      roughness: 0.1,
      metalness: 0.9
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    centralGroup.add(coreMesh);

    // 6. Nube de Partículas de Tesorería (Micro-monedas y datos flotantes)
    const particlesCount = 140;
    const particlePositions = new Float32Array(particlesCount * 3);
    const particleScales = new Float32Array(particlesCount);

    for (let i = 0; i < particlesCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 32;
      particlePositions[i + 1] = (Math.random() - 0.5) * 24;
      particlePositions[i + 2] = (Math.random() - 0.5) * 20;
      particleScales[i / 3] = Math.random() * 0.15 + 0.05;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0x67e8f9,
      size: 0.12,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });

    const particlesField = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particlesField);

    // 7. Parallax y Movimiento Suave
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handlePointerMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    // 8. Bucle de Animación Continuo con Lerp
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Suavizado de cursor
      targetX = THREE.MathUtils.lerp(targetX, mouseX * 2.5, 0.05);
      targetY = THREE.MathUtils.lerp(targetY, mouseY * 1.8, 0.05);

      // Rotación orgánica del grafo OTB
      centralGroup.rotation.y = elapsedTime * 0.08 + targetX * 0.3;
      centralGroup.rotation.x = Math.sin(elapsedTime * 0.12) * 0.1 + targetY * 0.2;

      // Pulso suave del núcleo central
      const coreScale = 1 + Math.sin(elapsedTime * 1.5) * 0.06;
      coreMesh.scale.set(coreScale, coreScale, coreScale);
      coreMesh.rotation.y += 0.01;
      coreMesh.rotation.z += 0.005;

      // Partículas flotantes
      particlesField.rotation.y = elapsedTime * 0.02;
      particlesField.position.y = Math.sin(elapsedTime * 0.3) * 0.4;

      // Suavizar posición de la cámara
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX * 0.5, 0.04);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY * 0.5, 0.04);
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // 9. Resize Responsivo con Debounce
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || window.innerWidth;
      const newHeight = container.clientHeight || window.innerHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    // 10. Desmontaje y Limpieza Estricta (.dispose)
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      nodeGeometry.dispose();
      nodeMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();

      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
      style={{ touchAction: 'pan-y' }}
    />
  );
};
