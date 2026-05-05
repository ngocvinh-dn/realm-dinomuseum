import React, { useRef, useEffect, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export const InteractableModel = ({ url, position, scale = 1, onEnter, eraColor = '#ffffff' }) => {
    const { scene } = useGLTF(url)
    const matsRef = useRef([])
    const [boxData, setBoxData] = useState({ center: [0, 0, 0], args: [1, 1, 1] })

    useEffect(() => {
        // 1. Tự động đo khung bắt chuột
        const box = new THREE.Box3().setFromObject(scene)
        if (!box.isEmpty()) {
            const size = box.getSize(new THREE.Vector3())
            const center = box.getCenter(new THREE.Vector3())
            setBoxData({
                center: [center.x, center.y, center.z],
                args: [size.x * 1.1, size.y * 1.1, size.z * 1.1]
            })
        }

        // 2. Clone vật liệu để chống dính màu giữa các con
        const mats = []
        scene.traverse((child) => {
            if (child.isMesh) {
                child.raycast = () => null

                if (child.material) {
                    if (!child.userData.materialCloned) {
                        if (Array.isArray(child.material)) {
                            child.material = child.material.map(m => m.clone())
                        } else {
                            child.material = child.material.clone()
                        }
                        child.userData.materialCloned = true
                    }

                    const childMats = Array.isArray(child.material) ? child.material : [child.material]
                    childMats.forEach(mat => {
                        if (!mat.userData.isSaved) {
                            mat.userData.origColor = mat.color ? mat.color.clone() : new THREE.Color('#ffffff')
                            mat.userData.origMap = mat.map
                            mat.userData.origWireframe = mat.wireframe || false
                            mat.userData.isSaved = true
                        }
                        mats.push(mat)
                    })
                }
            }
        })
        matsRef.current = mats
    }, [scene])

    // 3. HIỆU ỨNG LƯỚI THEO MÀU KỈ NGUYÊN (Era Color)
    const setHighlight = (isActive) => {
        matsRef.current.forEach((mat) => {
            if (isActive) {
                mat.wireframe = true
                mat.map = null
                // 👉 ĐỔI MÀU VIỀN THEO KỈ NGUYÊN
                if (mat.color) mat.color.set(eraColor)
            } else {
                mat.wireframe = mat.userData.origWireframe
                mat.map = mat.userData.origMap
                if (mat.color) mat.color.copy(mat.userData.origColor)
            }
            mat.needsUpdate = true
        })
    }

    return (
        <group position={position} scale={scale}>
            <mesh
                position={boxData.center}
                onPointerEnter={(e) => {
                    e.stopPropagation()
                    setHighlight(true)
                    document.body.style.cursor = 'pointer'
                    if (onEnter) onEnter()
                }}
                onPointerLeave={(e) => {
                    e.stopPropagation()
                    setHighlight(false)
                    document.body.style.cursor = 'auto'
                }}
            >
                <boxGeometry args={boxData.args} />
                <meshBasicMaterial transparent={true} opacity={0} depthWrite={false} />
            </mesh>
            <primitive object={scene} />
        </group>
    )
}