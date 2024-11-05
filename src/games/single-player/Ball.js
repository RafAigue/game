import { BALL_RADIUS, BALL_INITIAL_SPEED, CANVAS_WIDTH, CANVAS_HEIGHT, PAD_SPEED, BALL_COLOR } from '../../constants'

export default class Ball {
    constructor() {
        this.posX = CANVAS_WIDTH / 2 + Math.floor(Math.random() * 300) * (Math.random() > 0.5 ? 1 : -1)
        this.posY = CANVAS_HEIGHT / 2 + Math.floor(Math.random() * 100) * (Math.random() > 0.5 ? 1 : -1)
        this.speed = BALL_INITIAL_SPEED
        this.direction = {
            DOWN: false,
            RIGHT: Math.random() > 0.5
        }
        this.speedX = 0.5
        this.speedY = 0.5
    }

    draw(ctx) {
        ctx.beginPath()
        ctx.arc(this.posX, this.posY, BALL_RADIUS, 0, 2 * Math.PI)
        ctx.fillStyle = BALL_COLOR
        ctx.fill()
        ctx.stroke()
    }

    move() {
        this.direction.DOWN ? this.posY += this.speed * this.speedY : this.posY -= this.speed * this.speedY
        this.direction.RIGHT ? this.posX += this.speed * this.speedX : this.posX -= this.speed * this.speedX
    }

    checkCanvasCollisions(handleLose, ctx) {
        this.checkCanvasRightCollision()
        this.checkCanvasLeftCollision()
        this.checkCanvasTopCollision()
        this.checkCanvasBottomCollision(handleLose, ctx)
    }

    checkCanvasRightCollision() {
        if (this.posX + BALL_RADIUS >= CANVAS_WIDTH) this.direction.RIGHT = false
    }

    checkCanvasLeftCollision() {
        if (this.posX - BALL_RADIUS <= 0) this.direction.RIGHT = true
    }

    checkCanvasTopCollision() {
        if (this.posY - BALL_RADIUS <= 0) this.direction.DOWN = true
    }

    checkCanvasBottomCollision(handleGameOver,  ctx) {
        if (this.posY + BALL_RADIUS >= CANVAS_HEIGHT) {
            ctx.reset()
            handleGameOver()
        }
    }

    checkPadCollision(pad) {
        if (this.posY + BALL_RADIUS >= pad.y && this.posX + BALL_RADIUS >= pad.x && this.posX - BALL_RADIUS <= pad.x + pad.width) {
            this.direction.DOWN = false
            this.speed += PAD_SPEED

            // Ball hits the limits of the pad
            if (this.posX < pad.x + pad.stepAngle) { // Left side
                this.direction.RIGHT = false
                this.speedX = 0.7
                this.speedY = 0.3
            } else if (this.posX > pad.x + pad.width - pad.stepAngle) { // Right side
                this.direction.RIGHT = true
                this.speedX = 0.7
                this.speedY = 0.3
            } else if (this.posX > pad.x + pad.stepAngle && this.posX < pad.x + 2 * pad.stepAngle) { // Left side
                this.direction.RIGHT = false
                this.speedX = 0.6
                this.speedY = 0.4                
            } else if (this.posX > pad.x + pad.width - 2 * pad.stepAngle && this.posX < pad.x + pad.width - pad.stepAngle) { // Right side
                this.direction.RIGHT = true
                this.speedX = 0.6
                this.speedY = 0.4
            }
        }            
    }
}