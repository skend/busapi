var http = require('http')
var request = require('request');
var fs = require('fs');
var formidable = require("formidable");
var util = require('util');

var server = http.createServer(function (req, res) {
    if (req.method.toLowerCase() == 'get') {
        displayForm(res);
    } else if (req.method.toLowerCase() == 'post') {
        processAllFieldsOfTheForm(req, res);
    }
});

function displayForm(res) {
    fs.readFile('index.html', function (err, data) {
        res.writeHead(200, {
            'Content-Type': 'text/html',
                'Content-Length': data.length
        });
        res.write(data);
        res.end();
    });
}

function processAllFieldsOfTheForm(req, res) {
    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
        var body = getBusInfo(fields)
        res.end();
        writeDataPage(body);
    });
}


function getBusInfo(fields) {
	var data = JSON.stringify(fields);

	var arr = []
	JSON.parse(data, function(k, v) {
		arr.push(v);
	});

	var url = 'https://data.dublinked.ie/cgi-bin/rtpi/realtimebusinformation?';
	var stopid = 'stopid=';
	var routeid = 'routeid='
	var format = 'format=json';
	var and = '&';

	var requestUrl = url + stopid + arr[0] + and + routeid + arr[1] + and + format;

	request(requestUrl, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			return body;
		}
	}); 
}

function writeDataPage(body) {
	fs.writeFile("/tmp/test", "Hey there!", function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
}

server.listen(3000);
console.log("server listening on 3000");



                                                                                  