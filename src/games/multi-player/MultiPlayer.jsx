import React, { useEffect, useState } from 'react'
import './MultiPlayer.css'
import { MSG_TYPE_CHAT, MSG_TYPE_GAME_BOOL_RESP } from '../../constants'
const host = import.meta.env.VITE_WS_HOST
const port = import.meta.env.VITE_WS_PORT

export default function MultiPlayer() {
  const [ws, setWs] = useState(null)
  const [userId, setUserId] = useState(null)
  const [readyToPlay, setReadyToPlay] = useState(false)
  const [question, setQuestion] = useState([])
  const [messages, setMessages] = useState([])
  const [counter, setCounter] = useState(0)
  const [answer, setAnswer] = useState(null)
  const [disableAnswers, setDisableAnswers] = useState(false)
  const [countdown, setCountdown] = useState(null)

  useEffect(() => {
    const socket = new WebSocket(`ws://${host}:${port}`)

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
          setCountdown(10)
          setQuestion(data.data.question)
          setAnswer(null)
          setCounter(prev => prev + 1)
          setDisableAnswers(false)
        }
      } catch (error) {
        console.error('Error parsing message:', error)
      }
    }

    socket.onclose = () => setWs(socket)
  }, [])

    // Countdown
    useEffect(() => {
      if (countdown > 0) {
          const timer = setTimeout(() => {
              setCountdown(prev => prev.toFixed(2) - 0.01)
          }, 10)
          return () => clearTimeout(timer)
      } else if (countdown === 0) sendResponse()
  }, [countdown])

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
            className='answer-button'
            onClick={() => sendMessage('Player answered!')}
          >
            Send
          </button>
          <button 
            className='answer-button'
            onClick={() => ws.close()}
          >
            Disconnect
          </button>
          <ul className='messages-list'>
            {messages.map((msg, index) => (
              <li 
                key={index} 
                className={`message-item ${msg.userId === userId ? 'message-own' : 'message-other'}`}
              >
                <div className='message-user-id'>User: {msg.userId}</div>
                {msg.message}
              </li>
            ))}
          </ul>
        </>
      )
    }
  }

  const sendResponse = () => {
    if (ws) {
      ws.send(JSON.stringify({
        userId,
        type: MSG_TYPE_GAME_BOOL_RESP,
        response: answer,
        timeToAnswer: 10 - countdown
      }))
      setDisableAnswers(true)
      setCountdown(null)
    }
  }

  const game = () => {
    return (
      <main className='mp-game'>
        <h1 className='mp-game-title'>Quiz</h1>
        <h2>Question {counter}</h2>
        <h3 className='mp-question-category'>{question.category}</h3>
        <strong>{question.difficulty}</strong>
        <p>{question.question}</p>
        { countdown > 0 && <p>{countdown.toFixed(2)}</p> }
        <div className='answer-buttons'>
          <button 
            disabled={disableAnswers} 
            className={`answer-button ${answer === 'True' ? 'selected' : ''}`} 
            onClick={() => setAnswer('True')}
          >
            True
          </button>
          <button 
            disabled={disableAnswers} 
            className={`answer-button ${answer === 'False' ? 'selected' : ''}`} 
            onClick={() => setAnswer('False')}
          >
            False
          </button>
        </div>
        {
          (answer && !disableAnswers) &&
          <button
            className='send-button'
            onClick={() => sendResponse()}>
              Send
          </button>
        }
      </main>
    )
  }

  return (
    <div className='mp-game-container'>
      {
        readyToPlay ? game() : <h1>Waiting for the other player...</h1>
      }
    </div>
  )
}