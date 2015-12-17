var basicAuth = require('basic-auth');
var express = require('express');
var app = express();

var auth = function (req, res, next) {
  function unauthorized(res) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.sendStatus(401);
  };

  var user = basicAuth(req);

  if (!user || !user.name || !user.pass) {
    return unauthorized(res);
  };

  if (user.name === process.env.TS_USERNAME && user.pass === process.env.TS_PASSWORD) {
    return next();
  } else {
    return unauthorized(res);
  };
};

var bodyParser = require('body-parser');
var orchestrate = require('orchestrate');

app.use(bodyParser.json());

var orchestrate_api_key = process.env.ORCHESTRATE_API_KEY;
var orchestrate_api_url = process.env.ORCHESTRATE_API_HOST;

if (process.env.VCAP_SERVICES) {
  var services = JSON.parse(process.env.VCAP_SERVICES);
  var orchestrateConfig = services["orchestrate"];
  if (orchestrateConfig) {
    var node = orchestrateConfig[0];
    orchestrate_api_key = node.credentials.ORCHESTRATE_API_KEY
    orchestrate_api_url = node.credentials.ORCHESTRATE_API_HOST
  }
}

var db = orchestrate(orchestrate_api_key, orchestrate_api_url);

app.post('/criteria', function (req, res) {
  console.log('called criteria POST', req.body);

  db.post('criteria', req.body)
  .then(function(result) {
    res.send(result);
  })
  .fail(function(err) {
    res.send({'error': err});
  });
});

app.get('/criteria', function(req, res) {
  console.log('called criteria GET');

  db.newSearchBuilder()
  .collection('criteria')
  .sort('@path.reftime', 'desc')
  .query('*')
  .then(function(result) {
    res.send(result);
  })
  .fail(function(err) {
    res.send({'error': err});
  });
});

app.post('/themes', function (req, res) {
  var updatedThemes = req.body;

  console.log('called themes POST', updatedThemes);
  db.post('themes', { themes: updatedThemes })
  .then(function(result) {
    res.send(result);
  })
  .fail(function(err) {
    res.send({'error': err});
  });
});

app.get('/themes', function(req, res) {
  console.log('called themes GET');

  db.newSearchBuilder()
  .collection('themes')
  .sort('@path.reftime', 'desc')
  .query('*')
  .then(function(result) {
    res.send(result);
  })
  .fail(function(err) {
    res.send({'error': err});
  });
});

app.post('/team', function (req, res) {
  var updatedTeam = req.body;

  console.log('called team POST', updatedTeam);
  db.post('team', updatedTeam)
  .then(function(result) {
    res.send(result);
  })
  .fail(function(err) {
    res.send({'error': err});
  });
});

app.get('/team', function(req, res) {
  console.log('called team GET');

  db.newSearchBuilder()
  .collection('team')
  .sort('@path.reftime', 'desc')
  .query('*')
  .then(function(result) {
    res.send(result);
  })
  .fail(function(err) {
    res.send({'error': err});
  });
});

app.use('/', auth);
app.use('/', express.static(__dirname + '/dist'));

var port = process.env.PORT || 9000;

var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Theme Scoring app listening at http://%s:%s', host, port);
});
