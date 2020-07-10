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
    let parser = new UAParser();
    let ua = parser.getResult();
    console.log(ua.browser.name)
    let compatible_browser = ['Chrome', 'Chromium', 'Firefox'];
    if (!compatible_browser.includes(ua.browser.name)) {
        document.getElementById('reg_form').innerHTML = 'Your browser is not supported. This web application supports the latest versions of the Chrome; Firefox.'
    }
    try {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        context = new AudioContext();
        dest = context.createMediaStreamDestination();
        is_MediaRecorder_support = new MediaRecorder(dest.stream);
    } catch (e) {
        alert("Web Audio Initialization Error: " + e);
    }
    restartBeep(0);
    document.onkeydown = function(e) {
        console.log(oscillator, "stop");
        if (!beep_flag && event.keyCode == 32) {
            beep_flag = 1;

            restartBeep(300);
            console.log("up", context.currentTime);
            document.body.style.backgroundColor = "#3a3c3d";
        }

    };
    document.onkeyup = function(e) {
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
    try {
        if (oscillator.type == 'triangle') {
            oscillator.stop(context.currentTime);
        }
    } catch (e) {
        console.log(e);
    }
    //    oscillator.stop(context.currentTime);
    restartBeep(0);
    chunks = [];
    mediaRecorder = new MediaRecorder(dest.stream);
    mediaRecorder.start();
}

function recordingStop(num) {
    mediaRecorder.stop(context.currentTime);
    mediaRecorder.ondataavailable = function(e) {
        chunks.push(e.data);

        // Make blob out of our blobs, and open it.
        let blob = new Blob(chunks, {
            'type': 'audio/ogg; codecs=opus'
        });
        console.log("audio" + num);
        document.getElementById("audio" + num).src = URL.createObjectURL(blob);
        upload(blob, num);
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

function upload(Data, num) {
    console.log(Data)
    let formData = new FormData();
    formData.append('num', num);
    formData.append('filename', time_now);
    formData.append('blob', Data);
    fetch(`https://kaduo.jp/keystroke-recording/data/upload.php`, {
            method: "POST",
            body: formData
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

function recordForm() {
    time_now = getNow()
    console.log('save data', time_now, document.getElementById('gender').value, document.getElementById('age').value)
    fetch(`https://kaduo.jp/keystroke-recording/data/upload.php`, {
            method: "POST",
            body: JSON.stringify({
                "mode": "form",
                "filename": time_now,
                "date": time_now,
                "gender": document.getElementById('gender').value,
                "age": document.getElementById('age').value,
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

function getNow() {
    var now = new Date();
    var year = now.getFullYear();
    var mon = ("0" + (now.getMonth() + 1)).slice(-2);
    var day = ("0" + now.getDate()).slice(-2);
    var hour = ("0" + now.getHours()).slice(-2);
    var min = ("0" + now.getMinutes()).slice(-2);
    var sec = ("0" + now.getSeconds()).slice(-2);

    //出力用
    var s = String(year) + mon + day + '-' + hour + min + sec;
    return s;
}