import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { SceneSection } from "../../types/content";

type CityMapSceneProps = {
  sections: SceneSection[];
  activeSectionId: string;
  reducedMotion: boolean;
};

type BuildingSpec = {
  x: number;
  z: number;
  width: number;
  depth: number;
  height: number;
  color: string;
};

type RoadSegmentSpec = {
  from: THREE.Vector3;
  to: THREE.Vector3;
  width: number;
  opacity: number;
};

const GROUND_Y = -2.36;
const ROAD_Y = GROUND_Y + 0.045;
const TRACE_Y = GROUND_Y + 0.09;
const RUNNER_Y = GROUND_Y + 0.2;
const SKYLINE_Y = GROUND_Y + 0.24;

const cityColors = {
  background: "#06100d",
  fog: "#06100d",
  asphalt: "#07130f",
  road: "#18251f",
  roadShoulder: "#24342c",
  concrete: "#283730",
  glass: "#334840",
  mutedGlass: "#1d2925",
  teal: "#5be7c4",
  mint: "#9ef0b8",
  amber: "#ffbf5f",
  coral: "#ff6f61",
  magenta: "#d77aff",
  white: "#eef8ee"
};

const districtBuildingPalettes = [
  ["#31433b", "#26342f", "#415a4f", "#2b3934"],
  ["#273b35", "#3f5549", "#21312c", "#526a58"],
  ["#3d4134", "#4d553e", "#2d3329", "#5d6449"],
  ["#333044", "#473a54", "#2c2839", "#5c4966"],
  ["#3f342e", "#54423a", "#302823", "#655044"],
  ["#2e3f45", "#3f535a", "#253137", "#53666a"]
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

function getCityPosition(section: SceneSection, index: number) {
  const [x, y, z] = section.position;
  const stagger = index % 2 === 0 ? -0.35 : 0.35;

  return new THREE.Vector3(x, GROUND_Y, y * 1.2 + z * 1.75 + stagger);
}

function cloneWithY(point: THREE.Vector3, y: number) {
  return new THREE.Vector3(point.x, y, point.z);
}

function getRoutePoints(from: THREE.Vector3, to: THREE.Vector3, y = TRACE_Y) {
  const start = cloneWithY(from, y);
  const end = cloneWithY(to, y);
  const midX = THREE.MathUtils.lerp(start.x, end.x, 0.55);
  const firstElbow = new THREE.Vector3(midX, y, start.z);
  const secondElbow = new THREE.Vector3(midX, y, end.z);

  return [start, firstElbow, secondElbow, end];
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
      const segmentProgress = segmentLength === 0 ? 0 : remaining / segmentLength;
      const position = from.clone().lerp(to, THREE.MathUtils.clamp(segmentProgress, 0, 1));
      const tangent = to.clone().sub(from).normalize();

      return { position, tangent, done: !loop && distance >= totalLength };
    }

    remaining -= segmentLength;
  }

  return {
    position: points[points.length - 1].clone(),
    tangent: new THREE.Vector3(1, 0, 0),
    done: true
  };
}

function buildDistrictLoop(center: THREE.Vector3) {
  const y = RUNNER_Y;
  const radiusX = 1.05;
  const radiusZ = 0.82;

  return [
    new THREE.Vector3(center.x - radiusX, y, center.z - radiusZ),
    new THREE.Vector3(center.x + radiusX, y, center.z - radiusZ),
    new THREE.Vector3(center.x + radiusX, y, center.z + radiusZ),
    new THREE.Vector3(center.x - radiusX, y, center.z + radiusZ),
    new THREE.Vector3(center.x - radiusX, y, center.z - radiusZ)
  ];
}

function buildRunnerRoute(from: THREE.Vector3, to: THREE.Vector3) {
  return getRoutePoints(from, to, RUNNER_Y);
}

function getElevatedSignalPoints(from: THREE.Vector3, to: THREE.Vector3, y: number, lift: number) {
  const route = getRoutePoints(from, to, y);
  const middleIndex = Math.floor(route.length / 2);

  return route.map((point, index) => {
    const distanceFromMiddle = Math.abs(index - middleIndex);
    const arcLift = lift * (1 - distanceFromMiddle / Math.max(middleIndex, 1));
    return new THREE.Vector3(point.x, point.y + arcLift, point.z);
  });
}

