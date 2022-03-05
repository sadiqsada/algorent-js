exports.scrape_remax = (address)  =>//Note: Address MUST be in form <state>|<city>|<zip>
{
    return new Promise(async(resolve, reject)=>{
        try{
            if(address) {
                resolve(await scrape_remax(address));
            }
            args =[address];
            const { spawn } = require('child_process');
            //const pyProg = spawn('python', ['./scraper.py', args]);
            resolve(await spawn('python', ['./scraper.py', args]).stdout.on('data', function(data) {
                //console.log(data.toString());
                output = []
                let str_data = data.toString();
                let data_split = str_data.split("**")
                //console.log(data_split.toString())
                for (const house of data_split) {
                    output.push(house.split("|"));
                }
                return output
            }));
        }   
        catch(e){
            await pyProg.stderr.on('data', (data) => {
                //console.log(data.toString());
                output.push(["Error: " + data.toString()]);
            });
            reject(e)
        }
    });
}