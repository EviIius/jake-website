import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { SceneSection } from "../../types/content";

type CircuitBoardSceneProps = {
  sections: SceneSection[];
  activeSectionId: string;
  reducedMotion: boolean;
};

type TraceStripSpec = {
  from: THREE.Vector3;
  to: THREE.Vector3;
  width: number;
  color: string;
  opacity: number;
};

type ComponentSpec = {
  x: number;
  z: number;
  width: number;
  depth: number;
  height: number;
  color: string;
};

const BOARD_Y = -2.2;
const TRACE_Y = BOARD_Y + 0.075;
const PULSE_Y = BOARD_Y + 0.2;

const circuitColors = {
  background: "#03110d",
  fog: "#03110d",
  board: "#07241b",
  boardDeep: "#03140f",
  solderMask: "#0a3327",
  copper: "#d59f4a",
  copperDim: "#765d33",
  chip: "#101a17",
  chipTop: "#172720",
  pin: "#b8c9b5",
  text: "#edf8ee",
  mint: "#5be7c4",
  green: "#9ef0b8",
  amber: "#ffbf5f",
  coral: "#ff6f61",
  purple: "#d77aff"
};

const componentPalettes = [
  ["#182b23", "#1f342a", "#253d32", "#14231d"],
  ["#243025", "#2d3b2e", "#354536", "#1a261d"],
  ["#30261f", "#403329", "#4c3d30", "#211b17"],
  ["#2b2636", "#372e45", "#443752", "#211d2b"],
  ["#223234", "#2f4244", "#3a5152", "#192729"],
  ["#2b3324", "#394431", "#45533b", "#20281c"]
];

function createSeededRandom(seed: number) {
  let state = seed % 2147483647;
  if (state <= 0) {
    state += 2147483646;
  }

  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}

function getCircuitPosition(section: SceneSection, index: number) {
  const [x, y, z] = section.position;
  const compactX = x * 0.78;
  const compactZ = z * 1.68 + y * 0.78 + (index % 2 === 0 ? -0.24 : 0.24);

  return new THREE.Vector3(compactX, BOARD_Y, compactZ);
}

function cloneWithY(point: THREE.Vector3, y: number) {
  return new THREE.Vector3(point.x, y, point.z);
}

function getTracePoints(from: THREE.Vector3, to: THREE.Vector3, y = TRACE_Y) {
  const start = cloneWithY(from, y);
  const end = cloneWithY(to, y);
  const horizontalFirst = Math.abs(start.x - end.x) > Math.abs(start.z - end.z);
  const lead = horizontalFirst
    ? new THREE.Vector3(THREE.MathUtils.lerp(start.x, end.x, 0.5), y, start.z)
    : new THREE.Vector3(start.x, y, THREE.MathUtils.lerp(start.z, end.z, 0.5));
  const follow = horizontalFirst
    ? new THREE.Vector3(lead.x, y, end.z)
    : new THREE.Vector3(end.x, y, lead.z);

  return [start, lead, follow, end];
}

function getPolylineLength(points: THREE.Vector3[]) {
  let length = 0;

  for (let index = 1; index < points.length; index += 1) {
    length += points[index - 1].distanceTo(points[index]);
  }

  return length;
}

function samplePolyline(points: THREE.Vector3[], distance: number, loop: boolean) {
  const totalLength = Math.max(getPolylineLength(points), 0.001);
  let remaining = loop ? distance % totalLength : Math.min(distance, totalLength);

  for (let index = 1; index < points.length; index += 1) {
    const from = points[index - 1];
    const to = points[index];
    const segmentLength = from.distanceTo(to);

    if (remaining <= segmentLength || index === points.length - 1) {
      const progress = segmentLength === 0 ? 0 : remaining / segmentLength;
      return {
        position: from.clone().lerp(to, THREE.MathUtils.clamp(progress, 0, 1)),
        tangent: to.clone().sub(from).normalize(),
        done: !loop && distance >= totalLength
      };
    }

    remaining -= segmentLength;
  }

  return {
    position: points[points.length - 1].clone(),
    tangent: new THREE.Vector3(1, 0, 0),
    done: true
  };
}

