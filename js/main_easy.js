onSuccess = function (stream) { 
	console.log('getUserMedia success! Stream: ', stream);


	var output = document.getElementById('gum-local');

	output.srcObject = stream;
	var msgdiv = document.getElementById('okMsg');
	msgdiv.innerHTML = '<p>The user allowed using microphone and webcam</p>';
};

onError = function (error) {
	console.log('getUserMedia error! Got this error: ', error);
	errordiv = document.getElementById('errorMsg');
	errordiv.innerHTML = '<p> Errore! ' + error.name + '</p>' ;
};

var constraints = { video: true, audio: true};


navigator.webkitGetUserMedia(constraints, onSuccess, onError);
