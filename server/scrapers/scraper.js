async function scrapeRemax(address, filter, _callback) {
  // Note: Address MUST be in form <state>|<city>|<zip>
  const args = address + '**' + filter; // If one of the fields is not suppled, make it equal to 0
  const output = [];
  const { spawn } = require('child_process');
  // const pyProg = spawn('python', ['./scraper.py', args]); //For TEST ONLY
  const pyProg = spawn('python', ['./scrapers/scraper.py', args]); // WHEN ACTUAL PROJECT DEPLOY, USE THIS

  pyProg.stdout.on('data', function (data) {
    // console.log(data.toString());
    const output = [];
    const strData = data.toString().replace(/(\r\n|\n|\r)/gm, '');
    const dataSplit = strData.split('**');
    dataSplit.pop(); // Last value is useless
    // console.log(data_split.toString())
    for (const house of dataSplit) {
      output.push(house.split('|'));
    }
    // _callback(data.toString()); For Test Only
    _callback(output);
  });
  pyProg.stderr.on('data', (data) => {
    // console.log(data.toString());
    output.push(['Error: ' + data.toString()]);
    _callback(output);
  });
}
module.exports.scrapeRemax = scrapeRemax;
