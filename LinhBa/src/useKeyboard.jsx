import { useState, useEffect } from 'react'

export const useKeyboard = () => {
    const [keys, setKeys] = useState({ forward: false, backward: false, left: false, right: false })

    useEffect(() => {
        const handleKeyDown = (e) => {
            switch (e.code) {
                case 'KeyW': setKeys(k => ({ ...k, forward: true })); break;
                case 'KeyS': setKeys(k => ({ ...k, backward: true })); break;
                case 'KeyA': setKeys(k => ({ ...k, left: true })); break;
                case 'KeyD': setKeys(k => ({ ...k, right: true })); break;
            }
        }
        const handleKeyUp = (e) => {
            switch (e.code) {
                case 'KeyW': setKeys(k => ({ ...k, forward: false })); break;
                case 'KeyS': setKeys(k => ({ ...k, backward: false })); break;
                case 'KeyA': setKeys(k => ({ ...k, left: false })); break;
                case 'KeyD': setKeys(k => ({ ...k, right: false })); break;
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)

        // Dọn dẹp bộ nhớ khi Component bị hủy
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
        }
    }, [])

    return keys
}