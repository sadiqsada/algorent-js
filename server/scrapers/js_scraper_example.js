let scraper = require('./scraper.js');
/**EXAMPLE FUNCTION ON HOW TO USE scrape_remax */
function use_scraper(address, filter) {
  // call first function and pass in a callback function which
  // first function runs when it has completed
  scraper.scrape_remax(address, filter, function (output) {
    /*** WOOHOO WE GOT THE INFO IN OUTPUT */
    /** Your Code Goes Here! */
    console.log(output);
  });
}

use_scraper('NY|Kew Gardens|11415', ''); // PLEASE GIVE ADDRESS IN FORM: "<state>|<city>|zip"
//Filter NEEDS to look like this: '{"minBeds":2, "minBaths":2, "minPrice":"1000000","maxPrice":"10000000"}'
//If any min fields aren't given by user, just make them 0

//NOTE: Filter CAN be BLANK (Empty String)
//use_scraper("NY|Jamaica|11432", "")
/**------END OF EXAMPLE------------------------ */
