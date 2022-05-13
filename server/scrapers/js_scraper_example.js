const scraper = require('./scraper.js');

// EXAMPLE FUNCTION ON HOW TO USE scrape_remax
const useScraper = (address, filter) => {
  // call first function and pass in a callback function which
  // first function runs when it has completed
  scraper.scrapeRemax(address, filter, (output) => {
    // WOOHOO WE GOT THE INFO IN OUTPUT
    // Your Code Goes Here!
    console.log(output);
  });
};


const useSharpen = (url) => {
  scraper.sharpenImage(url, (output) => {
    console.log("Filename: ", output)
  });
}

const useGuesser = (address) => {
  // call first function and pass in a callback function which
  // first function runs when it has completed
  scraper.guessAddress(address, (output) => {
    // WOOHOO WE GOT THE INFO IN OUTPUT
    // Your Code Goes Here!
    console.log(output);
  });
};

// useScraper(
//   'NY|Ozone Park|11417',
//   '{"minBeds":2, "minBaths":2, "minPrice":"1000000","maxPrice":"10000000"}'
// ); // PLEASE GIVE ADDRESS IN FORM: "<state>|<city>|zip"

// useScraper('NY|Staten Island|10311', '')
/** Scraper With ANY Address String:  
useScraper(
  'Ozone Park 11417',
  '{"minBeds":2, "minBaths":2, "minPrice":"1000000","maxPrice":"10000000"}'
);
*/
// useGuesser('Jamaica 11432');
// Filter NEEDS to look like this: '{"minBeds":2, "minBaths":2, "minPrice":"1000000","maxPrice":"10000000"}'
// If any min fields aren't given by user, just make them 0

// NOTE: Filter CAN be BLANK (Empty String)
// use_scraper("NY|Jamaica|11432", "")
// ------END OF EXAMPLE------------------------

useSharpen('https://s3.amazonaws.com/rets-images-matrix-hgar/9db17eba12c81cd49afd283784fbc436d6e2155e-1-large.jpeg')
