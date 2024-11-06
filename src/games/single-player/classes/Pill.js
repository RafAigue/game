import { PILL_RADIUS, CANVAS_WIDTH, CANVAS_HEIGHT, BLUE, GREEN, PURPLE } from '../../../constants'

export default class Pill {
    constructor() {
        let random = Math.floor(Math.random() * 10) % 3
        this.posX = Math.floor(Math.random() * CANVAS_WIDTH)
        this.posY = Math.floor(Math.random() * (CANVAS_HEIGHT - 100))
        this.color = random === 0 ? BLUE : random === 1 ? GREEN : PURPLE
    }

    draw(ctx) {
        ctx.beginPath()
        ctx.arc(this.posX, this.posY, PILL_RADIUS, 0, 2 * Math.PI)
        ctx.fillStyle = this.color
        ctx.fill()
        ctx.stroke()
    }

    isClicked(mouseX, mouseY) {
        return Math.sqrt((this.posX - mouseX) ** 2 + (this.posY - mouseY) ** 2) <= PILL_RADIUS
    }
}