function buildChipLoop(center: THREE.Vector3) {
  const y = PULSE_Y;
  const width = 0.98;
  const depth = 0.72;

  return [
    new THREE.Vector3(center.x - width, y, center.z - depth),
    new THREE.Vector3(center.x + width, y, center.z - depth),
    new THREE.Vector3(center.x + width, y, center.z + depth),
    new THREE.Vector3(center.x - width, y, center.z + depth),
    new THREE.Vector3(center.x - width, y, center.z - depth)
  ];
}

function generateComponents(sectionIndex: number) {
  const rng = createSeededRandom(4600 + sectionIndex * 113);
  const palette = componentPalettes[sectionIndex % componentPalettes.length];
  const specs: ComponentSpec[] = [];

  for (let index = 0; index < 18; index += 1) {
    const side = index % 4;
    const spread = 0.88 + rng() * 0.36;
    const isHorizontalSide = side < 2;
    const x = isHorizontalSide
      ? -1.02 + rng() * 2.04
      : (side === 2 ? -spread : spread) + (rng() - 0.5) * 0.16;
    const z = isHorizontalSide
      ? (side === 0 ? -spread : spread) + (rng() - 0.5) * 0.18
      : -0.78 + rng() * 1.56;

    specs.push({
      x,
      z,
      width: isHorizontalSide ? 0.16 + rng() * 0.24 : 0.12 + rng() * 0.16,
      depth: isHorizontalSide ? 0.12 + rng() * 0.16 : 0.16 + rng() * 0.24,
      height: 0.08 + rng() * 0.18,
      color: palette[Math.floor(rng() * palette.length)]
    });
  }

  return specs;
}

function TraceStrip({ from, to, width, color, opacity }: TraceStripSpec) {
  const deltaX = to.x - from.x;
  const deltaZ = to.z - from.z;
  const length = Math.max(Math.hypot(deltaX, deltaZ), 0.001);
  const angle = Math.atan2(deltaZ, deltaX);

  return (
    <mesh position={[(from.x + to.x) / 2, TRACE_Y, (from.z + to.z) / 2]} rotation={[0, -angle, 0]}>
      <boxGeometry args={[length, 0.026, width]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.08}
        roughness={0.48}
        metalness={0.18}
        transparent
        opacity={opacity}
      />
    </mesh>
  );
}

function CircuitBoardBase() {
  return (
    <group>
      <mesh position={[0, BOARD_Y - 0.035, -0.35]}>
        <boxGeometry args={[25.5, 0.09, 16.5]} />
        <meshStandardMaterial color={circuitColors.boardDeep} roughness={0.88} metalness={0.05} />
      </mesh>
      <mesh position={[0, BOARD_Y + 0.005, -0.35]}>
        <boxGeometry args={[24.6, 0.035, 15.6]} />
        <meshStandardMaterial
          color={circuitColors.board}
          emissive={circuitColors.solderMask}
          emissiveIntensity={0.18}
          roughness={0.78}
          metalness={0.03}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, BOARD_Y + 0.035, -0.35]}>
        <planeGeometry args={[24.2, 15.2, 1, 1]} />
        <meshBasicMaterial color="#0d3b2c" transparent opacity={0.1} depthWrite={false} />
      </mesh>
    </group>
  );
}

function BoardTraceGrid() {
  const strips = useMemo(() => {
    const specs: TraceStripSpec[] = [];

    for (let x = -11.2; x <= 11.2; x += 1.6) {
      specs.push({
        from: new THREE.Vector3(x, TRACE_Y, -7.3),
        to: new THREE.Vector3(x, TRACE_Y, 6.5),
        width: x % 3.2 === 0 ? 0.035 : 0.022,
        color: circuitColors.copperDim,
        opacity: 0.22
      });
    }

    for (let z = -7.1; z <= 6.4; z += 1.35) {
      specs.push({
        from: new THREE.Vector3(-11.8, TRACE_Y, z),
        to: new THREE.Vector3(11.8, TRACE_Y, z),
        width: Math.abs(z) < 0.6 ? 0.04 : 0.024,
        color: circuitColors.copperDim,
        opacity: Math.abs(z) < 0.6 ? 0.32 : 0.18
      });
    }

    return specs;
  }, []);

  return (
    <group>
      {strips.map((strip, index) => (
        <TraceStrip key={index} {...strip} />
      ))}
    </group>
  );
}

