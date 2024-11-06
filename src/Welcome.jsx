export default function Welcome({ handleWelcome }) {
    return (
        <div className='welcome'>
            <h1>Welcome to the game</h1>
            <button className='button-play' onClick={handleWelcome}>Let's play!</button>
        </div>
    )
}