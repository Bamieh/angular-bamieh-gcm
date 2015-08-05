var express = require('express'),
    router = express.Router(),
    gcm = require('node-gcm'),
    bodyParser = require('body-parser');


router.use(bodyParser.json());       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({ extended: true }))


// middleware specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

// define the home page route
router.post('/subscribe', function(req, res) {
  console.log('pushing');
  var sender = new gcm.Sender('AIzaSyAlTpdgA-V695rQicl-_WsMGxbXuJWCcQM');
  var registrationIds = [];
  var message = new gcm.Message();
  message.addData('key1','testdarinodegcm');
  registrationIds.push(req.body.endpoint);
  sender.send(message, registrationIds, 4, function(err, result) {
    if(err) console.error(err);
    else    console.log('success', result);
    res.end('Done');
  });
});

module.exports = router;
//
// // Create a message
// // ... with default values
// var message = new gcm.Message();
//
// // ... or some given values
// var message = new gcm.Message({
//     collapseKey: 'demo',
//     priority: 3,
//     contentAvailable: true,
//     delayWhileIdle: true,
//     timeToLive: 3,
//     restrictedPackageName: "somePackageName",
//     dryRun: true,
//     data: {
//         key1: 'message1',
//         key2: 'message2'
//     },
//     notification: {
//         title: "Hello, World",
//         icon: "ic_launcher",
//         body: "This is a notification that will be displayed ASAP."
//     }
// });
//
// // Set up the sender with you API key
// var sender = new gcm.Sender('AIzaSyAlTpdgA-V695rQicl-_WsMGxbXuJWCcQM');
//
// // Add the registration IDs of the devices you want to send to
// var registrationIds = [];
// registrationIds.push('regId1');
//
// // Send the message
// // ... trying only once
// sender.sendNoRetry(message, registrationIds, function(err, result) {
//   if(err) console.error(err);
//   else    console.log(result);
// });
//
// // ... or retrying
// sender.send(message, registrationIds, function (err, result) {
//   if(err) console.error(err);
//   else    console.log(result);
// });
//
// // ... or retrying a specific number of times (10)
// sender.send(message, registrationIds, 10, function (err, result) {
//   if(err) console.error(err);
//   else    console.log(result);
// });
