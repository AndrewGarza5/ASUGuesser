const port = 5000 
const express = require('express')
const path = require('path')
const { createServer } = require('http')
const {Server} = require('socket.io')
const cors = require('cors')
require('dotenv').config()

const Games = require('./routes/Games.js')
const { playersLogger, gamesLogger } = require('./lib/logging/logger.js')
const pool = require('./db/connect')

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, { /* options */ });

// middleware 
app.use(cors())
app.use(express.json())

// routes
app.use('/api/v1/games', Games)


// Socket io
const mainLobby = require('./socketio/MainLobbySocket.js')
const globalEvents = require('./socketio/GlobalEventsSocket.js')

const onConnection = (socket) => {
  mainLobby(io, socket),
  globalEvents(io, socket)
}
io.on("connection", onConnection)

// io.of("/").adapter.on("create-room", (room) => {
//   console.log(`room ${room} was created`);
// });

// io.of("/").adapter.on("join-room", (room, id) => {
//   console.log(`socket ${id} has joined room ${room}`);
// });

// test endpoint
app.use('/test', async (req,res) => {
    const gameId = 'tempe_39.jpg'
    const query = await pool.query(
        "SELECT * FROM Photos WHERE photoname = ($1)",
        [gameId]
    )
    res.send(query.rows);
})


// start server
const start = async () => {
    try{
        
        httpServer.listen(port,()=>{
            console.log(`server listening on port ${port}...`)
        })
    }
    catch(error){
        console.log(error)
    }
}

start()