import { Physics, Debug } from '@react-three/rapier'
import Effects from './Effects.jsx'
import Lights from './Lights.jsx'
import { Level } from './Level.jsx'
import Player from './Player.jsx'
import useGame from './stores/useGame.js'

export default function Experience() {
  // Fetches the blocks count from the store
  const blocksCount = useGame((state) => {
    return state.blocksCount
  })
  // Generates a blocks seed and passes it as a prop on Level component
  const blocksSeed = useGame((state) => state.blocksSeed)

  return (
    <>
      <color args={['#252731']} attach="background" />
      <Physics>
        <Lights />
        <Level count={blocksCount} seed={blocksSeed} />
        <Player />
      </Physics>

      <Effects />
    </>
  )
}
