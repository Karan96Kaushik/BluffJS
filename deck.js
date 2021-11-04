const suite = ['♥', '⬩', '♠', '♣']

class Deck {

	all = []

	constructor () {
		this.initialiseDeck()
	}

	initialiseDeck () {
		// Suite
		for (let i = 0; i < suite.length; i++)
			for (let j = 1; j < 14; j++)
				this.all.push(j + suite[i])
	}

	get getCard () {
		if(!this.all.length)
			return

		let randomCardNum = Math.round(Math.random() * this.all.length) - 1
		return this.all.splice(randomCardNum,1)[0]
	}

	splitDeck (players) {
		let hands = []
		let playerID = 0

		// Keep distributing till deck is empty
		while (this.all.length) {

			// initialize hand
			if(!hands[playerID]) 
				hands[playerID] = [] 

			let card = this.getCard
			// console.log(card)
			hands[playerID].push(card)
			playerID++

			// loop player id
			if(playerID >= players) playerID = 0
		}

		return hands
	}

}

module.exports = Deck