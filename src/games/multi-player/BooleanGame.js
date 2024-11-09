import { WebSocket } from 'ws'

export default class BooleanGame {
    constructor(clients, players) {
        this.clients = clients
        this.players = players
        this.player1 = players[0]
        this.player2 = players[1]
        this.questions = []
        this.responses = []
        this.currentQuestion = 0
        this.scores = {
            player1: {
                correctAnswers: 0,
                totalAnswerTime: 0
            },
            player2: {
                correctAnswers: 0,
                totalAnswerTime: 0
            }
        }
    }

    async getQuestions() {
        const response = await fetch('https://opentdb.com/api.php?amount=10&type=boolean')
        const resp = await response.json()
        const tmp = resp.results.map((question) => {
            delete question.incorrect_answers
            return question
        })
        this.questions = tmp
    }

    sendQuestion() {
        this.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                    type: 'newQuestion',
                    data: {
                        question: this.questions[this.currentQuestion],
                        currentQuestion: this.currentQuestion
                    },
                }))
            }
        })
    }

    setPlayerResponse(response) {
        console.log(response)
        this.responses.push(response)
        let numResponses = this.responses.length
        if (this.responses.length === 2) {
            this.validateRoundWinner(this.responses[numResponses-2], this.responses[numResponses - 1])
            this.responses = []
        }
    }

    validateRoundWinner(firstAnswer, secondAnswer) {
        console.log(this.currentQuestion)
        let player1Answer = firstAnswer
        let player2Answer = secondAnswer
        if (firstAnswer.userId !== this.player1) {
            player1Answer = secondAnswer
            player2Answer = firstAnswer
        }

        let currentCorrectAnswer = this.questions[this.currentQuestion].correct_answer
        if (currentCorrectAnswer === player1Answer.response && currentCorrectAnswer === player2Answer.response) {
            console.log('DRAW!')
            this.scores.player1.correctAnswers ++
            this.scores.player1.totalAnswerTime += player1Answer.timeResponse
            this.scores.player2.correctAnswers ++
            this.scores.player2.totalAnswerTime += player2Answer.timeResponse
        }
        else if (currentCorrectAnswer === player1Answer.response && currentCorrectAnswer !== player2Answer.response) {
            console.log('Player 1 wins!')
            this.scores.player1.correctAnswers ++
            this.scores.player1.totalAnswerTime += player1Answer.timeResponse
        }
        else if (currentCorrectAnswer !== player1Answer.response && currentCorrectAnswer === player2Answer.response) {
            console.log('Player 2 wins!')
            this.scores.player2.correctAnswers ++
            this.scores.player2.totalAnswerTime += player2Answer.timeResponse
        }
        else if (currentCorrectAnswer !== player1Answer.response && currentCorrectAnswer !== player2Answer.response) console.log('BOTH FAILED!')
        console.log('------------------')

        this.currentQuestion ++

        if (this.currentQuestion === this.questions.length) notifyWinner()
        else this.sendQuestion()
    }

    notifyWinner() {
        console.log('GAME OVER')
        console.log(this.scores)
    }
}