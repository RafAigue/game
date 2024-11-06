import { WebSocket, WebSocketServer } from 'ws'

const wss = new WebSocketServer({ host: '192.168.0.193', port: 8080 })

const generateUserId = () => {
  return `user-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

wss.on('connection', (ws) => {
  const userId = generateUserId()
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

console.log('WebSocket server is running on ws://192.168.0.193:8080')
