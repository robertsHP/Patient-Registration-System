import nodeCMD from 'node-cmd';
import os from 'os';

// Determine the OS type
const osType = os.type();

// Configure the command based on the OS type
let cdCommand;

if (osType === 'Windows_NT') {
    cdCommand = 'cd admin &&';
} else {
    // For macOS and Linux
    cdCommand = 'cd admin;';
}

// Get the command from ecosystem.config.js
const command = process.env.NODE_COMMAND;

// Combine the commands
const fullCommand = `${cdCommand} ${command}`;

// Run the command
nodeCMD.run(fullCommand, function(err, data, stderr) {
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