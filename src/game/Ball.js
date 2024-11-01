import { BALL_RADIUS, BALL_INITIAL_SPEED, CANVAS_WIDTH, CANVAS_HEIGHT, SCORE_PAD, PAD_SPEED } from './constants'

export class Ball {
    constructor() {
        this.pos_x = CANVAS_WIDTH / 2 + Math.floor(Math.random() * 300) * (Math.random() > 0.5 ? 1 : -1)
        this.pos_y = CANVAS_HEIGHT / 2 + Math.floor(Math.random() * 100) * (Math.random() > 0.5 ? 1 : -1)
        this.speed = BALL_INITIAL_SPEED
        this.direction = {
            DOWN: true,
            RIGHT: Math.random() > 0.5
        }
    }

    draw(ctx) {
        ctx.beginPath()
        ctx.arc(this.pos_x, this.pos_y, BALL_RADIUS, 0, 2 * Math.PI)
        ctx.fillStyle = 'red'
        ctx.fill()
        ctx.stroke()
    }

    move() {
        this.direction.DOWN ? this.pos_y += this.speed : this.pos_y -= this.speed
        this.direction.RIGHT ? this.pos_x += this.speed : this.pos_x -= this.speed
    }

    checkCanvasCollisions(handleLose, ctx) {
        this.checkCanvasRightCollision()
        this.checkCanvasLeftCollision()
        this.checkCanvasTopCollision()
        this.checkCanvasBottomCollision(handleLose, ctx)
    }

    checkCanvasRightCollision() {
        if (this.pos_x + BALL_RADIUS >= CANVAS_WIDTH) this.direction.RIGHT = false
    }

    checkCanvasLeftCollision() {
        if (this.pos_x - BALL_RADIUS <= 0) this.direction.RIGHT = true
    }

    checkCanvasTopCollision() {
        if (this.pos_y - BALL_RADIUS <= 0) this.direction.DOWN = true
    }

    checkCanvasBottomCollision(handleLose,  ctx) {
        if (this.pos_y + BALL_RADIUS >= CANVAS_HEIGHT) {
            ctx.reset()
            handleLose()
        }
    }

    checkPadCollision(addScore, pad) {
        if (this.pos_y + BALL_RADIUS >= pad.y && this.pos_x + BALL_RADIUS >= pad.x && this.pos_x - BALL_RADIUS <= pad.x + pad.width) {
            this.direction.DOWN = false
            addScore(SCORE_PAD)
            this.increaseSpeed(PAD_SPEED)
        }            
    }

    increaseSpeed(speed) {
        this.speed += speed
    }
}

export class Balls {
    constructor() {
        this.balls = [new Ball()]
    }

    addBall() {
        this.balls.push(new Ball())
    }

    draw(ctx, pad, handleLose, addScore) {
        this.balls.forEach(ball => {
            ball.draw(ctx)
            ball.checkCanvasCollisions(handleLose, ctx)
            ball.checkPadCollision(addScore, pad)
            ball.move()
        })
    }
}