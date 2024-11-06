import { React, useState, useRef, useEffect } from 'react'
import { CANVAS_WIDTH, CANVAS_HEIGHT, PAD_WIDTH, PILL_SPEED } from '../../constants'
import Pad from './classes/Pad'
import Ball from './classes/Ball'
import Pill from './classes/Pill'
import Modal from './Modal'
import './SinglePlayer.css'
import pillSound from '../../assets/sounds/coin.mp3'
import loseSound from '../../assets/sounds/dead.mp3'
import countdownSound from '../../assets/sounds/countdown.mp3'

export default function SinglePlayer({ handlePlayGame }) {
    const canvasRef = useRef(null)
    const [score, setScore] = useState(0.00)
    const [maxScore, setMaxScore] = useState(Number(localStorage.getItem('SinglePlayerMaxScore')) || 0.00)
    const timerRef = useRef(null)
    const startTimeRef = useRef(null)
    const [gameRestart, setGameRestart] = useState(true)
    const [isGameRunning, setIsGameRunning] = useState(true)
    const pillIntervalRef = useRef(null)
    const [countdown, setCountdown] = useState(3)
    const [gameStarted, setGameStarted] = useState(false)

    let pill = new Pill()
    let animationFrameId

    const resetGame = () => {
        new Audio(countdownSound).play()
        setScore(0.00)
        setGameRestart(prev => !prev)
        setIsGameRunning(true)
        setGameStarted(false)
        setCountdown(3)
        pill = new Pill()
    }

    const handleGameOver = () => {
        new Audio(loseSound).play()
        clearInterval(timerRef.current)
        setIsGameRunning(false)
        cancelAnimationFrame(animationFrameId)
        const elapsedTime = (Date.now() - startTimeRef.current) / 1000
        const finalScore = Number(elapsedTime.toFixed(2))
        const newMaxScore = Math.max(finalScore, maxScore)
        setScore(finalScore)
        setMaxScore(newMaxScore)
        localStorage.setItem('SinglePlayerMaxScore', newMaxScore)
    }

    // Countdown
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(prev => prev - 1)
            }, 1000)
            return () => clearTimeout(timer)
        } else if (countdown === 0 && !gameStarted) {
            setGameStarted(true)
            startTimeRef.current = Date.now()
        }
    }, [countdown, gameStarted])

    // Timer
    useEffect(() => {
        if (!gameStarted) return

        startTimeRef.current = Date.now()
        timerRef.current = setInterval(() => {
            const elapsedTime = (Date.now() - startTimeRef.current) / 1000
            setScore(Number(elapsedTime.toFixed(2)))
        }, 10)

        return () => clearInterval(timerRef.current)
    }, [gameRestart, gameStarted])

    // Game
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const pad = new Pad()
        const ball = new Ball()
        setIsGameRunning(true)

        const handleMouseMove = (event) => {
            if (!isGameRunning) return
            const rect = canvas.getBoundingClientRect()
            const mouseX = event.clientX - rect.left
            pad.move(mouseX - PAD_WIDTH / 2)
        }

        const handleMouseClick = (event) => {
            const rect = canvas.getBoundingClientRect()
            const mouseX = event.clientX - rect.left
            const mouseY = event.clientY - rect.top
            if (pill?.isClicked(mouseX, mouseY)) {
                new Audio(pillSound).play()
                ball.speed -= PILL_SPEED
                pill = null
                clearInterval(pillIntervalRef.current)
                pillIntervalRef.current = setInterval(
                    () => pill = new Pill(), 
                    Math.floor(Math.random() * 10000) + 5000
                )
            }
        }

        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('click', handleMouseClick)

        function render() {
            if (!isGameRunning) return
            
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            pad.draw(ctx)
            ball.draw(ctx)
            ball.checkCanvasCollisions(handleGameOver, ctx)
            ball.checkPadCollision(pad)
            ball.move()
            pill?.draw(ctx)

            animationFrameId = requestAnimationFrame(render)
        }

        render()

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('click', handleMouseClick)
            cancelAnimationFrame(animationFrameId)
            clearInterval(pillIntervalRef.current)
        }
    }, [gameRestart, isGameRunning, gameStarted])

    const game = <canvas id='board' ref={canvasRef} height={CANVAS_HEIGHT} width={CANVAS_WIDTH} />

    return (
        <div className='game-container'>
            {isGameRunning ? (
                <main className='game-main'>
                    {!gameStarted ? <h1 className='countdown'>{countdown}</h1>
                    :
                    <>
                        <h2 className='score'>SCORE: {score.toFixed(2)}</h2>
                        <h2 className='max-score'>MAX SCORE: {maxScore.toFixed(2)}</h2>
                        {game}
                    </>}
                </main>
            ) : (
                <Modal
                    handlePlayGame={handlePlayGame}
                    score={score}
                    maxScore={maxScore}
                    resetGame={resetGame}
                />
            )}
        </div>
    )
}