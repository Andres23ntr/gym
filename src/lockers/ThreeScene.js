import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

// Carga el modelo 3D
const Model3D = () => {
  const { scene } = useGLTF('/model.gltf', true); // Ruta al modelo en la carpeta public
  return <primitive object={scene} scale={0.5} position={[0, 0, 0]} />;
};

// Componente para la escena 3D
const ThreeScene = () => {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      {/* Suspense envuelve la carga del modelo para mostrar algo mientras carga */}
      <Suspense fallback={null}>
        <Model3D />
      </Suspense>
      <OrbitControls /> {/* Permite rotar, acercar y alejar el modelo */}
    </Canvas>
  );
};

export default ThreeScene;
