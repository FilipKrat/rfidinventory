let app = require('./app');
let port = process.env.PORT || 3000;

let server = app.listen(port, function() {
  console.log('Express server listening on port ' + port);
});
