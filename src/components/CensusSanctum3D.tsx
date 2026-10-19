import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { RotateCw, Play, Pause, Sparkles, Eye, Shield, Flame, Heart, Compass, ZoomIn, ZoomOut } from 'lucide-react';
import { HouseType } from './HouseHeroBanner';

export interface HouseCensusData {
  house: HouseType;
  name: string;
  count: number;
  percentage: number;
  color: string;
  hexColor: number;
  label: string;
  motto: string;
  topSpecialties: string[];
}

interface CensusSanctum3DProps {
  selectedHouse: HouseType | null;
  onSelectHouse: (house: HouseType | null) => void;
  data: HouseCensusData[];
}

export const CensusSanctum3D: React.FC<CensusSanctum3DProps> = ({
  selectedHouse,
  onSelectHouse,
  data,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isRotating, setIsRotating] = useState(true);
  const [viewMode, setViewMode] = useState<'sanctum' | 'astrolabe'>('sanctum');
  const [hoveredHouse, setHoveredHouse] = useState<HouseType | null>(null);

  // References for animation
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sanctumGroupRef = useRef<THREE.Group | null>(null);
  const astrolabeGroupRef = useRef<THREE.Group | null>(null);
  const monolithMeshesRef = useRef<{ mesh: THREE.Mesh; house: HouseType; baseEmissive: number }[]>([]);

  // Setup Three.js scene
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
    rendererRef.current = renderer;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 4.2, 7.5);
    camera.lookAt(0, 0.5, 0);
    cameraRef.current = camera;

    // Root groups
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    const sanctumGroup = new THREE.Group();
    rootGroup.add(sanctumGroup);
    sanctumGroupRef.current = sanctumGroup;

    const astrolabeGroup = new THREE.Group();
    rootGroup.add(astrolabeGroup);
    astrolabeGroupRef.current = astrolabeGroup;
    astrolabeGroup.visible = false;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xc5a059, 1.8);
    dirLight1.position.set(5, 10, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 1.2);
    dirLight2.position.set(-6, 4, -4);
    scene.add(dirLight2);

    const centralLight = new THREE.PointLight(0xfef08a, 2.0, 15);
    centralLight.position.set(0, 1.5, 0);
    sanctumGroup.add(centralLight);

    // ==========================================
    // 1. SANCTUM MODE: Arcane Altar & 4 Monoliths
    // ==========================================

    // Altar Base (Circular obsidian & gold dais)
    const daisGeo = new THREE.CylinderGeometry(3.6, 3.8, 0.25, 48);
    const daisMat = new THREE.MeshStandardMaterial({
      color: 0x070c14,
      roughness: 0.4,
      metalness: 0.8,
    });
    const dais = new THREE.Mesh(daisGeo, daisMat);
    dais.position.y = -0.125;
    sanctumGroup.add(dais);

    // Concentric Golden Rings on Altar floor
    [1.8, 2.6, 3.4].forEach((radius, i) => {
      const ringGeo = new THREE.RingGeometry(radius, radius + 0.04, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xc5a059,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4 + i * 0.15,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.01;
      sanctumGroup.add(ring);
    });

    // Central Core Astrolabe inside Sanctum
    const coreAstrolabe = new THREE.Group();
    sanctumGroup.add(coreAstrolabe);

    const armillaryRing1Geo = new THREE.TorusGeometry(0.85, 0.02, 16, 64);
    const armillaryRingMat = new THREE.MeshStandardMaterial({
      color: 0xc5a059,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x78561d,
      emissiveIntensity: 0.3,
    });
    const ring1 = new THREE.Mesh(armillaryRing1Geo, armillaryRingMat);
    coreAstrolabe.add(ring1);

    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.02, 16, 64), armillaryRingMat);
    ring2.rotation.x = Math.PI / 3;
    coreAstrolabe.add(ring2);

    const ring3 = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.02, 16, 64), armillaryRingMat);
    ring3.rotation.y = Math.PI / 3;
    coreAstrolabe.add(ring3);

    // Central Glowing Crystal Orb
    const orbGeo = new THREE.SphereGeometry(0.28, 24, 24);
    const orbMat = new THREE.MeshStandardMaterial({
      color: 0xfffbeb,
      emissive: 0xc5a059,
      emissiveIntensity: 0.8,
      roughness: 0.1,
    });
    const centralOrb = new THREE.Mesh(orbGeo, orbMat);
    coreAstrolabe.add(centralOrb);
    coreAstrolabe.position.y = 1.2;

    // 4 House Monoliths positioned at N, E, S, W
    const monoliths: { mesh: THREE.Mesh; house: HouseType; baseEmissive: number }[] = [];
    const housePositions: { house: HouseType; angle: number }[] = [
      { house: 'Gryffindor', angle: 0 }, // North (0 rad)
      { house: 'Ravenclaw', angle: Math.PI / 2 }, // East
      { house: 'Slytherin', angle: Math.PI }, // South
      { house: 'Hufflepuff', angle: (3 * Math.PI) / 2 }, // West
    ];

    const radius = 2.4;

    housePositions.forEach(({ house, angle }) => {
      const houseData = data.find((d) => d.house === house);
      const percentage = houseData?.percentage ?? 25;
      const height = 1.0 + (percentage / 100) * 4.5; // Scaled height based on census proportion!

      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;

      const monoGroup = new THREE.Group();
      monoGroup.position.set(x, 0, z);
      sanctumGroup.add(monoGroup);

      // Monolith body: faceted hexagonal crystal obelisk
      const columnGeo = new THREE.CylinderGeometry(0.24, 0.32, height, 6);
      const columnMat = new THREE.MeshStandardMaterial({
        color: houseData?.hexColor ?? 0xffffff,
        emissive: houseData?.hexColor ?? 0xffffff,
        emissiveIntensity: 0.45,
        roughness: 0.2,
        metalness: 0.7,
      });
      const column = new THREE.Mesh(columnGeo, columnMat);
      column.position.y = height / 2;
      monoGroup.add(column);

      // Save for raycasting and hover
      column.userData = { house };
      monoliths.push({ mesh: column, house, baseEmissive: 0.45 });

      // Crystalline Octahedron Cap floating above monolith
      const capGeo = new THREE.OctahedronGeometry(0.2, 0);
      const capMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: houseData?.hexColor ?? 0xffffff,
        emissiveIntensity: 0.9,
        roughness: 0.1,
      });
      const cap = new THREE.Mesh(capGeo, capMat);
      cap.position.y = height + 0.3;
      monoGroup.add(cap);

      // Light beam / Halo ring under each monolith
      const baseHaloGeo = new THREE.RingGeometry(0.38, 0.48, 32);
      const baseHaloMat = new THREE.MeshBasicMaterial({
        color: houseData?.hexColor ?? 0xffffff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.75,
      });
      const baseHalo = new THREE.Mesh(baseHaloGeo, baseHaloMat);
      baseHalo.rotation.x = -Math.PI / 2;
      baseHalo.position.y = 0.02;
      monoGroup.add(baseHalo);

      // Dedicated Point Light for House Monolith
      const housePointLight = new THREE.PointLight(houseData?.hexColor ?? 0xffffff, 1.8, 4);
      housePointLight.position.set(0, height + 0.2, 0);
      monoGroup.add(housePointLight);
    });

    monolithMeshesRef.current = monoliths;

    // ==========================================
    // 2. ASTROLABE MODE: 51 Specialty Star Nodes
    // ==========================================
    const astrolabeSphereGeo = new THREE.SphereGeometry(2.8, 32, 32);
    const astrolabeSphereMat = new THREE.MeshBasicMaterial({
      color: 0x0f172a,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const astrolabeSphere = new THREE.Mesh(astrolabeSphereGeo, astrolabeSphereMat);
    astrolabeGroup.add(astrolabeSphere);

    // 51 Stars in clusters by house
    const starCount = 51;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      // Allocate to house
      const houseIndex = i % 4;
      const targetHouse = housePositions[houseIndex].house;
      const hData = data.find((d) => d.house === targetHouse);
      const c = new THREE.Color(hData?.hexColor ?? 0xffffff);

      const phi = (i / starCount) * Math.PI * 2;
      const theta = (Math.PI / 6) + (houseIndex * Math.PI) / 3 + (Math.sin(i * 3) * 0.3);
      const r = 2.4 + Math.sin(i * 5) * 0.4;

      const px = r * Math.sin(theta) * Math.cos(phi);
      const py = r * Math.sin(theta) * Math.sin(phi);
      const pz = r * Math.cos(theta);

      starPositions[i * 3] = px;
      starPositions[i * 3 + 1] = py;
      starPositions[i * 3 + 2] = pz;

      starColors[i * 3] = c.r;
      starColors[i * 3 + 1] = c.g;
      starColors[i * 3 + 2] = c.b;

      // Small glowing spheres for specialty nodes
      const nodeGeo = new THREE.SphereGeometry(0.065, 12, 12);
      const nodeMat = new THREE.MeshStandardMaterial({
        color: c,
        emissive: c,
        emissiveIntensity: 0.8,
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.set(px, py, pz);
      nodeMesh.userData = { house: targetHouse };
      astrolabeGroup.add(nodeMesh);
      monoliths.push({ mesh: nodeMesh, house: targetHouse, baseEmissive: 0.8 });
    }

    // Floating Magical Dust Motes
    const dustCount = 120;
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i += 3) {
      dustPositions[i] = (Math.random() - 0.5) * 8;
      dustPositions[i + 1] = Math.random() * 5;
      dustPositions[i + 2] = (Math.random() - 0.5) * 8;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xc5a059,
      size: 0.04,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const dustPoints = new THREE.Points(dustGeo, dustMat);
    rootGroup.add(dustPoints);

    // Initial tilt
    rootGroup.rotation.x = 0.2;

    // Raycaster for Hover & Selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const getPointerPos = (e: MouseEvent | Touch) => {
      const rect = container.getBoundingClientRect();
      return {
        x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
        y: -((e.clientY - rect.top) / rect.height) * 2 + 1,
      };
    };

    const handlePointerMove = (e: MouseEvent) => {
      const pos = getPointerPos(e);
      mouse.x = pos.x;
      mouse.y = pos.y;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(
        monolithMeshesRef.current.map((m) => m.mesh),
        false
      );

      if (intersects.length > 0) {
        const item = monolithMeshesRef.current.find((m) => m.mesh === intersects[0].object);
        if (item) {
          setHoveredHouse(item.house);
          canvas.style.cursor = 'pointer';
          return;
        }
      }
      setHoveredHouse(null);
      canvas.style.cursor = 'grab';
    };

    const handlePointerClick = (e: MouseEvent) => {
      const pos = getPointerPos(e);
      mouse.x = pos.x;
      mouse.y = pos.y;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(
        monolithMeshesRef.current.map((m) => m.mesh),
        false
      );

      if (intersects.length > 0) {
        const item = monolithMeshesRef.current.find((m) => m.mesh === intersects[0].object);
        if (item) {
          onSelectHouse(item.house === selectedHouse ? null : item.house);
        }
      }
    };

    // Orbit Drag Interaction
    let isMouseDown = false;
    let prevMouse = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isMouseDown = true;
      prevMouse = { x: e.clientX, y: e.clientY };
      canvas.style.cursor = 'grabbing';
    };

    const onMouseMove = (e: MouseEvent) => {
      handlePointerMove(e);
      if (!isMouseDown) return;

      const deltaX = e.clientX - prevMouse.x;
      const deltaY = e.clientY - prevMouse.y;

      rootGroup.rotation.y += deltaX * 0.008;
      rootGroup.rotation.x = Math.max(
        0.05,
        Math.min(0.85, rootGroup.rotation.x + deltaY * 0.005)
      );

      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isMouseDown = false;
      canvas.style.cursor = 'grab';
    };

    // Touch support for mobile
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isMouseDown = true;
        prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isMouseDown || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMouse.x;
      const deltaY = e.touches[0].clientY - prevMouse.y;

      rootGroup.rotation.y += deltaX * 0.008;
      rootGroup.rotation.x = Math.max(
        0.05,
        Math.min(0.85, rootGroup.rotation.x + deltaY * 0.005)
      );

      prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchEnd = () => {
      isMouseDown = false;
    };

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('click', handlePointerClick);
    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    canvas.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Continuous subtle auto-rotation if enabled
      if (isRotating && !isMouseDown) {
        rootGroup.rotation.y += delta * 0.18;
      }

      // Rotate Astrolabe rings
      ring1.rotation.z += delta * 0.35;
      ring2.rotation.y += delta * 0.45;
      ring3.rotation.x += delta * 0.25;

      // Pulse Central Orb
      const scale = 1 + Math.sin(time * 2.5) * 0.08;
      centralOrb.scale.set(scale, scale, scale);

      // Rotate Dust Points
      dustPoints.rotation.y -= delta * 0.05;

      // Pulse selected / hovered monolith emissive
      monolithMeshesRef.current.forEach(({ mesh, house, baseEmissive }) => {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        const isTarget = house === selectedHouse || house === hoveredHouse;
        if (isTarget) {
          mat.emissiveIntensity = 0.9 + Math.sin(time * 6) * 0.3;
        } else {
          mat.emissiveIntensity = baseEmissive;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('click', handlePointerClick);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);

      daisGeo.dispose();
      daisMat.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      armillaryRing1Geo.dispose();
      armillaryRingMat.dispose();
      orbGeo.dispose();
      orbMat.dispose();
      renderer.dispose();
    };
  }, [data]);

  // Synchronize view mode between sanctum and astrolabe
  useEffect(() => {
    if (sanctumGroupRef.current && astrolabeGroupRef.current) {
      sanctumGroupRef.current.visible = viewMode === 'sanctum';
      astrolabeGroupRef.current.visible = viewMode === 'astrolabe';
    }
  }, [viewMode]);

  // Zoom helpers
  const handleZoom = (factor: number) => {
    if (!cameraRef.current) return;
    const cam = cameraRef.current;
    cam.position.multiplyScalar(factor);
    cam.position.y = Math.max(2, Math.min(8, cam.position.y));
  };

  const activeFocus = hoveredHouse || selectedHouse;
  const activeFocusData = useMemo(() => {
    if (!activeFocus) return null;
    return data.find((d) => d.house === activeFocus);
  }, [activeFocus, data]);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-b from-[#08101a] via-[#050b12] to-[#03060a] shadow-2xl">
      {/* 3D Canvas Viewport */}
      <div
        ref={containerRef}
        className="relative h-[420px] w-full sm:h-[500px] cursor-grab select-none"
      >
        <canvas ref={canvasRef} className="h-full w-full" />

        {/* Top Controls Overlay */}
        <div className="pointer-events-none absolute left-4 right-4 top-4 flex items-center justify-between">
          <div className="pointer-events-auto flex items-center gap-2 rounded-xl border border-gold/25 bg-[#09111c]/90 px-3 py-1.5 backdrop-blur-md">
            <Sparkles size={14} className="text-gold" />
            <span className="font-mono text-xs uppercase tracking-widest text-parchment font-bold">
              Observatorio 3D del Censo
            </span>
          </div>

          <div className="pointer-events-auto flex items-center gap-1.5 rounded-xl border border-gold/25 bg-[#09111c]/90 p-1 backdrop-blur-md">
            {/* View Mode Toggle */}
            <button
              onClick={() => setViewMode(viewMode === 'sanctum' ? 'astrolabe' : 'sanctum')}
              className="rounded-lg px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-gold transition-colors hover:bg-gold/20"
              title="Cambiar vista 3D"
            >
              {viewMode === 'sanctum' ? 'Ver Orbe Constelación' : 'Ver Monolitos'}
            </button>

            {/* Rotation Toggle */}
            <button
              onClick={() => setIsRotating(!isRotating)}
              className="rounded-lg p-1.5 text-parchment/70 transition-colors hover:bg-gold/20 hover:text-gold"
              title={isRotating ? 'Pausar rotación' : 'Reanudar rotación'}
            >
              {isRotating ? <Pause size={14} /> : <Play size={14} />}
            </button>

            {/* Zoom Controls */}
            <button
              onClick={() => handleZoom(0.85)}
              className="rounded-lg p-1.5 text-parchment/70 transition-colors hover:bg-gold/20 hover:text-gold"
              title="Acercar"
            >
              <ZoomIn size={14} />
            </button>
            <button
              onClick={() => handleZoom(1.15)}
              className="rounded-lg p-1.5 text-parchment/70 transition-colors hover:bg-gold/20 hover:text-gold"
              title="Alejar"
            >
              <ZoomOut size={14} />
            </button>
          </div>
        </div>

        {/* Bottom Interactive Telemetry HUD Card */}
        <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          {/* Active House Inspect Card */}
          {activeFocusData ? (
            <div
              className="pointer-events-auto rounded-xl border p-4 shadow-xl backdrop-blur-md max-w-md w-full transition-all"
              style={{
                backgroundColor: 'rgba(9, 17, 28, 0.95)',
                borderColor: activeFocusData.color,
                boxShadow: `0 0 30px ${activeFocusData.color}33`,
              }}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: activeFocusData.color }}
                  />
                  <h4 className="font-magic text-base font-bold text-parchment">
                    {activeFocusData.name}
                  </h4>
                </div>
                <span className="font-mono text-xs font-bold text-gold">
                  {activeFocusData.percentage}% del Censo
                </span>
              </div>

              <p className="font-mono text-[10px] italic text-parchment/60 mt-0.5">
                "{activeFocusData.motto}"
              </p>

              <div className="mt-2.5 grid grid-cols-2 gap-2 text-xs border-t border-white/10 pt-2">
                <div>
                  <span className="text-[10px] uppercase text-parchment/60 block">Postulantes:</span>
                  <span className="font-bold text-parchment">{activeFocusData.count.toLocaleString('es-ES')} médicos</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-parchment/60 block">Especialidades:</span>
                  <span className="text-[11px] text-gold font-medium line-clamp-1">
                    {activeFocusData.topSpecialties.slice(0, 2).join(', ')}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="pointer-events-auto rounded-xl border border-gold/20 bg-[#09111c]/90 px-4 py-2.5 backdrop-blur-md text-xs text-parchment/70 flex items-center gap-2">
              <Compass size={15} className="text-gold shrink-0 animate-spin-slow" />
              <span>Haz clic o arrastra para rotar en 3D. Selecciona cualquier monolito de Casa para inspeccionarlo.</span>
            </div>
          )}

          {/* Quick House Select Badges */}
          <div className="pointer-events-auto flex flex-wrap gap-1.5 self-start sm:self-auto">
            {data.map((item) => {
              const isSelected = selectedHouse === item.house;
              return (
                <button
                  key={item.house}
                  onClick={() => onSelectHouse(isSelected ? null : item.house)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold uppercase transition-all ${
                    isSelected
                      ? 'border text-white shadow-md'
                      : 'border border-white/10 bg-black/40 text-parchment/60 hover:text-parchment hover:border-gold/40'
                  }`}
                  style={{
                    backgroundColor: isSelected ? `${item.color}44` : undefined,
                    borderColor: isSelected ? item.color : undefined,
                  }}
                >
                  {item.house}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
