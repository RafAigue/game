import React, { useEffect, useState } from 'react'
import './MultiPlayer.css'

export default function MultiPlayer() {
  const [messages, setMessages] = useState([])
  const [userId, setUserId] = useState(null)
  const [ws, setWs] = useState(null)

  useEffect(() => {
    const socket = new WebSocket('ws://192.168.0.193:8080')
    setWs(socket)
  
    socket.onopen = () => console.log('Connected to WebSocket')
    
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        
        if (data.type === 'init') {
          setUserId(data.userId)
        } else if (data.type === 'message') {
          const messageText = {userId: data.data.userId, message: data.data.message}
          setMessages((prevMessages) => [...prevMessages, messageText])
        }
      } catch (error) {
        console.error('Error parsing message:', error)
      }
    }

    socket.onclose = () => console.log('Disconnected from WebSocket')

    return () => socket.close()
  }, [])

  const sendMessage = (message) => {
    if (ws) {
      const messageData = {
        userId,
        message,
      }
      ws.send(JSON.stringify(messageData))
    }
  }

  return (
    <div className="game-container">
      <h1 className="game-title">Quiz</h1>
      <button 
        className="answer-button"
        onClick={() => sendMessage('Player answered!')}
      >
        Send
      </button>
      <ul className="messages-list">
        {messages.map((msg, index) => (
          <li 
            key={index} 
            className={`message-item ${msg.userId === userId ? 'message-own' : 'message-other'}`}
          >
            <div className="message-user-id">Usuario {msg.userId}</div>
            {msg.message}
          </li>
        ))}
      </ul>
    </div>
  )
}