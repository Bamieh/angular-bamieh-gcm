var express = require('express'),
    notifications = require('./notifications-module'),
    app = express(),
    http = require('http'),
    bodyParser = require('body-parser'),
    fs = require('fs');

var server = require('http').Server(app);

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/src', express.static('src'));
app.use('/example', express.static('example'));
app.use('/bower_components', express.static('bower_components'));


app.use('/notifications', notifications);

app.use("/", express.static(__dirname));
app.get('/', function(req, res, next) {
    // Just send the index.html for other files to support HTML5Mode
    res.sendFile('example/index.html', { root: __dirname });
});

/* Port Listening */
server.listen(1337, function() {
  console.log('Listening on port %d', server.address().port);
});

