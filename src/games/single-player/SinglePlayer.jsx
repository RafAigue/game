import { React, useState, useRef, useEffect } from 'react'
import { CANVAS_WIDTH, CANVAS_HEIGHT, PAD_WIDTH, PILL_SPEED } from '../../constants'
import Pad from './Pad'
import Ball from './Ball'
import Pill from './Pill'
import { Modal } from './Modal'
import './Board.css'

export default function SinglePlayer({ handleGameSelect }) {
    const canvasRef = useRef(null)
    const [score, setScore] = useState(0.00)
    const [maxScore, setMaxScore] = useState(0.00)
    const timerRef = useRef(null)
    const startTimeRef = useRef(null)
    const [gameRestart, setGameRestart] = useState(true)
    const [isGameRunning, setIsGameRunning] = useState(true)
    let pill = new Pill()
    const pillIntervalRef = useRef(null)

    let animationFrameId

    const resetGame = () => {
        setScore(0.00)
        setGameRestart(prev => !prev)
        setIsGameRunning(true)
        startTimeRef.current = Date.now()
        pill = new Pill()
    }

    const handleGameOver = () => {
        clearInterval(timerRef.current)
        setIsGameRunning(false)
        cancelAnimationFrame(animationFrameId)
        const elapsedTime = (Date.now() - startTimeRef.current) / 1000
        const finalScore = Number(elapsedTime.toFixed(2))
        const newMaxScore = Math.max(finalScore, maxScore)
        setScore(finalScore)
        setMaxScore(newMaxScore)
    }

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
    }, [gameRestart, isGameRunning])

    useEffect(() => {
        startTimeRef.current = Date.now()
        timerRef.current = setInterval(() => {
            const elapsedTime = (Date.now() - startTimeRef.current) / 1000
            setScore(Number(elapsedTime.toFixed(2)))
        }, 10)

        return () => clearInterval(timerRef.current)
    }, [gameRestart])

    const game = <canvas id='board' ref={canvasRef} height={CANVAS_HEIGHT} width={CANVAS_WIDTH} />

    return (
        <div className='game-container'>
            {isGameRunning ? (
                <main className='game-main'>
                    <h2 className='score'>SCORE: {score.toFixed(2)}</h2>
                    <h2 className='max-score'>MAX SCORE: {maxScore.toFixed(2)}</h2>
                    {game}
                </main>
            ) : (
                <Modal
                    handleGameSelect={handleGameSelect}
                    score={score}
                    maxScore={maxScore}
                    resetGame={resetGame}
                />
            )}
        </div>
    )
}