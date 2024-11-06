// Colors
export const BLUE = 'blue'
export const GREEN = 'green'
export const RED = 'red'
export const YELLOW = 'yellow'
export const PURPLE = 'purple'
export const WHITE = 'white'

// Canvas
let canvasWidth = window.innerWidth * 0.8
let canvasHeight = window.innerHeight * 0.8
export const CANVAS_WIDTH = canvasWidth < 1280 ? 1280 : canvasWidth
export const CANVAS_HEIGHT = canvasHeight < 720 ? 720 : canvasHeight

// Games
export const GAME_SINGLE_PLAYER = 'single-player'
export const GAME_MULTI_PLAYER = 'multi-player'
export const GAME_SINGLE_PLAYER_DESCRIPTION = 'Hold as much as you can!'
export const GAME_MULTI_PLAYER_DESCRIPTION = 'Beat your friends!'

// Ball
export const BALL_RADIUS = 16
export const BALL_INITIAL_SPEED = 20
export const BALL_NEW_BALL_INTERVAL = 8000
export const BALL_COLOR = WHITE

// Pad
export const PAD_Y = CANVAS_HEIGHT - 50
export const PAD_WIDTH = 200
export const PAD_STEP_ANGLE = PAD_WIDTH / 5
export const PAD_HEIGHT = 10
export const PAD_SPEED = 1
export const PAD_COLOR = GREEN

// Pill
export const PILL_RADIUS = 16
export const PILL_SPEED = 2

// WebSocket
export const WS_HOST = '192.168.0.193'
export const WS_PORT = 8080