function generateBuildings(sectionIndex: number) {
  const rng = createSeededRandom(2300 + sectionIndex * 89);
  const palette = districtBuildingPalettes[sectionIndex % districtBuildingPalettes.length];
  const specs: BuildingSpec[] = [];
  const grid = [-1.24, -0.72, -0.2, 0.36, 0.9, 1.34];

  grid.forEach((x, xIndex) => {
    grid.forEach((z, zIndex) => {
      const nearCore = Math.abs(x) < 0.42 && Math.abs(z) < 0.42;
      if (nearCore || rng() < 0.38) {
        return;
      }

      const heightBoost = (xIndex + zIndex + sectionIndex) % 4 === 0 ? 0.34 : 0;
      specs.push({
        x: x + (rng() - 0.5) * 0.14,
        z: z + (rng() - 0.5) * 0.14,
        width: 0.24 + rng() * 0.28,
        depth: 0.22 + rng() * 0.3,
        height: 0.32 + rng() * 1.12 + heightBoost,
        color: palette[Math.floor(rng() * palette.length)]
      });
    });
  });

  return specs;
}

function RoadSegment({ from, to, width, opacity }: RoadSegmentSpec) {
  const deltaX = to.x - from.x;
  const deltaZ = to.z - from.z;
  const length = Math.max(Math.hypot(deltaX, deltaZ), 0.001);
  const angle = Math.atan2(deltaZ, deltaX);

  return (
    <mesh
      position={[(from.x + to.x) / 2, ROAD_Y, (from.z + to.z) / 2]}
      rotation={[0, -angle, 0]}
    >
      <boxGeometry args={[length, 0.045, width]} />
      <meshStandardMaterial
        color={cityColors.road}
        emissive={cityColors.roadShoulder}
        emissiveIntensity={0.06}
        roughness={0.86}
        transparent
        opacity={opacity}
      />
    </mesh>
  );
}

function CityGround() {
  return (
    <group>
      <mesh position={[0, GROUND_Y - 0.035, -0.45]}>
        <boxGeometry args={[28, 0.045, 19]} />
        <meshStandardMaterial color={cityColors.asphalt} roughness={0.94} metalness={0.04} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, GROUND_Y - 0.008, -0.45]}>
        <planeGeometry args={[28, 19, 1, 1]} />
        <meshBasicMaterial
          color="#0d1b15"
          transparent
          opacity={0.72}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function CityStreetGrid() {
  const gridSegments = useMemo(() => {
    const specs: RoadSegmentSpec[] = [];

    for (let x = -12; x <= 12; x += 3) {
      specs.push({
        from: new THREE.Vector3(x, ROAD_Y, -8.4),
        to: new THREE.Vector3(x, ROAD_Y, 6.9),
        width: x % 6 === 0 ? 0.16 : 0.08,
        opacity: x % 6 === 0 ? 0.22 : 0.12
      });
    }

    for (let z = -7; z <= 6; z += 2.6) {
      specs.push({
        from: new THREE.Vector3(-12.5, ROAD_Y, z),
        to: new THREE.Vector3(12.5, ROAD_Y, z),
        width: Math.abs(z) < 1 ? 0.16 : 0.08,
        opacity: Math.abs(z) < 1 ? 0.22 : 0.12
      });
    }

    return specs;
  }, []);

  return (
    <group>
      {gridSegments.map((segment, index) => (
        <RoadSegment key={index} {...segment} />
      ))}
    </group>
  );
}

