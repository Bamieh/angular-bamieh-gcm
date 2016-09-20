# angular-bamieh-gcm


service worker

-> chrome level.not window level.

-> we dont have the token
-> we only listen to push event (sent from gcm)


client
-> register SW
-> register GCM

-> GCM sends endpoint token




server
-> recieves endpoint token and saves it.

-> sends to gcm a message, with specific data (title, body, icon).


SW listens to push, sends the payload data.

