import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function useThreeScene(modelPath, onModelLoad) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const modelRef = useRef(null);
  const currentRotationRef = useRef(0);
  const modelSizeRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setClearColor(0xf5f5f0, 0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.LinearEncoding;
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.toneMappingExposure = 1.5;

    containerRef.current.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 1.2));

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
    mainLight.position.set(1, 2, 3);
    mainLight.castShadow = true;
    mainLight.shadow.bias = -0.001;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.8);
    fillLight.position.set(-2, 0, -2);
    scene.add(fillLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 0.6);
    backLight.position.set(0, 1, -3);
    scene.add(backLight);

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;

    const setupModel = () => {
      if (!modelRef.current || !modelSizeRef.current) return;

      const isMobile = window.innerWidth < 1000;
      const box = new THREE.Box3().setFromObject(modelRef.current);
      const center = box.getCenter(new THREE.Vector3());

      modelRef.current.position.set(
        isMobile ? center.x + modelSizeRef.current.x * 1 : -center.x - modelSizeRef.current.x * 0.4,
        -center.y,
        -center.z
      );

      modelRef.current.rotation.z = isMobile ? 0 : THREE.MathUtils.degToRad(-25);

      const cameraDistance = isMobile ? 2 : 1.25;
      camera.position.set(
        0,
        0,
        Math.max(modelSizeRef.current.x, modelSizeRef.current.y, modelSizeRef.current.z) * cameraDistance
      );
      camera.lookAt(0, 0, 0);
    };

    const loader = new GLTFLoader();
    loader.load(modelPath, (gltf) => {
      const model = gltf.scene;

      model.traverse((node) => {
        if (node.isMesh && node.material) {
          if (Array.isArray(node.material)) {
            node.material.forEach((mat) => {
              if (mat) {
                mat.metalness = 0.05;
                mat.roughness = 0.85;
                mat.emissive = new THREE.Color(0x222222);
                mat.emissiveIntensity = 0.1;
              }
            });
          } else {
            node.material.metalness = 0.05;
            node.material.roughness = 0.85;
            node.material.emissive = new THREE.Color(0x222222);
            node.material.emissiveIntensity = 0.1;
          }
        }
      });

      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      modelSizeRef.current = size;

      scene.add(model);
      modelRef.current = model;
      setupModel();

      if (onModelLoad) {
        onModelLoad({ model, size });
      }
    });

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      setupModel();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      if (modelRef.current) {
        scene.remove(modelRef.current);
        modelRef.current.traverse((node) => {
          if (node.isMesh) {
            if (Array.isArray(node.material)) {
              node.material.forEach((mat) => mat.dispose());
            } else {
              node.material.dispose();
            }
            node.geometry.dispose();
          }
        });
      }
    };
  }, [modelPath, onModelLoad]);

  return {
    containerRef,
    modelRef,
    currentRotation: currentRotationRef,
    modelSize: modelSizeRef,
  };
}
