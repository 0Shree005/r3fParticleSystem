import './style.css'
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import Particles from './Particles.jsx'
import { StrictMode } from 'react'
import { Leva } from 'leva'

const root = ReactDOM.createRoot(document.querySelector('#root'))

root.render(
    <StrictMode>
        <Leva collapsed />
        <div className='bg-slate-900 relative w-screen min-h-screen'>
            <Canvas
                flat
                camera={{
                    fov: 45,
                    near: 0.1,
                    far: 200,
                    position: [0, 0, 15]
                    //position: [0, 0, 0.001]
                }}
                style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}
            >
                <Particles />
            </Canvas>
        </div>
    </StrictMode>
)
