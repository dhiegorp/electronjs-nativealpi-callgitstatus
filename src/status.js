const electron = require('electron');
const fs = require('fs');
const os = require('os');
const { exec } = require('child_process');
const { dir } = require('console');

let timer;

function isDir(path) {
    try {
        return fs.lstatSync(path).isDirectory()
    } catch (err) {
        return false;
    }
}

function checkGitStatus(path) {
    exec('git status', {
        cwd: path
    }, (err, stdout, stderr) => {
        console.log('err ', err);
        console.log('stdout ', stdout);
        console.log('stderr ', stderr);
        if (err) return setStatus('unknown');
        if (/nothing to commit/.test(stdout)) return setStatus('clean');
        return setStatus('dirty');
    })
};

function formatDir(path) {
    return /^~/.test(path) ? os.homedir() + path.substr(1).trim() : path.trim()
}


function removeStatus() {
    const elem = document.getElementById('status');
    elem.classList.remove('unknown', 'clean', 'dirty')
    return elem;
}

function setStatus(status) {
    const elem = removeStatus();
    elem.classList.add(status)
}

document.querySelector('#input').addEventListener('keyup', evt => {
    removeStatus();
    clearTimeout(timer);
    timer = setTimeout(_ => {
        const path = formatDir(evt.target.value)
        if (isDir(path)) {
            checkGitStatus(path);

        }
    }, 500);


});