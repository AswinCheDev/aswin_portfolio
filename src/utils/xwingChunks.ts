import * as THREE from 'three';

export function getChunkMapping(allMeshes: THREE.Mesh[], moduleIds: string[]) {
  const mapping: Record<string, THREE.Mesh[]> = {};
  const meshesPerChunk = Math.floor(allMeshes.length / moduleIds.length);
  
  moduleIds.forEach((id, i) => {
    const startIndex = i * meshesPerChunk;
    const endIndex = i === moduleIds.length - 1 ? allMeshes.length : startIndex + meshesPerChunk;
    mapping[id] = allMeshes.slice(startIndex, endIndex);
  });
  return mapping;
}
