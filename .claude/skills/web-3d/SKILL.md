---
name: web-3d-designer
description: "Crea experiencias web 3D interactivas, optimizadas y modernas usando Three.js, React Three Fiber y GSAP. Evita código obsoleto y garantiza alto rendimiento visual."
---

# Reglas de Diseño Web 3D (Web 3D Designer)

## Stack y Estándares
- Usa siempre **Three.js (r170+)** o **React Three Fiber (R3F)** con `@react-three/drei`.
- Prioriza materiales PBR (`MeshStandardMaterial` o `MeshPhysicalMaterial`) con iluminación ambiental realista en lugar de luces básicas planas.
- Geometrías procedurales optimizadas (redes de nodos comunitarios, icosaedros flotantes, mallas de partículas de tesorería y trazabilidad).

## Rendimiento (Crítico)
- Limita el `pixelRatio` a máximo 2 (`Math.min(window.devicePixelRatio, 2)`).
- Siempre limpia geometrías, materiales y texturas (`.dispose()`) al desmontar componentes.
- No bloquees eventos táctiles en móviles (`pointer-events: none` en el lienzo de fondo).
