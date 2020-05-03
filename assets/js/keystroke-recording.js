let context;
let oscillator;
let beep_flag = 0;
let chunks = [];
let time_data = [
  [],
  []
];
// ********* Init AudioContext and Oscillator Node

window.addEventListener('load', init, false);

function init() {
  try {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();
    dest = context.createMediaStreamDestination();
    is_MediaRecorder_support = new MediaRecorder(dest.stream);
  } catch (e) {
    alert("Web Audio Initialization Error: " + e);
  }

  document.onkeydown = function (e) {
    console.log(oscillator, "stop");
    if (!beep_flag && event.keyCode == 32) {
      beep_flag = 1;

      restartBeep(300);
      console.log("up", context.currentTime);
      document.body.style.backgroundColor = "#3a3c3d";
    }

  };
  document.onkeyup = function (e) {
    oscillator.stop(context.currentTime);
    beep_flag = 0;
    console.log("down", context.currentTime);
    document.body.style.backgroundColor = "#292b2c";

    restartBeep(0);
  };
}

function resumeContext() {
  context.resume().then(() => {
    console.log('Playback resumed successfully');
  });
}


function recordingStart() {
  restartBeep(0);
  chunks = [];
  mediaRecorder = new MediaRecorder(dest.stream);
  mediaRecorder.start();
}

function recordingStop(num) {
  mediaRecorder.stop(context.currentTime);
  mediaRecorder.ondataavailable = function (e) {
    chunks.push(e.data);

    // Make blob out of our blobs, and open it.
    let blob = new Blob(chunks, {
      'type': 'audio/ogg; codecs=opus'
    });
    console.log("audio" + num);
    document.getElementById("audio" + num).src = URL.createObjectURL(blob);
    upload(blob);
  }
}


function restartBeep(freq) {
  oscillator = context.createOscillator();
  oscillator.connect(context.destination);
  oscillator.type = 'triangle';
  oscillator.frequency.value = freq;
  gain = context.createGain();
  gain.gain.value = 1;
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.connect(dest);
  oscillator.start(context.currentTime);
}

function upload(Data) {
  fetch(`https://kaduo.jp/keystroke-recording/data/upload.php`, {
      method: "POST",
      body: JSON.stringify({
        "filename": "01.wav",
        "blob": "Data",
      })
    })
    .then(response => {
      if (response.ok) return response;
      else throw Error(`Server returned ${response.status}: ${response.statusText}`)
    })
    .then(response => console.log(response.text()))
    .catch(err => {
      alert(err);
    });
}