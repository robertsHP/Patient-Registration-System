const nodeCMD = require('node-cmd');

function getCommand(execType) {
    var execCommand = null;

    switch (execType) {
        case 'dev':
            execCommand = 'npm run dev';
            break;
        case 'build':
            execCommand = 'npm run build';
            break;
        case 'start':
            execCommand = 'npm run start';
            break;
        case 'test':
            execCommand = 'npm run test';
            break;
    }
    return execCommand;
}

function executeCommand(nodeCMD, folderName, execCommand) {
    nodeCMD.run('cd ' + folderName + ' && ' + execCommand, function(err, data, stderr) {
        if (err) {
            console.error('Error:', err);
            return;
        }
        if (stderr) {
            console.error('stderr:', stderr);
            return;
        }
        console.log('stdout:', data);
    });
}

const folderName = process.argv[2];
const execType = process.argv[3];
const execCommand = getCommand(execType);

if (folderName && execCommand) {
    executeCommand(nodeCMD, folderName, execCommand);
} else {
    console.error('Please provide a valid folder name and execution type.');
}


// pm2 start startscript.js --node-args="--exectype=dev"

// cmd.run('npm start'); 

// //pm2 start startscript.js
//https://github.com/Unitech/pm2/issues/2808