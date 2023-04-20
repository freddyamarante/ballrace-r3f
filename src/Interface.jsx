import { useKeyboardControls } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import { addEffect } from '@react-three/fiber'
import useGame from './stores/useGame.js'

export default function Interface() {
  const time = useRef()

  // Save the needed states from useGame
  const restart = useGame((state) => state.restart)
  const phase = useGame((state) => state.phase)

  // Listen to keys from KeyboardControls
  const forward = useKeyboardControls((state) => state.forward)
  const backward = useKeyboardControls((state) => state.backward)
  const leftward = useKeyboardControls((state) => state.leftward)
  const rightward = useKeyboardControls((state) => state.rightward)
  const jump = useKeyboardControls((state) => state.jump)

  useEffect(() => {
    // addEffect is a function that runs on each frame, we use addEffect instead of useFrame because we are outside the canvas
    const unsubscribeEffect = addEffect(() => {
      const state = useGame.getState()

      let elapsedTime = 0

      if (state.phase === 'playing') {
        elapsedTime = Date.now() - state.startTime // Update time when playing
      } else if (state.phase === 'ended') {
        elapsedTime = state.endTime - state.startTime // Get total time when ended
      }

      // Format elapsed time
      elapsedTime /= 1000
      elapsedTime = elapsedTime.toFixed(2)

      if (time.current) {
        time.current.textContent = elapsedTime
      }
    })

    return () => {
      // Unsubscribe from the effect when the component unmounts
      unsubscribeEffect()
    }
  }, [])
  return (
    <div className="interface">
      {/* Time */}
      <div ref={time} className="time"></div>

      {/* Restart */}
      {phase === 'ended' && (
        <div className="restart" onClick={restart}>
          Restart
        </div>
      )}

      {/* Controls */}
      <div className="controls">
        <div className="raw">
          <div className={`key ${forward ? 'active' : ''}`}></div>
        </div>
        <div className="raw">
          <div className={`key ${leftward ? 'active' : ''}`}></div>
          <div className={`key ${backward ? 'active' : ''}`}></div>
          <div className={`key ${rightward ? 'active' : ''}`}></div>
        </div>
        <div className="raw">
          <div className={`key ${jump ? 'active' : ''} large`}></div>
        </div>
      </div>
    </div>
  )
}
