const cheerio = require('cheerio');
const request = require('request');

request(
  {
    method: 'GET',
    url: 'https://www.remax.com/ny/jamaica/home-details/84-50-169th-st-102-jamaica-ny-11432/9637000322339336887/M00000489/3378032',
  },
  (err, res, body) => {
    if (err) return console.error(err);

    const $ = cheerio.load(body);

    const allEls = $('*');

    const filteredEls = allEls.filter(function (i, el) {
      // this === el
      const a = $(this);
      const src = a.find('img').attr('data-src');
      return src;
    });

    const items = filteredEls.get();

    items.forEach((e) => {
      console.log(e);
    });
  }
);
