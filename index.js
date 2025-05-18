import pSettings from "./settings";
import "./features/playerTracker.js";

register("gameLoad", () => {
    ChatLib.chat("&c&l[Cores Module Private] &r&7Module Loaded");
});

const commands = [
    {cmd: "cmp", description: "Open the settings", ph: ""},
    {cmd: "cmp help", description: "Show this message", ph: ""},
    {cmd: "track <player>", description: "Tracks a player loc (see the settings for customability), running it again will remove the first player and tracks the 2nd one", ph: `track ${Player.getName()}`},
    {cmd: "track add <player> (multiple possible)", description: "Tracks an another player loc", ph: `track ${Player.getName()}`},
    {cmd: "untrack", description: "Untracks all player", ph: `track ${Player.getName()}`},
    {cmd: "untrack <player>", description: "Untracks a player loc", ph: `untrack ${Player.getName()}`}
];

register("command", (args1, ...args) => {
    if (args1 == undefined || args1.toLowerCase() == "settings") {
        pSettings.openGUI();
    } else {
        switch (args1.toLowerCase()) {
            case "help":
                ChatLib.chat(ChatLib.getChatBreak("&b-"))
                ChatLib.chat("&6[Cmp] &eCommands:");
                commands.forEach(({ cmd, description, ph }) => {
                    if (ph == "") {
                        let text = new TextComponent("&7> &a/" + cmd + " &7- &e" + description)
                        .setClick("run_command", "/" + cmd)
                        .setHover("show_text", `&7Click to run &a/${cmd}`)
                        text.chat()
                    } else {
                        ph = ph.replace("/", "")
                        let text = new TextComponent("&7> &a/" + cmd + " &7- &e" + description)
                        .setClick("suggest_command", "/" + ph)
                        .setHover("show_text", `&7Click to suggest &a/${cmd}`)
                        text.chat()
                    }
                    
                });
                ChatLib.chat(ChatLib.getChatBreak("&b-"));
                break;
            default:
                ChatLib.chat("&6[Cmp] &eUnknown command. Use /cmp help for a list of commands")
                break;
        }
    }
}).setName("CoresModulePrivate").setAliases(["PrivateCores", "PrtivateCore", "Cmp", "Pcm"]);