const fs = require('fs');
const path = require('path');


function validateTimeArgs(timeArgs) {
    if (timeArgs.length !== 2) {
        return false;
    }
    try {
        const h = parseInt(timeArgs[0])
        const m = parseInt(timeArgs[1])
        return h <= 24 && h >= 0 && m <= 60 && m >= 0;
    } catch (err) {
        return false;
    }
}

function millisToCETString(millis) {
    const date = new Date(millis);
    return `${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function pad(num) {
    num = num.toString();
    while (num.length < 2) num = "0" + num;
    return num;
}

function getRandomJoinFile() {
    var files = fs.readdirSync(path.join("files", "join"));
    return path.join('files', 'join', files[getRandomInt(files.length)])
}

function getRandomLeaveFile() {
    var files = fs.readdirSync(path.join("files", "leave"));
    return path.join('files', 'leave', files[getRandomInt(files.length)])
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function splitArgs(string) {
    return string.match(/\\?.|^$/g).reduce((p, c) => {
        if (c === '"') {
            p.quote ^= 1;
        } else if (!p.quote && c === ' ') {
            p.a.push('');
        } else {
            p.a[p.a.length - 1] += c.replace(/\\(.)/, "$1");
        }
        return p;
    }, {a: ['']}).a
}

exports.splitArgs = splitArgs;
exports.validateTimeArgs = validateTimeArgs;
exports.getRandomJoinFile = getRandomJoinFile;
exports.getRandomLeaveFile = getRandomLeaveFile;
exports.millisToCETString = millisToCETString;