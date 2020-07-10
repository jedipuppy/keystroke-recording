let context;
let oscillator;
let beep_flag = 0;
let chunks = [];
let time_data = [
    [],
    []
];

current_page = 1;
page_setting = {
        1: {
            'id': 'page1',
            'recording': 0,
            'file-viewer': 0,
        },
        2: {
            'id': 'page2',
            'recording': 0,
            'file-viewer': 0,
        },
        3: {
            'id': 'page3',
            'recording': 1,
            'file-viewer': 1,
        },
        4: {
            'id': 'page4',
            'recording': 0,
            'file-viewer': 1,
        },
        5: {
            'id': 'page5',
            'recording': 0,
            'file-viewer': 1,
        },
        6: {
            'id': 'page5',
            'recording': 2,
            'file-viewer': 1,
        },
        7: {
            'id': 'page5',
            'recording': 3,
            'file-viewer': 1,
        },
        8: {
            'id': 'page5',
            'recording': 4,
            'file-viewer': 1,
        },
        9: {
            'id': 'page5',
            'recording': 0,
            'file-viewer': 1,
        },
    }
    // ********* Init AudioContext and Oscillator Node

window.addEventListener('load', init, false);

function init() {
    let parser = new UAParser();
    let ua = parser.getResult();
    console.log(ua.browser.name)
    let compatible_browser = ['Chrome', 'Chromium', 'Firefox'];
    if (!compatible_browser.includes(ua.browser.name)) {
        document.getElementById('page1').innerHTML = 'Your browser is not supported. This web application supports the latest versions of the Chrome; Firefox.'
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
        if (!beep_flag && event.keyCode == 90) {
            beep_flag = 1;

            restartBeep(300);
            console.log("up", context.currentTime);
            document.body.style.backgroundColor = "#cfcfcf";
        }

    };
    document.onkeyup = function(e) {
        oscillator.stop(context.currentTime);
        beep_flag = 0;
        console.log("down", context.currentTime);
        document.body.style.backgroundColor = "#ffffff";

        restartBeep(0);
    };
}

function resumeContext() {
    context.resume().then(() => {
        console.log('Playback resumed successfully');
    });
}



function preCount(page, num, count) {
    count -= 1;
    document.getElementById('countdown-' + page).innerHTML = '開始 ' + count + ' 秒前';
    if (count >= 0) {
        setTimeout(preCount, 1000, page, num, count);
    } else {
        recordingStart();
        recordCount(page, num, 5);
    }
}

function recordCount(page, num, count) {
    count -= 1;
    document.getElementById('countdown-' + page).innerHTML = '録音中。残り ' + count + ' 秒';
    if (count >= 0) {
        setTimeout(recordCount, 1000, page, num, count);
    } else {
        recordingStop(num);
        pageTransition(1);
    }
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
    pageTransition(1);
}

function getNow() {
    let now = new Date();
    let year = now.getFullYear();
    let mon = ("0" + (now.getMonth() + 1)).slice(-2);
    let day = ("0" + now.getDate()).slice(-2);
    let hour = ("0" + now.getHours()).slice(-2);
    let min = ("0" + now.getMinutes()).slice(-2);
    let sec = ("0" + now.getSeconds()).slice(-2);

    //出力用
    let s = String(year) + mon + day + '-' + hour + min + sec;
    return s;
}

function move(dir) {
    console.log(page_setting[current_page]['recording']);
    if (page_setting[current_page]['recording'] == 1) {
        preCount(page_setting[current_page]['id'], page_setting[current_page]['recording'], 5);
    } else {
        pageTransition(dir);
    }
}


function pageTransition(dir) {

    document.getElementById(page_setting[current_page]['id']).style.display = 'none';
    document.getElementById(page_setting[current_page + dir]['id']).style.display = 'block';

    if (page_setting[current_page + dir]['file-viewer'] == 1) {
        document.getElementById('file-viewer').style.display = 'block';
    } else {
        document.getElementById('file-viewer').style.display = 'none';
    }


    current_page += dir;
}