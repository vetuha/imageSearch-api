var bingSearch = require('bing.search');

module.exports = function(app, db) {
  
  app.get('/api/imagesearch/:query', searchAndDisplay);
  

  function searchAndDisplay(req, res) {
    var query = req.params.query;
    var size = req.query.offset || 10;
    var search = new bingSearch(process.env.BING_API_KEY);
    var result = {
        term: query,
        when: new Date().toLocaleString()
      };
    
      
    saveHistory(result, db);
    
    search.images(query, {
        top: size
      },
      function(err, results) {
        if (err) throw err;
        res.send(results.map(function(img) {
            return {
                "url": img.url,
                "snippet": img.title,
                "thumbnail": img.thumbnail.url,
                "context": img.sourceUrl
                };
            
        }));
      }
    );
  }

  function saveHistory(obj, db) {
    var urls = db.collection('sHistory')
    .save(obj, function(err, result) {
      if (err) throw err;
      console.log('Saved new search query' + result);
    });
  }
};