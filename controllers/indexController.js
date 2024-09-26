const { pool } = require('../db/database');
const { getSteamID64, getSteamProfilePicture } = require('../functions');

exports.testAllBans = async (req, res, next) => {
    try {
        const test = await pool.query("SELECT * FROM mb_bans ORDER BY id DESC" )
        console.log(test[0]);
        const rowsWithSteamID64 = await Promise.all(test[0].map(async (row) => {
        const avatar = await getSteamProfilePicture(row.steamid); // Espera a que se resuelva la promesa
        return { ...row, avatar, steamid64:getSteamID64(row.steamid)};
        }));
        res.status(200).json(rowsWithSteamID64);
    } catch (error) {
      next(error);
    }
};

exports.testpage = async (req, res, next) => {

    let sql = `SELECT * FROM mb_bans ORDER BY id DESC`;
  
      try {
        const [rows] = await pool.query(sql);
        const rowsWithSteamID64 = await Promise.all(rows.map(async (row) => {
            const steamid64 = getSteamID64(row.steamid.toString());
            const time = row.ban_created.toString();
            const time2unban = row.ban_expire.toString()
            const permanente = time2unban === 'Permanent' ? true : false;
            const url = await getSteamProfilePicture(row.steamid.toString()); // Espera a que se resuelva la promesa
            
            return { ...row, steamid64, url, time, time2unban, permanente };
        }));
        
          res.render("index", { links: rowsWithSteamID64 });
          
      } catch (error) {
          console.error('Error:', error.message);
          // Maneja el error de manera adecuada según tus necesidades
          res.status(200).json({"Error":"ERROR"})
      }

};
  