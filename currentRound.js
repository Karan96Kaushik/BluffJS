class CurrentRound {

	floor = []
	continousPasses = 0
	prevPlayers = []

	// claim is a number that is claimed by the starting player
	// play are the cards thrown by the starting player
	constructor (play, playerID, claim, totalPlayers) {
		this.claim = claim
		this.lastPlay = play
		this.prevPlayers.push(playerID)
		this.floor.push(...play)
		this.totalPlayers = totalPlayers
		this.currentPlayer = playerID
	}

	get lastPlayer () {
		return this.prevPlayers[this.prevPlayers.length - 1]
	}

	get secondLastPlayer () {
		return this.prevPlayers[this.prevPlayers.length - 2]
	}

	get state () {
		return {
			claim: this.claim,
			floor: this.floor.length,
			lastPlay: this.lastPlay.length
		} 
	}

	// play is the array of cards thrown by the current player
	nextPlay (play, playerID) {
		this.lastPlay = play
		this.prevPlayers.push(playerID)
		this.floor.push(...play)
		this.continousPasses = 0
	}

	passTurn () {
		this.continousPasses++

		if (this.continousPasses >= this.totalPlayers)
			this.winner = this.currentPlayer
	}

	callBluff (playerID) {
		let isBluff = !!this.lastPlay.find(c => parseInt(c) != this.claim)

		if (isBluff) {
			this.winner = playerID
			this.loser = this.lastPlayer
		}
		else {
			this.winner = this.lastPlayer
			this.loser = playerID
		}
	}

}

module.exports = CurrentRound