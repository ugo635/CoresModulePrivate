import renderBeaconBeam from "../../BeaconBeam/index";
import { Color } from '../../Vigilance';
import RenderLibV2 from "../../RenderLibV2";
import pSettings from "../settings";
import { trace } from "../../CoresModule/features/cmFunc";

let trackedPlayers = []; // Array to store tracked players as objects with name and coords properties
let [r, g, b, a] = [
    pSettings.lineColor.getRed() / 255,
    pSettings.lineColor.getGreen() / 255,
    pSettings.lineColor.getBlue() / 255,
    pSettings.lineColor.getAlpha() / 255
];

/**
 *  > @param {Array} **Waypoint Array**
 *      > @param {Array} ListOne **List One:**
 *          > @param {String} name - Waypoint's name
 *          > @param {Number} x - X coordinate
 *          > @param {Number} y - Y coordinate
 *          > @param {Number} z - Z coordinate
 *          > @param {Number} distanceToRemove - 
 * 
 *      > @param {Array} ListTwo **List Two:**
 *          > @param {Number} x - X coordinate
 *          > @param {Number} y - Y coordinate
 *          > @param {Number} z - Z coordinate
 * 
 *      > @param {Array} ListThree **RGB:**
 *          > @param {Number} R - Red value
 *          > @param {Number} G - Green value
 *          > @param {Number} B - Blue value
 */
function createWP(array1, array2, array3) {
    return [
        array1,
        array2,
        array3
    ]
}

function updateTracer(playerName) {
    let player = World.getPlayerByName(playerName);
    if (!player) {
        trackedPlayers = trackedPlayers.filter(p => p.name !== playerName);
        ChatLib.chat("&4[Cm Tracker] &cEnable to track &a" + playerName + " &canymore")
        return;
    }

    const toHead = (player) => (player.isSneaking() ? 1.54 : 1.62);

    try {
        let [x, y, z] = [
            player.getX(),
            player.getY() + toHead(player),
            player.getZ()
        ];
        let playerIndex = trackedPlayers.findIndex(p => p.name === playerName);
        if (playerIndex !== -1) {
            trackedPlayers[playerIndex] = { name: playerName, coords: [x, y, z] };
        } else {
            trackedPlayers.push({ name: playerName, coords: [x, y, z] });
        }
        trace(x, y, z, r, g, b, a, "", pSettings.lineWidth);

    } catch (e) {
        trackedPlayers = trackedPlayers.filter(p => p.name !== playerName);
        ChatLib.chat("&4[Cm Tracker] &cNo longer able to track" + playerName)
        return;
    }

    if (pSettings.wpTrue) {
        [x, y, z] = [
            Math.round(player.getX()),
            Math.round(player.getY()),
            Math.round(player.getZ())
        ];
        distanceRaw = Math.hypot(Player.getX() - x, Player.getY() - y, Player.getZ() - z);
        distance = Math.round(distanceRaw) + "m";
        wp = createWP(
            [`§5${playerName}: §a${distance}`, x, y, z, distanceRaw],
            [x, y, z],
            [pSettings.wpColor.getRed() / 255, pSettings.wpColor.getGreen() / 255, pSettings.wpColor.getBlue() / 255]
        )
        renderWaypoint([wp])
    }
}

function renderWaypoint(waypoints) {
    if (!waypoints.length) return;

    waypoints.forEach((waypoint) => {
        box = waypoint[0];
        beam = waypoint[1];
        rgb = waypoint[2];
        let removeAtDistance = 10;
        let alpha = pSettings.wpColor.getAlpha() / 255;
        // RenderLibV2.drawEspBoxV2(box[1], box[2], box[3], 1, 1, 1, rgb[0], rgb[1], rgb[2], 1, true);
        RenderLibV2.drawInnerEspBoxV2(box[1], box[2], box[3], 1, 1, 1, rgb[0], rgb[1], rgb[2], alpha/2, true);
        let hexCodeString = javaColorToHex(new Color(rgb[0], rgb[1], rgb[2]));
        if (box[0] != "" && box[0] != "§7") {
            Tessellator.drawString(box[0], box[1], box[2] + 1.5, box[3], parseInt(hexCodeString, 16), true);
        }
        if (box[4] >= removeAtDistance) {
            renderBeaconBeam(beam[0], beam[1]+1, beam[2], rgb[0], rgb[1], rgb[2], alpha, false);
        }
    });
}


register("renderWorld", () => {
    for (let player of trackedPlayers) updateTracer(player.name);
});

register("command", (...args) => {
    if (args.length === 0) {
        ChatLib.chat("&c[Cm Tracker] &ePlease specify a player name.");
        return;
    }

    if (args[0].toLowerCase() === "add") {
        if (args.length < 2) {
            ChatLib.chat("&c[Cm Tracker] &ePlease specify player names to add.");
            return;
        }

        args.slice(1).forEach((playerName) => {
            let player = World.getPlayerByName(playerName);
            if (!player) {
                ChatLib.chat(`&c[Cm Tracker] &ePlayer ${playerName} not found!`);
                return;
            }

            if (!trackedPlayers.some(p => p.name === playerName)) {
                trackedPlayers.push({
                    name: playerName,
                    coords: [
                        player.getRenderX().toFixed(2),
                        player.getRenderY().toFixed(2),
                        player.getRenderZ().toFixed(2)
                    ]
                });

                ChatLib.chat(
                    `&6[Cm Tracker] &ePlayer: ${playerName}, is now being tracked.`
                );
            }
        });
    } else {
        let playerName = args[0];
        let player = World.getPlayerByName(playerName);
        if (!player) {
            ChatLib.chat(`&c[Cm Tracker] &ePlayer ${playerName} not found!`);
            return;
        }

        trackedPlayers = [{
            name: playerName,
            coords: [
                player.getRenderX().toFixed(2),
                player.getRenderY().toFixed(2),
                player.getRenderZ().toFixed(2)
            ]
        }];

        ChatLib.chat(`&6[Cm Tracker] &ePlayer: ${playerName}, is now being tracked.`);
    }
})
    .setName("trackPlayer")
    .setAliases("track", "playerTrack");

register("command", (playerName) => {
    if (!playerName) {
        if (trackedPlayers.length === 0) {
            ChatLib.chat("&c[Cm Tracker] &eNo players are currently being tracked.");
            return;
        }

        trackedPlayers = [];
        ChatLib.chat("&6[Cm Tracker] &eAll players have been untracked.");
        return;
    }

    if (trackedPlayers.some(p => p.name === playerName)) {
        trackedPlayers = trackedPlayers.filter(p => p.name !== playerName);
        ChatLib.chat(`&6[Cm Tracker] &ePlayer: ${playerName}, is no longer being tracked.`);
    } else {
        ChatLib.chat(`&c[Cm Tracker] &ePlayer: ${playerName} is not being tracked.`);
    }
}).setName("unTrackPlayer").setAliases("untrack");

function javaColorToHex(javaColor) {
    // Extract RGB components
    let red = javaColor.getRed();
    let green = javaColor.getGreen();
    let blue = javaColor.getBlue();

    // Convert RGB to hexadecimal
    let hex = "0x" + componentToHex(red) + componentToHex(green) + componentToHex(blue);

    return hex;
}

function componentToHex(c) {
    let hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}