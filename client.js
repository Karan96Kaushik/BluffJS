const io = require("socket.io-client");
const readline = require('readline');

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

class Game {

	started = false

	constructor () {
		this.game = io("ws://localhost:3000/");
		this.game.on("connect", data => {
			rl.question("Enter your Name...\n", (name) => {
				this.playerName = name
				this.game.emit('register', this.playerName)
				console.log("Connected to game service ", this.game.id)
			})
		})
		this.game.on("player status", this.updatePlayerStatus.bind(this))
		this.game.on("your move", this.playMove.bind(this))
		this.game.on("start", this.begin.bind(this))
		this.game.on("new move", console.log)
	}

	begin () {
		console.log("Start")
	}

	updatePlayerStatus (data) {
		this.player = data
	}

	askStatus (data) {
		this.game.emit('status?')
	}

	playMove (gameState) {
		try {
			this.gameState = gameState
			console.table(this.player.hand)
			console.log(gameState)
			let move = null
			rl.question("Enter your move...\n", this.processMove.bind(this))
		} catch (err) {
			console.log(err.message)
			return this.playMove(gameState)
		}
	}

	processMove (move) {
		const state = this.gameState
		let play, claim

		if (move == 'quit')
			process.exit(0)

		// pass
		else if (move == 'pass') {
			if (state == 'new round')
				throw new Error("Cannot pass first turn")

			this.game.emit('pass')
		}

		// call bluff
		else if (move == 'call') {
			if (state == 'new round')
				throw new Error("Cannot call first turn")

			this.game.emit('call')
		}

		// play
		else {
			[play, claim] = move.split(":")
			play = play.split(',')
			play = play.map(c => c.trim())

			if (state == 'new round')
				if (!claim)
					throw new Error("Please claim a number")
				
			if (!play.length)
				throw new Error("Please enter card numbers")

			this.game.emit('play', { play, claim })
		}

	}

}

new Game()