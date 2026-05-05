import { Suspense, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PointerLockControls, useGLTF, Environment } from '@react-three/drei'
import * as THREE from 'three'

import { useKeyboard } from './useKeyboard'
import { Crosshair } from './Crosshair'
import { InteractableModel } from './InteractableModel'
import { DinoPopup } from './DinoPopup'
import './App.css'

const MuseumCorridor = () => {
  const { scene } = useGLTF('/Museum.glb')
  return <primitive object={scene} />
}

const Player = () => {
  const keys = useKeyboard()
  const speed = 1.2
  const direction = new THREE.Vector3()
  const front = new THREE.Vector3()
  const side = new THREE.Vector3()

  useFrame((state) => {
    front.set(0, 0, Number(keys.backward) - Number(keys.forward))
    side.set(Number(keys.left) - Number(keys.right), 0, 0)
    direction.subVectors(front, side).normalize().multiplyScalar(speed).applyEuler(state.camera.rotation)
    state.camera.position.add(direction)
    state.camera.position.y = 1.6
  })
  return <PointerLockControls />
}

export default function App() {
  const [activeDino, setActiveDino] = useState(null)

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#000' }}>
      <Crosshair />

      <div className="instruction-panel">
        <div className="instruction-panel__header">
          <h1 className="instruction-panel__title">DINO MUSEUM 3D</h1>
          <h2 className="instruction-panel__subtitle">BẢNG ĐIỀU KHIỂN</h2>
        </div>
        <div className="instruction-panel__content">
          <ul className="instruction-panel__control-list">
            <li><b>WASD:</b> Đi dạo</li>
            <li><b>Chỉa tâm:</b> Xem thông tin</li>
            <li><b>Click:</b> Chi tiết 3D</li>
            <li><b>ESC:</b> Thoát</li>
          </ul>
        </div>
      </div>

      <Canvas camera={{ position: [0, 1.6, 5], fov: 60 }} gl={{ antialias: false }}>
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} intensity={2} />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
        <Environment preset="city" />

        <Suspense fallback={null}>
          <MuseumCorridor />

          {/* Dino 1 - Kỉ Trias (Cam) */}
          <InteractableModel
            url="/Dino1.glb"
            eraColor="#e07b39"
            onEnter={() => setActiveDino('Dino1')}
          />

          {/* Dino 2 - Kỉ Phấn Trắng (Vàng) */}
          <InteractableModel
            url="/Dino2.glb"
            eraColor="#f59e0b"
            onEnter={() => setActiveDino('Dino2')}
          />

          {/* Dino 3 - Kỉ Jura (Xanh) - Tao tạm gán cho Dino3 để dùng hết 3 màu nhé */}
          <InteractableModel
            url="/Dino3.glb"
            eraColor="#4ade80"
            onEnter={() => setActiveDino('Dino3')}
          />
        </Suspense>

        <Player />
      </Canvas>

      {activeDino && (
        <DinoPopup
          key={activeDino}
          dinoId={activeDino}
          onClose={() => setActiveDino(null)}
        />
      )}
    </div>
  )
}

useGLTF.preload('/Museum.glb')
useGLTF.preload('/Dino1.glb')
useGLTF.preload('/Dino2.glb')
useGLTF.preload('/Dino3.glb')