async function scrape_remax(address, _callback)//Note: Address MUST be in form <state>|<city>|<zip>
{
    args =[address];
    output = []
    const { spawn } = require('child_process');
    const pyProg = spawn('python', ['./scrapers/scraper.py', args]);
    pyProg.stdout.on('data', function(data) {
        //console.log(data.toString());
        output = []
        let str_data = data.toString().replace(/(\r\n|\n|\r)/gm, "");
        let data_split = str_data.split("**")
        data_split.pop()//Last value is useless
        //console.log(data_split.toString())
        for (const house of data_split) {
            output.push(house.split("|"));
        }
        _callback(output);  
    })
    pyProg.stderr.on('data', (data) => {
        //console.log(data.toString());
        output.push(["Error: " + data.toString()]);
        _callback(output);  
    });
} 
module.exports.scrape_remax = scrape_remax;

