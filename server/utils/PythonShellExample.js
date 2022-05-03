const pyProg = require('./PythonShell.js');

function usePyShell(args, filepath) {
  pyProg.pythonShell(args, filepath, function (output) {
    // *** WOOHOO WE GOT THE INFO IN OUTPUT */
    // ** Your Code Goes Here! */
    console.log(output);
  });
}

usePyShell('Hello There!', './example_pyProg.py');
// Args^              FilePath
