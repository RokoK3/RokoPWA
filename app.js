let mediaRecorder;
let audioChunks = [];
let installPromptEvent;

window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    installPromptEvent = event;
    document.getElementById('installButton').style.display = 'block';
});

document.getElementById('installButton').addEventListener('click', () => {
    if (installPromptEvent) {
        installPromptEvent.prompt(); 
        installPromptEvent.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }
            installPromptEvent = null;
            document.getElementById('installButton').style.display = 'none';
        });
    }
});

document.getElementById('startRecording').addEventListener('click', function() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function(stream) {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();
            document.getElementById('startRecording').disabled = true;
            document.getElementById('stopRecording').disabled = false;

            mediaRecorder.addEventListener("dataavailable", event => {
                audioChunks.push(event.data);
            });

            mediaRecorder.addEventListener("stop", () => {
                const audioBlob = new Blob(audioChunks);
                const audioUrl = URL.createObjectURL(audioBlob);
                const audio = document.getElementById('audioPlayback');
                audio.src = audioUrl;
                audioChunks = [];
                document.getElementById('startRecording').disabled = false;
            });
        })
        .catch(function(err) {
            console.error('Microphone access denied or not available', err);
        });
});

document.getElementById('stopRecording').addEventListener('click', function() {
    mediaRecorder.stop();
    document.getElementById('stopRecording').disabled = true;
});



if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(function(registration) {
            console.log('Service Worker Registered!', registration);
        })
        .catch(function(error) {
            console.log('Service Worker Registration Failed', error);
        });
}