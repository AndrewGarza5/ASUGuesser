const { playersLogger, gameSessionsLogger } = require('../lib/logging/logger.js')
const axios = require('axios')

module.exports = async (io, socket) => {
    const disconnect =  async (payload, callback) => {
      try{
        const playerResponse = await axios.get(`http://localhost:5000/api/v1/players/${socket.id}`)
        
        if(playerResponse.status == 200){
          await axios.delete(`http://localhost:5000/api/v1/game-sessions/${playerResponse.data.gameSessionId}/players/${socket.id}`)
        }
        else{
          throw new Error(`Player ${socket.id} unsuccessfuly disconnected from game due to unsuccessful get request`)
        }
      }
      catch(error){
        console.log('Player disconnection error')
        gameSessionsLogger.error(error)
      }
    }

    const randomTest = (payload, callback) => {
      console.log('randomTest :)')
      callback({status: 200})
    }
  
    socket.on("disconnect", disconnect)
    socket.on('randomTest', randomTest)
  }
