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
        const difficulty = req.body['difficulty']
        const amountOfPlayers = '1'
        var currentDate = new Date()
        const gameCreationDate = currentDate.toISOString()
        const gameId = await gameUtils.CreateNewGameID()

        await pool.query(
            "INSERT INTO Games VALUES($1, $2, $3, $4, $5)",
            [gameId, isSinglePlayer, difficulty, amountOfPlayers, gameCreationDate]
        )
        console.log([gameId, isSinglePlayer, difficulty, amountOfPlayers, gameCreationDate])
        res.status(200).json({msg: 'success'})
    }
    catch(error){
        res.status(500).json({msg: error.toString()})
    }
    
}

const UpdateAmountOfPlayers = async (req, res) => {
    try{
        const gameId = req.params['gameId']
        const changeInPlayers = req.body['changeInPlayers']
        let numberToAdd = 0

        if(changeInPlayers == 1){
            numberToAdd = 1
        }
        else if(changeInPlayers == -1){
            numberToAdd = -1
        }
        else{
            res.status(400).json({msg: 'Input must be a 1 or -1 int value to specify the change, your request did not contain either'})
            return
        }

        const query = await pool.query(
            "SELECT amountofplayers FROM Games WHERE gameid = ($1)",
            [gameId]
        )
        if(query.rowCount == 0){
            res.status(400).json({msg: `No session with id: ${gameId}`})
            return
        }
        const currentAmountOfPlayers = query.rows[0]['amountofplayers']

        const newAmountOfPlayers = currentAmountOfPlayers + numberToAdd

        const updateQuery = await pool.query(
            "UPDATE games SET amountofplayers = ($1) WHERE gameid = ($2)",
            [newAmountOfPlayers, gameId]
        )

        if(updateQuery.rowCount == 0){
            res.status(500).json({msg: `There was an error when making the update to the database`})
            return
        }
        
        res.status(200).json( {msg:`Success. New amount of players is ${newAmountOfPlayers}`} )
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
    UpdateAmountOfPlayers,
    DeleteGameAndPlayers
}

