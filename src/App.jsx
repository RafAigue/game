import './App.css'
import { useState } from 'react'
import Welcome from './Welcome'
import SinglePlayer from './games/single-player/SinglePlayer'
import MultiPlayer from './games/multi-player/MultiPlayer'
import Summary from './Summary'
import { GAME_SINGLE_PLAYER, GAME_MULTI_PLAYER } from './constants'
import countdownSound from './assets/sounds/countdown.mp3'
import selectSound from './assets/sounds/coin_2.mp3'

function App() {
    const [isWelcome, setIsWelcome] = useState(false)
    const [gameSelected, setGameSelected] = useState(null)
    const [game, setGame] = useState(null)

    const handleWelcome = () => {
        setIsWelcome(true)
    }

    const handlePlayGame = (game) => {
        game === GAME_SINGLE_PLAYER && new Audio(countdownSound).play()
        setGame(game)
    }

    const handleSelectGame = (game) => {
        new Audio(selectSound).play()
        setGameSelected(game)
    }

    const gameSelector = () => {
        return (
            <div className='game-selector'>
                <div className='game-selector-buttons'>
                    <button className='game-selector-button'
                        onClick={() => handleSelectGame(GAME_SINGLE_PLAYER)}>
                        Single Player
                    </button>
                    <button className='game-selector-button'
                        onClick={() => handleSelectGame(GAME_MULTI_PLAYER)}>
                        Multi Player
                    </button>
                </div>
                <div className='game-selected'>
                    { ( gameSelected !== null) ?
                        <Summary game={gameSelected} handlePlayGame={handlePlayGame} />
                        :
                        <h1 style={{ color: '#dedede' }}>Select a game</h1>
                    }
                </div>
            </div>
        )
    }

    return (
        <div className='app'>
            { !isWelcome && <Welcome handleWelcome={handleWelcome} /> }
            { !game && isWelcome && gameSelector() }
            { game === GAME_SINGLE_PLAYER && <SinglePlayer handlePlayGame={handlePlayGame} /> }
            { game === GAME_MULTI_PLAYER && <MultiPlayer /> }
        </div>
    )
}

export default App
