const axios = require('axios')
const pool = require('../../db/connect')

exports.DeleteAllPlayersInGameSession = async function(gameSessionId){
    try{
        // const players = await axios.get(`http://localhost:5000/api/v1/game-sessions/${gameSessionId}/players`)
        // const JSONobj = players.data.playersList

        // JSONobj.forEach(async element => {
        //     const response = await axios.delete(`http://localhost:5000/api/v1/players/${element.playerSocketId}`)
        //     if(response.status == 404 || response.status == 500){
        //         throw new Error('bad request')
        //     }
        // });
        // return true
        return true
    }
    catch(error){
        return false
    }
    
}

exports.CheckIfGameExists = async function(gameId){
    
    const gameResponse = await pool.query(
        "SELECT * FROM Games WHERE gameId = ($1)",
        [gameId]
    )
    console.log(gameResponse.rowCount)
    if(gameResponse.rowCount == 0){
        
        return false
    }
    else{
        return true
    }
}

exports.CreateNewGameID = async function(){
    const min = 65
    const max = 90
    while(true){
        var gameId = ''
        for(var i = 0; i < 5; i++){
            var randomInt = Math.floor(Math.random() * (max - min) + min)
            var character = String.fromCharCode(randomInt)
            gameId += character
        }
        const gameResponse = await pool.query(
            "SELECT * FROM Games WHERE gameId = ($1)",
            [gameId]
        )
        if(gameResponse.rowCount == 0){
            return gameId
        }
    }
}