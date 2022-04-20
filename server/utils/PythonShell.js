async function pythonShell(args, filePath, _callback) {
  // _callback is function provided by user once python program finishes
  const output = []; // output of python program
  // let filePath = filePath; // in case you want to change filepath (String) to a different py program, do that here
  const { spawn } = require('child_process');
  const pyProg = spawn('python', [filePath, args]); // New PyProcess

<<<<<<< HEAD
  pyProg.stdout.on('data', (data) => {
    data = data.toString();
    // You can do anything fancy with the output (String) here
=======
  pyProg.stdout.on('data', function (data) {
    data = data.toString();
    /**You can do anything fancy with the output (String) here */
>>>>>>> jiayi
    output.push(data);
    _callback(output);
  });
  pyProg.stderr.on('data', (data) => {
    data = data.toString();
    output.push(['Error: ' + data.toString()]);
    _callback(output);
  });
}
module.exports.pythonShell = pythonShell; // You can rename the function on top , but remember to rename the export
// as well
