function getCsvData(dataPath) {
    const request = new XMLHttpRequest();
    request.addEventListener('load', (event) => {
        response = event.target.responseText;
        lines = response.split('\n').map(l => l.split('\t'));
        table = "<table class=\"table\"><thead><tr><th>date</th><th>filename</th><th>gender</th><th>age</th><th>1</th><th>2</th><th>3</th></tr></thead>";
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].length <= 2) {
                break;
            }
            table += "<tr>";
            for (let j = 0; j < lines[i].length; j++) {
                console.log("len", lines[i].length)
                table += "<td>" + lines[i][j] + "</td>";
            }
            for (let j = 1; j <= 3; j++) {
                let path = "./data/" + lines[i][0] + "/" + lines[i][0] + "-" + j + ".wav";
                let sound = new Audio(path);
                let img = new Image();
                img.src = path;
                console.log(img.fileSize)
                if (doesFileExist(path) == 0) {
                    table += "<td>None</td>";
                    console.log("error")
                } else {

                    table += "<td><a href=\"./data/" + lines[i][0] + "/" + lines[i][0] + "-" + j + ".wav\">data" + j + "</a></td>";
                    console.log("success")
                }
            }

            table += "</tr>";
        }
        document.getElementById('output_csv').innerHTML = table;
        console.log(table, lines.length)
    });

    request.open('GET', dataPath, true);
    request.send();
}

function doesFileExist(urlToFile) {
    var xhr = new XMLHttpRequest();
    xhr.open('HEAD', urlToFile, false);
    xhr.send();

    if (xhr.status == "404") {
        return false;
    } else {
        return true;
    }
}
getCsvData('./data/log.dat');