function CircuitNetwork({ circuitPositions }: { circuitPositions: THREE.Vector3[] }) {
  const routeGroups = useMemo(
    () =>
      circuitPositions.slice(0, -1).map((position, index) => ({
        points: getTracePoints(position, circuitPositions[index + 1]),
        stripPoints: getTracePoints(position, circuitPositions[index + 1], TRACE_Y - 0.008),
        color:
          index % 3 === 0
            ? circuitColors.mint
            : index % 3 === 1
              ? circuitColors.amber
              : circuitColors.coral
      })),
    [circuitPositions]
  );

  const strips = useMemo(
    () =>
      routeGroups.flatMap((route) =>
        route.stripPoints.slice(1).map((point, index) => ({
          from: route.stripPoints[index],
          to: point,
          width: 0.075,
          color: circuitColors.copper,
          opacity: 0.7
        }))
      ),
    [routeGroups]
  );

  return (
    <group>
      {strips.map((strip, index) => (
        <TraceStrip key={index} {...strip} />
      ))}

      {routeGroups.map((route, index) => (
        <Line key={index} points={route.points} color={route.color} lineWidth={1.8} transparent opacity={0.58} />
      ))}

      {routeGroups.flatMap((route, routeIndex) =>
        route.points.map((point, pointIndex) => (
          <mesh key={`${routeIndex}-${pointIndex}`} position={[point.x, TRACE_Y + 0.022, point.z]}>
            <cylinderGeometry args={[0.06, 0.06, 0.032, 22]} />
            <meshStandardMaterial
              color={circuitColors.copper}
              emissive={route.color}
              emissiveIntensity={pointIndex === 0 || pointIndex === route.points.length - 1 ? 0.28 : 0.12}
              roughness={0.42}
              metalness={0.2}
            />
          </mesh>
        ))
      )}
    </group>
  );
}

function ChipPins({ accent, active }: { accent: string; active: boolean }) {
  const pinPositions = useMemo(() => {
    const positions: Array<{ x: number; z: number; rotation: number }> = [];

    for (let index = 0; index < 8; index += 1) {
      const offset = -0.7 + index * 0.2;
      positions.push({ x: offset, z: -0.74, rotation: 0 });
      positions.push({ x: offset, z: 0.74, rotation: 0 });
    }

    for (let index = 0; index < 5; index += 1) {
      const offset = -0.4 + index * 0.2;
      positions.push({ x: -1.02, z: offset, rotation: Math.PI / 2 });
      positions.push({ x: 1.02, z: offset, rotation: Math.PI / 2 });
    }

    return positions;
  }, []);

  return (
    <group>
      {pinPositions.map((pin, index) => (
        <mesh key={index} position={[pin.x, 0.19, pin.z]} rotation={[0, pin.rotation, 0]}>
          <boxGeometry args={[0.08, 0.045, 0.22]} />
          <meshStandardMaterial
            color={circuitColors.pin}
            emissive={accent}
            emissiveIntensity={active ? 0.14 : 0.035}
            roughness={0.36}
            metalness={0.28}
          />
        </mesh>
      ))}
    </group>
  );
}

