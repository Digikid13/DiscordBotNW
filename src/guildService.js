const persistance = require('./persistance')
const { Guild } = require('./Guild')

const defaultServer = {
    "preJoinTimer": "300",
    "channelName": "war-bot",
    "warChannel": "war-channel",
    "callRate": [15, 10, 5],
    "firstCallTimer": "600"
}

function createDefault(id) {
    server = { ...defaultServer }
    server["id"] = id
    return new Promise((resolve, reject) => {
        persistance.create(server).then((data, err) => {
            if (err) {
                reject(err);
                return;
            }
            const tmp = new Guild(data.id, data.preJoinTimer, data.channelName, data.warChannel, data.callRate)
            resolve(tmp);
        })
    })
}

function save(guild) {
    const obj = {
        "id": guild.id,
        "preJoinTimer": guild.preJoinTimer,
        "channelName": guild.channelName,
        "warChannel": guild.warChannel,
        "callRate": guild.callRate,
        "firstCallTimer": guild.firstCallTimer
    }
    return new Promise((resolve, reject) => {
        persistance.save(obj).then((data, err) => {
            if (err) {
                reject(err);
                return;
            }
            const tmp = new Guild(data.id, data.preJoinTimer, data.channelName, data.warChannel, data.callRate, data.firstCallTimer)
            resolve(tmp);
        })
    })
}

const idToServerMap = new Map();

function get(id) {
    return new Promise((resolve, reject) => {
        persistance.find(id).then((data, err) => {
            if (err) {
                reject(err);
            } else {
                if (!data) {
                    resolve(data);
                    return;
                }
                const tmp = new Guild(data.id, data.preJoinTimer, data.channelName, data.warChannel, data.callRate, data.firstCallTimer)
                resolve(tmp);
            }
        })
    })
}



function dispatch(id, msg) {
    if (!idToServerMap.has(id)) {
        get(id).then(resultGuild => {
            if (resultGuild) {
                idToServerMap.set(id, resultGuild)
                idToServerMap.get(id).dispatch(msg);
            } else {
                createDefault(id).then((resultDefault) => {
                    idToServerMap.set(id, resultDefault);
                    idToServerMap.get(id).dispatch(msg);
                })
            }
        })
    } else {
        idToServerMap.get(id).dispatch(msg);
    }

}

exports.createDefault = createDefault;
exports.get = get;
exports.dispatch = dispatch;
exports.save = save;