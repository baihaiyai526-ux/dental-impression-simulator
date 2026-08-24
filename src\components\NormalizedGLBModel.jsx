import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

/**
 * Loads a GLB and normalizes its original scan coordinates into a predictable
 * local size. The outer group can then be positioned and animated normally.
 */
export default function NormalizedGLBModel({
  path,
  targetSize = 1.6,
  rotation = [0, 0, 0],
  castShadow = true,
  receiveShadow = true
}) {
  const { scene } = useGLTF(path);

  const normalized = useMemo(() => {
    const clonedScene = scene.clone(true);
    const bounds = new THREE.Box3().setFromObject(clonedScene);
    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());
    const largestDimension = Math.max(size.x, size.y, size.z) || 1;
    const scale = targetSize / largestDimension;

    clonedScene.traverse((object) => {
      if (object.isMesh) {
        object.castShadow = castShadow;
        object.receiveShadow = receiveShadow;
      }
    });

    return {
      object: clonedScene,
      offset: center.multiplyScalar(-scale),
      scale
    };
  }, [castShadow, receiveShadow, scene, targetSize]);

  return (
    <group rotation={rotation}>
      <primitive
        object={normalized.object}
        position={normalized.offset.toArray()}
        scale={normalized.scale}
      />
    </group>
  );
}
