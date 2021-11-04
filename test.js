const gameMaster = require('./gameMaster')

gameMaster.createPlayer("Karan", {id:0})
gameMaster.createPlayer("Bayonet", {id:1})
gameMaster.createPlayer("Baron", {id:2})

gameMaster.startGame()

console.log(gameMaster.getPlayer(0))
console.log(gameMaster.getPlayer(1))
console.log(gameMaster.getPlayer(2))

gameMaster.playTurn('play', {
	play: gameMaster.getPlayer(0).playCards([2,3,4]),
	playerID: 0,
	claim: 9
})

gameMaster.playTurn('call', {
	playerID: 1,
})

console.log(gameMaster.getPlayer(0))
console.log(gameMaster.getPlayer(1))
console.log(gameMaster.getPlayer(2))

let claim = gameMaster.getPlayer(1).hand[0]
claim = parseInt(claim)

console.log("CP", gameMaster.currentPlayer)

gameMaster.playTurn('play', {
	play: gameMaster.getPlayer(1).playCards([0]),
	playerID: 1,
	claim
})

gameMaster.playTurn('play', {
	play: gameMaster.getPlayer(2).playCards([0,1,2,3]),
	playerID: 2,
})

console.log('F', gameMaster.currentRound.floor)

gameMaster.playTurn('call', {
	playerID: 0,
})

console.log(gameMaster.getPlayer(0))
console.log(gameMaster.getPlayer(1))
console.log(gameMaster.getPlayer(2))

gameMaster.playTurn('play', {
	play: gameMaster.getPlayer(1).playCards([0,1]),
	playerID: 0,
})

gameMaster.playTurn('play', {
	play: gameMaster.getPlayer(0).playCards([0,1]),
	playerID: 1,
})

gameMaster.playTurn('pass', {
	playerID: 2,
})

gameMaster.playTurn('pass', {
	playerID: 0,
})

gameMaster.playTurn('pass', {
	playerID: 1,
})

claim = gameMaster.getPlayer(1).hand[0]
claim = parseInt(claim)

gameMaster.playTurn('play', {
	play: gameMaster.getPlayer(1).playCards([0,1]),
	playerID: 1,
	claim
})

gameMaster.playTurn('play', {
	play: gameMaster.getPlayer(2).playCards([0,1]),
	playerID: 2
})

console.log(gameMaster.getPlayer(0))
console.log(gameMaster.getPlayer(1))
console.log(gameMaster.getPlayer(2))