export default function Modal({ handleGameSelect, score, maxScore, resetGame }) {
    const handleGameSelectorClick = () => {
        // Smooth fade out
        const overlay = document.querySelector('.modal-overlay')
        overlay.classList.add('fade-out')
        
        setTimeout(() => {
            handleGameSelect(null)
        }, 800)
    }

    return (
        <div className='modal-overlay'>
            <div className='modal'>
                <h2 className={'modal-title'}>GAME OVER</h2>
                <h3 className='modal-score'>SCORE: {score}</h3>
                <h4>MAX SCORE: {maxScore}</h4>
                <button className='modal-button' onClick={resetGame}>
                    Play again
                </button>
                <button className='modal-button' onClick={handleGameSelectorClick}>
                    Game select
                </button>
            </div>
        </div>
    )
}
