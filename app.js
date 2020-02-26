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

  let commitMessage = req.body.head_commit.message
  let asanaRef = commitMessage.match( /(refs#\d+)/)
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
  try {
    console.log('commentAsana')

    let me = await client.users.me();
    const userId = me.gid;
    const workspaceId = me.workspaces[0].gid;
    
    console.log('Searching Asana Task with id ' + asanId)
    let task = await client.tasks.findById(asanId)
    
    console.log(task)
    console.log(task.id)
    console.log(task.assignee.name)
  } catch(e) {
    console.log('Error al contactar con Asana')
    console.log(e.message)
  }
  /*
  task.dispatchPut('/tasks/' + asanId, comments) {

  }
  */
}