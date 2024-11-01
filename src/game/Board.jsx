import { React, useState, useRef, useEffect } from 'react'
import { CANVAS_WIDTH, CANVAS_HEIGHT, PAD_WIDTH } from './constants'
import { Ball } from './Ball'
import { Pad } from './Pad'
import { Blocks } from './Block'

export default function Board() {
    const canvasRef = useRef("board")
    const [score, setScore] = useState(0)
    const [win, setWin] = useState(false)
    const [lose, setLose] = useState(false)
    const [gameKey, setGameKey] = useState(true)

    const ball = new Ball()
    const pad = new Pad()
    const blocks = new Blocks()
    blocks.initializeBlocks()

    const addScore = (add) => {
        setScore(prevScore => prevScore + add)
    }

    const resetGame = () => {
        ball.direction.DOWN = false
        setScore(0)
        setWin(false)
        setLose(false)
        setGameKey(prev => !prev)
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
            blocks.checkCollision(addScore, ball)

            ball.draw(ctx)
            ball.checkCanvasCollisions(handleLose, ctx)
            ball.checkPadCollision(addScore, pad)
            
            if (blocks.checkAllDestroyed()) {
                isGameRunning = false
                setWin(true)
                return
            }

            ball.move()
            animationFrameId = requestAnimationFrame(render)
        }

        render()

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            cancelAnimationFrame(animationFrameId)
        }
    }, [gameKey])

    const game = <canvas id="board" ref={canvasRef} height={CANVAS_HEIGHT} width={CANVAS_WIDTH} />

    return (
        <div>
            {!lose ?
                <div>
                    {!win ?
                        <main>
                            <h2>SCORE: {score}</h2>
                            {game}
                        </main>
                        :
                        <div>
                            <h2>YOU WIN!</h2>
                            <h3>SCORE: {score}</h3>
                            <button onClick={resetGame}>Play again</button>
                        </div>
                    }                    
                </div>
                :
                <div>
                    <h2>YOU LOSE!</h2>
                    <h3>SCORE: {score}</h3>
                    <button onClick={resetGame}>Play again</button>
                </div>
            }
        </div>
    )
}
