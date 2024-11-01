import { PAD_Y, PAD_WIDTH, PAD_HEIGHT, CANVAS_WIDTH } from './constants'

export class Pad {
    constructor(x) {
        this.x = x
        this.y = PAD_Y
        this.width = PAD_WIDTH
        this.height = PAD_HEIGHT
    }

    draw(ctx) {
        ctx.fillStyle = 'green'
        ctx.fillRect(this.x, this.y, this.width, this.height)
        ctx.stroke()
    }

    move(x) {
        this.x = Math.max(0, Math.min(x, CANVAS_WIDTH - this.width))
    }

    angleCollision(x) {
        // Dividimos el pad en 6 partes iguales (el centro ocupa 2 partes)
        const stepSize = this.width / 6
        const relativeX = x - this.x
        let currentStep

        if (relativeX < stepSize) {
            currentStep = 0 // -75°
        } else if (relativeX < stepSize * 2) {
            currentStep = 1 // -60°
        } else if (relativeX < stepSize * 3) {
            currentStep = 2 // -20°
        } else if (relativeX < stepSize * 5) {
            currentStep = 3 // 0° (zona central)
        } else if (relativeX < stepSize * 6) {
            currentStep = 4 // 20°, 60° o 75° dependiendo de la posición
        }

        const angles = [-75, -60, -20, 0, 20, 60, 75]
        let finalAngle

        if (currentStep === 4) {
            const remainingWidth = this.width - (stepSize * 5)
            const subStep = Math.floor((relativeX - stepSize * 5) / (remainingWidth / 3))
            finalAngle = angles[4 + subStep]
        } else {
            finalAngle = angles[currentStep]
        }

        console.log(finalAngle)
    }
}
