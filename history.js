module.exports = function(app, db) {
  
  app.get('/api/latest/imagesearch/', showHistory);

  function showHistory(req, res) {
      getHistory(db, res);
  }

  function getHistory(db, res) {
    var urls = db.collection('sHistory')
    .find( { $query: {}, $orderby: { when : -1 } } ).toArray(function(err, result) {
      if (err) throw err;
      if (result) {
        res.send(result.map(function(el){
            return {
                term: el.term,
                when: el.when
            }
        }));
      } else {
        res.send({message:"History is empty!"});
      }
    });
  }
};