function CircuitChip({
  section,
  sectionIndex,
  position,
  active
}: {
  section: SceneSection;
  sectionIndex: number;
  position: THREE.Vector3;
  active: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const components = useMemo(() => generateComponents(sectionIndex), [sectionIndex]);
  const accent = section.accent;

  useFrame((state, delta) => {
    if (groupRef.current) {
      const targetScale = active ? 1.08 : 0.95;
      const nextScale = THREE.MathUtils.lerp(
        groupRef.current.scale.x,
        targetScale,
        1 - Math.exp(-delta * 5.4)
      );
      groupRef.current.scale.setScalar(nextScale);
    }

    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.18 + sectionIndex * 0.2;
      const material = ringRef.current.material;
      if (material instanceof THREE.MeshBasicMaterial) {
        material.opacity = active ? 0.22 + Math.sin(state.clock.elapsedTime * 2.4) * 0.05 : 0.07;
      }
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh position={[0, 0.095, 0]}>
        <boxGeometry args={[2.36, 0.12, 1.88]} />
        <meshStandardMaterial
          color={active ? circuitColors.solderMask : "#08251c"}
          emissive={active ? accent : circuitColors.board}
          emissiveIntensity={active ? 0.18 : 0.05}
          transparent
          opacity={active ? 0.86 : 0.64}
          roughness={0.72}
        />
      </mesh>

      <ChipPins accent={accent} active={active} />

      <mesh position={[0, 0.28, 0]}>
        <boxGeometry args={[1.8, 0.34, 1.24]} />
        <meshStandardMaterial
          color={active ? circuitColors.chipTop : circuitColors.chip}
          emissive={accent}
          emissiveIntensity={active ? 0.16 : 0.035}
          roughness={0.62}
          metalness={0.08}
        />
      </mesh>

      <mesh position={[0, 0.475, 0]}>
        <boxGeometry args={[1.2, 0.025, 0.08]} />
        <meshBasicMaterial color={accent} transparent opacity={active ? 0.86 : 0.35} />
      </mesh>
      <mesh position={[-0.46, 0.49, 0.26]}>
        <boxGeometry args={[0.36, 0.025, 0.055]} />
        <meshBasicMaterial color={circuitColors.copper} transparent opacity={active ? 0.72 : 0.28} />
      </mesh>
      <mesh position={[0.48, 0.49, -0.26]}>
        <boxGeometry args={[0.42, 0.025, 0.055]} />
        <meshBasicMaterial color={circuitColors.copper} transparent opacity={active ? 0.72 : 0.28} />
      </mesh>

      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.52, 0]}>
        <ringGeometry args={[1.1, 1.18, 96]} />
        <meshBasicMaterial color={accent} side={THREE.DoubleSide} transparent opacity={0.08} />
      </mesh>

      {components.map((component, index) => (
        <mesh
          key={index}
          position={[component.x, component.height / 2 + 0.1, component.z]}
          rotation={[0, ((index % 3) - 1) * 0.08, 0]}
        >
          <boxGeometry args={[component.width, component.height, component.depth]} />
          <meshStandardMaterial
            color={component.color}
            emissive={active ? accent : circuitColors.boardDeep}
            emissiveIntensity={active ? 0.06 : 0.015}
            roughness={0.68}
          />
        </mesh>
      ))}
    </group>
  );
}

function DataPulse({
  sections,
  circuitPositions,
  activeSectionId,
  reducedMotion
}: {
  sections: SceneSection[];
  circuitPositions: THREE.Vector3[];
  activeSectionId: string;
  reducedMotion: boolean;
}) {
  const pulseRef = useRef<THREE.Group>(null);
  const activeIndex = Math.max(
    0,
    sections.findIndex((section) => section.id === activeSectionId)
  );
  const currentIndexRef = useRef(activeIndex);
  const pathRef = useRef(buildChipLoop(circuitPositions[activeIndex] ?? circuitPositions[0]));
  const distanceRef = useRef(0);
  const transferringRef = useRef(false);

  useFrame((state, delta) => {
    const pulse = pulseRef.current;
    if (!pulse || circuitPositions.length === 0) {
      return;
    }

    if (activeIndex !== currentIndexRef.current && !transferringRef.current) {
      pathRef.current = getTracePoints(
        circuitPositions[currentIndexRef.current],
        circuitPositions[activeIndex],
        PULSE_Y
      );
      distanceRef.current = 0;
      transferringRef.current = true;
    }

    const speed = reducedMotion ? 0 : transferringRef.current ? 5.2 : 1.42;
    distanceRef.current += delta * speed;
    const sample = samplePolyline(pathRef.current, distanceRef.current, !transferringRef.current);

    pulse.position.lerp(sample.position, 1 - Math.exp(-delta * 18));
    const scale = transferringRef.current
      ? 1.12 + Math.sin(state.clock.elapsedTime * 16) * 0.06
      : 0.96 + Math.sin(state.clock.elapsedTime * 9) * 0.05;
    pulse.scale.setScalar(scale);

    if (sample.done && transferringRef.current) {
      currentIndexRef.current = activeIndex;
      pathRef.current = buildChipLoop(circuitPositions[activeIndex]);
      distanceRef.current = 0;
      transferringRef.current = false;
    }
  });

  return (
    <group ref={pulseRef}>
      <mesh>
        <sphereGeometry args={[0.12, 20, 20]} />
        <meshBasicMaterial color={circuitColors.amber} transparent opacity={0.92} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.22, 20, 20]} />
        <meshBasicMaterial color={circuitColors.mint} transparent opacity={0.12} depthWrite={false} />
      </mesh>
      <pointLight color={circuitColors.amber} intensity={0.92} distance={3.4} />
    </group>
  );
}

