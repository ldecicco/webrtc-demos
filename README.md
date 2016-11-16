Installation
------------
```sh
npm install connect serve-static
```
Run server
----------
```sh
./server.js
```
Start the call
--------------
The **call initiator** (1/2):
- Open http://127.0.0.1:8080/peerconnection.html
- Click on "Create Offer"
- Copy the appeared text, it's the SDP offer
- Send it to the other peer (it's up to you how to send it)

The **callee**:
- Open http://127.0.0.1:8080/peerconnection.html
- Copy the received ```offer``` and paste it in the textbox
- Click on "Set as SDP offer"
- Copy the appeared text, it's the SDP answer
- Send it to the other peer (it's up to you how to send it)

The **call initiator** (2/2):
- Copy the received ```answer``` and paste it in the textbox
- Click on "Set as SDP answer"
- Enjoy the conversation!
