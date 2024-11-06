import './App.css'
import { useState } from 'react'
import SinglePlayer from './games/single-player/SinglePlayer'
import Summary from './Summary'
import { GAME_SINGLE_PLAYER, GAME_MULTI_PLAYER } from './constants'

function App() {
    const [game, setGame] = useState(null)
    const [mouseOverGame, setMouseOverGame] = useState(GAME_SINGLE_PLAYER)

    const handleGameSelect = (game) => {
        setGame(game)
    }

    const handleMouseEnter = (game) => {
        setMouseOverGame(game)
    }

    const gameSelector = () => {
        return (
            <div className='game-selector'>
                <div className='game-selector-buttons'>
                    <button className='game-selector-button'
                        onMouseEnter={() => handleMouseEnter(GAME_SINGLE_PLAYER)}>
                        Single Player
                    </button>
                    <button className='game-selector-button'
                        onMouseEnter={() => handleMouseEnter(GAME_MULTI_PLAYER)}>
                        Multi Player
                    </button>
                </div>
                { mouseOverGame && <Summary game={mouseOverGame} handleGameSelect={handleGameSelect} /> }
            </div>
        )
    }

    return (
        <div className='app'>
            { !game && gameSelector()}
            { game === GAME_SINGLE_PLAYER && <SinglePlayer handleGameSelect={handleGameSelect} /> }
            { game === GAME_MULTI_PLAYER && <h1 style={{ color: '#dedede' }}>Multi Player</h1> }
        </div>
    )
}

export default App
