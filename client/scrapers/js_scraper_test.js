let scraper = require('./scraper_py.js');
//return google.login(data.username, data.password).then(token => { return token } )
//let house_info = scraper.scraper("NY|Jamaica|11432")
scraper.scrape_remax("NY|Jamaica|11432").then((output)=>console.log(output))