//Constants
var localStream = null;
var pc = null; 
var dataChannel = null;
//HTML Stuff
var callBtn = document.getElementById('call');
var clearBtn = document.getElementById('clear');
var hangupBtn = document.getElementById('hangup');
var sdpAnswerBtn = document.getElementById('setSdpAnswer');
var sdpOfferBtn = document.getElementById('setSdpOffer');
var sendBtn = document.getElementById('send');
var messageText = document.getElementById('message');
var errordiv = document.getElementById('errorMsg');
var chatDiv = document.getElementById('chat');
var msgdiv = document.getElementById('okMsg');
var SdpText = document.getElementById('sdpMessage');

callBtn.disabled = false;
hangupBtn.disabled = true;
callBtn.onclick = call;
hangupBtn.onclick = hangup;
sdpAnswerBtn.onclick = setSdpAnswer;
sdpOfferBtn.onclick = setSdpOffer;
sendBtn.onclick = sendData;
sendBtn.disabled = true;
clearBtn.onclick = function() { msgdiv.innerHTML = "";} ;
initPeerConnection();

function initPeerConnection() {
   var servers = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'},
   				 {"urls":["turn:74.125.143.127:19305?transport=udp","turn:[2A00:1450:4013:C03::7F]:19305?transport=udp","turn:74.125.143.127:443?transport=tcp","turn:[2A00:1450:4013:C03::7F]:443?transport=tcp"],"username":"COCYrsAFEgZfe2dPu/0Yzc/s6OMT","credential":"C/B5w7Oauq7czKcFMgatxB8pTyQ="}]};
   var  pcConstraint = {'mandatory':
  {
    'OfferToReceiveAudio': false,
    'OfferToReceiveVideo': false
  }
};
   pc = new webkitRTCPeerConnection(servers, pcConstraint);
   pc.onicecandidate = function(e) {
      onIceCandidate(pc, e);
   };
   pc.ondatachannel = dataChannelCallback;
   pc.oniceconnectionstatechange = function(e) {
     onIceStateChange(pc, e);
   };
}

//---------------UI Stuff------------------------
//Called when the "Call" button is pressed!
function call() {
   dataConstraint = null;
   dataChannel = pc.createDataChannel('LinuxDayRules', dataConstraint);
   dataChannel.onopen = function (e) {
	console.log("Data Channel open!", e);
	sendBtn.disabled = false;
   }; 
   dataChannel.onclose = function (e) { 
	console.log("Data channel closed :(", e);
   };
   dataChannel.onmessage = messageCallback; 

   pc.createOffer().then(

    function (desc) { 

	console.log("Created offer", desc);
        pc.setLocalDescription(desc).then(
          function() { console.log("Create offer success"); },
          onSetSessionDescriptionError
        );
   },
    function (e) { console.log("Error", e); }
  );
}

function dataChannelCallback(event) {
	console.log("Got this event", event);
	if (dataChannel === null) {
		dataChannel = event.channel;
		dataChannel.onmessage = messageCallback; 
		sendBtn.disabled = false;
	}
 
}
function messageCallback(event) {
	console.log("Got data", event);
	chatDiv.innerHTML += 'Other peer said: ' + event.data + '</br>';
  
}
function onDataChannelStateChange() {
  var readyState = dataChannel.readyState;
  console.log('Send channel state is: ' + readyState);
}

//Callee logic
function setSdpOffer() {
  console.log('set Sdp offer button clicked');
  sdpOffer =  new RTCSessionDescription({type: 'offer', sdp: SdpText.value});
 
  pc.setRemoteDescription(sdpOffer).then(
    function() { //Success
   	console.log('Set remote Success. Creating answer');
	pc.createAnswer().then(
	   function (desc) {
	      console.log('Created answer', desc);
              msgdiv.innerHTML = '<pre>' + desc.sdp + '</pre>'; 
              pc.setLocalDescription(desc).then(
		    function() {},
		    onSetSessionDescriptionError
	      );
	   },
	   onCreateSessionDescriptionError
	);
    },
    onSetSessionDescriptionError
  );
}

//Initiator logic
function setSdpAnswer() { 
  var sdpAnswer = new RTCSessionDescription({type: 'answer', sdp: SdpText.value});
  console.log('set Sdp answer button clicked. Setting answer', sdpAnswer);
  pc.setRemoteDescription(sdpAnswer).then(
    function() {
      console.log("setRemoteDescription was successful");
    },
    onSetSessionDescriptionError
  );
}

function sendData() {
    data = messageText.value;
    console.log("About to send this data: " + data);  
    chatDiv.innerHTML += 'I said: ' + data + '</br>';
    dataChannel.send(data);
    messageText.value = "";
}

//ICE Callbacks
function onIceCandidate(pc, event) {
    console.log("Ice candidate", event);
    msgdiv.innerHTML = '<pre>' + pc.localDescription.sdp + '</pre>'; 
}

function onAddIceCandidateSuccess(pc) {
  console.log('addIceCandidate success');
}

function onIceStateChange(pc, event) {
  if (pc) {
    console.log('ICE state: ' + pc.iceConnectionState);
  }
}

//Error Handling
function onCreateSessionDescriptionError(error) {
  console.log('Error setting SDP: ' + error.toString(), error);
  errordiv.innerHTML = 'Error setting SDP';
}

function onSetSessionDescriptionError(error) {
  console.log("Set session desc. error!", error);
}

function onAddIceCandidateError(pc, error) {
  console.log('failed to add ICE Candidate: ' + error.toString());
}
