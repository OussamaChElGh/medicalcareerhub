import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { RotateCw, Play, Pause, Compass, Sparkles, Eye, Info } from 'lucide-react';
import { DimensionMetric } from './DimensionsRadarChart';
import { UserProfile } from '../types';
import { DIMENSIONS, NUMERIC_DIMENSIONS } from '../data/dimensions';

export interface VocationalNode {
  id: string;
  name: string;
  nameEs: string;
  score: number; // 0 - 100
  color: string;
  category: 'cardinal' | 'continuous';
  description: string;
  clinicalFocus: string;
  position: [number, number, number];
}

interface VocationalHolocron3DProps {
  cardinalMetrics: DimensionMetric[];
  v2Profile?: UserProfile | null;
  specialtyHouse?: string;
  selectedDimensionKey?: string | null;
  onSelectDimension?: (key: string) => void;
}

const HOUSE_THEME_COLORS: Record<string, { primary: number; secondary: number; light: number }> = {
  Slytherin: { primary: 0x14b8a6, secondary: 0x0f766e, light: 0x5eead4 },
  Gryffindor: { primary: 0xd97706, secondary: 0xb45309, light: 0xfde68a },
  Ravenclaw: { primary: 0x3b82f6, secondary: 0x1d4ed8, light: 0x93c5fd },
  Hufflepuff: { primary: 0xeab308, secondary: 0xca8a04, light: 0xfef08a },
};

