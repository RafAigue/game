import spSummaryImage from './assets/sp.png'
import mpSummaryImage from './assets/mp.png'
import { GAME_SINGLE_PLAYER, GAME_SINGLE_PLAYER_DESCRIPTION, GAME_MULTI_PLAYER_DESCRIPTION } from './constants'

export default function Summary({ game, handleGameSelect }) {
    let summaryImage = game === GAME_SINGLE_PLAYER ? spSummaryImage : mpSummaryImage

    const title = game === GAME_SINGLE_PLAYER ? 'Single Player' : 'Multi Player'
    return (
        <div className='summary'>
            <h2>{title}</h2>
            <p>{game === GAME_SINGLE_PLAYER ? GAME_SINGLE_PLAYER_DESCRIPTION : GAME_MULTI_PLAYER_DESCRIPTION}</p>
            <img className='summary-image' src={summaryImage} alt='Single Player Summary' />
            <button className='summary-button-play' onClick={() => handleGameSelect(game)}>Play</button>
        </div>
    )
}