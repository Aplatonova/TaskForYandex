const path = require('path');
var express = require('express');
var app = express();
app.use(express.static('.'));
app.get('/', function (request, response)
{
  response.sendFile(path.resolve('./index.html'));
});
app.listen(3000);
