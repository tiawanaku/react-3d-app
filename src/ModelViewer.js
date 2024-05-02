import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"; // Importa OrbitControls
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"; // Importa GLTFLoader

const ModelViewer = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    // Configurar la escena
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff); // Establece el color de fondo a blanco

    // Configurar la cámara
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, -4, 1); // Mover la cámara hacia abajo

    // Configurar el renderizador
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Agregar una luz ambiental para iluminar la escena
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Luz blanca con intensidad 0.5
    scene.add(ambientLight);

    // Agregar una luz direccional para simular la luz del sol
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 1, 1).normalize();
    scene.add(directionalLight);

    // Agregar una luz puntual sobre el modelo
    const spotLight = new THREE.SpotLight(0xffffff, 5);
    spotLight.position.set(0, 10, 0); // Posición de la luz (arriba del modelo)
    spotLight.angle = Math.PI / 4; // Ángulo de dispersión de la luz
    spotLight.penumbra = 0.5; // Suavidad de los bordes de la sombra
    spotLight.decay = 5; // Atenuación de la luz
    spotLight.distance = 200; // Distancia máxima de la luz
    scene.add(spotLight);

    // Cargar el modelo 3D
    const loader = new GLTFLoader(); // Usa GLTFLoader directamente
    loader.load("/iron_man_mark_85.glb", function (gltf) {
      scene.add(gltf.scene);
    });

    // Agregar controles de órbita
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.maxPolarAngle = Math.PI / 2;

    // Animar la escena
    const animate = function () {
      requestAnimationFrame(animate);

      // Rotar el modelo
      scene.rotation.y += 0.01; // Ajusta la velocidad de rotación aquí

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Limpiar al desmontar el componente
    return () => {
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
};

export default ModelViewer;

