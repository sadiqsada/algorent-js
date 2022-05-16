async function scrapeRemax(address, filter, _callback) {
  try {
    // Note: Address MUST be in form <state>|<city>|<zip>
    // console.log("ADDRESS IS: " +  address + " AND FILTER IS: " + filter);
    const args = address + '**' + filter; // If one of the fields is not suppled, make it equal to 0
    let output = [];
    const { spawnSync } = require('child_process');
    const pyProg = spawnSync('python', ['./scraper.py', args]); // For TEST ONLY
    // const pyProg = spawnSync('python', ['./scrapers/scraper.py', args]); // WHEN ACTUAL PROJECT DEPLOY, USE THIS
    //

    /*
    pyProg.stdout.on('data', function (data) {
      //console.log(data.toString());
      output = [];
      let str_data = data.toString().replace(/(\r\n|\n|\r)/gm, '');
      let data_split = str_data.split('**');
      data_split.pop(); //Last value is useless
      //console.log(data_split.toString())
      for (const house of data_split) {
        //output.push(house[0])
        output.push(house.split('|'));
        //output[0].replace("[", "").replace("]","")
      }
    
      if(output.length > 0 && !callback_called)
      {
        callback_called = true
        _callback(output);
      }
    });
    pyProg.stderr.on('data', (data) => {
      // console.log(data.toString());
      output.push(['Error: ' + data.toString()]);
      _callback(output);
    }); */

    // SpawnSYNC Code
    output = [];
    const data = pyProg.stdout;
    const err = pyProg.stderr;
    if (err.toString().length > 0) {
      console.log('Error Occured, scrapeRemax js: ' + err.toString());
    }
    // console.log("Error Occured, scrapeRemax js: " + err.toString());
    // const err = pyProg.stderr;
    const strData = data.toString().replace(/(\r\n|\n|\r)/gm, '');
    const dataSplit = strData.split('**');
    dataSplit.pop(); // Last value is useless
    // console.log(data_split.toString())
    for (const house of dataSplit) {
      // output.push(house[0])
      output.push(house.split('|'));
      // output[0].replace("[", "").replace("]","")
    }

    if (output.length > 0) {
      _callback(output);
    }
  } catch (error) {
    console.log('ERROR OCCURED IN SCRAPER JS scrapeRemax: ' + error);
  }
}
module.exports.scrapeRemax = scrapeRemax;

async function guessAddress(address, _callback) {
  try {
    const args = address + '**' + 'G'; // If one of the fields is not suppled, make it equal to 0
    const { spawnSync } = require('child_process');
    // const pyProg = spawnSync('python', ['./scraper.py', args]); // For TEST ONLY
    const pyProg = spawnSync('python', ['./scrapers/scraper.py', args]); // WHEN ACTUAL PROJECT DEPLOY, USE THIS

    const data = pyProg.stdout;
    const err = pyProg.stderr;
    if (err.toString().length > 0) {
      console.log('Error Occured in guessAddress: ' + err.toString());
    }
    const strData = data
      .toString()
      .replace(/(\r\n|\n|\r)/gm, '')
      .split(' , ');
    _callback(strData); // FOR TESTING CHANGE THIS LATER
  } catch (error) {
    console.log('ERROR OCCURED IN SCRAPER.JS GUESSADDRESS: ' + error);
  }
}
module.exports.guessAddress = guessAddress;
