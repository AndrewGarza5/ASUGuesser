const gameUtils = require('../lib/game_utils/GamesHelper')
const pool = require('../db/connect')

const GetAllGames = async (req, res) => {
    try{
        const query = await pool.query(
            "SELECT * FROM Games"
        )

        res.status(200).json(query.rows)
    }
    catch(error){
        res.status(500).json({msg: error.toString()})
    }
    
}

const GetGame = async (req, res) => {
    try{
        const gameId = req.params['gameId']

        const query = await pool.query(
            "SELECT * FROM Games WHERE gameId = ($1)",
            [gameId]
        )

        if(query.rowCount == 0){
            res.status(404).json({msg: `No session with id: ${gameId}`})
            return
        }

        res.status(200).json(query.rows)
    }
    catch(error){
        res.status(500).json({msg: error.toString()})
    }
}

// Requires 5 body elements
// gameId
// isSinglePlayer
// amountOfPlayers
// gameCreationDate
// difficulty
const CreateGame = async (req, res) => {

    try{
        
        const isSinglePlayer = req.body['isSinglePlayer']
        const amountOfPlayers = '1'
        var currentDate = new Date()
        const gameCreationDate = currentDate.toISOString()
        const gameId = await gameUtils.CreateNewGameID()

        const tmp = await pool.query(
            "INSERT INTO Games VALUES($1, $2, $3, $4)",
            [gameId, isSinglePlayer, amountOfPlayers, gameCreationDate]
        )
        console.log([gameId, isSinglePlayer, amountOfPlayers, gameCreationDate])
        res.status(200).json({msg: 'success'})
    }
    catch(error){
        res.status(500).json({msg: error.toString()})
    }
    
}

const UpdateGame = async (req, res) => {
    try{
        throw new Error('poopoo')
        
    }
    catch(error){
        res.status(500).json({msg: error.toString()})
    }
}

const DeleteGameAndPlayers = async (req, res) => {
    try{
        const gameId = req.params['gameId']

        const query = await pool.query(
            "DELETE FROM Games WHERE gameId = ($1)",
            [gameId]
        )

        if(query.rowCount == 0){
            res.status(404).json({msg: `No session with id: ${gameId}`})
            return
        }
        
        // ************************* FINISH THIS IN UTILS
        // if(await gameUtils.DeleteAllPlayersInGameSession(gameId) == false){
        //     res.status(500).json({msg: 'There was an issue with removing players from game session, the deletion of this session has been aborted'})
        //     return
        // }

        res.status(200).json({msg: 'success'})
    }
    catch(error){
        res.status(500).json({msg: error.toString()})
    }
}

module.exports = {
    GetAllGames,
    GetGame,
    CreateGame,
    UpdateGame,
    DeleteGameAndPlayers
}

