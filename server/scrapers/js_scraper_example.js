let scraper = require('./scraper.js');
/**EXAMPLE FUNCTION ON HOW TO USE scrape_remax */
function use_scraper(address) { 
    // call first function and pass in a callback function which
    // first function runs when it has completed
    scraper.scrape_remax(address, function(output) {
        /*** WOOHOO WE GOT THE INFO IN OUTPUT */
        /** Your Code Goes Here! */
        console.log(output)
        
    });    
}

use_scraper("NY|Jamaica|11432") // PLEASE GIVE ADDRESS IN FORM: "<state>|<city>|zip" 
/**------END OF EXAMPLE------------------------ */