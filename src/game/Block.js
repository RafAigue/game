import { BLOCK_WIDTH, BLOCK_HEIGHT, BLOCK_COLORS, CANVAS_WIDTH, BALL_RADIUS, SCORE_BLOCK, BLOCK_SPACING, BLOCK_SPEED } from './constants'

export class Block {
    constructor(x) {
        this.x = x
        this.y = 100
        this.width = BLOCK_WIDTH
        this.height = BLOCK_HEIGHT
        this.color = BLOCK_COLORS[Math.floor(Math.random() * BLOCK_COLORS.length)]
        this.destroyed = false
    }

    draw(ctx) {
        if (!this.destroyed) {
            ctx.fillStyle = this.color
            ctx.fillRect(this.x, this.y, this.width, this.height)
            ctx.stroke()
        }
    }

    checkCollision(addScore, ball) {
        if (!this.destroyed && (
            this.checkRightCollision(ball) ||
            this.checkLeftCollision(ball) ||
            this.checkTopCollision(ball) ||
            this.checkBottomCollision(ball))) {
            this.destroyed = true
            addScore(SCORE_BLOCK)
        }
    }

    checkRightCollision(ball) {
        if (!ball.direction.RIGHT &&
            ball.pos_x - BALL_RADIUS <= this.x + this.width &&
            ball.pos_x >= this.x + this.width - BALL_RADIUS &&
            ball.pos_y >= this.y &&
            ball.pos_y <= this.y + this.height) {
            ball.direction.RIGHT = true
            ball.increaseSpeed(BLOCK_SPEED)
            return true
        }
        return false
    }

    checkLeftCollision(ball) {
        if (ball.direction.RIGHT &&
            ball.pos_x + BALL_RADIUS >= this.x &&
            ball.pos_x <= this.x + BALL_RADIUS &&
            ball.pos_y >= this.y &&
            ball.pos_y <= this.y + this.height) {
            ball.direction.RIGHT = false
            ball.increaseSpeed(BLOCK_SPEED)
            return true
        }
        return false
    }

    checkTopCollision(ball) {
        if (ball.direction.DOWN &&
            ball.pos_x >= this.x && 
            ball.pos_x <= this.x + this.width &&
            ball.pos_y + BALL_RADIUS >= this.y &&
            ball.pos_y <= this.y + BALL_RADIUS) {
            ball.direction.DOWN = false
            ball.increaseSpeed(BLOCK_SPEED)
            return true
        }
        return false
    }

    checkBottomCollision(ball) {
        if (!ball.direction.DOWN &&
            ball.pos_x >= this.x && 
            ball.pos_x <= this.x + this.width &&
            ball.pos_y - BALL_RADIUS <= this.y + this.height &&
            ball.pos_y >= this.y + this.height - BALL_RADIUS) {
            ball.direction.DOWN = true
            ball.increaseSpeed(BLOCK_SPEED)
            return true
        }
        return false
    }
}

export class Blocks {
    constructor() {
        this.blocks = []
    }

    initializeBlocks() {
        let numBlocks = Math.floor(CANVAS_WIDTH / (BLOCK_WIDTH + BLOCK_SPACING))
        let totalSpace = CANVAS_WIDTH - (numBlocks * BLOCK_WIDTH)
        let spaceBetweenBlocks = totalSpace / (numBlocks + 1)

        for (let i = 0; i < numBlocks; i++) {
            this.addBlock(i, spaceBetweenBlocks)
        }
    }

    addBlock(i, spaceBetweenBlocks) {
        let x = (i * BLOCK_WIDTH) + ((i + 1) * spaceBetweenBlocks)
        let block = new Block(x)
        this.blocks.push(block)
    }

    draw(ctx) {
        this.blocks.forEach(block => block.draw(ctx))
    }

    checkCollision(addScore, balls) {
        this.blocks.forEach(block => {
            balls.forEach(ball => {
                block.checkCollision(addScore, ball)
            })
        })
    }

    checkAllDestroyed() {
        return this.blocks.every(block => block.destroyed)
    }
}
