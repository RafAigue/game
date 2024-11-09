import React, { useEffect, useState } from 'react'
import './MultiPlayer.css'
import { WS_HOST, WS_PORT, MSG_TYPE_CHAT, MSG_TYPE_GAME_BOOL_RESP } from '../../constants'

export default function MultiPlayer() {
  const [ws, setWs] = useState(null)
  const [userId, setUserId] = useState(null)
  const [readyToPlay, setReadyToPlay] = useState(false)
  const [question, setQuestion] = useState([])
  const [messages, setMessages] = useState([])
  const [counter, setCounter] = useState(0)
  const [disableAnswers, setDisableAnswers] = useState(false)

  useEffect(() => {
    const socket = new WebSocket(`ws://${WS_HOST}:${WS_PORT}`)

    socket.onopen = () => setWs(socket)

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        
        if (data.type === 'init') {
          setUserId(data.userId)
        } else if (data.type === 'chat') {
          const messageText = {userId: data.data.userId, message: data.data.message}
          setMessages((prevMessages) => [...prevMessages, messageText])
        } else if (data.type === 'newQuestion') {
          !readyToPlay && setReadyToPlay(true)
          let question = data.data.question
          question.question = question.question.replace(/&quot;/g, '"')
          setQuestion(data.data.question)
          setCounter(prev => prev + 1)
          setDisableAnswers(false)
        }
      } catch (error) {
        console.error('Error parsing message:', error)
      }
    }

    socket.onclose = () => setWs(socket)
  }, [])

  const sendMessage = (message) => {
    if (ws) {
      ws.send(JSON.stringify({
        userId,
        type: MSG_TYPE_CHAT,
        message
      }))
    }
  }

  const chat = () => {
    if (ws.readyState === WebSocket.OPEN) {
      return (
        <>
          <button 
            className="answer-button"
            onClick={() => sendMessage('Player answered!')}
          >
            Send
          </button>
          <button 
            className="answer-button"
            onClick={() => ws.close()}
          >
            Disconnect
          </button>
          <ul className="messages-list">
            {messages.map((msg, index) => (
              <li 
                key={index} 
                className={`message-item ${msg.userId === userId ? 'message-own' : 'message-other'}`}
              >
                <div className="message-user-id">User: {msg.userId}</div>
                {msg.message}
              </li>
            ))}
          </ul>
        </>
      )
    }
  }

  const sendResponse = (response) => {
    if (ws) {
      // Controlar si no responde en un plazo de tiempo
      ws.send(JSON.stringify({
        userId,
        type: MSG_TYPE_GAME_BOOL_RESP,
        response
      }))
      setDisableAnswers(true)
    }
  }

  const game = () => {
    return (
      <main className='mp-game'>
        <h1 className='mp-game-title'>Quiz ({counter})</h1>
        <h3 className='mp-question-category'>{question.category}</h3>
        <strong>{question.difficulty}</strong>
        <p>{question.question}</p>
        <p>{question.correct_answer}</p>
        <div>
          <button disabled={disableAnswers} className='answer-button answer-true' onClick={() => sendResponse('True')}>True</button>
          <button disabled={disableAnswers} className='answer-button answer-false' onClick={() => sendResponse('False')}>False</button>
        </div>
      </main>
    )
  }

  return (
    <div className="mp-game-container">
      {
        readyToPlay ? game() : <h1 id='waiting'>Waiting for the other player...</h1>
      }
    </div>
  )
}