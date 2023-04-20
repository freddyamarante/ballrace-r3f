import './style.css'
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import Experience from './Experience'
import Interface from './Interface'
import { KeyboardControls } from '@react-three/drei'
import { Analytics } from '@vercel/analytics/react'

const root = ReactDOM.createRoot(document.querySelector('#root'))

root.render(
  <>
    {/* Analytics from Vercel */}
    <Analytics />
    {/* Set the keys the component KeyboardControls is going to listen to, which now can be used in the useKeyboardControls hook (which works as a Zustand store aswell) */}
    <KeyboardControls
      map={[
        { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
        { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
        { name: 'leftward', keys: ['ArrowLeft', 'KeyA'] },
        { name: 'rightward', keys: ['ArrowRight', 'KeyD'] },
        { name: 'jump', keys: ['Space'] },
      ]}
    >
      <Canvas
        shadows
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
          position: [2.5, 4, 6],
        }}
      >
        <Experience />
      </Canvas>
      <Interface />
    </KeyboardControls>
  </>
)
