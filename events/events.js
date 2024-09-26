async function showMenu(Title, EntityId, Items) {
    let result = {}

    result["ShowMenu"] = {
        Title: Title,
        Callback: "ClientMenuHandle",
        Exit: true,
        EntityId: EntityId,
        Items: Items
    }
    return result;
}
function printChat(EntityId, msg) {
    let result = {}

    result["PrintChat"] = {
        EntityId: EntityId,
        Message: msg
    }

    return result["PrintChat"];
}
function serverCommand(command) {
    let result = {}

    result["ServerCommand"] = command;

    return result["ServerCommand"];
}
function consolePrint(EntityId, msg) {
    let result = {}

    result["ClientPrint"] = {
        EntityId: EntityId,
        PrintType: 2,
        Message: msg
    };

    return result["ClientPrint"];
}
function showHudMsg(EntityId, TeamSay, msg) {
    let result = {}

    result["ShowHudMessage"] = {
        EntityId: EntityId,
        TeamSay: TeamSay,
        Message: msg
    };

    return result["ShowHudMessage"];
}

module.exports = { showMenu, printChat, serverCommand, consolePrint, showHudMsg }