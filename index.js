(function() {
  'use strict';

  var got = require('got');
  var $ = require('cheerio');

  module.exports = {};

  module.exports.detailed = function(hash) {
    return got('https://www.torrentz.eu/' + hash)
      .then(function(response) {
        var $doc = $(response.body);

        var sources = $('div.download dl a', $doc).map(function(ind, item) {
          return {
            link: $(item).attr('href'),
            title: $('span.u', item).text()
          };
        }).get();

        var trackers = $('div.trackers dl', $doc).map(function(ind, item) {
          return {
            tracker: $('a', item).text(),
            seeds: parseInt($('span.u', item).text()),
            peers: parseInt($('span.d', item).text()),
            last_scrape: new Date($('span.a span', item).attr('title') + ' UTC')
          };
        }).get();

        function parseFolder(ind, item) {
          if ($(item).hasClass('t')) {
            var folders = $('> li', $(item).next()).map(parseFolder).get();
            return {
              folder: $(item).text(),
              files: folders
            };
          } else {
            if ($('> li', item).length) return null;
            return {
              filename: $(item).text().replace($('span', item).text(), '').trim(),
              size: $('span', item).text()
            };
          }
        }

        var files = $('div.files > ul > li > ul > li', $doc).map(parseFolder).get();

        return {
          sources: sources,
          trackers: trackers,
          files: files
        };
      });
  };

  module.exports.search = function(query) {
    if (typeof query == 'string') {
      query = { 'query': query };
    }

    query.quality = query.quality || 'good';

    var url = 'https://www.torrentz.eu/';

    if (query.quality == 'any') url += 'any';
    if (query.quality == 'good') url += 'search';
    if (query.quality == 'verified') url += 'verified';

    if (query.order == 'peers') url += 'P';
    if (query.order == 'rating') url += 'N';
    if (query.order == 'date') url += 'A';
    if (query.order == 'size') url += 'S';

    url += '?q=' + encodeURIComponent(query.query);

    if (query.page) url += '&p=' + (query.page - 1);

    return got(url)
      .then(function(response) {
        var results = $('div.results', response.body);
        var items = $('dl', results);
        return {
          page: parseInt($('p span > span', results).text().trim()) || 1,
          pagecount: parseInt($('p a:last-child', results).prev().text()),
          torrents: items.map(function(index, item) {
            if (!$('a', item).text()) return null;
            return {
              title: $('a', item).text(),
              hash: $('a', item).attr('href').substr(1),
              date: new Date($('span.a span', item).attr('title') + ' UTC'),
              size: $('span.s', item).text(),
              seeds: parseInt($('span.u', item).text()),
              peers: parseInt($('span.d', item).text())
            };
          }).get()
        };
      });
  };

  return;

})();
