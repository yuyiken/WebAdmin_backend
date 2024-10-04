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

function calcularDiferencia(timestamp) {
  
    
    const ahora = Date.now(); // Tiempo actual en milisegundos
    //const fechaIngresada = timestamp * 1000/1000; // Convertir el timestamp a milisegundos
    console.log(timestamp);
    console.log(ahora);
    //console.log(fechaIngresada);
    const diferenciaMilisegundos = timestamp-ahora;

    // Calcular las diferencias en diferentes unidades de tiempo
    const segundos = Math.floor(diferenciaMilisegundos / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);

    // Lógica de formato según el tiempo transcurrido
    if (horas < 1) {
        // Si la diferencia es menor a una hora
        return `${minutos} minute(s)`;
    } else if (dias < 1) {
        // Si la diferencia es menor a un día
        const minutosRestantes = minutos % 60;
        return `${horas} hour(s) and ${minutosRestantes} minute(s)`;
    } else {
        // Si la diferencia es mayor a un día
        const horasRestantes = horas % 24;
        return `${dias} day(s)  ${horasRestantes} hour(s)`;
    }
}

module.exports = {time, getSteamID64, getSteamProfilePicture, calcularDiferencia}