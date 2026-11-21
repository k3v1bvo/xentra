---
name: web-3d-designer
description: "Crea experiencias web 3D interactivas, optimizadas y modernas usando Three.js, React Three Fiber y GSAP. Evita código obsoleto y garantiza alto rendimiento visual."
---

# Reglas de Diseño Web 3D (Web 3D Designer)

## Stack y Estándares
- Usa siempre **Three.js (r170+)** o **React Three Fiber (R3F)** con `@react-three/drei`.
- Prioriza materiales PBR (`MeshStandardMaterial` o `MeshPhysicalMaterial`) con iluminación ambiental realista (`Environment` HDRI o luces direccionales cruzadas) en lugar de luces básicas planas.
- Usa formatos comprimidos **.GLB / .GLTF** o geometrías procedurales optimizadas (icosaedros, toros con wireframe sutil, mallas de partículas de red comunitaria).

## Diseño y Cámara
- Configura cámaras con `fov` cinematográfico (entre 35 y 50) y suaviza los movimientos con interpolación (`lerp`).
- Sincroniza la rotación y elevación con la posición del cursor (`mouseX`, `mouseY`).
- Agrega profundidad espacial (Z-layering): fondos oscuros profundos (`#080C14`), partículas brillantes flotantes, y tarjetas con efecto vidrio (*glassmorphism*).

## Rendimiento (Crítico)
- Limita el `pixelRatio` a máximo 2 (`Math.min(window.devicePixelRatio, 2)`).
- Siempre limpia geometrías, materiales y texturas (`.dispose()`) al desmontar componentes para evitar fugas de memoria.
- Asegura que el lienzo (`<canvas>`) sea completamente responsivo y no bloquee los eventos táctiles en dispositivos móviles (`pointer-events-none` o `touch-action: pan-y`).
