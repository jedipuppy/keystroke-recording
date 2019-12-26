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
  } catch (e) {
    alert("Web Audio Initialization Error: " + e);
  }

  document.onkeydown = function (e) {
    console.log(oscillator, "stop");
    oscillator.stop(context.currentTime);
    if (!beep_flag) {
      beep_flag = 1;

      restartBeep(300);
      console.log("up", context.currentTime);
    }

  };
  document.onkeyup = function (e) {
    oscillator.stop(context.currentTime);
    beep_flag = 0;
    console.log("down", context.currentTime);


    restartBeep(0);
  };
}


function recordingStart() {
  restartBeep(0);
  mediaRecorder = new MediaRecorder(dest.stream);
  mediaRecorder.start();
  timer = setInterval(timeChange, 1000);
  setTimeout(recordingStop, 5000);
}

function recordingStop() {
  clearInterval(timer);
  mediaRecorder.stop(context.currentTime);
  mediaRecorder.ondataavailable = function (e) {
    chunks.push(e.data);

    // Make blob out of our blobs, and open it.
    let blob = new Blob(chunks, {
      'type': 'audio/ogg; codecs=opus'
    });
    document.querySelector("audio").src = URL.createObjectURL(blob);
  }
}

function timeChange() {
  document.getElementById('time').innerHTML = Math.floor(context.currentTime);
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