function MainTransitNetwork({ cityPositions }: { cityPositions: THREE.Vector3[] }) {
  const routeGroups = useMemo(
    () =>
      cityPositions.slice(0, -1).map((position, index) => ({
        points: getRoutePoints(position, cityPositions[index + 1], TRACE_Y),
        roadPoints: getRoutePoints(position, cityPositions[index + 1], ROAD_Y),
        color:
          index % 3 === 0
            ? cityColors.mint
            : index % 3 === 1
              ? cityColors.amber
              : cityColors.magenta
      })),
    [cityPositions]
  );

  const roadSegments = useMemo(
    () =>
      routeGroups.flatMap((route) =>
        route.roadPoints.slice(1).map((point, index) => ({
          from: route.roadPoints[index],
          to: point,
          width: 0.34,
          opacity: 0.74
        }))
      ),
    [routeGroups]
  );

  return (
    <group>
      {roadSegments.map((segment, index) => (
        <RoadSegment key={index} {...segment} />
      ))}

      {routeGroups.map((route, index) => (
        <Line
          key={index}
          points={route.points}
          color={route.color}
          lineWidth={2.4}
          transparent
          opacity={0.72}
        />
      ))}

      {routeGroups.flatMap((route, routeIndex) =>
        route.points.map((point, pointIndex) => (
          <mesh key={`${routeIndex}-${pointIndex}`} position={[point.x, TRACE_Y + 0.014, point.z]}>
            <cylinderGeometry args={[0.08, 0.08, 0.025, 24]} />
            <meshBasicMaterial
              color={route.color}
              transparent
              opacity={pointIndex === 0 || pointIndex === route.points.length - 1 ? 0.74 : 0.36}
            />
          </mesh>
        ))
      )}
    </group>
  );
}

function DataTrafficLayer({
  cityPositions,
  reducedMotion
}: {
  cityPositions: THREE.Vector3[];
  reducedMotion: boolean;
}) {
  const packetRefs = useRef<Array<THREE.Mesh | null>>([]);
  const packetSpecs = useMemo(
    () =>
      cityPositions.slice(0, -1).flatMap((position, index) => {
        const routePoints = getRoutePoints(position, cityPositions[index + 1], TRACE_Y + 0.075);
        const routeLength = getPolylineLength(routePoints);
        const color =
          index % 3 === 0
            ? cityColors.teal
            : index % 3 === 1
              ? cityColors.amber
              : cityColors.coral;

        return [0, 0.5].map((offset) => ({
          color,
          offset: routeLength * offset,
          routeLength,
          routePoints,
          speed: 0.72 + index * 0.04
        }));
      }),
    [cityPositions]
  );

  useFrame((state) => {
    if (reducedMotion) {
      return;
    }

    packetRefs.current.forEach((packet, index) => {
      const spec = packetSpecs[index];
      if (!packet || !spec) {
        return;
      }

      const sample = samplePolyline(
        spec.routePoints,
        state.clock.elapsedTime * spec.speed + spec.offset,
        true
      );
      packet.position.copy(sample.position);
      packet.scale.setScalar(0.82 + Math.sin(state.clock.elapsedTime * 5 + index) * 0.08);
    });
  });

  return (
    <group>
      {packetSpecs.map((spec, index) => (
        <mesh
          key={index}
          ref={(node) => {
            packetRefs.current[index] = node;
          }}
        >
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshBasicMaterial color={spec.color} transparent opacity={0.88} />
        </mesh>
      ))}
    </group>
  );
}

