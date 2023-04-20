import { useRapier, RigidBody } from '@react-three/rapier'
import { useFrame } from '@react-three/fiber'
import { useKeyboardControls } from '@react-three/drei'
import * as THREE from 'three'
import { useState, useRef, useEffect } from 'react'
import useGame from './stores/useGame'

export default function Player() {
  const body = useRef()

  // Get the camera target and position directly from THREE
  const [smoothedCameraPosition] = useState(() => new THREE.Vector3(10, 10, 10))
  const [smoothedCameraTarget] = useState(() => new THREE.Vector3())

  // Get the world properties from Rapier to be able to raycast
  const { rapier, world } = useRapier()
  const rapierWorld = world.raw()

  // Get keyboard controls
  const [subscribeKeys, getKeys] = useKeyboardControls()

  // Access start and end functions
  const start = useGame((state) => state.start)
  const end = useGame((state) => state.end)

  const blocksCount = useGame((state) => state.blocksCount)

  const reset = () => {
    body.current.setTranslation({ x: 0, y: 1, z: 0 })
    body.current.setLinvel({ x: 0, y: 0, z: 0 })
    body.current.setAngvel({ x: 0, y: 0, z: 0 })
  }

  // Apply impulse only when the ball is on the floor, or near the floor
  const jump = () => {
    const origin = body.current.translation()
    origin.y -= 0.31
    const direction = { x: 0, y: -1, z: 0 }
    const ray = new rapier.Ray(origin, direction)
    const hit = rapierWorld.castRay(ray, 10, true)

    if (hit.toi < 0.15) {
      body.current.applyImpulse({ x: 0, y: 0.5, z: 0 })
    }
  }

  useEffect(() => {
    // Get the phase of the game
    useGame.subscribe(
      (state) => state.phase,
      (value) => {
        if (value === 'ready') {
          reset() // Set initial position when the phase is ready.
        }
      }
    )

    // Get keys, and if it's true run the jump function
    const unsubscribeJump = subscribeKeys(
      (state) => state.jump,
      (value) => {
        if (value) {
          jump()
        }
      }
    )

    // Add the function to start on any key
    const unsubscribeAny = subscribeKeys(() => {
      start()
    })

    return () => {
      // Unsubscribe when re-render
      unsubscribeJump()
      unsubscribeAny()
    }
  }, [])

  useFrame((state, delta) => {
    // Controls
    const { forward, backward, leftward, rightward } = getKeys()

    const impulse = { x: 0, y: 0, z: 0 }
    const torque = { x: 0, y: 0, z: 0 }

    const impulseStrength = 0.6 * delta
    const torqueStrength = 0.2 * delta

    if (forward) {
      impulse.z -= impulseStrength
      torque.x -= torqueStrength
    }

    if (backward) {
      impulse.z += impulseStrength
      torque.x += torqueStrength
    }

    if (leftward) {
      impulse.y -= impulseStrength
      torque.z += torqueStrength
    }

    if (rightward) {
      impulse.y += impulseStrength
      torque.z -= torqueStrength
    }

    if (rightward) {
      impulse.y -= impulseStrength
      torque.z -= torqueStrength
    }

    body.current.applyImpulse(impulse)
    body.current.applyTorqueImpulse(torque)

    // Camera
    const bodyPosition = body.current.translation()
    const cameraPosition = new THREE.Vector3()
    cameraPosition.copy(bodyPosition)
    cameraPosition.z += 2.25
    cameraPosition.y += 0.65

    const cameraTarget = new THREE.Vector3()
    cameraTarget.copy(bodyPosition)
    cameraTarget.y += 0.25

    // Smoothing using lerp and frames
    smoothedCameraPosition.lerp(cameraPosition, 5 * delta)
    smoothedCameraTarget.lerp(cameraTarget, 5 * delta)

    // Look at and move the camera with the ball
    state.camera.position.copy(smoothedCameraPosition)
    state.camera.lookAt(smoothedCameraTarget)

    // Phases
    if (bodyPosition.z < -(blocksCount * 4 + 2)) {
      end() // End when you are near the burger
    }

    if (bodyPosition.y < -4) {
      reset() // Reset when you fall off the map
    }
  })

  return (
    <RigidBody
      ref={body}
      colliders="ball"
      restitution={0.2}
      friction={1}
      position={[0, 1, 0]}
      linearDamping={0.5}
      angularDamping={0.5}
    >
      <mesh castShadow>
        <icosahedronGeometry args={[0.3, 1]} />
        <meshStandardMaterial
          flatShading
          color="mediumpurple"
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>
    </RigidBody>
  )
}
