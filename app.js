const gameMaster = require('./gameMaster')

const io = require("socket.io")();

const allSockets = {}

io.on("connection", (socket) => {

	const playerID = socket.id

	socket.on("register", (playerName, reconnectID) => {
		let player

		if (reconnectID)
			player = gameMaster.reconnectPlayer(reconnectID)
		else
			player = gameMaster.createPlayer(playerName, playerID)

		if(player) {
			console.log("Registration Successful")
			// socket key is creating issue when emitting
			socket.emit('player status', {...player})
			allSockets[playerID] = socket
		}
		else {
			socket.emit("registration failed")
			socket.disconnect()
		}

	});

	socket.on('play', (props) => {
		gameMaster.playTurn('play', {
			play: gameMaster.getPlayer(playerID).playCards(props.play),
			playerID,
			claim: props.claim
		})
	})

	socket.on('pass', () => {
		gameMaster.playTurn('pass', {
			playerID
		})
	})

	socket.on('call', () => {
		gameMaster.playTurn('call', {
			playerID
		})
	})

	socket.on('status?', () => {
		socket.emit('player status', gameMaster.getPlayer(playerID))
	})

});

gameMaster.gameEvents.on("start", (data) => {
	io.sockets.emit('start');
})
gameMaster.gameEvents.on("round over", (data) => {})
gameMaster.gameEvents.on("your move", (pid) => {
	allSockets[pid].emit('your move', gameMaster.gameState)
})
gameMaster.gameEvents.on("round over", (data) => {})
gameMaster.gameEvents.on("starting game", (data) => { console.log("Starting game") })
gameMaster.gameEvents.on("new move", (msg, pid) => {
	io.sockets.emit('new move', msg)
})
gameMaster.gameEvents.on("player status", (pid, data) => {
	allSockets[pid].emit('player status', data)
})

io.listen(3000);