function ElevatedSignalLayer({ cityPositions }: { cityPositions: THREE.Vector3[] }) {
  const ribbons = useMemo(
    () =>
      cityPositions.slice(0, -1).map((position, index) => ({
        color:
          index % 3 === 0
            ? cityColors.mint
            : index % 3 === 1
              ? cityColors.amber
              : cityColors.magenta,
        points: getElevatedSignalPoints(
          position,
          cityPositions[index + 1],
          SKYLINE_Y + 0.52 + (index % 2) * 0.16,
          0.72 + (index % 3) * 0.12
        )
      })),
    [cityPositions]
  );

  return (
    <group>
      {ribbons.map((ribbon, index) => (
        <group key={index}>
          <Line points={ribbon.points} color={ribbon.color} lineWidth={1.6} transparent opacity={0.34} />
          {ribbon.points.slice(1, -1).map((point, pointIndex) => (
            <mesh key={pointIndex} position={point}>
              <sphereGeometry args={[0.045, 12, 12]} />
              <meshBasicMaterial color={ribbon.color} transparent opacity={0.46} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

function CircuitTraceLayer({ cityPositions }: { cityPositions: THREE.Vector3[] }) {
  const traces = useMemo(
    () =>
      cityPositions.map((position, index) => {
        const side = index % 2 === 0 ? 1 : -1;
        const y = TRACE_Y + 0.018;
        const offset = 1.62 + (index % 3) * 0.18;

        return {
          points: [
            new THREE.Vector3(position.x - 0.28, y, position.z + side * 0.22),
            new THREE.Vector3(position.x - offset, y, position.z + side * 0.22),
            new THREE.Vector3(position.x - offset, y, position.z + side * 1.06),
            new THREE.Vector3(position.x - offset - side * 0.7, y, position.z + side * 1.06)
          ],
          color: index % 3 === 0 ? cityColors.teal : index % 3 === 1 ? cityColors.amber : cityColors.coral
        };
      }),
    [cityPositions]
  );

  return (
    <group>
      {traces.map((trace, traceIndex) => (
        <group key={traceIndex}>
          <Line points={trace.points} color={trace.color} lineWidth={1.5} transparent opacity={0.46} />
          {trace.points.slice(1).map((point, pointIndex) => (
            <mesh key={pointIndex} position={[point.x, point.y + 0.012, point.z]}>
              <cylinderGeometry args={[0.05, 0.05, 0.018, 18]} />
              <meshBasicMaterial color={trace.color} transparent opacity={0.52} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

function DistrictNode({
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
  const buildings = useMemo(() => generateBuildings(sectionIndex), [sectionIndex]);
  const pulseRef = useRef<THREE.Mesh>(null);
  const sweepRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const accent = section.accent;

  useFrame((state, delta) => {
    if (groupRef.current) {
      const targetScale = active ? 1.06 : 0.94;
      const nextScale = THREE.MathUtils.lerp(
        groupRef.current.scale.x,
        targetScale,
        1 - Math.exp(-delta * 5)
      );
      groupRef.current.scale.setScalar(nextScale);
    }

    if (pulseRef.current) {
      pulseRef.current.rotation.z = state.clock.elapsedTime * 0.2 + sectionIndex * 0.18;
      const material = pulseRef.current.material;
      if (material instanceof THREE.MeshBasicMaterial) {
        material.opacity = active
          ? 0.22 + Math.sin(state.clock.elapsedTime * 2.2 + sectionIndex) * 0.055
          : 0.075;
      }
    }

    if (sweepRef.current) {
      sweepRef.current.rotation.y = state.clock.elapsedTime * 0.36 + sectionIndex * 0.2;
      const material = sweepRef.current.material;
      if (material instanceof THREE.MeshBasicMaterial) {
        material.opacity = active ? 0.32 + Math.sin(state.clock.elapsedTime * 3 + sectionIndex) * 0.06 : 0;
      }
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh position={[0, 0.03, 0]} rotation={[0, Math.PI / 6, 0]}>
        <cylinderGeometry args={[1.76, 1.86, 0.07, 6]} />
        <meshStandardMaterial
          color={cityColors.concrete}
          emissive={active ? accent : cityColors.mutedGlass}
          emissiveIntensity={active ? 0.2 : 0.04}
          transparent
          opacity={active ? 0.78 : 0.52}
          roughness={0.82}
        />
      </mesh>

      <mesh ref={pulseRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.085, 0]}>
        <ringGeometry args={[1.35, 1.48, 96]} />
        <meshBasicMaterial color={accent} side={THREE.DoubleSide} transparent opacity={0.1} />
      </mesh>

      <mesh ref={sweepRef} position={[0, 0.42, 0]}>
        <boxGeometry args={[2.8, 0.025, 0.045]} />
        <meshBasicMaterial color={accent} transparent opacity={0} depthWrite={false} />
      </mesh>

      <mesh position={[0, 0.13, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.08, 32]} />
        <meshStandardMaterial
          color={active ? cityColors.white : cityColors.glass}
          emissive={accent}
          emissiveIntensity={active ? 0.75 : 0.18}
          roughness={0.42}
          metalness={0.08}
        />
      </mesh>

      <mesh position={[0, 0.68, 0]}>
        <boxGeometry args={[0.06, 1.16, 0.06]} />
        <meshStandardMaterial
          color={cityColors.white}
          emissive={accent}
          emissiveIntensity={active ? 0.56 : 0.18}
          roughness={0.34}
        />
      </mesh>

      <mesh position={[0, 1.36, 0]} rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[0.54, 0.16, 0.54]} />
        <meshStandardMaterial
          color={active ? accent : cityColors.glass}
          emissive={accent}
          emissiveIntensity={active ? 0.88 : 0.2}
          roughness={0.36}
          metalness={0.12}
        />
      </mesh>

      {buildings.map((building, index) => {
        const activeHeight = active ? building.height * 1.14 : building.height * 0.9;
        return (
          <group
            key={index}
            position={[building.x, activeHeight / 2 + 0.05, building.z]}
            rotation={[0, ((index % 3) - 1) * 0.06, 0]}
          >
            <mesh>
              <boxGeometry args={[building.width, activeHeight, building.depth]} />
              <meshStandardMaterial
                color={active ? building.color : cityColors.mutedGlass}
                emissive={active ? accent : "#06100d"}
                emissiveIntensity={active ? 0.1 : 0.015}
                roughness={0.78}
                metalness={0.08}
              />
            </mesh>
            {active && index % 3 === 0 ? (
              <mesh position={[0, activeHeight / 2 + 0.012, 0]}>
                <boxGeometry args={[building.width * 0.82, 0.025, building.depth * 0.82]} />
                <meshBasicMaterial color={accent} transparent opacity={0.58} />
              </mesh>
            ) : null}
          </group>
        );
      })}
    </group>
  );
}

function RouteRunner({
  sections,
  cityPositions,
  activeSectionId,
  reducedMotion
}: {
  sections: SceneSection[];
  cityPositions: THREE.Vector3[];
  activeSectionId: string;
  reducedMotion: boolean;
}) {
  const activeIndex = Math.max(
    0,
    sections.findIndex((section) => section.id === activeSectionId)
  );
  const runnerRef = useRef<THREE.Group>(null);
  const currentIndexRef = useRef(activeIndex);
  const pathRef = useRef(buildDistrictLoop(cityPositions[activeIndex] ?? cityPositions[0]));
  const distanceRef = useRef(0);
  const transferringRef = useRef(false);

  useFrame((state, delta) => {
    const runner = runnerRef.current;
    if (!runner || cityPositions.length === 0) {
      return;
    }

    if (activeIndex !== currentIndexRef.current && !transferringRef.current) {
      pathRef.current = buildRunnerRoute(
        cityPositions[currentIndexRef.current],
        cityPositions[activeIndex]
      );
      distanceRef.current = 0;
      transferringRef.current = true;
    }

    const speed = reducedMotion ? 0 : transferringRef.current ? 4.4 : 1.18;
    distanceRef.current += delta * speed;
    const sample = samplePolyline(pathRef.current, distanceRef.current, !transferringRef.current);

    runner.position.lerp(sample.position, 1 - Math.exp(-delta * 18));

    if (sample.tangent.lengthSq() > 0) {
      runner.rotation.y = -Math.atan2(sample.tangent.z, sample.tangent.x);
    }

    const bodyPulse = 1 + Math.sin(state.clock.elapsedTime * 6) * 0.04;
    runner.scale.set(bodyPulse, bodyPulse, bodyPulse);

    if (sample.done && transferringRef.current) {
      currentIndexRef.current = activeIndex;
      pathRef.current = buildDistrictLoop(cityPositions[activeIndex]);
      distanceRef.current = 0;
      transferringRef.current = false;
    }
  });

  return (
    <group ref={runnerRef}>
      <mesh position={[0, 0.03, 0]}>
        <boxGeometry args={[0.34, 0.14, 0.22]} />
        <meshStandardMaterial
          color={cityColors.amber}
          emissive={cityColors.amber}
          emissiveIntensity={0.78}
          roughness={0.32}
          metalness={0.16}
        />
      </mesh>
      <mesh position={[0.05, 0.14, 0]}>
        <boxGeometry args={[0.16, 0.06, 0.14]} />
        <meshBasicMaterial color={cityColors.white} transparent opacity={0.82} />
      </mesh>
      <pointLight color={cityColors.amber} intensity={0.8} distance={3.2} />
    </group>
  );
}

function DistantSkyline() {
  const buildings = useMemo(() => {
    const rng = createSeededRandom(9601);
    return Array.from({ length: 44 }, (_, index) => ({
      x: -13 + index * 0.62 + (rng() - 0.5) * 0.08,
      z: -9.2 + (rng() - 0.5) * 0.16,
      width: 0.26 + rng() * 0.32,
      height: 0.55 + rng() * 1.9,
      depth: 0.34 + rng() * 0.36,
      color: index % 4 === 0 ? cityColors.concrete : cityColors.mutedGlass
    }));
  }, []);

  return (
    <group>
      {buildings.map((building, index) => (
        <mesh
          key={index}
          position={[building.x, GROUND_Y + building.height / 2, building.z]}
        >
          <boxGeometry args={[building.width, building.height, building.depth]} />
          <meshStandardMaterial
            color={building.color}
            emissive={index % 5 === 0 ? cityColors.amber : cityColors.teal}
            emissiveIntensity={0.035}
            transparent
            opacity={0.62}
            roughness={0.86}
          />
        </mesh>
      ))}
    </group>
  );
}

function HarborGlow() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[8.6, GROUND_Y + 0.028, 4.8]}>
        <circleGeometry args={[2.8, 64]} />
        <meshBasicMaterial color={cityColors.teal} transparent opacity={0.065} depthWrite={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-7.8, GROUND_Y + 0.03, -5.6]}>
        <circleGeometry args={[2.2, 64]} />
        <meshBasicMaterial color={cityColors.amber} transparent opacity={0.05} depthWrite={false} />
      </mesh>
    </group>
  );
}

function CityCameraRig({
  sections,
  cityPositions,
  activeSectionId,
  reducedMotion
}: {
  sections: SceneSection[];
  cityPositions: THREE.Vector3[];
  activeSectionId: string;
  reducedMotion: boolean;
}) {
  const activeIndex = Math.max(
    0,
    sections.findIndex((section) => section.id === activeSectionId)
  );
  const activePosition = cityPositions[activeIndex] ?? cityPositions[0] ?? new THREE.Vector3();
  const cameraTarget = useMemo(
    () => new THREE.Vector3(activePosition.x + 3.4, 4.95, activePosition.z + 6.4),
    [activePosition.x, activePosition.z]
  );
  const lookAtTarget = useMemo(
    () => new THREE.Vector3(activePosition.x, GROUND_Y + 0.38, activePosition.z),
    [activePosition.x, activePosition.z]
  );
  const workingTarget = useRef(lookAtTarget.clone());

  useFrame((state, delta) => {
    const lerpFactor = reducedMotion ? 1 : 1 - Math.exp(-delta * 1.9);
    state.camera.position.lerp(cameraTarget, lerpFactor);
    workingTarget.current.lerp(lookAtTarget, lerpFactor);
    state.camera.lookAt(workingTarget.current);
  });

  return null;
}

function CityMapScene({ sections, activeSectionId, reducedMotion }: CityMapSceneProps) {
  const cityPositions = useMemo(
    () => sections.map((section, index) => getCityPosition(section, index)),
    [sections]
  );

  return (
    <>
      <color attach="background" args={[cityColors.background]} />
      <fog attach="fog" args={[cityColors.fog, 12, 28]} />
      <ambientLight intensity={0.72} />
      <directionalLight position={[6, 8, 4]} intensity={1.05} color="#dfffea" />
      <pointLight position={[-8, 4, 6]} intensity={1.35} color={cityColors.teal} />
      <pointLight position={[9, 2, -4]} intensity={1.2} color={cityColors.amber} />
      <pointLight position={[1, 5, -7]} intensity={0.86} color={cityColors.coral} />

      <CityGround />
      <HarborGlow />
      <CityStreetGrid />
      <MainTransitNetwork cityPositions={cityPositions} />
      <CircuitTraceLayer cityPositions={cityPositions} />
      <ElevatedSignalLayer cityPositions={cityPositions} />
      <DataTrafficLayer cityPositions={cityPositions} reducedMotion={reducedMotion} />
      <DistantSkyline />

      {sections.map((section, index) => (
        <DistrictNode
          key={section.id}
          section={section}
          sectionIndex={index}
          position={cityPositions[index]}
          active={section.id === activeSectionId}
        />
      ))}

      <RouteRunner
        sections={sections}
        cityPositions={cityPositions}
        activeSectionId={activeSectionId}
        reducedMotion={reducedMotion}
      />
      <CityCameraRig
        sections={sections}
        cityPositions={cityPositions}
        activeSectionId={activeSectionId}
        reducedMotion={reducedMotion}
      />
    </>
  );
}

export default CityMapScene;
