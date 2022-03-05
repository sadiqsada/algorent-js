const { spawn } = require('child_process');
const pyProg = spawn('python', ['scrapers/scraper.py']);
pyProg.stdout.on('data', function(data) {
    console.log(data.toString());
});
pyProg.stderr.on('data', (data) => {
    // As said before, convert the Uint8Array to a readable string. 
    console.log(data.toString());
});
