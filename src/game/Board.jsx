import { React, useState, useRef, useEffect } from 'react'
import { CANVAS_WIDTH, CANVAS_HEIGHT, PAD_WIDTH, BALL_NEW_BALL_INTERVAL } from './constants'
import { Pad } from './Pad'
import { Blocks } from './Block'
import { Balls } from './Ball'
import './Board.css'

export default function Board() {
    const canvasRef = useRef("board")
    const [score, setScore] = useState(0)
    const [maxScore, setMaxScore] = useState(0)
    const [win, setWin] = useState(false)
    const [lose, setLose] = useState(false)
    const [gameRestart, setGameRestart] = useState(true)

    const pad = new Pad()
    const blocks = new Blocks()
    let balls = new Balls()
    blocks.initializeBlocks()

    const addScore = (add) => {
        setScore(prevScore => {
            const newScore = prevScore + add
            setMaxScore(current => Math.max(current, newScore))
            return newScore
        })
    }

    const resetGame = () => {
        balls = new Balls()
        setScore(0)
        setWin(false)
        setLose(false)
        setGameRestart(prev => !prev)
    }

    useEffect(() => {
        const canvas = canvasRef.current
        let animationFrameId
        let isGameRunning = true
        
        const handleMouseMove = (event) => {
            if (!isGameRunning) return
            const rect = canvas.getBoundingClientRect()
            const mouseX = event.clientX - rect.left
            pad.move(mouseX - PAD_WIDTH / 2)
        }

        const handleLose = () => {
            isGameRunning = false
            setLose(true)
            cancelAnimationFrame(animationFrameId)
        }

        window.addEventListener('mousemove', handleMouseMove)

        function render() {
            if (!isGameRunning) return
            
            const ctx = canvas.getContext('2d')
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            pad.draw(ctx)
            blocks.draw(ctx)
            blocks.checkCollision(addScore, balls.balls)

            balls.draw(ctx, pad, handleLose, addScore)
            
            if (blocks.checkAllDestroyed()) {
                isGameRunning = false
                setWin(true)
                return
            }

            animationFrameId = requestAnimationFrame(render)
        }

        render()

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            cancelAnimationFrame(animationFrameId)
        }
    }, [gameRestart])

    useEffect(() => {
        const timer = setInterval(() => {
            if (!lose && !win) {
                balls.addBall()
            }
        }, BALL_NEW_BALL_INTERVAL)

        return () => clearInterval(timer)
    }, [gameRestart, lose, win])

    const game = <canvas id="board" ref={canvasRef} height={CANVAS_HEIGHT} width={CANVAS_WIDTH} />

    return (
        <div className="game-container">
            {!lose && !win ? (
                <main className="game-main">
                    <h2 className="score">SCORE: {score}</h2>
                    <h2 className="max-score">MAX SCORE: {maxScore}</h2>
                    {game}
                </main>
            ) : (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2 className={`modal-title ${lose ? "lose" : "win"}`}>
                            {lose ? "You lose!" : "You win!"}
                        </h2>
                        <h3 className="modal-score">SCORE: {score}</h3>
                        <h4>MAX SCORE: {maxScore}</h4>
                        <button className="modal-button" onClick={resetGame}>
                            Play again
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}