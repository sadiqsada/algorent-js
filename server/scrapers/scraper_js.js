const cheerio = require('cheerio');
const request = require('request');

request({
    method: 'GET',
    url: 'https://www.remax.com/ny/jamaica/home-details/84-50-169th-st-102-jamaica-ny-11432/9637000322339336887/M00000489/3378032'
}, (err, res, body) => {

    if (err) return console.error(err);

    let $ = cheerio.load(body);

    let allEls = $('*');

    let filteredEls = allEls.filter(function (i, el) {
        // this === el
        let a = $(this)
        let src = a.find('img').attr('data-src');
        return src
    });

    let items = filteredEls.get();

    items.forEach(e => {
        console.log(e);
    });

});