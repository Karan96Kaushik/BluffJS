const Player = require('./player')
const Deck = require('./deck')
const CurrentRound = require('./currentRound')
const EventEmitter = require('events');

class GameMaster {

	players = []
	finishedRounds = []
	currentPlayer = null
	started = false
	finishers = []
	gameEvents = null
	notifiedStart = false

	constructor () {
		this.gameEvents = new EventEmitter()
	}

	get gameState () {
		// game has ended
		if(this.ended)
			return ['ended']

		// new round hasn't started, next play will initiate new round
		if(!this.currentRound || this.currentRound.winner)
			return ['new round'] 

		if(!this.currentRound.winner)
			return ['active play', { 
				...this.currentRound.state, 
				player: this.getPlayer(this.currentPlayer).playerName,
			}]
	}

	setCurrentPlayer (playerID) {
		this.shareStatus()
		this.gameEvents.emit("your move", playerID)
		this.currentPlayer = playerID
	}

	startGame () {
		this.started = true

		this.deck = new Deck()

		let hands = this.deck.splitDeck(this.players.length)
		hands.forEach((hand, pid) => this.players[pid].giveHand(hand))
		this.shareStatus()
		this.gameEvents.emit("start", { players: this.players.map(p => p.playerName) })
		this.setCurrentPlayer(this.players[0].playerID)
	}

	playTurn (move, props) {
		this.checkTurn(props.playerID)

		this.gameEvents.emit('new move', 
			`------\n` + 
			`${this.getPlayer(this.currentPlayer).playerName} - ${move}ed \n` + 
			`------`, props.playerID
		)

		switch (move) {
			case ('pass'):
				this.currentRound.passTurn()

				// if round has ended after cont passes
				if(this.currentRound.winner) {
					this.gameEvents.emit("round over", this.currentRound.winner)
					this.endRound(this.currentRound.floor.length)
					this.setCurrentPlayer(this.currentRound.winner)
					this.finishedRounds.push(this.currentRound)
				}
				// If round hasn't ended
				else {
					this.setNextPlayer()
				}
				break;

			case ('play'):
				if(!props.play.length)
					throw new Error("No cards thrown!")

				// If its a new game or last round has ended
				if (!this.currentRound || this.currentRound.winner) {
					this.currentRound = new CurrentRound(
						props.play, 
						props.playerID, 
						props.claim, 
						this.players.length
					)
				}

				else {
					this.currentRound.nextPlay(props.play, props.playerID)
					// when a new player has played, check if last player has finished their hand
					this.checkFinisher(this.currentRound.secondLastPlayer)
				}

				this.setNextPlayer()

				break;

			case ('call'):
				// End round by calling bluff
				this.currentRound.callBluff(props.playerID)
				// Add cards to loser's hand
				const floorCardsNum = this.currentRound.floor.length
				this.getPlayer(this.currentRound.loser).addCards(this.currentRound.floor.flat())
				this.endRound(floorCardsNum)
				// Set winner as current player
				this.setCurrentPlayer(this.currentRound.winner)
				this.finishedRounds.push(this.currentRound)
				break;

			default:
				throw new Error("Invalid move")
		}
	}

	endRound (floorCardsNum) {
		this.gameEvents.emit('new move', 
			`------ Round Ended ------- \n` + 
			`Winner - ${this.getPlayer(this.currentRound.winner).playerName} \n` +
			(this.currentRound.loser ? `Loser - ${this.getPlayer(this.currentRound.loser).playerName} - Added ${floorCardsNum} cards` : `Folded ${floorCardsNum} cards`) + 
			`\n ------`
		)
	}

	checkTurn (playerID) {
		if(this.ended)
			throw new Error("Game has ended!")
		if(playerID != this.currentPlayer)
			throw new Error("It's the turn of player " + String(this.currentPlayer))
	}

	createPlayer (playerName, playerID) {
		if(this.started)
			return false

		let newPlayer = new Player(playerName, playerID)

		this.players.push(newPlayer)

		this.gameStarter()
		return newPlayer
	}

	// Checks if game must be started
	gameStarter () {
		if (this.players.length < 2 || this.notifiedStart)
			return

		setTimeout(this.startGame.bind(this), 5000)
		this.notifiedStart = true
		this.gameEvents.emit("starting game", 60)
	}

	getPlayer (playerID) {
		return this.players.find(p => p.playerID == playerID)
	}

	shareStatus () {
		this.players.forEach(p => {
			this.gameEvents.emit("player status", p.playerID, { ...p})
		})
	}

	reconnectPlayer (prevID) {
		let player = this.players.find(p => p.playerID == prevID)
		if (!player)
			return false

		return player
	}

	announceFinisher (playerID) {
		this.gameEvents.emit("finisher", { playerName: this.getPlayer(playerID).playerName, position: this.finishers.length })
		if(this.finishers.length == (this.players.length - 1))
			this.endGame()
	}

	endGame () {
		this.finishers.forEach((pid, i) => console.log("Position " + (i+1) + ":", this.players[pid].playerName))
		this.ended = true
		this.gameEvents.emit("game over", { playerName: this.finishers })
	}

	setNextPlayer () {
		let playerIndex = -1

		this.players.forEach((p, idx) => { if (p.playerID == this.currentPlayer) playerIndex = idx })

		if (playerIndex == -1)
			throw new Error("currentPlayer not found")

		let totalPlayers = this.players.length

		playerIndex++
		if (playerIndex >= totalPlayers)
			playerIndex = 0

		// Check if the current player has finished
		if (this.checkFinisher(this.players[playerIndex].playerID)) {
			playerIndex++
			if (playerIndex >= totalPlayers)
				playerIndex = 0
		}

		this.setCurrentPlayer(this.players[playerIndex].playerID)
		return this.currentPlayer
	}

	checkFinisher (playerID) {
		if (this.finishers.includes(playerID))
			return true

		if (this.getPlayer(playerID).hand.length == 0) {
			this.finishers.push(playerID)
			this.announceFinisher(playerID)
			return true
		}
		return false
	}

}

module.exports = new GameMaster()