require('dotenv').config()

const axios = require('axios')

function time() {
    const fecha = new Date();
    const horas = String(fecha.getHours()).padStart(2, '0');
    const minutos = String(fecha.getMinutes()).padStart(2, '0');
    const segundos = String(fecha.getSeconds()).padStart(2, '0');


    return (`[${horas}:${minutos}:${segundos}] - `);
}


const getSteamProfilePicture = async(steamID) => {
    try 
    {
        const steamID64 = getSteamID64(steamID);
        const msg = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.STEAMAPI}&steamids=${steamID64}`
        //console.log(msg);
        
        const response = await axios.get(msg);
        const player = response.data.response.players[0];
    
        if (player) 
        {
           //console.log(player.avatarfull);
            return player.avatarfull;

        } 
        else 
        {
            console.log('Player not found.');
            return `https://avatars.akamai.steamstatic.com/1e45bba9e73afde8bcf380187b1876fc2d1d5434_full.jpg`
        }
    } 
    catch (error) 
    {
      console.error('Error:', error.message);
    }
}

const getSteamID64 = (steamID) => {

        const parts = steamID.split(':');
        const universe = parts[1] === '1' ? 1 : 0;
        const accountID = parseInt(parts[2]);
        return ((BigInt(accountID) * 2n) + BigInt(universe) + 76561197960265728n).toString();
}

module.exports = {time, getSteamID64, getSteamProfilePicture}