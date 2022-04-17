async function scrape_remax(address, filter, _callback) {
  //Note: Address MUST be in form <state>|<city>|<zip>
  args = address + '**' + filter; //If one of the fields is not suppled, make it equal to 0
  output = [];
  const { spawn, spawnSync } = require('child_process');
  const pyProg = spawnSync('python', ['./scraper.py', args]); //For TEST ONLY
  //const pyProg = spawn('python', ['./scrapers/scraper.py', args]); //WHEN ACTUAL PROJECT DEPLOY, USE THIS
  callback_called = false
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
    //console.log(data.toString());
    output.push(['Error: ' + data.toString()]);
    _callback(output);
  });*/
  


  /**SpawnSYNC Code: */
  output = [];
  data = pyProg.stdout
  let str_data = data.toString().replace(/(\r\n|\n|\r)/gm, '');
  let data_split = str_data.split('**');
  data_split.pop(); //Last value is useless
  //console.log(data_split.toString())
  for (const house of data_split) {
    //output.push(house[0])
    output.push(house.split('|'));
    //output[0].replace("[", "").replace("]","")
  }

  if(output.length > 0)
  {
    callback_called = true
    _callback(output);
  }
}
module.exports.scrape_remax = scrape_remax;
