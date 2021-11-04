class Player {

	constructor (playerName, playerID) {
		this.playerName = playerName
		this.playerID = playerID
	}

	giveHand (hand) {
		this.hand = hand
	}

	playCards (cardIDs) {
		let cards = cardIDs.map((id, index) => this.hand.splice(id - index,1))
		return cards.flat()
	}

	addCards (cards) {
		this.hand.push(...cards)
	}

}

module.exports = Player