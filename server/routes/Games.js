const express = require('express')
const router = express.Router()

const {
    GetAllGames, 
    GetGame, 
    CreateGame, 
    UpdateGame, 
    DeleteGameAndPlayers
} = require('../controllers/Games.js')

router.route('/').get(GetAllGames).post(CreateGame)
router.route('/:gameId').get(GetGame).patch(UpdateGame).delete(DeleteGameAndPlayers)

module.exports = router