import { WebSocket, WebSocketServer } from 'ws'

const WS_HOST = '192.168.0.193'
const WS_PORT = 8080
const wss = new WebSocketServer({ host: WS_HOST, port: WS_PORT })

wss.on('connection', (ws) => {
  const userId = `user-${Date.now()}-${Math.floor(Math.random() * 1000)}`
  console.log('New client connected with ID:', userId)
  ws.send(JSON.stringify({ type: 'init', userId }))

  ws.on('message', (message) => {
    console.log('Received:', message)

    const messageData = JSON.parse(message)
    console.log('messageData:', messageData)

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'message',
          data: {
            userId: userId,
            message: messageData.message
          }
        }))
      }
    })
  })

  ws.on('close', () => {
    console.log('Client with ID', userId, 'disconnected')
  })
})

console.log(`WebSocket server is running on ws://${WS_HOST}:${WS_PORT}`)
