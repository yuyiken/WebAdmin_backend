require('dotenv').config()

let time = [];
let convertTime = {};
let banReasons = [];
let teamName = {};

switch (process.env.LANG) {
    case "en":
    default:

            time = ['5 min', '1 hour', '3 hours', '1 day', '1 week', '^y1 month', '^rPermanent'];

            banReasons = ['Cheating / No Scan', 'Insulting', 'Trolling', 'Spamming', 'Harrasing']

            convertTime = {
                '5 min': 5,
                '1 hour': 60,
                '3 hours': 180,
                '1 day': 1440,
                '1 week': 10080,
                '^y1 month': 43200,
                '^rPermanent': 0
            };
           
            teamName = {
                TT: "Terrorists",
                CT: "Counter-Terrorists",
                SPEC: "Spectators",
            }

            // Main menu title
            function mainMenuTitle(hostname){
                return `^r${hostname}\n^y` + `Admin Menu`
            }
            // Main menu title
            function mainMenuKickName(){
                return `Kick Menu`
            }
            // Main menu title
            function mainMenuBanName(){
                return `Ban Menu`
            }
            //Main menu unban title
            function mainMenuUnbanName(){
                return `Unban Menu`
            }
            // Main menu Slay title
            function mainMenuSlayName(){
                return `Slay Menu`
            }
            // Main menu Team title
            function mainMenuTeamName(){
                return `Team Menu`
            }
            // Main menu Map title
            function mainMenuMapName(){
                return `Map Menu`
            }
            // Menu Ban Reasons title
            function banMenuReasons(){
                return `Ban Reasons`
            }
             // Menu Ban Time title
            function banMenuTime(){
                return `Ban Time`
            }
                        
        break;

    case "es":
    

        break;

}
module.exports = {

    mainMenuTitle,
    mainMenuKickName,
    mainMenuBanName,
    mainMenuUnbanName,
    mainMenuSlayName,
    mainMenuTeamName,
    mainMenuMapName,
    time, 
    convertTime,
    banMenuReasons,
    banMenuTime,
    banReasons,
    teamName

}

