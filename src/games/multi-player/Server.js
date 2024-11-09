import { WebSocket, WebSocketServer } from 'ws'
import BooleanGame from './BooleanGame.js'

const WS_HOST = '192.168.0.193'
const WS_PORT = 8080
const wss = new WebSocketServer({ host: WS_HOST, port: WS_PORT })

let players = []
let game = null

wss.on('connection', async (ws) => {
  const userId = `user-${Date.now()}-${Math.floor(Math.random() * 1000)}`
  ws.send(JSON.stringify({ type: 'init', userId }))
  console.log('New client connected with ID:', userId)

  players.push(userId)

  if (players.length === 2 && !game) {
    game = new BooleanGame(wss.clients, players)
    await game.getQuestions()
    game.sendQuestion()
  }

  ws.on('message', (message) => {
    const messageData = JSON.parse(message)

    if (messageData.type === 'gameBoolean') {

      if (game) {
        game.setPlayerResponse({
          userId: messageData.userId,
          response: messageData.response,
          timeResponse: Date.now()
        })
      } else {
        console.error('Error: Game not initialized')
      }
    }

    if (messageData.type === 'chat') {
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'chat',
            data: {
              userId: userId,
              message: messageData.message
            }
          }))
        }
      })
    }
  })

  ws.on('close', () => {
    console.log('Client with ID', userId, 'disconnected')
    players = players.filter(player => player !== userId)

    if (players.length < 2) {
      game = null
    }
  })
})

console.log(`WebSocket server is running on ws://${WS_HOST}:${WS_PORT}`)
