import { shaderMaterial, OrbitControls, Center } from '@react-three/drei'
import { useFrame, extend } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import { useControls } from 'leva'
import { Perf } from 'r3f-perf'
import * as THREE from 'three'

import customVertexShader from './shaders/vertex.glsl'
import customFragmentShader from './shaders/fragment.glsl'

const CustomMaterial = shaderMaterial(
    {
        uSize: 2.0,
        uTime: 0.0,
        uAnimate: 1.0, // 1.0: true, 0.0: false
    },
    customVertexShader,
    customFragmentShader
)

extend({ CustomMaterial })

export default function Particles() {
    // Leva controls for particle size and distribution mode
    const particlesControls = useControls('Particles', {
        pSize: {
            value: 100.0,
            min: 0.1,
            max: 200.0,
            step: 0.01
        },

        distribution: {
            value: 'surface',
            options: {
                Surface: 'surface',
                Random: 'random',
                Uniform: 'uniform'
            },
        },

        animate: {
            value: true
        }
    })

    const perfControls = useControls('Performance', { perfVisible: true })
    const orbitControls = useControls('Orbit Controls', {
        autoRotate: false,
        autoRotateSpeed: {
            value: 0.01,
            min: 0.01,
            max: 10.0,
            step: 0.001
        },
    })

    const particlesCount = 10000
    const sphereRadius = 5

    // Generate positions, scales, and random values in one memoized loop.
    const { positions, scales, randoms } = useMemo(() => {
        const positions = new Float32Array(particlesCount * 3)
        const scales = new Float32Array(particlesCount)
        const randoms = new Float32Array(particlesCount)
        for (let i = 0; i < particlesCount; i++) {
            const phi = Math.random() * 2 * Math.PI
            const cosTheta = Math.random() * 2 - 1
            const theta = Math.acos(cosTheta)

            // Choose the radius based on the distribution option from leva
            let r = sphereRadius
            if (particlesControls.distribution === 'random') {
                r = sphereRadius * Math.random()
            } else if (particlesControls.distribution === 'uniform') {
                r = sphereRadius * Math.cbrt(Math.random())
            }

            // Compute Cartesian coordinates
            const x = r * Math.sin(theta) * Math.cos(phi)
            const y = r * Math.sin(theta) * Math.sin(phi)
            const z = r * Math.cos(theta)

            positions[i * 3 + 0] = x
            positions[i * 3 + 1] = y
            positions[i * 3 + 2] = z

            // Generate random scale and random values for each particle
            scales[i] = Math.random()
            randoms[i] = Math.random()
        }
        return { positions, scales, randoms }
    }, [particlesCount, sphereRadius, particlesControls.distribution])

    // Reference to geometry and material
    const geometryRef = useRef()
    const materialRef = useRef()
    const pSizeRef = useRef(particlesControls.pSize)
    const animateRef = useRef(particlesControls.animate)

    useEffect(() => {
        pSizeRef.current = particlesControls.pSize
    }, [particlesControls.pSize])

    useEffect(() => {
        animateRef.current = particlesControls.animate
    }, [particlesControls.animate])

    // Update geometry attributes when memoized arrays change.
    useEffect(() => {
        if (geometryRef.current) {
            geometryRef.current.attributes.position.array = positions
            geometryRef.current.attributes.position.needsUpdate = true

            geometryRef.current.attributes.aScale.array = scales
            geometryRef.current.attributes.aScale.needsUpdate = true

            geometryRef.current.attributes.aRandom.array = randoms
            geometryRef.current.attributes.aRandom.needsUpdate = true
        }
    }, [positions, scales, randoms])

    useFrame((state, delta) => {
        if (materialRef.current) {
            materialRef.current.uTime += delta
            materialRef.current.uSize = pSizeRef.current * window.devicePixelRatio
            materialRef.current.uAnimate = animateRef.current ? 1.0 : 0.0
        }
    })

    return (
        <>
            <color args={['#000000']} attach="background" />
            <OrbitControls
                autoRotate={orbitControls.autoRotate}
                autoRotateSpeed={orbitControls.autoRotateSpeed}
                enablePan={false}
            />
            {perfControls.perfVisible ? <Perf position="bottom-right" /> : null}
            <Center>
                <points>
                    <bufferGeometry ref={geometryRef}>
                        <bufferAttribute
                            attach="attributes-position"
                            array={positions}
                            count={positions.length / 3}
                            itemSize={3}
                        />
                        <bufferAttribute
                            attach="attributes-aScale"
                            array={scales}
                            count={particlesCount}
                            itemSize={1}
                        />
                        <bufferAttribute
                            attach="attributes-aRandom"
                            array={randoms}
                            count={particlesCount}
                            itemSize={1}
                        />
                    </bufferGeometry>
                    <customMaterial
                        ref={materialRef}
                        vertexColors
                        depthWrite={false}
                        blending={THREE.AdditiveBlending}
                    />
                </points>
            </Center>
        </>
    )
}
