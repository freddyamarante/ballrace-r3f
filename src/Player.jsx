import { useRapier, RigidBody } from '@react-three/rapier'
import { useFrame } from '@react-three/fiber'
import { useKeyboardControls } from '@react-three/drei'
import { useRef, useEffect } from 'react'

export default function Player() {
  const body = useRef()
  const { rapier, world } = useRapier()
  const rapierWorld = world.raw()
  const [subscribeKeys, getKeys] = useKeyboardControls()

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
    subscribeKeys(
      (state) => state.jump,
      (value) => {
        if (value) jump()
      }
    )
  }, [])

  useFrame((state, delta) => {
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
        <meshStandardMaterial flatShading color="mediumpurple" />
      </mesh>
    </RigidBody>
  )
}
