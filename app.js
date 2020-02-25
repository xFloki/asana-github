const express = require('express');
const asana = require('asana');
const client = asana.Client.create().useAccessToken(process.env.ASANA_KEY);
const port = process.env.PORT || 3000;

let app = express();

app.use( express.json());
app.get('/', function (req, res) {
 res.send(JSON.stringify({ Hello: 'World'}));
});
app.post('/', function (req, res) {
  console.log(req.header('x-github-event'))
  console.log(req.headers)
  console.log(req.body)
  commentAsana();
  res.sendStatus(200);
 });
app.listen(port, function () {
 console.log('Listening on ' + port);
});

function commentAsana() {
  client.users.me().then(function(me) {
    console.log(me);
  });
}