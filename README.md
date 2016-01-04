# node-torrentz

Simple, rather unstable, scraper for torrentz.eu.
Written to provide easy and fast access to torrentz.eu results.

## Methods

### search

#### Options
```
Object:
{
  query: 'String query',
  page: 1,
  order: 'date', // defaults to peers, possible is rating, date, size, peers
  quality: 'any', // defaults to good, possible is any, good, verified
}

or simply a 'String query'
```

#### Returned result object
```
{
  pagecount: 200,
  page: 1,
  torrents: [
    { title: 'Linux',
       hash: '...',
       date: Date Object,
       size: '700 MB',
       seeds: 100,
       peers: 99
    },
    ....
  ]
}
```

#### Simple example usage
```
var torrentz = require('node-torrentz');
torrentz.search('Linux ISO')
  .then(function(results) {
    for(var i in results.torrents) {
      console.log(results.torrents[i].title);
    }
  })
  .catch(console.error);
```

### Detailed

#### Arguments

The only actual argument is an info hash.

#### Returned information
```
{
  sources: [
    {
      link: 'http://...',
      tile: '1337x.to'
    },
    ...
  ],
  trackers: [
    {
      tracker: 'udp://.../announce',
      seeds: 12,
      peers: 0,
      last_scrape: Date Object
    },
    ...
  ],
  files: [
    {
      filename: 'Cover.jpg',
      size: '1 MB'
    },
    {
      folder: 'doc',
      files: [
        {
          filename: 'manual.html',
          size: '1 KB'
        },
        ...
      ]
    },
    ...
  ]
}
```

#### Simple example usage
```
var torrentz = require('node-torrentz');
torrentz.detailed('info_hash...')
  .then(function(info) {
    console.log(info.trackers);
    console.log(info.sources);
    console.log(info.files);
  })
  .catch(console.error);
```


## License

The MIT License (MIT)

Copyright (c) 2016 Patrick Engström

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
