let pyProg = require('./PythonShell.js');
/**EXAMPLE FUNCTION ON HOW TO USE scrape_remax */
function usePyShell(args, filepath) { 
    // call first function and pass in a callback function which
    // first function runs when it has completed
    pyProg.pythonShell(args, filepath, function(output) {
        /*** WOOHOO WE GOT THE INFO IN OUTPUT */
        /** Your Code Goes Here! */
        console.log(output.toString())
        
    });    
}

usePyShell("Hello There!", "./example_pyProg.py")