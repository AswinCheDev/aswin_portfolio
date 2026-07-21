import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const MODEL_URL = '/assests/Models/30654_-_x-wing_starfighter.glb';

// ── Convex Hull (Andrew's Monotone Chain) ──────────────────────────
function cross(O: [number, number], A: [number, number], B: [number, number]): number {
  return (A[0] - O[0]) * (B[1] - O[1]) - (A[1] - O[1]) * (B[0] - O[0]);
}

function convexHull(points: [number, number][]): [number, number][] {
  const sorted = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  if (sorted.length <= 2) return sorted;

  const lower: [number, number][] = [];
  for (const p of sorted) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0)
      lower.pop();
    lower.push(p);
  }

  const upper: [number, number][] = [];
  for (let i = sorted.length - 1; i >= 0; i--) {
    const p = sorted[i];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0)
      upper.pop();
    upper.push(p);
  }

  lower.pop();
  upper.pop();
  return [...lower, ...upper];
}

// ── Ramer-Douglas-Peucker simplification ───────────────────────────
function perpendicularDistance(
  pt: [number, number],
  lineStart: [number, number],
  lineEnd: [number, number]
): number {
  const dx = lineEnd[0] - lineStart[0];
  const dy = lineEnd[1] - lineStart[1];
  const mag = Math.sqrt(dx * dx + dy * dy);
  if (mag === 0) return Math.sqrt((pt[0] - lineStart[0]) ** 2 + (pt[1] - lineStart[1]) ** 2);
  return Math.abs(dx * (lineStart[1] - pt[1]) - (lineStart[0] - pt[0]) * dy) / mag;
}

function simplifyPolygon(points: [number, number][], epsilon: number): [number, number][] {
  if (points.length <= 3) return points;

  let maxDist = 0;
  let maxIdx = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const d = perpendicularDistance(points[i], points[0], points[points.length - 1]);
    if (d > maxDist) { maxDist = d; maxIdx = i; }
  }

  if (maxDist > epsilon) {
    const left = simplifyPolygon(points.slice(0, maxIdx + 1), epsilon);
    const right = simplifyPolygon(points.slice(maxIdx), epsilon);
    return [...left.slice(0, -1), ...right];
  }
  return [points[0], points[points.length - 1]];
}

// ── Material colour map ────────────────────────────────────────────
const MATERIAL_COLORS: Record<string, string> = {
  'SOLID-WHITE': '#e8e8e8',
  'SOLID-WHITE_0': '#e8e8e8',
  'SOLID-DARK_RED': '#8b1a1a',
  'SOLID-DARK_RED_0': '#8b1a1a',
  'SOLID-LIGHT_BLUISH_GRAY': '#a0a5a9',
  'SOLID-LIGHT_BLUISH_GRAY_0': '#a0a5a9',
  'METAL-SILVER': '#c0c0c0',
  'METAL-SILVER_0': '#c0c0c0',
  'TRANS-BROWN': '#7b5b3a',
  'PEARL-DARK_GRAY': '#6b6b6b',
  'SOLID-DARK_BLUISH_GRAY': '#474c50',
  'SOLID-BLACK': '#1a1a1a',
};

function lighten(hex: string, amount: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const nr = Math.min(255, Math.round(r + (255 - r) * amount));
  const ng = Math.min(255, Math.round(g + (255 - g) * amount));
  const nb = Math.min(255, Math.round(b + (255 - b) * amount));
  return `#${nr.toString(16).padStart(2, '0')}${ng.toString(16).padStart(2, '0')}${nb.toString(16).padStart(2, '0')}`;
}

function darken(hex: string, amount: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const nr = Math.max(0, Math.round(r * (1 - amount)));
  const ng = Math.max(0, Math.round(g * (1 - amount)));
  const nb = Math.max(0, Math.round(b * (1 - amount)));
  return `#${nr.toString(16).padStart(2, '0')}${ng.toString(16).padStart(2, '0')}${nb.toString(16).padStart(2, '0')}`;
}

