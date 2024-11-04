export const Modal = ({ lose, score, maxScore, resetGame }) => {
    return (
        <div className='modal-overlay'>
            <div className='modal'>
                <h2 className={`modal-title ${lose ? 'lose' : 'win'}`}>
                {lose ? 'You lose!' : 'You win!'}
                </h2>
                <h3 className='modal-score'>SCORE: {score}</h3>
                <h4>MAX SCORE: {maxScore}</h4>
                <button className='modal-button' onClick={resetGame}>
                    Play again
                </button>
            </div>
        </div>
    )
}
