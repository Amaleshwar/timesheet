var express = require('express');
var app = express();
var fileUpload = require('express-fileupload');
app.use(fileUpload());
var cors = require('cors');
app.use(cors());
var path = require('path');
var fs = require('fs');

var sql = require("mssql");

app.post('/checkfileexists', function (req, res) {

  let filename = req.body.filename.trim();
  var dropoffLocation = '/public/MonthlyJsonFiles/';
  var filePath = __dirname + dropoffLocation + filename + '.json';
  console.log(filePath)
  console.log(fs.existsSync(filePath));
  res.send(fs.existsSync(filePath));
});

app.post('/createjsonfile', function (req, res) {

  let filename = req.body.filename.trim();
  let jsondata = req.body.jsondata.trim();
  var dropoffLocation = '/public/MonthlyJsonFiles/';
  var filePath = __dirname + dropoffLocation + filename + '.json';

fs.writeFileSync(filePath,jsondata );

var file_content = fs.readFileSync(filePath);
var content = JSON.parse(file_content);
console.log(content)

  res.send(filePath);


});

app.post('/getjsondata', function (req, res) {

  let filename = req.body.filename.trim();
  var dropoffLocation = '/public/MonthlyJsonFiles/';
  var filePath = __dirname + dropoffLocation + filename + '.json';
  try {

    var jsondata = fs.readFileSync(filePath);
   
     //chatdata = chatdata.toString().replace(/,\s*$/, "");
     console.log("filename ", jsondata)
     res.send( jsondata );
  }
  catch{
    console.log("empty")
   res.send( jsondata );
  }


});

app.post('/updatejson', function (req, res) {

  let filename = req.body.filename.trim();
  let jsondata = req.body.jsondata.trim();
  var dropoffLocation = '/public/MonthlyJsonFiles/';
  var filePath = __dirname + dropoffLocation + filename + '.json';

fs.writeFileSync(filePath,jsondata );

var file_content = fs.readFileSync(filePath);
var content = JSON.parse(file_content);
console.log(content)

  res.send(filePath);


});

app.listen(8002, function () {
  console.log('App running on port 8002');
});


app.post('/viewjson', function (req, res) {
  let filename = 'chatnotifcations'  //req.body.filename.trim().toLowerCase();
 // console.log("filename ", filename)
  var dropoffLocation = '/public/ChatFiles/';

  filePath = __dirname + dropoffLocation + filename + '.txt';


  try {

    var chatdata = fs.readFileSync(filePath);
   
     chatdata = chatdata.toString().replace(/,\s*$/, "");
    // console.log("filename ", chatdata)
     res.send( chatdata );
  }
  catch{
    console.log("empty")
   chatdata = [{
    senderId: " ",
    text: "Send message"
  }]
   res.send( chatdata );
  }

});

app.post('/updatejson', function (req, res) {

  let chat_data = req.body.statusvalue.trim();
  let filename = 'chatnotifcations'  //req.body.filename.trim().toLowerCase();
  //console.log("write file to: "+filename);
 // console.log("write file to: "+chat_data);
  var dropoffLocation = '/public/ChatFiles/';

  filePath = __dirname + dropoffLocation + filename + '.txt';
  //console.log(filePath)
  var file_content = fs.readFileSync(filePath);
var content = JSON.parse(file_content);

content.Employee.map( (user)  => { if(user.id === '2'){  user.Status= '0' }} );
console.log(content)

fs.writeFileSync(filePath, JSON.stringify(content) );

var file_content2 = fs.readFileSync(filePath);
var content2 = JSON.parse(file_content2);
console.log(content2)
  res.send(filePath);


});

app.post('/addjson', function (req, res) {

  let chat_data = req.body.addvalue.trim();
  let filename = 'chatnotifcations'  

  var dropoffLocation = '/public/ChatFiles/';

  filePath = __dirname + dropoffLocation + filename + '.txt';
  console.log(JSON.parse(chat_data))
  
  var file_content = fs.readFileSync(filePath);
//var content = JSON.parse(file_content);

var parseJson = JSON.parse(file_content);
parseJson.Employee.push(JSON.parse(chat_data))

console.log("-----------------",parseJson)

fs.writeFileSync(filePath, JSON.stringify(parseJson) );

var file_content2 = fs.readFileSync(filePath);
var content2 = JSON.parse(file_content2);
console.log(content2)
  res.send(filePath);


});

app.post('/deletejson', function (req, res) {

  let chat_data = req.body.addvalue.trim();
  let filename = 'chatnotifcations'  

  var dropoffLocation = '/public/ChatFiles/';

  filePath = __dirname + dropoffLocation + filename + '.txt';
 
  
  var file_content = fs.readFileSync(filePath);
  var content = JSON.parse(file_content);
  
  // var key = content.Employee.filter( (user,i)  => { if(user.Status === '1'){ return i}  });
   content.Employee.sort(function(a, b) {
    return b.Status.localeCompare(a.Status);
});
  console.log(content.Employee)  
  var results = content.Employee.reduce((results, item,i) => {
    if(item.Status === '0') results.push(i) // modify is a fictitious function that would apply some change to the items in the array
    return results
}, [])
console.log(results) 
  results.map((item) => {    content.Employee.splice(item) 
  } )
//   content.Employee.splice(2, 1) 
//   content.Employee.splice(2, 1) 
  console.log(content)

//console.log("-----------------",parseJson)

fs.writeFileSync(filePath, JSON.stringify(content) );

 var file_content2 = fs.readFileSync(filePath);
 var content2 = JSON.parse(file_content2);
 console.log(content2)
  res.send(filePath);


});