// ── Public types ───────────────────────────────────────────────────
export interface PieceClipData {
  clipPath: string;
  primaryColor: string;
  topColor: string;
  sideColor: string;
  aspectRatio: number;   // width / height of the chunk's bounding box
  relativeSize: number;  // 0–1, how big this chunk is compared to the largest
}

// ── Module-level cache ─────────────────────────────────────────────
let _cache: Map<string, PieceClipData> | null = null;
let _promise: Promise<Map<string, PieceClipData>> | null = null;

export function loadXWingClipPaths(moduleIds: string[]): Promise<Map<string, PieceClipData>> {
  if (_cache) return Promise.resolve(_cache);
  if (_promise) return _promise;

  _promise = new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      MODEL_URL,
      (gltf) => {
        // Collect all meshes in scene-traversal order
        const meshes: THREE.Mesh[] = [];
        gltf.scene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) meshes.push(child as THREE.Mesh);
        });

        const meshesPerChunk = Math.floor(meshes.length / moduleIds.length);
        const result = new Map<string, PieceClipData>();
        const areas: number[] = [];

        moduleIds.forEach((id, i) => {
          const start = i * meshesPerChunk;
          const end = i === moduleIds.length - 1 ? meshes.length : start + meshesPerChunk;
          const chunk = meshes.slice(start, end);

          // ── Collect 2D points (top-down: X, Z) and material votes ──
          const pts: [number, number][] = [];
          const matVotes: Record<string, number> = {};

          for (const mesh of chunk) {
            mesh.updateMatrixWorld(true);
            const pos = mesh.geometry.attributes.position;
            const matName = (mesh.material as THREE.Material).name || 'SOLID-WHITE';
            matVotes[matName] = (matVotes[matName] || 0) + 1;

            for (let v = 0; v < pos.count; v++) {
              const vert = new THREE.Vector3().fromBufferAttribute(pos, v);
              vert.applyMatrix4(mesh.matrixWorld);
              pts.push([vert.x, vert.z]);
            }
          }

          if (pts.length === 0) {
            result.set(id, {
              clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
              primaryColor: '#e8e8e8', topColor: '#ffffff', sideColor: '#c0c0c0',
              aspectRatio: 1, relativeSize: 0.5,
            });
            areas.push(0);
            return;
          }

          // ── Bounding box ──
          let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
          for (const [x, y] of pts) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
          const rangeX = maxX - minX || 1;
          const rangeY = maxY - minY || 1;
          areas.push(rangeX * rangeY);

          // ── Convex hull → simplified polygon → clip-path string ──
          let hull = convexHull(pts);
          // Simplify to ~12-20 points max
          const epsilon = Math.max(rangeX, rangeY) * 0.02;
          hull = simplifyPolygon(hull, epsilon);
          if (hull.length < 3) hull = convexHull(pts); // fallback

          const clipPath = `polygon(${hull.map(([x, y]) => {
            const px = ((x - minX) / rangeX * 100).toFixed(1);
            const py = ((y - minY) / rangeY * 100).toFixed(1);
            return `${px}% ${py}%`;
          }).join(', ')})`;

          // ── Dominant colour ──
          const dominantMat = Object.entries(matVotes).sort((a, b) => b[1] - a[1])[0]?.[0] || 'SOLID-WHITE';
          const primary = MATERIAL_COLORS[dominantMat] || '#e8e8e8';

          result.set(id, {
            clipPath,
            primaryColor: primary,
            topColor: lighten(primary, 0.25),
            sideColor: darken(primary, 0.3),
            aspectRatio: rangeX / rangeY,
            relativeSize: 0, // filled in next pass
          });
        });

        // ── Normalise relative sizes ──
        const maxArea = Math.max(...areas, 1);
        let idx = 0;
        for (const id of moduleIds) {
          const entry = result.get(id)!;
          entry.relativeSize = Math.max(0.3, areas[idx] / maxArea);
          idx++;
        }

        _cache = result;
        resolve(result);
      },
      undefined,
      reject,
    );
  });

  return _promise;
}
