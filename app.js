const express = require('express');
const port = process.env.PORT || 3000;

let app = express();

app.use( express.json());
app.get('/', function (req, res) {
 res.send(JSON.stringify({ Hello: 'World'}));
});
app.post('/', function (req, res) {
  console.log('Hello')
  console.log(req.header('x-github-event'))
  console.log('Hello')
  console.log(req.headers)
  console.log('Hello')
  console.log(req.body)
  console.log(req.payload)
  res.sendStatus(200);
 });
app.listen(port, function () {
 console.log('Listening on ' + port);
});
