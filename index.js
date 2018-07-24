var http = require('http');

var server = http.createServer(function(request, response) {
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.end("Hello Prashanth!");
});

app.get('/', function (req, res) {
    res.send('Hello World!!!');
});
  
var port = process.env.PORT || 1337;
// server.listen(port);
// console.log("Server running at http://localhost:%d", port);

app.listen(port, function () {
    console.log(`Server running at http://localhost:${port}`);
});