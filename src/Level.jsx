import * as THREE from 'three'

// Materials & geometries
const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const floorStartMaterial = new THREE.MeshStandardMaterial({
  color: 'limegreen',
})
const floorEndMaterial = new THREE.MeshStandardMaterial({
  color: 'greenYellow',
})
const obstacleMaterial = new THREE.MeshStandardMaterial({
  color: 'orangered',
})
const wallMaterial = new THREE.MeshStandardMaterial({
  color: 'slategrey',
})

function BlockStart({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      <mesh
        geometry={boxGeometry}
        material={floorStartMaterial}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
    </group>
  )
}

export default function Level() {
  return (
    <>
      <BlockStart position={[0, 0, 0]} />
    </>
  )
}
