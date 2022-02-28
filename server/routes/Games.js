const express = require('express')
const router = express.Router()

const {
    GetAllGames, 
    GetGame, 
    CreateGame, 
    UpdateAmountOfPlayers, 
    DeleteGameAndPlayers
} = require('../controllers/Games.js')

router.route('/').get(GetAllGames).post(CreateGame)
router.route('/:gameId').get(GetGame).patch(UpdateAmountOfPlayers).delete(DeleteGameAndPlayers)

module.exports = router