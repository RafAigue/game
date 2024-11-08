import { PAD_Y, PAD_WIDTH, PAD_HEIGHT, CANVAS_WIDTH, PAD_COLOR, PAD_STEP_ANGLE } from '../../../constants'

export default class Pad {
    constructor() {
        this.x = CANVAS_WIDTH / 2
        this.y = PAD_Y
        this.width = PAD_WIDTH
        this.height = PAD_HEIGHT
        this.stepAngle = PAD_STEP_ANGLE
    }

    draw(ctx) {
        ctx.beginPath()
        ctx.roundRect(this.x, this.y, this.width, this.height, 5)
        ctx.fillStyle = PAD_COLOR
        ctx.fill()

        const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height)
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.5)')
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
        ctx.fillStyle = gradient
        ctx.fill()
    }

    move(x) {
        this.x = Math.max(0, Math.min(x, CANVAS_WIDTH - this.width))
    }
}
