import { shaderMaterial, OrbitControls, Center } from '@react-three/drei'
import { useFrame, extend } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { useControls } from 'leva'
import { Perf } from 'r3f-perf'
import * as THREE from 'three'

import customVertexShader from './shaders/vertex.glsl'
import customFragmentShader from './shaders/fragment.glsl'

const CustomMaterial = shaderMaterial(
    {
        uSize: 2.0,
        uTime: 0.0,
    },
    customVertexShader,
    customFragmentShader
)

extend({ CustomMaterial })

export default function Particles() {
    /*
     * Leva controls
     */
    const particlesControls = useControls('Particles', {
        pSize: {
            value: 100.0,
            min: 0.1,
            max: 200.0,
            step: 0.01
        },
    })

    const perfControls = useControls('Performance', {
        perfVisible: true
    })

    const orbitControls = useControls('Orbit Controls', {
        autoRotate: false,
        autoRotateSpeed: {
            value: 0.01,
            min: 0.01,
            max: 10.0,
            step: 0.001
        },
    })

    const materialRef = useRef()
    const particlesCount = 10000
    const positionsArray = new Float32Array(particlesCount * 3)
    const scalesArray = new Float32Array(particlesCount * 1)
    const randomsArray = new Float32Array(particlesCount * 1)
    const sphereRadius = 5

    for (let i = 0; i < particlesCount; i++) {
        const phi = Math.random() * 2 * Math.PI
        const cosTheta = Math.random() * 2 - 1
        const theta = Math.acos(cosTheta)

        // Points on the surface of the sphere
        const radius = sphereRadius

        // Points randomly distributed inside the sphere
        //const radius = sphereRadius * Math.random()

        // Points uniformly distributed inside the sphere
        //const radius = sphereRadius * Math.cbrt(Math.random())

        // Convert spherical coordinates to Cartesian coordinates
        const x = radius * Math.sin(theta) * Math.cos(phi)
        const y = radius * Math.sin(theta) * Math.sin(phi)
        const z = radius * Math.cos(theta)

        positionsArray[i * 3 + 0] = x
        positionsArray[i * 3 + 1] = y
        positionsArray[i * 3 + 2] = z

        scalesArray[i] = Math.random()
        randomsArray[i] = Math.random()
    }

    const pSizeRef = useRef(particlesControls.pSize);

    useEffect(() => {
        pSizeRef.current = particlesControls.pSize;
    }, [particlesControls.pSize]);


    useFrame((state, delta) => {
        if (materialRef.current) {
            materialRef.current.uTime += delta
            materialRef.current.uSize = pSizeRef.current * window.devicePixelRatio
        }
    })

    return (
        <>
            <color args={['#000000']} attach="background" />
            <OrbitControls autoRotate={orbitControls.autoRotate} autoRotateSpeed={orbitControls.autoRotateSpeed} />
            {perfControls.perfVisible ? <Perf position='bottom-right' /> : null}
            <Center>
                <points>
                    <bufferGeometry>
                        <bufferAttribute
                            attach="attributes-position"
                            array={positionsArray}
                            count={positionsArray.length / 3}
                            itemSize={3}
                        />
                        <bufferAttribute
                            attach="attributes-aScale"
                            array={scalesArray}
                            count={particlesCount}
                            itemSize={1}
                        />
                        <bufferAttribute
                            attach="attributes-aRandom"
                            array={randomsArray}
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
