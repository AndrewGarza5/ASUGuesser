const axios = require('axios')
const pool = require('../../db/connect')

async function DeleteAllExpiredGames(){
    const allGames = await pool.query(
        "SELECT * FROM Games"
    )

    for(var i = 0; i < allGames.rowCount; i++){
        
        let currentDate = new Date()
        
        let gameCreationDate = new Date(allGames.rows[i].gamecreationdate)
        let expirationDate = new Date(gameCreationDate)
        expirationDate.setUTCHours(expirationDate.getUTCHours() + 3)

        if(currentDate > expirationDate){
            await pool.query(
                "DELETE FROM Games WHERE gameId = ($1)",
                [allGames.rows[i].gameid]
            )
        }        
    }
}

DeleteAllExpiredGames()