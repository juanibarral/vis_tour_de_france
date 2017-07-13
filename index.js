var express = require('express')
var app = express()

var request = require('request');
var cheerio = require('cheerio');
var async = require('async');

var bodyParser = require('body-parser');
app.use(bodyParser.json());

app.post('/scrapper', function (req, res) {

    var data = req.body;

 	var urls = [];
    for(var i = 1; i <= parseInt(data.stages); i++)
    {
        var url_address = data.page.replace("<i>", i); 
        urls.push({ url : url_address,
                    stage : ('stage_0' + i).slice(-2)});
    }

	async.each(urls, 
        function(url, callback){
            processUrl(url.url, url.stage, callback)
        }, 
        function(err)
        {
            if( err ) {
              console.log('A file failed to process');
              res.json({success : false, message : 'A file failed to process'})
            } else {
            	res.json({success : true, data : jsonDataTotal})
            }
        }
    );

    
});

var jsonDataTotal = {};

var processUrl = function(url, stage, callback)
{
    console.log("processing " + url);
    request(url, function(error, response, html){
        if(!error){
            jsonDataTotal[stage] = {};
            var $ = cheerio.load(html);
            var jsonData = {};
            console.log("html read");
            var trs = $(this).find("table.rankingList tr");
            
            //console.log(trs);
            //var trs = table.find("tr");
            for(tr_index in trs)
            {
            	console.log("***********************tr_index**********************");
            	console.log(tr_index);
            	// var tr = trs[tr_index];
             //    if(tr.children && tr.children[0])
             //    {
                    // var newVal = {
                    //     name : "",
                    //     value : "",
                    //     number : ""
                    // }

                    // var name = false;
                    // var value = true;
                    // var td = tr.children[0];
                    // console.log(td.data)
                    // if(td.children && td.children[1])
                    // {
                    //     newVal.name = td.children[1].data;
                    //     name = true;
                    // }
                    // td = tr.children[2];
                    // newVal.value = td.data;   
                    // value = true;
                    
                    // if(name && value)
                    // {
                    //     jsonData["table_" + table_index].data.push(newVal)
                    // }
                // }
            }
            
            jsonDataTotal[stage] = jsonData;
            callback();
        }
    })
}



app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/main.html');
});


var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Vis tester app listening at http://%s:%s', host, port);
}); 