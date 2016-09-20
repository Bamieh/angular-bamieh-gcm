var express = require('express'),
    router = express.Router(),
    webPush = require('web-push'),
    bodyParser = require('body-parser');

// var GCM_API_KEY = process.env.GCM_API_KEY;
var GCM_API_KEY = "AIzaSyAlTpdgA-V695rQicl-_WsMGxbXuJWCcQM";

webPush.setGCMAPIKey(GCM_API_KEY);

router.use(bodyParser.json());       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({ extended: true }))

// middleware specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});


router.post('/subscribe', function(req, res) {
  var payload = req.body.payload;
  console.log('payload', payload);
  setTimeout(function() {
    console.log('trying!', payload.endpoint)
    webPush.sendNotification(payload.endpoint, {
        TTL: payload.ttl || 60,
        payload: JSON.stringify({
          "body" : "Custom Body from server.",
          "title" : "New Notification Arrived!",
          "icon" : "https://yamsafer.atlassian.net/secure/useravatar?ownerId=bamieh&avatarId=11705",
        }),
        userPublicKey: payload.keys.p256dh,
        userAuth: payload.keys.auth,
    }).then(function(result) {
      console.log(result);
      res.sendStatus(201);
    }).catch(function(err) {
      console.log('error: ', err);
    })

  }, 1200);
});


module.exports = router;