export const VocationalHolocron3D: React.FC<VocationalHolocron3DProps> = ({
  cardinalMetrics,
  v2Profile,
  specialtyHouse = 'Ravenclaw',
  selectedDimensionKey,
  onSelectDimension,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isRotating, setIsRotating] = useState(true);
  const [hoveredNode, setHoveredNode] = useState<VocationalNode | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Compute 3D Nodes based on the candidate's scores
  const nodes = useMemo<VocationalNode[]>(() => {
    const list: VocationalNode[] = [];

    // 1. Cardinal Dimensions (Tech, Crisis, Diag, Social)
    const tech = cardinalMetrics.find((m) => m.key === 'tech')?.score ?? 50;
    const crisis = cardinalMetrics.find((m) => m.key === 'crisis')?.score ?? 50;
    const diag = cardinalMetrics.find((m) => m.key === 'diag')?.score ?? 50;
    const social = cardinalMetrics.find((m) => m.key === 'social')?.score ?? 50;

    const scale = (val: number) => 1.1 + (val / 100) * 1.5; // Radius between 1.1 and 2.6

    list.push({
      id: 'tech',
      name: 'Technical Resolution',
      nameEs: 'Resolución Técnica',
      score: tech,
      color: '#38bdf8',
      category: 'cardinal',
      description: 'Destreza instrumental, procedimientos invasivos y precisión quirúrgica.',
      clinicalFocus: 'Quirófano, técnicas intervencionistas y biomecánica',
      position: [scale(tech), 0, 0],
    });

    list.push({
      id: 'diag',
      name: 'Diagnostic Reasoning',
      nameEs: 'Razonamiento Diagnóstico',
      score: diag,
      color: '#a855f7',
      category: 'cardinal',
      description: 'Deducción fisiopatológica, integración de datos complejos y medicina interna.',
      clinicalFocus: 'Diagnóstico diferencial y análisis sistemático',
      position: [-scale(diag), 0, 0],
    });

    list.push({
      id: 'crisis',
      name: 'Crisis Management',
      nameEs: 'Gestión de Crisis',
      score: crisis,
      color: '#f59e0b',
      category: 'cardinal',
      description: 'Toma de decisiones crítica bajo incertidumbre y estabilización vital.',
      clinicalFocus: 'Urgencias, UCI, shock y soporte vital agudo',
      position: [0, scale(crisis), 0],
    });

    list.push({
      id: 'social',
      name: 'Social Care',
      nameEs: 'Cuidado Social',
      score: social,
      color: '#14b8a6',
      category: 'cardinal',
      description: 'Vínculo empático longitudinal, soporte integral y comunicación terapéutica.',
      clinicalFocus: 'Atención primaria, salud comunitaria y vínculo humano',
      position: [0, -scale(social), 0],
    });

    // 2. Calibrated Continuous Dimensions (A1 - A8) if profile exists
    if (v2Profile?.numeric) {
      const a1 = (v2Profile.numeric.A1 ?? 2) / 4; // 0..1
      const a2 = (v2Profile.numeric.A2 ?? 2) / 4;
      const a3 = (v2Profile.numeric.A3 ?? 2) / 4;
      const a4 = (v2Profile.numeric.A4 ?? 2) / 4;
      const a5 = (v2Profile.numeric.A5 ?? 2) / 4;
      const a8 = (v2Profile.numeric.A8 ?? 2) / 4;

      const calcRadius = (ratio: number) => 1.0 + ratio * 1.6;

      list.push({
        id: 'A2',
        name: DIMENSIONS.A2.label,
        nameEs: DIMENSIONS.A2.label,
        score: Math.round(a2 * 100),
        color: '#f43f5e', // Rose/crimson
        category: 'continuous',
        description: DIMENSIONS.A2.description,
        clinicalFocus: `${DIMENSIONS.A2.lowLabel} ↔ ${DIMENSIONS.A2.highLabel}`,
        position: [0, 0, calcRadius(a2)],
      });

      list.push({
        id: 'A1',
        name: DIMENSIONS.A1.label,
        nameEs: DIMENSIONS.A1.label,
        score: Math.round(a1 * 100),
        color: '#6366f1', // Indigo
        category: 'continuous',
        description: DIMENSIONS.A1.description,
        clinicalFocus: `${DIMENSIONS.A1.lowLabel} ↔ ${DIMENSIONS.A1.highLabel}`,
        position: [0, 0, -calcRadius(a1)],
      });

      list.push({
        id: 'A3',
        name: DIMENSIONS.A3.label,
        nameEs: DIMENSIONS.A3.label,
        score: Math.round(a3 * 100),
        color: '#eab308', // Amber
        category: 'continuous',
        description: DIMENSIONS.A3.description,
        clinicalFocus: `${DIMENSIONS.A3.lowLabel} ↔ ${DIMENSIONS.A3.highLabel}`,
        position: [calcRadius(a3) * 0.7, calcRadius(a3) * 0.7, calcRadius(a3) * 0.3],
      });

      list.push({
        id: 'A5',
        name: DIMENSIONS.A5.label,
        nameEs: DIMENSIONS.A5.label,
        score: Math.round(a5 * 100),
        color: '#10b981', // Emerald
        category: 'continuous',
        description: DIMENSIONS.A5.description,
        clinicalFocus: `${DIMENSIONS.A5.lowLabel} ↔ ${DIMENSIONS.A5.highLabel}`,
        position: [-calcRadius(a5) * 0.7, -calcRadius(a5) * 0.7, calcRadius(a5) * 0.3],
      });

      list.push({
        id: 'A8',
        name: DIMENSIONS.A8.label,
        nameEs: DIMENSIONS.A8.label,
        score: Math.round(a8 * 100),
        color: '#8b5cf6', // Violet
        category: 'continuous',
        description: DIMENSIONS.A8.description,
        clinicalFocus: `${DIMENSIONS.A8.lowLabel} ↔ ${DIMENSIONS.A8.highLabel}`,
        position: [-calcRadius(a8) * 0.7, calcRadius(a8) * 0.7, -calcRadius(a8) * 0.3],
      });

      list.push({
        id: 'A4',
        name: DIMENSIONS.A4.label,
        nameEs: DIMENSIONS.A4.label,
        score: Math.round(a4 * 100),
        color: '#06b6d4', // Cyan
        category: 'continuous',
        description: DIMENSIONS.A4.description,
        clinicalFocus: `${DIMENSIONS.A4.lowLabel} ↔ ${DIMENSIONS.A4.highLabel}`,
        position: [calcRadius(a4) * 0.7, -calcRadius(a4) * 0.7, -calcRadius(a4) * 0.3],
      });
    }

    return list;
  }, [cardinalMetrics, v2Profile]);

  // Three.js Scene Setup & Loop
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 1.8, 6.2);
    camera.lookAt(0, 0, 0);

    // Main rotating group
    const holocronGroup = new THREE.Group();
    scene.add(holocronGroup);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const houseTheme = HOUSE_THEME_COLORS[specialtyHouse] || HOUSE_THEME_COLORS.Ravenclaw;
    const pointLight = new THREE.PointLight(houseTheme.light, 2.5, 12);
    pointLight.position.set(0, 0, 0);
    holocronGroup.add(pointLight);

    const dirLight1 = new THREE.DirectionalLight(0xc5a059, 1.5);
    dirLight1.position.set(4, 6, 4);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x14b8a6, 1.2);
    dirLight2.position.set(-4, -4, 4);
    scene.add(dirLight2);

    // 1. Central Core Sphere (Pulsing Medical Heart)
    const coreGeo = new THREE.SphereGeometry(0.42, 24, 24);
    const coreMat = new THREE.MeshStandardMaterial({
      color: houseTheme.primary,
      emissive: houseTheme.primary,
      emissiveIntensity: 0.7,
      roughness: 0.2,
      metalness: 0.8,
      transparent: true,
      opacity: 0.88,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    holocronGroup.add(coreMesh);

    // 2. Build 3D Polyhedral Convex / Faceted Mesh using Nodes Positions
    const vertexPoints = nodes.map((n) => new THREE.Vector3(...n.position));
    
    // Create an indexed or buffer geometry for the faceted volume
    // We connect adjacent nodes into a dynamic gemstone crystal
    const polyGeometry = new THREE.BufferGeometry();
    const positionArray: number[] = [];

    // Construct triangular faces connecting center to nodes and between cardinal nodes
    const topNode = nodes.find((n) => n.id === 'crisis') || nodes[2];
    const bottomNode = nodes.find((n) => n.id === 'social') || nodes[3];
    const rightNode = nodes.find((n) => n.id === 'tech') || nodes[0];
    const leftNode = nodes.find((n) => n.id === 'diag') || nodes[1];

    const cardinalQuads = [
      [topNode, rightNode],
      [rightNode, bottomNode],
      [bottomNode, leftNode],
      [leftNode, topNode],
    ];

    // Connect with Z-axis nodes (A2 front, A1 back)
    const frontNode = nodes.find((n) => n.id === 'A2') || { position: [0, 0, 1.8] };
    const backNode = nodes.find((n) => n.id === 'A1') || { position: [0, 0, -1.8] };

    cardinalQuads.forEach(([n1, n2]) => {
      // Front pyramids
      positionArray.push(
        n1.position[0], n1.position[1], n1.position[2],
        n2.position[0], n2.position[1], n2.position[2],
        frontNode.position[0], frontNode.position[1], frontNode.position[2]
      );
      // Back pyramids
      positionArray.push(
        n2.position[0], n2.position[1], n2.position[2],
        n1.position[0], n1.position[1], n1.position[2],
        backNode.position[0], backNode.position[1], backNode.position[2]
      );
    });

    polyGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positionArray, 3));
    polyGeometry.computeVertexNormals();

    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0x0f2d2e,
      roughness: 0.15,
      metalness: 0.85,
      transparent: true,
      opacity: 0.42,
      side: THREE.DoubleSide,
      flatShading: true,
    });
    const crystalMesh = new THREE.Mesh(polyGeometry, crystalMat);
    holocronGroup.add(crystalMesh);

    // 3. Golden Wireframe Overlay
    const wireframeMat = new THREE.LineBasicMaterial({
      color: 0xc5a059,
      transparent: true,
      opacity: 0.6,
      linewidth: 1.5,
    });
    const wireframeGeo = new THREE.WireframeGeometry(polyGeometry);
    const wireframeLines = new THREE.LineSegments(wireframeGeo, wireframeMat);
    holocronGroup.add(wireframeLines);

    // 4. Dimensional Axis Lines radiating from center to each node
    const axisMat = new THREE.LineDashedMaterial({
      color: 0xc5a059,
      dashSize: 0.15,
      gapSize: 0.08,
      opacity: 0.35,
      transparent: true,
    });
    nodes.forEach((n) => {
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(n.position[0], n.position[1], n.position[2]),
      ]);
      const axisLine = new THREE.Line(lineGeo, axisMat);
      axisLine.computeLineDistances();
      holocronGroup.add(axisLine);
    });

    // 5. Interactive Vertex Spheres for each node
    const sphereMeshes: { mesh: THREE.Mesh; node: VocationalNode }[] = [];
    const sphereGeo = new THREE.SphereGeometry(0.13, 16, 16);

    nodes.forEach((node) => {
      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(node.color),
        emissive: new THREE.Color(node.color),
        emissiveIntensity: 0.65,
        roughness: 0.2,
        metalness: 0.7,
      });
      const sphere = new THREE.Mesh(sphereGeo, mat);
      sphere.position.set(node.position[0], node.position[1], node.position[2]);
      holocronGroup.add(sphere);
      sphereMeshes.push({ mesh: sphere, node });

      // Add a subtle halo ring around cardinal nodes
      if (node.category === 'cardinal') {
        const ringGeo = new THREE.RingGeometry(0.18, 0.22, 24);
        const ringMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color(node.color),
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.6,
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.set(node.position[0], node.position[1], node.position[2]);
        ring.lookAt(0, 0, 0);
        holocronGroup.add(ring);
      }
    });

    // 6. Floating Magical Constellation Particles
    const particleCount = 75;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      const r = 2.2 + Math.random() * 1.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      particlePositions[i] = r * Math.sin(phi) * Math.cos(theta);
      particlePositions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      particlePositions[i + 2] = r * Math.cos(phi);
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xc5a059,
      size: 0.045,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    holocronGroup.add(particles);

    // Initial slight heraldic tilt
    holocronGroup.rotation.x = 0.35;
    holocronGroup.rotation.y = 0.45;

    // Raycaster for Hover Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(
        sphereMeshes.map((s) => s.mesh),
        false
      );

      if (intersects.length > 0) {
        const found = sphereMeshes.find((s) => s.mesh === intersects[0].object);
        if (found) {
          setHoveredNode(found.node);
          document.body.style.cursor = 'pointer';
          return;
        }
      }
      setHoveredNode(null);
      document.body.style.cursor = 'default';
    };

    const handlePointerDown = () => {
      setIsDragging(true);
    };

    // Drag Orbit Logic
    let previousMousePosition = { x: 0, y: 0 };
    let isMouseDown = false;

    const onMouseDown = (e: MouseEvent) => {
      isMouseDown = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      handlePointerMove(e);
      if (!isMouseDown) return;

      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      holocronGroup.rotation.y += deltaX * 0.009;
      holocronGroup.rotation.x += deltaY * 0.009;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isMouseDown = false;
      setIsDragging(false);
    };

    // Touch support for mobile devices
    let touchStart = { x: 0, y: 0 };
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - touchStart.x;
        const deltaY = e.touches[0].clientY - touchStart.y;
        holocronGroup.rotation.y += deltaX * 0.009;
        holocronGroup.rotation.x += deltaY * 0.009;
        touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: true });

    // Click handler to select dimension
    const onClick = () => {
      if (hoveredNode && onSelectDimension) {
        onSelectDimension(hoveredNode.id);
      }
    };
    container.addEventListener('click', onClick);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Slow smooth auto-rotation if enabled and not dragging
      if (isRotating && !isMouseDown) {
        holocronGroup.rotation.y += 0.005;
        holocronGroup.rotation.x = 0.28 + Math.sin(elapsedTime * 0.4) * 0.08;
      }

      // Heartbeat pulse for central core and light
      const pulse = 1 + Math.sin(elapsedTime * 2.8) * 0.09;
      coreMesh.scale.set(pulse, pulse, pulse);
      pointLight.intensity = 2.2 + Math.sin(elapsedTime * 2.8) * 0.6;

      // Particle gentle counter-spin
      particles.rotation.y -= 0.002;

      // Highlight selected or hovered spheres
      sphereMeshes.forEach(({ mesh, node }) => {
        const isHovered = hoveredNode?.id === node.id;
        const isSelected = selectedDimensionKey === node.id;
        const scaleVal = isHovered || isSelected ? 1.55 : 1.0;
        mesh.scale.lerp(new THREE.Vector3(scaleVal, scaleVal, scaleVal), 0.15);
      });

      renderer.render(scene, camera);
    };

    animate();

    // Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !renderer || !camera) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
    resizeObserver.observe(container);

    // Reset function exposed via ref/clean
    const handleReset = () => {
      holocronGroup.rotation.x = 0.35;
      holocronGroup.rotation.y = 0.45;
    };
    (container as any).__resetHolocron = handleReset;

    // Cleanup resources to prevent memory leaks
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('click', onClick);

      document.body.style.cursor = 'default';

      // Dispose Three.js objects
      polyGeometry.dispose();
      crystalMat.dispose();
      wireframeGeo.dispose();
      wireframeMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      sphereGeo.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      axisMat.dispose();
      renderer.dispose();
    };
  }, [nodes, isRotating, specialtyHouse, hoveredNode, selectedDimensionKey, onSelectDimension]);

  const handleResetAngle = () => {
    if (containerRef.current && (containerRef.current as any).__resetHolocron) {
      (containerRef.current as any).__resetHolocron();
    }
  };

  return (
    <div className="w-full relative flex flex-col items-center">
      {/* 3D WebGL Canvas Container with Subtle Radial Backdrop */}
      <div
        ref={containerRef}
        className="w-full h-[320px] sm:h-[380px] md:h-[420px] relative rounded-2xl overflow-hidden bg-radial-gradient from-black/80 via-black/90 to-black/95 border border-gold/20 shadow-[inset_0_0_60px_rgba(0,0,0,0.8)] select-none touch-none"
      >
        {/* Holographic background grid lines */}
        <div className="absolute inset-0 bg-[radial-gradient(#c5a059_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 pointer-events-none" />

        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* 3D Floating HUD Tooltip when hovering over a node */}
        {hoveredNode && (
          <div className="absolute top-4 left-4 right-4 sm:right-auto sm:max-w-xs z-20 pointer-events-none animate-in fade-in zoom-in-95 duration-200">
            <div className="p-3.5 rounded-xl bg-black/80 border border-gold/40 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.8)] space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] uppercase tracking-widest font-mono font-bold text-parchment flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full inline-block shadow-[0_0_8px_currentColor]"
                    style={{ backgroundColor: hoveredNode.color, color: hoveredNode.color }}
                  />
                  {hoveredNode.nameEs}
                </span>
                <span
                  className="font-mono text-xs font-black px-1.5 py-0.5 rounded bg-white/10"
                  style={{ color: hoveredNode.color }}
                >
                  {hoveredNode.score}%
                </span>
              </div>
              <p className="text-[11px] text-parchment/80 italic font-sans leading-snug">
                {hoveredNode.description}
              </p>
              <div className="text-[9px] uppercase tracking-wider text-parchment/50 border-t border-white/10 pt-1 font-mono">
                {hoveredNode.clinicalFocus}
              </div>
            </div>
          </div>
        )}

        {/* Interactive Controls Overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs pointer-events-auto">
          {/* Legend / Info hint */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/60 border border-gold/20 text-[10px] text-parchment/70 font-mono backdrop-blur-sm">
            <Sparkles size={11} className="text-gold" />
            <span>Arrastra para rotar · Clic en un nodo para inspeccionar</span>
          </div>

          <div className="flex items-center gap-1.5 ml-auto">
            {/* Auto-rotation Toggle */}
            <button
              onClick={() => setIsRotating(!isRotating)}
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-black/60 hover:bg-gold/20 border border-gold/30 text-parchment hover:text-gold transition-colors flex items-center gap-1.5 text-[10px] font-mono cursor-pointer backdrop-blur-sm"
              title={isRotating ? 'Pausar rotación automática' : 'Reanudar rotación automática'}
            >
              {isRotating ? <Pause size={12} /> : <Play size={12} />}
              <span className="hidden sm:inline">{isRotating ? 'Pausar' : 'Girar'}</span>
            </button>

            {/* Reset Camera Angle */}
            <button
              onClick={handleResetAngle}
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-black/60 hover:bg-gold/20 border border-gold/30 text-parchment hover:text-gold transition-colors flex items-center gap-1.5 text-[10px] font-mono cursor-pointer backdrop-blur-sm"
              title="Restablecer ángulo isométrico"
            >
              <RotateCw size={12} />
              <span className="hidden sm:inline">Recentrar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
