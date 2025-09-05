import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// A simple debounce function helper
const debounce = (func, delay) => {
  let timeoutId;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(context, args), delay);
  }
};

const Face = ({ isParentInView, paused, disableTracking, onModelLoaded }) => {
  const { scene } = useGLTF('/RoboFace/scene.gltf');
  const groupRef = useRef();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState({ x: 1.5, y: 1.2, z: 1.2 });
  
  // FIX 1: Use a ref to ensure the onModelLoaded callback is only fired once.
  const hasCalledLoaded = useRef(false);

  // --- HOOKS REFACTORED FOR STABILITY AND SEPARATION OF CONCERNS ---

  // Effect for calling the loaded callback ONCE when visible.
  useEffect(() => {
    if (isParentInView && !hasCalledLoaded.current) {
      if (onModelLoaded) {
        onModelLoaded();
      }
      hasCalledLoaded.current = true;
    }
  }, [isParentInView, onModelLoaded]);

  // Effect for handling responsive scaling (debounced for performance).
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let newScale, newY;
      if (width < 480) {
        newScale = { x: 0.95, y: 0.75, z: 1 }; newY = -0.9;
      } else if (width < 768) {
        newScale = { x: 1.05, y: 0.85, z: 1 }; newY = -0.95;
      } else if (width < 1024) {
        newScale = { x: 1.3, y: 1, z: 1 }; newY = -1.4;
      } else {
        newScale = { x: 1.45, y: 1.15, z: 1.1 }; newY = -1.6;
      }
      setScale(newScale);
      scene.position.y = newY;
    };

    const debouncedResize = debounce(handleResize, 250);
    handleResize(); // Initial call
    window.addEventListener('resize', debouncedResize);
    return () => window.removeEventListener('resize', debouncedResize);
  }, [scene]);
  
  // Effect for applying scale to the scene when the scale state changes.
  useEffect(() => {
    scene.scale.set(scale.x, scale.y, scale.z);
  }, [scale, scene]);
  
  // Effect for safely adding and removing the wireframe overlay.
  useEffect(() => {
    if (!isParentInView) return; // Do nothing if not visible

    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 'grey',
      wireframe: true,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide
    });
    
    const wireframeMeshes = [];
    scene.traverse((child) => {
      if (child.isMesh && child.geometry) {
        const wireframeMesh = new THREE.Mesh(child.geometry, wireframeMaterial);
        wireframeMesh.position.copy(child.position);
        wireframeMesh.rotation.copy(child.rotation);
        wireframeMesh.scale.copy(child.scale);
        if (child.parent) {
          child.parent.add(wireframeMesh);
          wireframeMeshes.push(wireframeMesh);
        }
      }
    });

    // Cleanup function to run when component unmounts or isParentInView changes
    return () => {
      wireframeMeshes.forEach(mesh => {
        if (mesh.parent) {
          mesh.parent.remove(mesh);
        }
      });
      wireframeMaterial.dispose();
    };
  }, [scene, isParentInView]); // Re-run only when the scene is available or visibility changes

  // Effect for mouse tracking.
  useEffect(() => {
    if (!isParentInView || disableTracking) {
      // Reset mouse position when tracking is disabled
      setMouse({ x: 0, y: 0 });
      return;
    };

    const handleMouseMove = (event) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = (event.clientY / window.innerHeight) * 2 - 1;
      setMouse({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isParentInView, disableTracking]);

  // useFrame for animation, respects paused and visibility state.
  useFrame(() => {
    if (paused || !groupRef.current) return;
    // Smoothly animate rotation towards the mouse position
    groupRef.current.rotation.y += (mouse.x * 0.6 - groupRef.current.rotation.y) * 0.1;
    groupRef.current.rotation.x += (mouse.y * 0.4 - groupRef.current.rotation.x) * 0.1;
  });

  return <group ref={groupRef}><primitive object={scene} /></group>;
};

// The main FaceModel component is now much simpler.
// It no longer manages its own visibility state.
const FaceModel = ({ paused, disableTracking, onModelLoaded }) => {
  return (
    <Canvas
      dpr={[1, 1.5]}
      className="absolute inset-0 pointer-events-none z-20"
      camera={{ position: [0, 0, 5], fov: 35 }}
      shadows
    >
      <ambientLight intensity={1} />
      <directionalLight position={[2, 2, 5]} intensity={1.2} />
      <Suspense fallback={null}>
        {/* The Face component is always mounted for stability. 
          Its internal animations are controlled by the paused prop.
        */}
        <Face 
          isParentInView={!paused} 
          paused={paused}
          disableTracking={disableTracking}
          onModelLoaded={onModelLoaded}
        />
      </Suspense>
    </Canvas>
  );
};

export default FaceModel;