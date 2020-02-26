const express = require('express');
const asana = require('asana');
const client = asana.Client.create().useAccessToken(process.env.ASANA_KEY);
const port = process.env.PORT || 3000;

let app = express();

app.use( express.json());

app.post('/', function (req, res) {
  console.log(req.header('x-github-event'))
  console.log(req.headers)
  console.log(req.body)

  let asanaRef = asana1.match( /(refs#\d+)/)
  if (asanaRef) {

    let asanId = asanaRef[0].split('#')[1]
    commentAsana(asanId);
  }
 
  res.sendStatus(200);
 });
 
app.listen(port, function () {
 console.log('Listening on ' + port);
});

async function commentAsana(asanId) {
  client.users.me().then(function(me) {
    console.log(me);
  });

  let me = await client.users.me();
  const userId = user.gid;
  const workspaceId = user.workspaces[0].gid;

  let task = await client.tasks.findById('asanId')

  console.log(task.id)
  console.log(task.assignee.name)
  
}