function CircuitCameraRig({
  sections,
  circuitPositions,
  activeSectionId,
  reducedMotion
}: {
  sections: SceneSection[];
  circuitPositions: THREE.Vector3[];
  activeSectionId: string;
  reducedMotion: boolean;
}) {
  const activeIndex = Math.max(
    0,
    sections.findIndex((section) => section.id === activeSectionId)
  );
  const activePosition = circuitPositions[activeIndex] ?? circuitPositions[0] ?? new THREE.Vector3();
  const cameraTarget = useMemo(
    () => new THREE.Vector3(activePosition.x + 2.8, 5.2, activePosition.z + 5.4),
    [activePosition.x, activePosition.z]
  );
  const lookAtTarget = useMemo(
    () => new THREE.Vector3(activePosition.x, BOARD_Y + 0.24, activePosition.z),
    [activePosition.x, activePosition.z]
  );
  const workingTarget = useRef(lookAtTarget.clone());

  useFrame((state, delta) => {
    const lerpFactor = reducedMotion ? 1 : 1 - Math.exp(-delta * 2);
    state.camera.position.lerp(cameraTarget, lerpFactor);
    workingTarget.current.lerp(lookAtTarget, lerpFactor);
    state.camera.lookAt(workingTarget.current);
  });

  return null;
}

function CircuitBoardScene({ sections, activeSectionId, reducedMotion }: CircuitBoardSceneProps) {
  const circuitPositions = useMemo(
    () => sections.map((section, index) => getCircuitPosition(section, index)),
    [sections]
  );

  return (
    <>
      <color attach="background" args={[circuitColors.background]} />
      <fog attach="fog" args={[circuitColors.fog, 11, 26]} />
      <ambientLight intensity={0.74} />
      <directionalLight position={[5, 8, 5]} intensity={1.04} color="#eaffec" />
      <pointLight position={[-6, 3, 5]} intensity={1.2} color={circuitColors.mint} />
      <pointLight position={[7, 2, -5]} intensity={1.05} color={circuitColors.amber} />
      <pointLight position={[0, 4, -7]} intensity={0.9} color={circuitColors.purple} />

      <CircuitBoardBase />
      <BoardTraceGrid />
      <CircuitNetwork circuitPositions={circuitPositions} />

      {sections.map((section, index) => (
        <CircuitChip
          key={section.id}
          section={section}
          sectionIndex={index}
          position={circuitPositions[index]}
          active={section.id === activeSectionId}
        />
      ))}

      <DataPulse
        sections={sections}
        circuitPositions={circuitPositions}
        activeSectionId={activeSectionId}
        reducedMotion={reducedMotion}
      />
      <CircuitCameraRig
        sections={sections}
        circuitPositions={circuitPositions}
        activeSectionId={activeSectionId}
        reducedMotion={reducedMotion}
      />
    </>
  );
}

export default CircuitBoardScene;
