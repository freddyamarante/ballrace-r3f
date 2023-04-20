import { Physics, Debug } from '@react-three/rapier'
import Lights from './Lights.jsx'
import { Level } from './Level.jsx'
import Player from './Player.jsx'
import useGame from './stores/useGame.js'

export default function Experience() {
  const blocksCount = useGame((state) => {
    return state.blocksCount
  })

  return (
    <>
      <Physics>
        <Lights />
        <Level count={blocksCount} />
        <Player />
      </Physics>
    </>
  )
}
