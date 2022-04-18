const pyProg = require('./PythonShell.js');

const usePyShell(args, filepath) => {
  pyProg.pythonShell(args, filepath, (output) => {
    // WOOHOO WE GOT THE INFO IN OUTPUT
    // Your Code Goes Here!
    console.log(output);
  });
}

usePyShell('Hello There!', './example_pyProg.py');
