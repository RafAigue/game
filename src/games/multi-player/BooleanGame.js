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
                id: players[0],
                correctAnswers: 0,
                totalAnswerTime: 0.00,
                unanswered: 0
            },
            player2: {
                id: players[1],
                correctAnswers: 0,
                totalAnswerTime: 0.00,
                unanswered: 0
            }
        }
    }

    async getQuestions() {
        const response = await fetch('https://opentdb.com/api.php?amount=5&type=boolean')
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
                        question: this.questions[this.currentQuestion]
                    },
                }))
            }
        })
    }

    setPlayerResponse(response) {
        this.responses.push(response)
        let numResponses = this.responses.length
        if (this.responses.length === 2) {
            this.validateRoundWinner(this.responses[numResponses-2], this.responses[numResponses - 1])
            this.responses = []
        }
    }

    validateRoundWinner(firstAnswer, secondAnswer) {
        let player1Answer = firstAnswer
        let player2Answer = secondAnswer
        if (firstAnswer.userId !== this.player1) {
            player1Answer = secondAnswer
            player2Answer = firstAnswer
        }
        let currentCorrectAnswer = this.questions[this.currentQuestion].correct_answer

        currentCorrectAnswer === player1Answer.response && this.scores.player1.correctAnswers ++
        currentCorrectAnswer === player2Answer.response && this.scores.player2.correctAnswers ++

        this.scores.player1.totalAnswerTime += Number(player1Answer.timeToAnswer)
        this.scores.player2.totalAnswerTime += Number(player2Answer.timeToAnswer)

        if (player2Answer.response === null) {
            this.scores.player2.totalAnswerTime += 10.00
            this.scores.player2.unanswered ++
        }
        if (player1Answer.response === null) {
            this.scores.player1.totalAnswerTime += 10.00
            this.scores.player1.unanswered ++
        }

        this.currentQuestion ++

        if (this.currentQuestion === this.questions.length) this.notifyWinner()
        else this.sendQuestion()
    }

    notifyWinner() {
        let winner = {}
        let loser = {}

        if (this.scores.player1.correctAnswers > this.scores.player2.correctAnswers ||
            ((this.scores.player1.correctAnswers === this.scores.player2.correctAnswers) && (this.scores.player1.totalAnswerTime < this.scores.player2.totalAnswerTime))
        ) {
            winner = this.scores.player1
            loser = this.scores.player2
        } else {
            winner = this.scores.player2
            loser = this.scores.player1
        }

        this.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                    type: 'notifyWinner',
                    data: {
                        scores: {winner, loser}
                    },
                }))
            }
        })
    }
}