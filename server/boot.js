const nodeCMD = require('node-cmd');

const executionType = process.env.NODE_ENV;

nodeCMD.run(executionType, function(err, data, stderr) {
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

