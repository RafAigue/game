import './App.css'
import SinglePlayer from './games/single-player/SinglePlayer'
import { useState } from 'react'
import { GAME_SINGLE_PLAYER, GAME_MULTI_PLAYER } from './constants'

function App() {
    const [game, setGame] = useState(null)

    const handleGameSelect = (game) => {
        setGame(game)
    }

    const gameSelector = () => {
        return (
            <div className='game-selector'>
                <button className='game-selector-button' onClick={() => handleGameSelect(GAME_SINGLE_PLAYER)}>Single Player</button>
                <button className='game-selector-button' onClick={() => handleGameSelect(GAME_MULTI_PLAYER)}>Multi Player</button>
            </div>
        )
    }
    return (
        <div className='app'>
            { !game && gameSelector()}
            { game === GAME_SINGLE_PLAYER && <SinglePlayer handleGameSelect={handleGameSelect} /> }
            { game === GAME_MULTI_PLAYER && <h1>Multi Player</h1> }
        </div>
    )
}

export default App
